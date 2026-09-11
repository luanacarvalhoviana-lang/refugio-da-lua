import { create } from "zustand";
import { persist } from "zustand/middleware";
import { dailyAdviceLimit, entitlementsFor, REST_MESSAGE, weeklyLetterLimit, type VipPlanKey, type VipSubscriptionStatus } from "@/lib/refugio/vip";
import { reviewLetterText, canPublish } from "@/lib/refugio/letterReview";
import { demoLetters, withDemoLetters, withoutDemoLetters, type Letter } from "@/lib/refugio/letters";
import { addLocalDiary } from "@/lib/refugio/localGarden";
import { islandCareScore, islandCareSince, islandChoicesFor, islandStage, type IslandTreeKey } from "@/lib/refugio/islandTrees";
import { dewPhase } from "@/lib/refugio/dew";
import {
  canPlantNextAmazon,
  createSeed,
  energyForSeed,
  stageForEnergy,
  type AmazonSeed,
  type AmazonTreeKey,
} from "@/lib/refugio/amazonTrees";

export type SessionPlan = "free" | VipPlanKey;

export type GardenNotice = {
  id: string;
  title: string;
  text: string;
  time: string;
  kind: "energy" | "garden" | "advice" | "letter" | "care";
  read: boolean;
};

export function isValidNickname(name: string, email = "") {
  const nick = name.trim();
  if (nick.length < 2 || nick.length > 28) return false;
  if (nick.includes("@")) return false;
  if (!/[a-zA-ZÀ-ÿ]/.test(nick)) return false;
  const lower = nick.toLowerCase();
  if (lower === "girassol sereno" || lower === "maré serena" || lower === "mare serena") return false;
  const prefix = email.split("@")[0]?.trim().toLowerCase();
  if (prefix && lower === prefix) return false;
  return true;
}

function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function weekKey(date = new Date()) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const mondayOffset = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - mondayOffset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "AS";
}

function normalizeGrove(seeds: AmazonSeed[], energiesReceived: number) {
  const growing = seeds.filter((seed) => stageForEnergy(energyForSeed(seed, energiesReceived)) !== "mature");
  const mature = seeds.filter((seed) => stageForEnergy(energyForSeed(seed, energiesReceived)) === "mature");
  return [...mature, ...growing.slice(0, 1)];
}

function vaultKey(email: string) {
  return `refugio-vault:${email.trim().toLowerCase()}`;
}

function readVault(email: string): Partial<RefugioState> | null {
  if (typeof window === "undefined" || !email.trim()) return null;
  try {
    const raw = window.localStorage.getItem(vaultKey(email));
    return raw ? (JSON.parse(raw) as Partial<RefugioState>) : null;
  } catch {
    return null;
  }
}

function writeVault(email: string, state: Partial<RefugioState>) {
  if (typeof window === "undefined" || !email.trim()) return;
  window.localStorage.setItem(vaultKey(email), JSON.stringify(state));
}

export function sessionSlice(state: RefugioState): Partial<RefugioState> {
  return {
    userName: state.userName,
    nickChosen: state.nickChosen,
    email: state.email,
    plan: state.plan,
    avatarKey: state.avatarKey,
    frameKey: state.frameKey,
    envelopeKey: state.envelopeKey,
    fontKey: state.fontKey,
    pinEnabled: state.pinEnabled,
    pin: state.pin,
    energiesSent: state.energiesSent,
    energiesReceived: state.energiesReceived,
    dewDropsReceived: state.dewDropsReceived,
    lettersRead: state.lettersRead,
    adviceSent: state.adviceSent,
    lettersPublished: state.lettersPublished,
    days: state.days,
    amazonSeeds: state.amazonSeeds,
    islandTreeKey: state.islandTreeKey,
    islandBornCare: state.islandBornCare,
    grownIslandKeys: state.grownIslandKeys,
    thankedAdviceIds: state.thankedAdviceIds,
    adviceDay: state.adviceDay,
    adviceToday: state.adviceToday,
    letterWeek: state.letterWeek,
    lettersThisWeek: state.lettersThisWeek,
    protectScreen: state.protectScreen,
    notices: state.notices,
    humusCount: state.humusCount,
    pendingDew: state.pendingDew,
    letters: withoutDemoLetters(state.letters),
    cloudStamp: state.cloudStamp ?? 0,
  };
}

export function gardenWeight(state: Partial<RefugioState>) {
  let n = 0;
  if (state.nickChosen) n += 4;
  if (state.userName && state.userName !== "Girassol sereno") n += 3;
  if (state.islandTreeKey) n += 5;
  n += (state.amazonSeeds?.length || 0) * 3;
  n += state.lettersPublished || 0;
  n += state.energiesSent || 0;
  n += state.adviceSent || 0;
  n += withoutDemoLetters(state.letters || []).length * 2;
  if (state.avatarKey && state.avatarKey !== "leaf") n += 2;
  if (state.frameKey && state.frameKey !== "none") n += 1;
  return n;
}

const FRESH_PROFILE: Partial<RefugioState> = {
  userName: "Girassol sereno",
  nickChosen: false,
  plan: "free",
  avatarKey: "leaf",
  frameKey: "none",
  envelopeKey: "kraft",
  fontKey: "serif",
  pinEnabled: false,
  pin: "",
  unlocked: false,
  energiesSent: 0,
  energiesReceived: 0,
  dewDropsReceived: 0,
  lettersRead: 0,
  adviceSent: 0,
  lettersPublished: 0,
  days: 1,
  amazonSeeds: [],
  islandTreeKey: null,
  islandBornCare: 0,
  grownIslandKeys: [],
  thankedAdviceIds: [],
  adviceDay: todayKey(),
  adviceToday: 0,
  letterWeek: weekKey(),
  lettersThisWeek: 0,
  protectScreen: false,
  notices: [],
  humusCount: 0,
  pendingDew: [],
  letters: demoLetters,
};

type RefugioState = {
  ageOk: boolean;
  pactOk: boolean;
  userName: string;
  nickChosen: boolean;
  email: string;
  loggedIn: boolean;
  isAnonymous: boolean;
  plan: SessionPlan;
  letters: Letter[];
  energiesSent: number;
  energiesReceived: number;
  dewDropsReceived: number;
  lettersRead: number;
  adviceSent: number;
  lettersPublished: number;
  days: number;
  pinEnabled: boolean;
  pin: string;
  unlocked: boolean;
  avatarKey: string;
  frameKey: string;
  envelopeKey: string;
  fontKey: string;
  amazonSeeds: AmazonSeed[];
  islandTreeKey: IslandTreeKey | null;
  islandBornCare: number;
  grownIslandKeys: IslandTreeKey[];
  thankedAdviceIds: string[];
  adviceDay: string;
  adviceToday: number;
  letterWeek: string;
  lettersThisWeek: number;
  theme: "day" | "night";
  protectScreen: boolean;
  notices: GardenNotice[];
  humusCount: number;
  pendingDew: Letter[];
  cloudStamp: number;
  confirmAge: () => void;
  acceptPact: () => void;
  setUserName: (name: string) => void;
  login: (input?: { name?: string; email?: string }) => void;
  register: (input: { name: string; email: string }) => void;
  logout: () => void;
  enterAnonymous: () => void;
  setPlan: (plan: SessionPlan) => void;
  cancelPlan: () => void;
  chooseIslandTree: (key: IslandTreeKey) => void;
  chooseAmazonTree: (key: AmazonTreeKey) => void;
  ensureAmazonGrove: () => void;
  sendEnergy: (letterId: string) => { grewSeed: boolean };
  markRead: (letterId: string) => void;
  publishLetter: (input: {
    body: string;
    topic: string;
    title?: string;
    gender?: string;
    emotion?: string;
    ageGroup?: string;
    paperKey?: string;
    sealKey?: string;
    afterMural?: "humus" | "diary";
  }) => void;
  addAdvice: (input: { letterId: string; body: string; envelopeKey?: string; fontKey?: string }) => AmazonSeed | null;
  openAdvice: (adviceId: string) => void;
  thankAdvice: (adviceId: string) => { drops: number } | null;
  retireLetter: (letterId: string, destiny: "humus" | "diary") => { destiny: "humus" | "diary" };
  evaporateDue: () => void;
  resolveDew: (letterId: string, destiny: "humus" | "diary") => void;
  adviceStatus: () => { atRest: boolean; used: number; limit: number | null; message: string };
  letterStatus: () => { atRest: boolean; used: number; limit: number; message: string };
  setPin: (pin: string) => void;
  unlock: (pin: string) => boolean;
  setAvatar: (key: string) => void;
  setFrame: (key: string) => void;
  setEnvelope: (key: string) => void;
  setLetterFont: (key: string) => void;
  setTheme: (theme: "day" | "night") => void;
  pushNotice: (notice: Omit<GardenNotice, "id" | "time" | "read">) => void;
  markNoticeRead: (id: string) => void;
  unreadNotices: () => number;
  hydrateFromCloud: (slice: Partial<RefugioState>, stamp: number) => void;
};

export const useRefugioStore = create<RefugioState>()(
  persist(
    (set, get) => ({
      ageOk: false,
      pactOk: false,
      userName: "Girassol sereno",
      nickChosen: false,
      email: "",
      loggedIn: false,
      isAnonymous: false,
      plan: "free",
      letters: demoLetters,
      energiesSent: 12,
      energiesReceived: 0,
      dewDropsReceived: 0,
      lettersRead: 8,
      adviceSent: 0,
      lettersPublished: 1,
      days: 12,
      pinEnabled: false,
      pin: "",
      unlocked: false,
      avatarKey: "leaf",
      frameKey: "none",
      envelopeKey: "kraft",
      fontKey: "serif",
      amazonSeeds: [],
      islandTreeKey: null,
      islandBornCare: 0,
      grownIslandKeys: [],
      thankedAdviceIds: [],
      adviceDay: todayKey(),
      adviceToday: 0,
      letterWeek: weekKey(),
      lettersThisWeek: 0,
      theme: "day",
      protectScreen: false,
      notices: [],
      humusCount: 0,
      pendingDew: [],
      cloudStamp: 0,
      confirmAge: () => set({ ageOk: true }),
      acceptPact: () => set({ pactOk: true, ageOk: true }),
      setUserName: (userName) =>
        set({
          userName: userName.trim() || get().userName,
          nickChosen: isValidNickname(userName, get().email),
        }),
      login: (input) => {
        const state = get();
        const nextEmail = (input?.email || state.email).trim().toLowerCase();
        const prevEmail = state.email.trim().toLowerCase();
        if (nextEmail && prevEmail && nextEmail !== prevEmail) {
          writeVault(prevEmail, sessionSlice(state));
          const saved = readVault(nextEmail);
          set({
            ...(saved ?? FRESH_PROFILE),
            loggedIn: true,
            isAnonymous: false,
            email: nextEmail,
            ageOk: state.ageOk,
            pactOk: state.pactOk,
            theme: state.theme,
          });
          return;
        }
        set({
          loggedIn: true,
          isAnonymous: false,
          email: nextEmail || state.email,
        });
      },
      register: (input) => {
        get().login({ email: input.email, name: input.name });
      },
      logout: () => {
        const state = get();
        if (state.email) writeVault(state.email, sessionSlice(state));
        set({
          ...FRESH_PROFILE,
          loggedIn: false,
          isAnonymous: false,
          email: "",
          ageOk: state.ageOk,
          pactOk: state.pactOk,
          theme: state.theme,
          cloudStamp: 0,
        });
      },
      enterAnonymous: () => set({ isAnonymous: true, loggedIn: false }),
      setPlan: (plan) => {
        set({
          plan,
          protectScreen: plan === "monthly" || plan === "annual",
        });
      },
      cancelPlan: () => set({ plan: "free", protectScreen: false }),
      chooseIslandTree: (key) => {
        const state = get();
        const plan = state.plan === "annual" ? "free" : state.plan;
        const allowed = islandChoicesFor(plan);
        if (!allowed.some((tree) => tree.key === key)) return;
        const careNow = islandCareScore({
          dewDropsReceived: state.dewDropsReceived,
          energiesReceived: state.energiesReceived,
          adviceSent: state.adviceSent,
        });
        if (state.islandTreeKey && state.islandTreeKey !== key) {
          const grown = islandStage(islandCareSince(state, state.islandBornCare)).stage === "mature";
          if (!grown) return;
          set({
            grownIslandKeys: [...new Set([...state.grownIslandKeys, state.islandTreeKey])],
            islandTreeKey: key,
            islandBornCare: careNow,
          });
          return;
        }
        if (!state.islandTreeKey) set({ islandTreeKey: key, islandBornCare: careNow });
      },
      chooseAmazonTree: (key) => {
        const state = get();
        if (state.plan !== "annual") return;
        const seeds = normalizeGrove(state.amazonSeeds, state.energiesReceived);
        if (!canPlantNextAmazon(seeds, state.energiesReceived)) return;
        if (seeds.some((seed) => seed.speciesKey === key)) return;
        set({ amazonSeeds: [...seeds, createSeed(key, state.energiesReceived)] });
      },
      ensureAmazonGrove: () => {
        const state = get();
        const next = normalizeGrove(state.amazonSeeds, state.energiesReceived);
        if (next.length !== state.amazonSeeds.length) set({ amazonSeeds: next });
      },
      sendEnergy: (letterId) => {
        const state = get();
        let grewSeed = false;
        set({
          energiesSent: state.energiesSent + 1,
          letters: state.letters.map((letter) => {
            if (letter.id !== letterId) return letter;
            const own = letter.author === state.userName;
            if (own) grewSeed = true;
            return { ...letter, energy: letter.energy + 1 };
          }),
          energiesReceived: grewSeed ? state.energiesReceived + 1 : state.energiesReceived,
        });
        return { grewSeed };
      },
      markRead: (letterId) =>
        set((state) => ({
          lettersRead: state.lettersRead + 1,
          letters: state.letters.map((letter) => (letter.id === letterId ? letter : letter)),
        })),
      publishLetter: (input) => {
        const state = get();
        const week = weekKey();
        const used = state.letterWeek === week ? state.lettersThisWeek : 0;
        const limit = weeklyLetterLimit(state.plan);
        if (used >= limit) throw new Error(REST_MESSAGE);
        const review = reviewLetterText(input.body, "letter");
        if (!canPublish(review)) throw new Error(review.summary);
        const author = state.userName || "Anônimo sereno";
        const letter: Letter = {
          id: `carta-${Date.now()}`,
          title: input.title?.trim() || input.body.slice(0, 42),
          author,
          initials: initialsOf(author),
          topic: input.topic,
          time: "agora",
          excerpt: input.body.slice(0, 140),
          color: "lavender",
          energy: 0,
          body: input.body,
          gender: input.gender,
          ageGroup: input.ageGroup,
          emotion: input.emotion,
          hour: new Date().getHours(),
          priority: state.plan === "annual" ? 2 : state.plan === "monthly" ? 1 : 0,
          paperKey: input.paperKey,
          sealKey: input.sealKey,
          afterMural: input.afterMural,
          postedAt: new Date().toISOString(),
          advice: [],
        };
        set({
          letters: [letter, ...state.letters],
          lettersPublished: state.lettersPublished + 1,
          letterWeek: week,
          lettersThisWeek: used + 1,
        });
      },
      addAdvice: (input) => {
        const state = get();
        const day = todayKey();
        const used = state.adviceDay === day ? state.adviceToday : 0;
        const limit = dailyAdviceLimit(state.plan);
        if (limit !== null && used >= limit) throw new Error(REST_MESSAGE);
        const review = reviewLetterText(input.body, "advice");
        if (!canPublish(review)) throw new Error(review.summary);
        const author = state.userName || "Guardião sereno";
        set({
          adviceSent: state.adviceSent + 1,
          adviceDay: day,
          adviceToday: used + 1,
          letters: state.letters.map((letter) =>
            letter.id === input.letterId
              ? {
                  ...letter,
                  advice: [
                    ...(letter.advice || []),
                    {
                      id: `adv-${Date.now()}`,
                      author,
                      body: input.body,
                      envelopeKey: input.envelopeKey,
                      fontKey: input.fontKey,
                      opened: false,
                    },
                  ],
                }
              : letter,
          ),
        });
        return null;
      },
      openAdvice: (adviceId) =>
        set((state) => ({
          letters: state.letters.map((letter) => ({
            ...letter,
            advice: letter.advice?.map((item) => (item.id === adviceId ? { ...item, opened: true } : item)),
          })),
        })),
      thankAdvice: (adviceId) => {
        const state = get();
        if (state.thankedAdviceIds.includes(adviceId)) return null;
        const letter = state.letters.find((item) => item.advice?.some((advice) => advice.id === adviceId));
        if (!letter || letter.author !== state.userName) return null;
        const drops = state.dewDropsReceived + 1;
        set({
          dewDropsReceived: drops,
          thankedAdviceIds: [...state.thankedAdviceIds, adviceId],
        });
        return { drops };
      },
      retireLetter: (letterId, destiny) => {
        const state = get();
        const letter = state.letters.find((item) => item.id === letterId);
        if (!letter) throw new Error("Carta não encontrada.");
        if (letter.author !== state.userName) throw new Error("Só quem escreveu pode decidir o destino.");
        set({
          letters: state.letters.filter((item) => item.id !== letterId),
          humusCount: destiny === "humus" ? state.humusCount + 1 : state.humusCount,
        });
        if (destiny === "diary") addLocalDiary(letter.body);
        return { destiny };
      },
      evaporateDue: () => {
        const state = get();
        const now = Date.now();
        const due = state.letters.filter((letter) => dewPhase(letter, now) === "due");
        if (!due.length) return;
        let humus = 0;
        const pending = [...state.pendingDew];
        const keep = state.letters.filter((letter) => dewPhase(letter, now) !== "due");
        for (const letter of due) {
          if (letter.author !== state.userName) continue;
          if (letter.afterMural === "diary") addLocalDiary(letter.body);
          else if (letter.afterMural === "humus") humus += 1;
          else pending.push(letter);
        }
        const notice =
          humus || pending.length
            ? {
                id: `n-${Date.now()}`,
                title: "O orvalho passou",
                text:
                  pending.length > 0
                    ? "Uma carta sua saiu do mural. No jardim você escolhe se vira húmus ou vai ao diário."
                    : "Uma carta sua evaporou e foi para o destino que você escolheu.",
                time: "agora",
                kind: "care" as const,
                read: false,
              }
            : null;
        set({
          letters: keep,
          humusCount: state.humusCount + humus,
          pendingDew: pending,
          notices: notice ? [notice, ...state.notices].slice(0, 40) : state.notices,
        });
      },
      resolveDew: (letterId, destiny) => {
        const state = get();
        const letter = state.pendingDew.find((item) => item.id === letterId);
        if (!letter) return;
        if (destiny === "diary") addLocalDiary(letter.body);
        set({
          pendingDew: state.pendingDew.filter((item) => item.id !== letterId),
          humusCount: destiny === "humus" ? state.humusCount + 1 : state.humusCount,
        });
      },
      adviceStatus: () => {
        const state = get();
        const day = todayKey();
        const used = state.adviceDay === day ? state.adviceToday : 0;
        const limit = dailyAdviceLimit(state.plan);
        const atRest = limit !== null && used >= limit;
        return { atRest, used, limit, message: REST_MESSAGE };
      },
      letterStatus: () => {
        const state = get();
        const week = weekKey();
        const used = state.letterWeek === week ? state.lettersThisWeek : 0;
        const limit = weeklyLetterLimit(state.plan);
        return { atRest: used >= limit, used, limit, message: REST_MESSAGE };
      },
      setPin: (pin) => set({ pin, pinEnabled: true, unlocked: true }),
      unlock: (pin) => {
        const ok = get().pin === pin;
        if (ok) set({ unlocked: true });
        return ok;
      },
      setAvatar: (key) => set({ avatarKey: key }),
      setFrame: (key) => set({ frameKey: key }),
      setEnvelope: (key) => set({ envelopeKey: key }),
      setLetterFont: (key) => set({ fontKey: key }),
      setTheme: (theme) => set({ theme }),
      pushNotice: (notice) =>
        set((state) => ({
          notices: [
            { ...notice, id: `n-${Date.now()}`, time: "agora", read: false },
            ...state.notices,
          ].slice(0, 40),
        })),
      markNoticeRead: (id) =>
        set((state) => ({
          notices: state.notices.map((item) => (item.id === id ? { ...item, read: true } : item)),
        })),
      unreadNotices: () => get().notices.filter((item) => !item.read).length,
      hydrateFromCloud: (slice, stamp) => {
        const incoming = slice as Partial<RefugioState>;
        set({
          ...incoming,
          letters: withDemoLetters(incoming.letters),
          cloudStamp: stamp,
          loggedIn: true,
          isAnonymous: false,
        });
      },
    }),
    {
      name: "refugio-session",
      partialize: (state) => ({
        ageOk: state.ageOk,
        pactOk: state.pactOk,
        userName: state.userName,
        nickChosen: state.nickChosen,
        email: state.email,
        loggedIn: state.loggedIn,
        isAnonymous: state.isAnonymous,
        plan: state.plan,
        avatarKey: state.avatarKey,
        frameKey: state.frameKey,
        envelopeKey: state.envelopeKey,
        fontKey: state.fontKey,
        pinEnabled: state.pinEnabled,
        pin: state.pin,
        energiesSent: state.energiesSent,
        energiesReceived: state.energiesReceived,
        dewDropsReceived: state.dewDropsReceived,
        lettersRead: state.lettersRead,
        adviceSent: state.adviceSent,
        lettersPublished: state.lettersPublished,
        days: state.days,
        amazonSeeds: state.amazonSeeds,
        islandTreeKey: state.islandTreeKey,
        islandBornCare: state.islandBornCare,
        grownIslandKeys: state.grownIslandKeys,
        thankedAdviceIds: state.thankedAdviceIds,
        adviceDay: state.adviceDay,
        adviceToday: state.adviceToday,
        letterWeek: state.letterWeek,
        lettersThisWeek: state.lettersThisWeek,
        theme: state.theme,
        protectScreen: state.protectScreen,
        notices: state.notices,
        humusCount: state.humusCount,
        pendingDew: state.pendingDew,
        letters: state.letters,
        cloudStamp: state.cloudStamp,
      }),
    },
  ),
);

export function currentSubscription() {
  const state = useRefugioStore.getState();
  const plan = state.plan === "free" ? null : state.plan;
  const status: VipSubscriptionStatus | null = plan ? "active" : null;
  return {
    plan,
    status,
    active: Boolean(plan),
    entitlements: entitlementsFor(plan, status),
  };
}
