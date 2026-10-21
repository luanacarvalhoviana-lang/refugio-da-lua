import type { Story } from "@/lib/refugio/stories";

export type TrackMood = "calma" | "romance" | "suspense" | "despedida" | "revelacao";

export type Track = {
  id: string;
  title: { pt: string; es: string };
  mood: TrackMood;
  src: string;
  premium: boolean;
  credit?: string;
};

export const tracks: Track[] = [
  { id: "calma", title: { pt: "Calma", es: "Calma" }, mood: "calma", src: "/music/calma.mp3", premium: false },
  { id: "romance", title: { pt: "Romance", es: "Romance" }, mood: "romance", src: "/music/romance.mp3", premium: false },
  { id: "suspense", title: { pt: "Suspense", es: "Suspense" }, mood: "suspense", src: "/music/suspense.mp3", premium: false },
  { id: "despedida", title: { pt: "Despedida", es: "Despedida" }, mood: "despedida", src: "/music/despedida.mp3", premium: false },
  { id: "revelacao", title: { pt: "Revelação", es: "Revelación" }, mood: "revelacao", src: "/music/revelacao.mp3", premium: false },
];

const STORY_PASS = new Set(["cheia", "lua-cheia", "lua_cheia", "constelacao", "constelação", "star", "full"]);

export function isStoryPass(plan: string | null | undefined) {
  if (!plan) return false;
  return STORY_PASS.has(plan.toLowerCase());
}

export function resolveTrack(id: string, premiumUnlocked: boolean): Track | null {
  const track = tracks.find((item) => item.id === id) ?? null;
  if (!track) return null;
  if (!track.premium || premiumUnlocked) return track;
  return tracks.find((item) => item.mood === track.mood && !item.premium) ?? null;
}

/** Last scene with a track wins. If none did, the story ambient sound plays. */
export function sourceForScene(story: Story, sceneIds: string[], premiumUnlocked: boolean) {
  let held: string | null = null;
  for (const id of sceneIds) {
    const scene = story.scenes.find((item) => item.id === id);
    if (!scene?.music) continue;
    const track = resolveTrack(scene.music, premiumUnlocked);
    if (track) held = track.src;
  }
  return held || story.sound || "/sounds/rain.mp3";
}

export function crossfade(
  slots: Array<HTMLAudioElement | null>,
  active: { current: number },
  toSrc: string,
  volume: number,
  frame: { current: number },
) {
  const nextI = active.current === 0 ? 1 : 0;
  if (!slots[nextI]) {
    const created = new Audio();
    created.loop = true;
    created.preload = "auto";
    slots[nextI] = created;
  }
  const next = slots[nextI];
  const prev = slots[active.current];
  if (!next) return;
  if (prev && prev.src.endsWith(toSrc) && !prev.paused) {
    prev.volume = volume;
    return;
  }
  next.loop = true;
  if (!next.src.endsWith(toSrc)) {
    next.src = toSrc;
    next.load();
  }
  next.volume = 0;
  const failed = () => {
    next.pause();
    next.volume = 0;
  };
  next.onerror = failed;
  void next.play().catch(failed);
  const start = performance.now();
  cancelAnimationFrame(frame.current);
  const tick = (now: number) => {
    const amount = Math.min(1, (now - start) / 1500);
    if (!next.error) next.volume = volume * amount;
    if (prev && !prev.paused) prev.volume = volume * (1 - amount);
    if (amount < 1) {
      frame.current = requestAnimationFrame(tick);
      return;
    }
    if (prev) {
      prev.pause();
      prev.volume = 0;
    }
  };
  frame.current = requestAnimationFrame(tick);
  active.current = nextI;
}
