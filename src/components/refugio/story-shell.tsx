import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/refugio/theme-toggle";
import { copy } from "@/lib/refugio/site-copy";
import { useRefugioStore } from "@/lib/refugio/store";
import type { Lang } from "@/lib/refugio/stories";

export function useHouse() {
  const lang = useRefugioStore((state) => state.lang);
  const setLang = useRefugioStore((state) => state.setLang);
  const night = useRefugioStore((state) => state.theme) === "night";
  return { lang, setLang, night, t: copy(lang) };
}

export function StoryShell({ children }: { children: ReactNode }) {
  const { lang, setLang, night, t } = useHouse();
  const choose = (next: Lang) => {
    setLang(next);
    document.documentElement.lang = next === "es" ? "es-419" : "pt-BR";
  };
  return (
    <div className={`house ${night ? "is-night" : "is-day"}`}>
      <header className="house-bar">
        <a className="house-brand" href={lang === "es" ? "/es" : "/"}>
          <img src={night ? "/icons/logo-night.png" : "/icons/logo-day.png"} alt="" width={40} height={40} />
          <span>{t.brand}</span>
        </a>
        <nav className="house-nav">
          <a href="/historias">{t.navStories}</a>
          <a href="/planos">{t.navPlans}</a>
          <a href="/jardim">{t.navGarden}</a>
          <a href="/sobre">{t.navAbout}</a>
        </nav>
        <div className="house-tools">
          <div className="soon-lang" aria-label="idioma">
            <button type="button" className={lang === "pt" ? "is-on" : ""} onClick={() => choose("pt")}>
              PT
            </button>
            <button type="button" className={lang === "es" ? "is-on" : ""} onClick={() => choose("es")}>
              ES
            </button>
          </div>
          <ThemeToggle compact />
          <a className="house-enter" href="/#entrar">
            {t.enter}
          </a>
        </div>
      </header>
      {children}
      <footer className="house-foot">
        <a href="/regras">{t.rulesLink}</a>
        <a href={lang === "es" ? "/es/pacto" : "/pacto"}>{t.pactoLink}</a>
        <a href="/privacidade">{t.privacyLink}</a>
        <a href="/termos">{t.termsLink}</a>
        <a href="/contato">{t.contactLink}</a>
        <a href="/escrever">{t.writeStory}</a>
        <a href="/apoio">{t.helpLink}</a>
        <a href="/instalar">{t.install}</a>
      </footer>
    </div>
  );
}
