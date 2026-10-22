import { ageFromBirth, readBirth, writeBirth } from "@/lib/refugio/reading-local";

export const PACTO_VERSION = 1;
const KEY = "refugio-pacto";
const NEXT = "refugio-pacto-next";

export type PactRecord = { version: number; acceptedAt: string };

export function readPact(): PactRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = JSON.parse(window.localStorage.getItem(KEY) || "") as PactRecord;
    if (raw?.version === PACTO_VERSION && raw.acceptedAt) return raw;
  } catch {
    return null;
  }
  return null;
}

export function writePact() {
  const record: PactRecord = { version: PACTO_VERSION, acceptedAt: new Date().toISOString() };
  window.localStorage.setItem(KEY, JSON.stringify(record));
  return record;
}

export function rememberPactNext(path: string) {
  window.sessionStorage.setItem(NEXT, path);
}

export function takePactNext() {
  const path = window.sessionStorage.getItem(NEXT) || "/historias";
  window.sessionStorage.removeItem(NEXT);
  return path.startsWith("/") ? path : "/historias";
}

export function birthIso(day: string, month: string, year: string) {
  const d = Number(day);
  const m = Number(month);
  const y = Number(year);
  if (!Number.isInteger(y) || y < 1900 || y > new Date().getFullYear()) return null;
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  if (date.getTime() > Date.now()) return null;
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function displayBirth(iso: string | null) {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return "";
  return `${day}/${month}/${year}`;
}

export function parseBirth(value: string) {
  const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  return birthIso(match[1], match[2], match[3]);
}

export function knownBirth() {
  const iso = readBirth();
  if (!iso || ageFromBirth(iso) === null) return "";
  return displayBirth(iso);
}

export function keepBirth(iso: string) {
  writeBirth(iso);
}
