import { sharpPt } from "@/lib/refugio/stories-sharp";
import { sharpEs } from "@/lib/refugio/stories-sharp-es";
import { sharpEn } from "@/lib/refugio/stories-sharp-en";
import { applyMemory } from "@/lib/refugio/story-memory";
import { jantarPt } from "@/lib/refugio/stories-jantar";

export type Lang = "pt" | "es" | "en";

export type Choice = {
  id: string;
  label: string;
  to: string;
  affinity?: number;
  clue?: string;
  thought?: string;
};

export type Ending = {
  key: string;
  title: string;
  body: string;
  flower: string;
  letter?: { from: string; text: string };
  /** The morning after this ending. */
  morning?: { title: string; body: string };
  /** If the reader made this choice, that morning replaces the default. */
  morningIf?: Array<{ if: string; title: string; body: string }>;
};

export type Scene = {
  id: string;
  speaker?: string;
  body?: string;
  choices?: Choice[];
  ending?: Ending;
  music?: string;
  /** Se houver, a música toca só esses segundos e o som ambiente volta. */
  musicFor?: number;
  /** A paragraph that appears only if that earlier choice was taken. */
  after?: Array<{ if: string; line: string }>;
  /** Show every matching `after` line (in order), not only the latest one. */
  afterEach?: boolean;
  /** Still for this place. Changes when the scene changes. */
  art?: string;
  /** A different still when an earlier choice was taken. */
  artIf?: Array<{ if: string; art: string; where?: string }>;
  /** Short name of the place, shown under the still. */
  where?: string;
  /** Names present in this scene. */
  people?: string[];
  /** A short cinematic loop of this exact scene. */
  motion?: string;
};

export type Story = {
  slug: string;
  title: string;
  author: string;
  rating: "16" | "14" | "livre";
  genres: string[];
  minutes: number;
  synopsis: string;
  place: string;
  art?: string;
  start: string;
  sound?: string;
  life?: "rain" | "paper" | "candle" | "lamp" | "room";
  cast?: Array<{ name: string; life: string; portrait?: string; motion?: string }>;
  scenes: Scene[];
  access?: "aberta" | "cheia" | "antecipada";
  opensOn?: string;
  locked?: boolean;
  moonNight?: boolean;
};

export const stories: Record<Lang, Story[]> = applyMemory({
  pt: [...sharpPt, jantarPt],
  es: sharpEs,
  en: sharpEn,
});

export function getStory(lang: Lang, slug: string) {
  return stories[lang].find((story) => story.slug === slug) ?? null;
}

export function sceneOf(story: Story, id: string) {
  return story.scenes.find((scene) => scene.id === id) ?? story.scenes[0];
}

export function artOf(story: Story) {
  if (story.art) return story.art;
  const place = story.place.toLowerCase();
  if (place.includes("templ")) return "/scenes/templo.jpg";
  if (place.includes("varanda") || place.includes("balc")) return "/scenes/varanda.jpg";
  if (place.includes("caf")) return "/scenes/cafe.jpg";
  if (place.includes("praia") || place.includes("playa") || place.includes("beach")) return "/scenes/praia.jpg";
  return "/scenes/biblioteca.jpg";
}

export function authorSlug(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
