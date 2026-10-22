import { useEffect } from "react";
import { Door } from "@/components/refugio/account-pages";
import { MoonMascot } from "@/components/refugio/moon-mascot";
import { StoryShell, useHouse } from "@/components/refugio/story-shell";
import { useShelf } from "@/components/refugio/use-shelf";
import type { Lang } from "@/lib/refugio/stories";

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
            <a className="house-primary" href={`/ler/${story?.slug ?? "o-bilhete"}`}>
              {t.read}
            </a>
            <a className="house-quiet" href="#entrar">
              {t.enter}
            </a>
          </div>
        </div>
        <MoonMascot mood="hi" size={120} />
      </section>
      <ul className="safe-row">
        <li>{t.safeAge}</li>
        <li>{t.safeKind}</li>
        <li>{t.safePrivate}</li>
        <li>{t.safeHelpShort}</li>
      </ul>
      <section className="house-split">
        <div>
          <h2>{t.summaryTitle}</h2>
          <p>{t.summary}</p>
          <p className="house-note">{t.luna}</p>
        </div>
        <Door heading />
      </section>
      <section className="house-block">
        <h2>{t.now}</h2>
        <div className="story-list">
          {shelf.map((item) => (
            <a key={item.slug} className="story-card" href={`/historia/${item.slug}`}>
              <span className="soon-kicker">{item.place}</span>
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
    </StoryShell>
  );
}