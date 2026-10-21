import type { Ending } from "@/lib/refugio/stories";

export type SavedEnding = {
  slug: string;
  lang: "pt" | "es";
  title: string;
  story: string;
  flower: string;
  key: string;
  at: string;
};

const KEY = "refugio-endings";

export function readEndings(): SavedEnding[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as SavedEnding[]) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveEnding(input: { slug: string; lang: "pt" | "es"; story: string; ending: Ending }) {
  const list = readEndings().filter((item) => !(item.slug === input.slug && item.key === input.ending.key && item.lang === input.lang));
  list.unshift({
    slug: input.slug,
    lang: input.lang,
    title: input.ending.title,
    story: input.story,
    flower: input.ending.flower,
    key: input.ending.key,
    at: new Date().toISOString(),
  });
  window.localStorage.setItem(KEY, JSON.stringify(list.slice(0, 24)));
}
