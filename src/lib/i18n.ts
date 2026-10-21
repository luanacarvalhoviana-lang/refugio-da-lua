import { useRefugioStore } from "@/lib/refugio/store";
import es from "@/locales/es.json";
import pt from "@/locales/pt.json";

export type Lang = "pt" | "es";

const dictionaries: Record<Lang, Record<string, string>> = { pt, es };

export function t(key: string, lang: Lang = "pt") {
  return dictionaries[lang][key] ?? dictionaries.pt[key] ?? key;
}

export function useT() {
  const lang = useRefugioStore((state) => state.lang);
  const setLang = useRefugioStore((state) => state.setLang);
  return {
    lang,
    setLang,
    t: (key: string) => t(key, lang),
  };
}
