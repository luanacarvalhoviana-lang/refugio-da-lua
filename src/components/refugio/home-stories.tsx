import { useEffect, useState, type FormEvent } from "react";
import { AccessMark } from "@/components/refugio/access-mark";
import { Door } from "@/components/refugio/account-pages";
import { StoryShell, useHouse } from "@/components/refugio/story-shell";
import { saveStoryAlert } from "@/lib/refugio/alert-cloud";
import { type Lang } from "@/lib/refugio/stories";
import { useShelf } from "@/components/refugio/use-shelf";
import { MoonNightNote } from "@/components/refugio/moon-night";

export function HomeStories({ initialLang }: { initialLang?: Lang }) {
  const { lang, setLang, t } = useHouse();
  const shelf = useShelf(lang);
  useEffect(() => {
    if (initialLang && initialLang !== lang) setLang(initialLang);
  }, [initialLang, lang, setLang]);
  const story = shelf[0];
  return (
    <StoryShell>
      <section className="house-stage">
        <div className="house-stage-copy">
          <p className="soon-kicker">{t.heroKicker}</p>
          <h1>{t.heroTitle}</h1>
          <p className="soon-lead">{t.heroLead}</p>
          <div className="house-cta">
            <a className="house-primary" href={`/ler/${story?.slug ?? "passageira"}`}>
              {story ? t.readTitle.replace("{title}", story.title) : t.read}
            </a>
          </div>
        </div>
        {story?.art ? (
          <a className="house-poster" href={`/ler/${story.slug}`}>
            <img src={story.art} alt="" />
          </a>
        ) : null}
      </section>
      <ul className="safe-row">
        <li>{t.safeAge}</li>
        <li>{t.safeKind}</li>
        <li>{t.safePrivate}</li>
        <li>{t.safeHelpShort}</li>
      </ul>
      <section className="house-block">
        <h2>{t.now}</h2>
        <MoonNightNote />
        <div className="story-list">
          {shelf.map((item) => (
            <a key={item.slug} className="story-card" href={`/ler/${item.slug}`}>
              {item.art ? <img className="story-poster" src={item.art} alt="" /> : null}
              <span className="soon-kicker">{item.place} <AccessMark story={item} cheia={t.accessCheia} early={t.accessEarly} moon={t.moonMark} /></span>
              <strong>{item.title}</strong>
              <em>
                {t.by} {item.author} · {item.rating} · {item.minutes} {t.minutes}
              </em>
              <p>{item.synopsis}</p>
            </a>
          ))}
        </div>
      </section>
      <section className="house-block">
        <h2>{t.how}</h2>
        <div className="house-steps">
          <article>
            <h3>{t.step1t}</h3>
            <p>{t.step1}</p>
          </article>
          <article>
            <h3>{t.step2t}</h3>
            <p>{t.step2}</p>
          </article>
          <article>
            <h3>{t.step3t}</h3>
            <p>{t.step3}</p>
          </article>
        </div>
      </section>
      <section className="house-split">
        <div>
          <h2>{t.summaryTitle}</h2>
          <p>{t.summary}</p>
          <p className="house-note">{t.luna}</p>
        </div>
        <Door heading />
      </section>
      <AlertForm />
    </StoryShell>
  );
}

function AlertForm() {
  const { lang, t } = useHouse();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);
  const [pending, setPending] = useState(false);
  function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setFailed(false);
    void saveStoryAlert({ data: { email, lang } })
      .then(() => setDone(true))
      .catch(() => setFailed(true))
      .finally(() => setPending(false));
  }
  return (
    <section className="house-block">
      <h2>{t.alertTitle}</h2>
      <p>{t.alertLead}</p>
      {done ? (
        <p>{t.alertDone}</p>
      ) : (
        <form className="soon-form alert-form" onSubmit={submit}>
          <label>
            {t.email}
            <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
          </label>
          <button type="submit" disabled={pending}>{t.alertSend}</button>
          {failed ? <p className="soon-error">{t.alertFail}</p> : null}
        </form>
      )}
    </section>
  );
}