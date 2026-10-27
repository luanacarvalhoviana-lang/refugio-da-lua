import { useEffect, useState, type FormEvent } from "react";
import { ThemeToggle } from "@/components/refugio/theme-toggle";
import { homePath } from "@/lib/refugio/lang";
import { useT, type Lang } from "@/lib/i18n";
import { useRefugioStore } from "@/lib/refugio/store";
import { joinWaitlist, waitlistCount } from "@/lib/refugio/waitlist.server";

const PLACES = [
  ["city", "soon.place.city"],
  ["beach", "soon.place.beach"],
  ["cafe", "soon.place.cafe"],
  ["library", "soon.place.library"],
] as const;

const COUNTRIES = ["BR", "AR", "MX", "CO", "CL", "PE", "UY", "OUTRO"] as const;

export function SoonPage({ pageLang }: { pageLang: Lang }) {
  const { t, setLang, lang } = useT();
  const night = useRefugioStore((state) => state.theme) !== "day";
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"leitora" | "autora" | "ambas">("leitora");
  const [country, setCountry] = useState("BR");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [total, setTotal] = useState(0);
  const [ref, setRef] = useState("");

  useEffect(() => {
    if (lang !== pageLang) setLang(pageLang);
  }, [lang, pageLang, setLang]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRef(params.get("ref")?.trim().toLowerCase() || "");
    void waitlistCount().then((result) => setTotal(result.total)).catch(() => setTotal(0));
  }, []);

  const left = Math.max(0, 300 - total);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!email.includes("@")) {
      setError(pageLang === "en" ? "The email is missing." : pageLang === "es" ? "Falta el correo." : "Falta o e-mail.");
      return;
    }
    if (!consent) {
      setError(pageLang === "en" ? "Check the box to continue." : pageLang === "es" ? "Marca la casilla para continuar." : "Marque a caixa para continuar.");
      return;
    }
    setPending(true);
    try {
      const result = await joinWaitlist({
        data: {
          email,
          name: name.trim() || undefined,
          lang: pageLang,
          role,
          country,
          ref: ref || undefined,
          consent: true,
        },
      });
      const next = `${homePath(pageLang) === "/" ? "" : homePath(pageLang)}/obrigada`;
      window.location.assign(`${next}?code=${encodeURIComponent(result.code)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : pageLang === "en" ? "I could not save it now." : pageLang === "es" ? "No pude guardar ahora." : "Não consegui guardar agora.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className={`soon ${night ? "is-night" : "is-day"}`}>
      <header className="soon-bar">
        <img src={night ? "/icons/logo-night.png" : "/icons/logo-day.png"} alt="" width={42} height={42} />
        <span>{t("brand")}</span>
        <div className="soon-tools">
          <nav className="soon-lang" aria-label="idioma">
            <a href="/" className={pageLang === "pt" ? "is-on" : ""}>
              PT
            </a>
            <a href="/es" className={pageLang === "es" ? "is-on" : ""}>
              ES
            </a>
            <a href="/en" className={pageLang === "en" ? "is-on" : ""}>
              EN
            </a>
          </nav>
          <ThemeToggle compact />
        </div>
      </header>

      <section className="soon-hero">
        <div className="soon-rain" aria-hidden="true" />
        <p className="soon-kicker">{t("soon.kicker")}</p>
        <h1>{t("soon.title")}</h1>
        <p className="soon-lead">{t("soon.lead")}</p>
        <form className="soon-form" onSubmit={onSubmit}>
          <label>
            {t("soon.email")}
            <input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>
            {t("soon.name")}
            <input type="text" maxLength={80} value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label>
            {t("soon.role")}
            <select value={role} onChange={(event) => setRole(event.target.value as typeof role)}>
              <option value="leitora">{t("soon.role.leitora")}</option>
              <option value="autora">{t("soon.role.autora")}</option>
              <option value="ambas">{t("soon.role.ambas")}</option>
            </select>
          </label>
          <label>
            {t("soon.country")}
            <select value={country} onChange={(event) => setCountry(event.target.value)}>
              {COUNTRIES.map((code) => (
                <option key={code} value={code}>
                  {t(`soon.country.${code}`)}
                </option>
              ))}
            </select>
          </label>
          <label className="soon-check">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
            <span>
              {t("soon.consent")}{" "}
              <a href={pageLang === "es" ? "/privacidade" : "/privacidade"}>{t("soon.privacy")}</a>.
            </span>
          </label>
          {error ? <p className="soon-error">{error}</p> : null}
          <button type="submit" disabled={pending}>
            {pending ? t("soon.sending") : t("soon.submit")}
          </button>
        </form>
        {total >= 100 ? <p className="soon-count">{t("soon.count").replace("{n}", String(left))}</p> : null}
      </section>

      <section className="soon-hooks">
        {(["1", "2", "3"] as const).map((n) => (
          <article key={n}>
            <h2>{t(`soon.hook${n}.title`)}</h2>
            <p>{t(`soon.hook${n}.text`)}</p>
          </article>
        ))}
      </section>

      <section className="soon-places">
        <h2>{t("soon.places")}</h2>
        <div>
          {PLACES.map(([key, label]) => (
            <figure key={key} className={`soon-place is-${key}`}>
              <figcaption>{t(label)}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="soon-authors">
        <img src="/mascot/luna-waving.png" alt="" width={88} height={88} />
        <div>
          <p className="soon-kicker">{t("soon.authors.kicker")}</p>
          <h2>{t("soon.authors.title")}</h2>
          <p>{t("soon.authors.text")}</p>
        </div>
      </section>

      <footer className="soon-foot">
        <a href="/privacidade">{t("soon.footer.privacy")}</a>
        <a href="/termos">{t("soon.footer.terms")}</a>
        <a href="/contato">{t("soon.footer.contact")}</a>
      </footer>
    </main>
  );
}
