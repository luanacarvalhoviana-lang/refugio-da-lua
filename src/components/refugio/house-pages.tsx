import { useEffect, useState } from "react";
import { MoonMascot } from "@/components/refugio/moon-mascot";
import { StoryShell, useHouse } from "@/components/refugio/story-shell";
import { sendContactNote } from "@/lib/refugio/contact-cloud";
import { loadGardenCloud } from "@/lib/refugio/progress-cloud";
import { readEndings, type SavedEnding } from "@/lib/refugio/reading-local";

export function PlansPage() {
  const { t } = useHouse();
  const cards = [
    [t.freeName, t.freePrice, "", t.freeItems],
    [t.fullName, t.fullPrice, t.fullYear, t.fullItems],
    [t.starName, t.starPrice, t.starYear, t.starItems],
  ] as const;
  return (
    <StoryShell>
      <section className="house-hero">
        <p className="soon-kicker">{t.navPlans}</p>
        <h1>{t.plansTitle}</h1>
        <p className="soon-lead">{t.plansLead}</p>
      </section>
      <section className="plan-grid">
        {cards.map(([name, price, year, items]) => (
          <article key={name} className={name === t.fullName ? "is-main" : ""}>
            <h2>{name}</h2>
            <p className="plan-price">{price}</p>
            {year ? <p className="house-note">{year}</p> : null}
            <ul>
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
      <p className="house-note plan-note">{t.plansNote}</p>
    </StoryShell>
  );
}

export function AboutPage() {
  const { t } = useHouse();
  return (
    <StoryShell>
      <section className="house-hero">
        <MoonMascot mood="hug" size={92} />
        <h1>{t.aboutTitle}</h1>
        <p className="soon-lead">{t.aboutBody}</p>
        <p className="soon-lead">{t.aboutKeep}</p>
      </section>
      <section className="house-block">
        <h2>{t.safeTitle}</h2>
        <p>{t.safe}</p>
      </section>
    </StoryShell>
  );
}

export function RulesPage() {
  const { t } = useHouse();
  return (
    <StoryShell>
      <section className="house-block prose">
        <p className="soon-kicker">{t.rulesLink}</p>
        <h1>{t.rulesTitle}</h1>
        <ol>
          {t.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ol>
        <p>{t.rulesPunish}</p>
      </section>
    </StoryShell>
  );
}

export function PrivacyPage() {
  const { t } = useHouse();
  return (
    <StoryShell>
      <section className="house-block prose">
        <h1>{t.privacyTitle}</h1>
        {t.privacy.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </section>
    </StoryShell>
  );
}

export function TermsPage() {
  const { t } = useHouse();
  return (
    <StoryShell>
      <section className="house-block prose">
        <h1>{t.termsTitle}</h1>
        {t.terms.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </section>
    </StoryShell>
  );
}

export function HelpPage() {
  const { t } = useHouse();
  return (
    <StoryShell>
      <section className="house-hero">
        <h1>{t.helpTitle}</h1>
        <p className="soon-lead">{t.help}</p>
      </section>
    </StoryShell>
  );
}

export function GardenPage() {
  const { t } = useHouse();
  const [endings, setEndings] = useState<SavedEnding[]>([]);
  useEffect(() => {
    const local = readEndings();
    setEndings(local);
    void loadGardenCloud()
      .then((result) => {
        if (!result.signedIn) return;
        const merged = new Map<string, SavedEnding>();
        for (const item of result.endings) merged.set(`${item.lang}:${item.slug}:${item.key}`, item);
        for (const item of local) merged.set(`${item.lang}:${item.slug}:${item.key}`, item);
        setEndings([...merged.values()]);
      })
      .catch(() => undefined);
  }, []);
  return (
    <StoryShell>
      <section className="house-block">
        <p className="soon-kicker">{t.navGarden}</p>
        <h1>{t.gardenTitle}</h1>
        <p>{t.gardenLead}</p>
        {endings.length === 0 ? (
          <p className="house-note">{t.gardenEmpty}</p>
        ) : (
          <div className="flower-grid">
            {endings.map((ending) => (
              <article key={`${ending.slug}-${ending.key}-${ending.lang}`}>
                <span>{ending.flower}</span>
                <strong>{ending.title}</strong>
                <em>{ending.story}</em>
              </article>
            ))}
          </div>
        )}
      </section>
    </StoryShell>
  );
}

export function ContactPage() {
  const { t } = useHouse();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("outro");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  useEffect(() => {
    const story = new URLSearchParams(window.location.search).get("historia");
    if (!story) return;
    setTopic("relato");
    setBody((current) => current || `${t.report}: ${story}\n\n`);
  }, [t.report]);
  return (
    <StoryShell>
      <section className="house-block">
        <h1>{t.contactTitle}</h1>
        <p>{t.contactLead}</p>
        <form
          className="soon-form"
          onSubmit={(event) => {
            event.preventDefault();
            setError("");
            setPending(true);
            const label =
              topic === "relato" ? t.topicReport : topic === "tecnico" ? t.topicPay : topic === "autora" ? t.topicWrite : t.topicOther;
            void sendContactNote({
              data: {
                name,
                email,
                topic: topic === "relato" || topic === "tecnico" ? topic : "outro",
                body: `${label}\n\n${body}`,
              },
            })
              .then(() => setSent(true))
              .catch((err) => setError(err instanceof Error ? err.message : "…"))
              .finally(() => setPending(false));
          }}
        >
          <label>
            {t.name}
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label>
            {t.email}
            <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>
            {t.topic}
            <select value={topic} onChange={(event) => setTopic(event.target.value)}>
              <option value="relato">{t.topicReport}</option>
              <option value="tecnico">{t.topicPay}</option>
              <option value="autora">{t.topicWrite}</option>
              <option value="outro">{t.topicOther}</option>
            </select>
          </label>
          <label>
            {t.message}
            <textarea required minLength={8} rows={5} value={body} onChange={(event) => setBody(event.target.value)} />
          </label>
          {error ? <p className="soon-error">{error}</p> : null}
          {sent ? <p>{t.sent}</p> : null}
          <button type="submit" disabled={pending}>
            {t.send}
          </button>
        </form>
      </section>
    </StoryShell>
  );
}
