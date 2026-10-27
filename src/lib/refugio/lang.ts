import type { Lang } from "@/lib/refugio/stories";

export function htmlLang(lang: Lang) {
  if (lang === "en") return "en";
  if (lang === "es") return "es-419";
  return "pt-BR";
}

export function dateLocale(lang: Lang) {
  if (lang === "en") return "en";
  if (lang === "es") return "es";
  return "pt-BR";
}

export function homePath(lang: Lang) {
  if (lang === "en") return "/en";
  if (lang === "es") return "/es";
  return "/";
}

export function pactoPath(lang: Lang) {
  if (lang === "en") return "/en/pacto";
  if (lang === "es") return "/es/pacto";
  return "/pacto";
}

export function asLang(value: string): Lang {
  if (value === "en" || value === "es" || value === "pt") return value;
  return "pt";
}
