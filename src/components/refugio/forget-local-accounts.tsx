import { useEffect } from "react";
import { htmlLang } from "@/lib/refugio/lang";
import { useRefugioStore } from "@/lib/refugio/store";

export function ForgetLocalAccounts() {
  const lang = useRefugioStore((state) => state.lang);
  useEffect(() => {
    try {
      window.localStorage.removeItem("refugio-accounts");
    } catch {
      /* o navegador pode bloquear o armazenamento */
    }
  }, []);
  useEffect(() => {
    document.documentElement.lang = htmlLang(lang);
  }, [lang]);
  return null;
}
