import { useState, type ReactNode } from "react";
import { ThemeToggle } from "@/components/refugio/theme-toggle";
import { htmlLang, homePath, pactoPath } from "@/lib/refugio/lang";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const choose = (next: Lang) => {
    setLang(next);
    document.documentElement.lang = htmlLang(next);
  };
  const closeMenu = () => setMenuOpen(false);
  const tools = (
    <div className="house-tools">
      <div className="soon-lang" aria-label="idioma">
        <button type="button" className={lang === "pt" ? "is-on" : ""} onClick={() => choose("pt")}>
          PT
        </button>
        <button type="button" className={lang === "es" ? "is-on" : ""} onClick={() => choose("es")}>
          ES
        </button>
        <button type="button" className={lang === "en" ? "is-on" : ""} onClick={() => choose("en")}>
          EN
        </button>
      </div>
      <ThemeToggle compact />
      <a className="house-enter" href="/#entrar" onClick={closeMenu}>
        {t.enter}
      </a>
    </div>
  );
  const links = (
    <nav className="house-nav" onClick={closeMenu}>
      <a href="/historias">{t.navStories}</a>
      <a href="/biblioteca">{t.navLibrary}</a>
      <a href="/loja">{t.navShop}</a>
      <a href="/planos">{t.navPlans}</a>
      <a href="/jardim">{t.navGarden}</a>
      <a href="/sobre">{t.navAbout}</a>
    </nav>
  );
  return (
    <div className={`house ${night ? "is-night" : "is-day"}`}>
      <header className="house-bar">
        <div className="house-bar-inner">
          <a className="house-brand" href={homePath(lang)}>
            <img src={night ? "/icons/logo-night.png" : "/icons/logo-day.png"} alt="" width={48} height={48} />
            <span>{t.brand}</span>
          </a>
          {links}
          {tools}
          <button
            type="button"
            className="house-menu"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Fechar" : "Menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </header>
      {menuOpen ? (
        <>
          <button type="button" className="house-menu-shade" aria-label="Fechar" onClick={closeMenu} />
          <div className="house-drawer">
            <button type="button" className="house-menu-x" aria-label="Fechar" onClick={closeMenu}>
              ×
            </button>
            {links}
            {tools}
          </div>
        </>
      ) : null}
      {children}
      <footer className="house-foot">
        <a href="/regras">{t.rulesLink}</a>
        <a href={pactoPath(lang)}>{t.pactoLink}</a>
        <a href="/privacidade">{t.privacyLink}</a>
        <a href="/termos">{t.termsLink}</a>
        <a href="/contato">{t.contactLink}</a>
        <a href="/escrever">{t.writeStory}</a>
        <a href="/apoio">{t.helpLink}</a>
        <a href="/instalar">{t.install}</a>
        <a href="https://refugio-da-lua.vercel.app">refugio-da-lua.vercel.app</a>
      </footer>
    </div>
  );
}