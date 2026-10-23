/** Pico de uma lua cheia conhecida. O ciclo médio leva as próximas. */
const EPOCH = Date.parse("2026-10-26T04:12:00Z");
const MONTH = 29.530588853 * 24 * 60 * 60 * 1000;
const SAO_PAULO = 3 * 60 * 60 * 1000;

function localParts(ms: number) {
  const shifted = new Date(ms - SAO_PAULO);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth(),
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours(),
  };
}

function atLocal(year: number, month: number, day: number, hour: number) {
  return Date.UTC(year, month, day, hour) + SAO_PAULO;
}

function nearestPeak(now: number) {
  const n = Math.round((now - EPOCH) / MONTH);
  return EPOCH + n * MONTH;
}

/** Uma noite só: das 18h às 6h, no horário de São Paulo. */
export function moonNightWindow(peak: number) {
  const parts = localParts(peak);
  const evening = parts.hour < 6
    ? atLocal(parts.year, parts.month, parts.day - 1, 18)
    : atLocal(parts.year, parts.month, parts.day, 18);
  return { start: evening, end: evening + 12 * 60 * 60 * 1000, peak };
}

export function moonStatus(now = Date.now()) {
  const peak = nearestPeak(now);
  const around = [peak - MONTH, peak, peak + MONTH];
  for (const item of around) {
    const window = moonNightWindow(item);
    if (now >= window.start && now < window.end) return { open: true as const, until: window.end, next: window.start };
  }
  const upcoming = around
    .map((item) => moonNightWindow(item))
    .filter((window) => window.start > now)
    .sort((a, b) => a.start - b.start)[0];
  return { open: false as const, until: null, next: upcoming?.start ?? peak };
}

export function moonDateLabel(ms: number, lang: "pt" | "es") {
  return new Intl.DateTimeFormat(lang === "es" ? "es" : "pt-BR", {
    day: "numeric",
    month: "long",
    timeZone: "America/Sao_Paulo",
  }).format(ms);
}
