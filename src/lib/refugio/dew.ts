import type { Letter } from "@/lib/refugio/letters";

const HOUR = 60 * 60 * 1000;
export const DEW_UNCARED_MS = 48 * HOUR;
export const DEW_CARED_MS = 7 * 24 * HOUR;
const MIST_MS = 12 * HOUR;

export function letterWasCared(letter: Letter) {
  return letter.energy >= 1 || (letter.advice?.length ?? 0) > 0;
}

export function letterPostedAt(letter: Letter) {
  if (letter.postedAt) {
    const time = new Date(letter.postedAt).getTime();
    if (!Number.isNaN(time)) return time;
  }
  return Date.now() - 2 * HOUR;
}

export function dewLifetime(letter: Letter) {
  return letterWasCared(letter) ? DEW_CARED_MS : DEW_UNCARED_MS;
}

export type DewPhase = "fresh" | "mist" | "due";

export function dewPhase(letter: Letter, now = Date.now()): DewPhase {
  const remaining = dewLifetime(letter) - (now - letterPostedAt(letter));
  if (remaining <= 0) return "due";
  if (remaining <= MIST_MS) return "mist";
  return "fresh";
}

export function dewHoursLeft(letter: Letter, now = Date.now()) {
  return Math.max(0, Math.ceil((dewLifetime(letter) - (now - letterPostedAt(letter))) / HOUR));
}
