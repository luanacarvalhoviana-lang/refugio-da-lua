import { useEffect, useState } from "react";
import { homePath } from "@/lib/refugio/lang";
import { useT, type Lang } from "@/lib/i18n";

export function ThanksPage({ pageLang }: { pageLang: Lang }) {
  const { t, setLang, lang } = useT();
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (lang !== pageLang) setLang(pageLang);
    setCode(new URLSearchParams(window.location.search).get("code")?.trim() || "");
  }, [lang, pageLang, setLang]);

  const link = `https://www.refugiodalua.com.br${homePath(pageLang) === "/" ? "" : homePath(pageLang)}/?ref=${encodeURIComponent(code)}`;
  const share = pageLang === "en"
    ? "Stories between women, romance and mystery, where you choose the ending. Refúgio da Lua is about to open."
    : pageLang === "es"
      ? "Historias entre mujeres, de romance y misterio, en las que tú eliges el final. El Refúgio da Lua está por abrir."
      : "Histórias entre mulheres, de romance e mistério, em que você escolhe o final. O Refúgio da Lua está para abrir.";

  return (
    <main className="soon is-night">
      <section className="soon-hero soon-thanks">
        <p className="soon-kicker">{t("thanks.kicker")}</p>
        <h1>{t("thanks.title")}</h1>
        <p className="soon-lead">{t("thanks.lead")}</p>
        <p className="soon-link">{link}</p>
        <div className="soon-share">
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(link).then(() => {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1600);
              });
            }}
          >
            {copied ? t("thanks.copied") : t("thanks.copy")}
          </button>
          <a href={`https://wa.me/?text=${encodeURIComponent(`${share} ${link}`)}`}>{t("thanks.whatsapp")}</a>
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${share} ${link}`)}`}>{t("thanks.x")}</a>
        </div>
        <a className="soon-back" href={homePath(pageLang)}>
          {t("thanks.back")}
        </a>
      </section>
    </main>
  );
}
