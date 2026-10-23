export type KeptLetter = {
  slug: string;
  lang: string;
  key: string;
  story: string;
  from: string;
  text: string;
};

const KEY = "refugio-cartas";

export function readLetters(): KeptLetter[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(window.localStorage.getItem(KEY) || "[]") as KeptLetter[];
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function keepLetter(letter: KeptLetter) {
  const next = readLetters().filter((item) => !(item.slug === letter.slug && item.lang === letter.lang && item.key === letter.key));
  next.unshift(letter);
  window.localStorage.setItem(KEY, JSON.stringify(next.slice(0, 40)));
}
