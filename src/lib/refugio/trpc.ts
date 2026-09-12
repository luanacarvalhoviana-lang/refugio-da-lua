import { useRefugioStore, currentSubscription } from "@/lib/refugio/store";
import { loadLocalDiary, loadLocalMemories } from "@/lib/refugio/localGarden";
import { findAccount, removeAccount, resetPassword, upsertAccount, verifyAccount } from "@/lib/refugio/accounts";
import type { AmazonSeed } from "@/lib/refugio/amazonTrees";
import { adviseMuralLetter, energyMuralLetter, hideMuralLetter, publishMuralLetter } from "@/lib/refugio/mural-cloud";
import { cachedMuralLetters } from "@/lib/refugio/use-mural";

type Handlers<TData, TVars> = {
  onSuccess?: (data: TData, vars: TVars) => void;
  onError?: (err: Error) => void;
};

function useMutation<TVars, TData>(
  run: (vars: TVars) => TData,
  handlers?: Handlers<TData, TVars>,
) {
  return {
    mutate: (vars: TVars) => {
      try {
        const data = run(vars);
        handlers?.onSuccess?.(data, vars);
      } catch (error) {
        handlers?.onError?.(error instanceof Error ? error : new Error("Algo deu errado."));
      }
    },
    isPending: false,
    error: null as Error | null,
    reset: () => undefined,
  };
}

export const trpc = {
  useUtils: () => ({
    auth: { me: { invalidate: async () => undefined } },
  }),
  auth: {
    login: {
      useMutation: (handlers?: Handlers<void, { email: string; password: string }>) =>
        useMutation((vars) => {
          const existing = findAccount(vars.email);
          if (existing) {
            const result = verifyAccount(vars.email, vars.password);
            if (!result.ok) throw new Error(result.error);
            useRefugioStore.getState().login({ email: result.account.email });
            return;
          }
          const account = upsertAccount({ name: "Girassol sereno", email: vars.email, password: vars.password });
          useRefugioStore.getState().register({ name: account.name, email: account.email });
        }, handlers),
    },
    register: {
      useMutation: (
        handlers?: Handlers<void, { name: string; email: string; password: string; isAdult: boolean }>,
      ) =>
        useMutation((vars) => {
          if (!vars.isAdult) throw new Error("É preciso aceitar os Termos.");
          if (vars.password.length < 8) throw new Error("A senha precisa ter pelo menos 8 caracteres.");
          if (findAccount(vars.email)) throw new Error("Já existe uma conta com este e-mail. Entre nela.");
          const account = upsertAccount({ name: vars.name, email: vars.email, password: vars.password });
          useRefugioStore.getState().register({ name: account.name, email: account.email });
        }, handlers),
    },
    requestPasswordReset: {
      useMutation: (handlers?: Handlers<void, { email: string }>) =>
        useMutation((vars) => {
          const account = findAccount(vars.email);
          if (account) {
            const next = "lua-" + Math.random().toString(36).slice(2, 8);
            resetPassword(vars.email, next);
            if (typeof window !== "undefined") window.sessionStorage.setItem("refugio-temp-pass", `${vars.email}|${next}`);
          } else if (typeof window !== "undefined") {
            window.sessionStorage.removeItem("refugio-temp-pass");
          }
        }, handlers),
    },
    deleteAccount: {
      useMutation: (handlers?: Handlers<void, void>) =>
        useMutation(() => {
          const email = useRefugioStore.getState().email;
          if (email) removeAccount(email);
          useRefugioStore.getState().logout();
          window.localStorage.removeItem("refugio-session");
          window.localStorage.removeItem("refugio-favorites");
          window.localStorage.removeItem("refugio-diary-entries");
          window.localStorage.removeItem("refugio-memories");
          window.localStorage.removeItem("refugio-pact-ok");
          window.localStorage.removeItem("refugio-age-ok");
        }, handlers),
    },
  },
  vip: {
    favorites: {
      useQuery: (_input?: undefined, _opts?: { enabled?: boolean; retry?: boolean }) => ({
        data: undefined as string[] | undefined,
      }),
    },
    toggleFavorite: {
      useMutation: (handlers?: Handlers<void, { letterId: string }>) => useMutation(() => undefined, handlers),
    },
    savePreferences: {
      useMutation: (handlers?: Handlers<void, { avatarKey?: string; frameKey?: string }>) =>
        useMutation((vars) => {
          if (vars.avatarKey) useRefugioStore.getState().setAvatar(vars.avatarKey);
          if (vars.frameKey) useRefugioStore.getState().setFrame(vars.frameKey);
        }, handlers),
    },
  },
  letters: {
    list: {
      useQuery: () => {
        const letters = useRefugioStore((s) => s.letters);
        return { data: letters, isLoading: false };
      },
    },
    get: {
      useQuery: ({ letterId }: { letterId: string }, _opts?: { enabled?: boolean; retry?: boolean }) => {
        const letters = useRefugioStore((s) => s.letters);
        const data = letters.find((letter) => letter.id === letterId) || cachedMuralLetters().find((letter) => letter.id === letterId);
        return { data, isLoading: false };
      },
    },
    sendEnergy: {
      useMutation: (handlers?: Handlers<{ grewSeed: boolean }, { letterId: string; label?: string }>) =>
        useMutation((vars) => {
          const result = useRefugioStore.getState().sendEnergy(vars.letterId);
          void energyMuralLetter({ data: { letterId: vars.letterId } }).catch(() => undefined);
          return result;
        }, handlers),
    },
    advise: {
      useMutation: (handlers?: Handlers<AmazonSeed | null, { letterId: string; body: string; envelopeKey?: string; fontKey?: string }>) =>
        useMutation((vars) => {
          const result = useRefugioStore.getState().addAdvice(vars);
          const letter = useRefugioStore.getState().letters.find((item) => item.id === vars.letterId);
          const last = letter?.advice?.[letter.advice.length - 1];
          if (last) {
            void adviseMuralLetter({ data: { letterId: vars.letterId, advice: last } }).catch(() => undefined);
          }
          return result;
        }, handlers),
    },
    openAdvice: {
      useMutation: (handlers?: Handlers<void, { adviceId: string }>) =>
        useMutation((vars) => {
          useRefugioStore.getState().openAdvice(vars.adviceId);
        }, handlers),
    },
    thankAdvice: {
      useMutation: (handlers?: Handlers<{ drops: number } | null, { adviceId: string }>) =>
        useMutation((vars) => {
          return useRefugioStore.getState().thankAdvice(vars.adviceId);
        }, handlers),
    },
    publish: {
      useMutation: (
        handlers?: Handlers<
          void,
          {
            body: string;
            topic: string;
            title?: string;
            gender?: string;
            emotion?: string;
            ageGroup?: string;
            paperKey?: string;
            sealKey?: string;
            afterMural?: "humus" | "diary";
          }
        >,
      ) =>
        useMutation((vars) => {
          const letter = useRefugioStore.getState().publishLetter(vars);
          void publishMuralLetter({
            data: {
              id: letter.id,
              title: letter.title,
              author: letter.author,
              initials: letter.initials,
              topic: letter.topic,
              excerpt: letter.excerpt,
              body: letter.body,
              color: letter.color,
              gender: letter.gender || undefined,
              ageGroup: letter.ageGroup || undefined,
              emotion: letter.emotion || undefined,
              hour: letter.hour,
              priority: letter.priority,
              paperKey: letter.paperKey,
              sealKey: letter.sealKey,
              afterMural: letter.afterMural,
            },
          }).catch(() => undefined);
        }, handlers),
    },
    retire: {
      useMutation: (handlers?: Handlers<{ destiny: "humus" | "diary" }, { letterId: string; destiny: "humus" | "diary" }>) =>
        useMutation((vars) => {
          const result = useRefugioStore.getState().retireLetter(vars.letterId, vars.destiny);
          void hideMuralLetter({ data: { letterId: vars.letterId } }).catch(() => undefined);
          return result;
        }, handlers),
    },
  },
  garden: {
    stats: {
      useQuery: (_input?: undefined, _opts?: { enabled?: boolean; retry?: boolean }) => {
        const energies = useRefugioStore((s) => s.energiesSent);
        const energiesReceived = useRefugioStore((s) => s.energiesReceived);
        const lettersRead = useRefugioStore((s) => s.lettersRead);
        const adviceSent = useRefugioStore((s) => s.adviceSent);
        const days = useRefugioStore((s) => s.days);
        const amazonSeeds = useRefugioStore((s) => s.amazonSeeds);
        const dewDropsReceived = useRefugioStore((s) => s.dewDropsReceived);
        const islandTreeKey = useRefugioStore((s) => s.islandTreeKey);
        return { data: { energies, energiesReceived, lettersRead, adviceSent, days, amazonSeeds, dewDropsReceived, islandTreeKey } };
      },
    },
  },
  diary: {
    pinStatus: {
      useQuery: (_input?: undefined, _opts?: { enabled?: boolean; retry?: boolean }) => {
        const enabled = useRefugioStore((s) => s.pinEnabled);
        return { data: { enabled }, refetch: async () => ({ data: { enabled } }) };
      },
    },
    weekly: {
      useQuery: (_input?: undefined, _opts?: { enabled?: boolean; retry?: boolean }) => {
        const entries = typeof window === "undefined" ? [] : loadLocalDiary();
        const data = Array.from({ length: 7 }, (_, index) => {
          const day = new Date();
          day.setDate(day.getDate() - (6 - index));
          const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
          return entries.filter((entry) => entry.createdAt.slice(0, 10) === key).length;
        });
        return { data };
      },
    },
    setPin: {
      useMutation: (handlers?: Handlers<void, { pin: string }>) =>
        useMutation((vars) => {
          if (!/^\d{4,6}$/.test(vars.pin)) throw new Error("Use 4 a 6 números.");
          useRefugioStore.getState().setPin(vars.pin);
        }, handlers),
    },
    unlock: {
      useMutation: (handlers?: Handlers<void, { pin: string }>) =>
        useMutation((vars) => {
          if (!useRefugioStore.getState().unlock(vars.pin)) throw new Error("PIN incorreto.");
        }, handlers),
    },
    list: {
      useQuery: (_input?: undefined, _opts?: { enabled?: boolean; retry?: boolean }) => {
        const entries = typeof window === "undefined" ? [] : loadLocalDiary();
        const data = entries.map((entry) => ({
          id: entry.id,
          content: entry.content,
          createdAt: entry.createdAt,
        }));
        return {
          data,
          refetch: async () => ({ data }),
        };
      },
    },
    create: {
      useMutation: (handlers?: Handlers<void, { content: string }>) =>
        useMutation(() => undefined, handlers),
    },
  },
  memories: {
    list: {
      useQuery: (_input?: undefined, _opts?: { enabled?: boolean; retry?: boolean }) => {
        const items = typeof window === "undefined" ? [] : loadLocalMemories();
        const data = items.map((item) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          createdAt: item.createdAt,
        }));
        return {
          data,
          refetch: async () => ({ data }),
        };
      },
    },
    create: {
      useMutation: (handlers?: Handlers<void, { title: string; content: string; sourceType: string }>) =>
        useMutation(() => undefined, handlers),
    },
  },
  billing: {
    subscriptionStatus: {
      useQuery: () => {
        const plan = useRefugioStore((s) => s.plan);
        const loggedIn = useRefugioStore((s) => s.loggedIn);
        const active = loggedIn && plan !== "free";
        const vipPlan = plan === "free" ? null : plan;
        const status = active ? "active" : null;
        return {
          data: currentSubscription(),
          isLoading: false,
          refetch: async () => ({
            data: { plan: vipPlan, status, active, entitlements: currentSubscription().entitlements },
          }),
        };
      },
    },
    cancelSubscription: {
      useMutation: (handlers?: Handlers<void, void>) =>
        useMutation(() => {
          useRefugioStore.getState().cancelPlan();
        }, handlers),
    },
  },
};
