import { useEffect, useState } from "react";
import { StoryShell, useHouse } from "@/components/refugio/story-shell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { confirmStoryCheckout, openPlanPortal, readHousePlan, startStoryCheckout, storyCheckoutReady } from "@/lib/refugio/billing";
import { sendContactNote } from "@/lib/refugio/contact-cloud";
import { listStoryLetters } from "@/lib/refugio/letter-cloud";
import { readLetters, type KeptLetter } from "@/lib/refugio/kept-letters";
import { loadGardenCloud } from "@/lib/refugio/progress-cloud";
import { readEndings, type SavedEnding } from "@/lib/refugio/reading-local";

export function PlansPage() {
  const { t, lang } = useHouse();
  const { user } = useCurrentUserState();
  const [ready, setReady] = useState(false);
  const [cycle, setCycle] = useState<"month" | "year">("month");
  const [planNow, setPlanNow] = useState("lua_nova");
  const [note, setNote] = useState("");
  const [pending, setPending] = useState("");
  const signedIn = Boolean(user && !user.isDevFallback);
  useEffect(() => {
    void storyCheckoutReady().then((result) => setReady(result.ready)).catch(() => setReady(false));
    if (signedIn) void readHousePlan().then((result) => setPlanNow(result.plan)).catch(() => setPlanNow("lua_nova"));
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (params.get("checkout") === "cancelled") setNote(t.planBack);
    if (params.get("checkout") === "success" && sessionId) {
      void confirmStoryCheckout({ data: { sessionId } })
        .then((result) => setNote(result.paid ? t.planOpened : t.planFail))
        .catch(() => setNote(t.planFail));
    }
  }, [signedIn, t.planBack, t.planFail, t.planOpened]);
  const cards = [
    [t.freeName, t.freePrice, t.freeItems, ""] as const,
    [t.fullName, cycle === "year" ? t.fullYearPrice : t.fullPrice, t.fullItems, "lua_cheia"] as const,
    [t.starName, cycle === "year" ? t.starYearPrice : t.starPrice, t.starItems, "constelacao"] as const,
  ];
  function subscribe(plan: "lua_cheia" | "constelacao") {
    if (!ready) {
      setNote(t.planWait);
      return;
    }
    setPending(plan);
    setNote("");
    void startStoryCheckout({ data: { plan, interval: cycle, origin: window.location.origin, lang } })
      .then((result) => {
        if (result.ok && result.url) window.location.assign(result.url);
        else setNote(result.reason === "conta" ? t.planEnter : t.shopSoon);
      })
      .catch(() => setNote(t.planFail))
      .finally(() => setPending(""));
  }
  function manage() {
    setPending("portal");
    void openPlanPortal({ data: { origin: window.location.origin } })
      .then((result) => {
        if (result.ok && result.url) window.location.assign(result.url);
        else setNote(t.planFail);
      })
      .catch(() => setNote(t.planFail))
      .finally(() => setPending(""));
  }
  return (
    <StoryShell>
      <section className="house-hero">
        <p className="soon-kicker">{t.navPlans}</p>
        <h1>{t.plansTitle}</h1>
        <p className="soon-lead">{t.planOath}</p>
        <p className="house-cta">
          <button type="button" className={cycle === "month" ? "is-on" : ""} onClick={() => setCycle("month")}>{t.planMonthly}</button>
          <button type="button" className={cycle === "year" ? "is-on" : ""} onClick={() => setCycle("year")}>{t.planAnnual} · {t.planSave}</button>
        </p>
      </section>
      <section className="plan-grid">
        {cards.map(([name, price, items, plan]) => (
          <article key={name} className={plan === "lua_cheia" ? "is-main" : ""}>
            {plan === "lua_cheia" ? <p className="soon-kicker">{t.planLoved}</p> : null}
            <h2>{name}</h2>
            <p className="plan-price">{price}</p>
            <ul>
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="plan-actions">
              {!plan ? (
                <a className="house-primary" href="/historias">{t.planFree}</a>
              ) : planNow === plan ? (
                <>
                  <p className="access-pill">{t.planYours}</p>
                  <button type="button" disabled={pending !== ""} onClick={manage}>{pending === "portal" ? t.passWorking : t.planManage}</button>
                </>
              ) : signedIn ? (
                <button type="button" disabled={pending !== ""} onClick={() => subscribe(plan)}>
                  {pending === plan ? t.passWorking : plan === "lua_cheia" ? t.planJoinCheia : t.planJoinStar}
                </button>
              ) : (
                <a className="house-primary" href="/conta">{t.planEnter}</a>
              )}
            </div>
          </article>
        ))}
      </section>
      <section className="house-block">
        <h2>{t.shopTitle}</h2>
        <p className="soon-lead">{t.shopLead}</p>
        <a className="house-primary" href="/loja">{t.navShop}</a>
      </section>
      <section className="house-block prose">
        <h2>{t.planFaq}</h2>
        {t.planQuestions.map((item) => (
          <p key={item.q}><strong>{item.q}</strong> {item.a}</p>
        ))}
      </section>
      {note ? <p className="house-note plan-note">{note}</p> : null}
      <p className="house-note plan-note">{ready ? t.plansOpen : t.plansNote}</p>
    </StoryShell>
  );
}

export function AboutPage() {
  const { t } = useHouse();
  return (
    <StoryShell>
      <section className="house-hero">
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
  const [letters, setLetters] = useState<KeptLetter[]>([]);
  useEffect(() => {
    const local = readEndings();
    setEndings(local);
    setLetters(readLetters());
    void loadGardenCloud()
      .then((result) => {
        if (!result.signedIn) return;
        const merged = new Map<string, SavedEnding>();
        for (const item of result.endings) merged.set(`${item.lang}:${item.slug}:${item.key}`, item);
        for (const item of local) merged.set(`${item.lang}:${item.slug}:${item.key}`, item);
        setEndings([...merged.values()]);
      })
      .catch(() => undefined);
    void listStoryLetters()
      .then((result) => {
        if (!result.signedIn) return;
        const merged = new Map<string, KeptLetter>();
        for (const item of result.letters) merged.set(`${item.lang}:${item.slug}:${item.key}`, item);
        for (const item of readLetters()) merged.set(`${item.lang}:${item.slug}:${item.key}`, item);
        setLetters([...merged.values()]);
      })
      .catch(() => undefined);
  }, []);
  return (
    <StoryShell>
      <section className="house-block">
        <p className="soon-kicker">{t.navGarden}</p>
        <h1>{t.gardenTitle}</h1>
        <p>{t.gardenLead}</p>
        <p><a href="/lembrancas">{t.keepBox}</a></p>
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
        {letters.length > 0 ? (
          <div className="flower-grid">
            {letters.map((letter) => (
              <article key={`${letter.slug}-${letter.key}`} className="letter-sheet">
                <span>{t.letterFrom.replace("{name}", letter.from)}</span>
                <strong>{letter.story}</strong>
                <p>{letter.text}</p>
              </article>
            ))}
          </div>
        ) : null}
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
