import type { Letter } from "@/lib/refugio/letters";

function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function hash(value: string) {
  let total = 0;
  for (let i = 0; i < value.length; i += 1) total = (total * 33 + value.charCodeAt(i)) >>> 0;
  return total;
}

export function moonPhaseLabel(date = new Date()) {
  const synodic = 29.530588;
  const known = Date.UTC(2026, 0, 18);
  const days = (date.getTime() - known) / 86400000;
  const age = ((days % synodic) + synodic) % synodic;
  if (age < 1.8 || age > 27.7) return "lua nova";
  if (age < 7.4) return "crescente";
  if (age < 9.2) return "quarto crescente";
  if (age < 13.8) return "gibosa";
  if (age < 16.6) return "lua cheia";
  if (age < 21.2) return "minguante";
  if (age < 23.1) return "quarto minguante";
  return "crescente balsâmica";
}

export function pickNightLetters(letters: Letter[], count = 3, date = new Date()) {
  const key = dayKey(date);
  return [...letters]
    .sort((a, b) => {
      const scoreA = hash(`${key}:${a.id}`) - Number(a.priority || 0) * 40;
      const scoreB = hash(`${key}:${b.id}`) - Number(b.priority || 0) * 40;
      return scoreA - scoreB;
    })
    .slice(0, Math.min(count, letters.length));
}
