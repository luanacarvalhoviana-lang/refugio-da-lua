import { sharpPt } from "@/lib/refugio/stories-sharp";
import { sharpEs } from "@/lib/refugio/stories-sharp-es";
import { sharpEn } from "@/lib/refugio/stories-sharp-en";

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
  scenes: Scene[];
  access?: "aberta" | "cheia" | "antecipada";
  opensOn?: string;
  locked?: boolean;
  moonNight?: boolean;
};

export const stories: Record<Lang, Story[]> = {
  pt: sharpPt,
  es: sharpEs,
  en: sharpEn,
};

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
