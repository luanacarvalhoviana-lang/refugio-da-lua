import { createFileRoute } from "@tanstack/react-router";
import { t } from "@/lib/i18n";
import { useRefugioStore } from "@/lib/refugio/store";

export const Route = createFileRoute("/regras")({
  component: RulesSoon,
});

function RulesSoon() {
  const lang = useRefugioStore((state) => state.lang);
  return (
    <main className="soon is-night">
      <section className="soon-hero soon-thanks">
        <p className="soon-kicker">{t("rules.kicker", lang)}</p>
        <h1>{t("rules.title", lang)}</h1>
        <p className="soon-lead">{t("rules.text", lang)}</p>
        <a className="soon-back" href={lang === "es" ? "/es" : "/"}>
          {t("thanks.back", lang)}
        </a>
      </section>
    </main>
  );
}
