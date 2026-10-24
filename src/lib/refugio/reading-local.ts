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
const PROGRESS = "refugio-reading";
const BIRTH = "refugio-birth";

export type LocalProgress = {
  slug: string;
  lang: "pt" | "es";
  sceneId: string;
  affinity: number;
  clues: string[];
  title?: string;
  ended?: boolean;
};

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

export function ageFromBirth(birthDate: string, today = new Date()) {
  const [year, month, day] = birthDate.split("-").map(Number);
  if (!year || !month || !day) return null;
  let age = today.getFullYear() - year;
  const monthNow = today.getMonth() + 1;
  if (monthNow < month || (monthNow === month && today.getDate() < day)) age -= 1;
  return age;
}

export function readBirth() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(BIRTH);
  } catch {
    return null;
  }
}

export function writeBirth(value: string) {
  window.localStorage.setItem(BIRTH, value);
}

function readAllProgress(): LocalProgress[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PROGRESS);
    const list = raw ? (JSON.parse(raw) as LocalProgress[]) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function readProgress(slug: string, lang: "pt" | "es") {
  return readAllProgress().find((item) => item.slug === slug && item.lang === lang) ?? null;
}

export function readShelf() {
  return readAllProgress();
}

export function writeProgress(progress: LocalProgress) {
  const list = readAllProgress().filter((item) => !(item.slug === progress.slug && item.lang === progress.lang));
  list.unshift(progress);
  window.localStorage.setItem(PROGRESS, JSON.stringify(list.slice(0, 20)));
}
