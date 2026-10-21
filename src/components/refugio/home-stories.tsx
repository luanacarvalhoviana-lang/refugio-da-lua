import { useEffect } from "react";
import { MoonMascot } from "@/components/refugio/moon-mascot";
import { StoryShell, useHouse } from "@/components/refugio/story-shell";
import { stories, type Lang } from "@/lib/refugio/stories";

export function HomeStories({ initialLang }: { initialLang?: Lang }) {
  const { lang, setLang, t } = useHouse();
  useEffect(() => {
    if (initialLang && initialLang !== lang) setLang(initialLang);
  }, [initialLang, lang, setLang]);
  const story = stories[lang][0];
  return (
    <StoryShell>
      <section className="house-hero">
        <div className="soon-rain" aria-hidden="true" />
        <p className="soon-kicker">{t.heroKicker}</p>
        <h1>{t.heroTitle}</h1>
        <p className="soon-lead">{t.heroLead}</p>
        <div className="house-cta">
          <a className="house-primary" href={`/ler/${story.slug}`}>
            {t.read}
          </a>
          <a className="house-quiet" href="/historias">
            {t.navStories}
          </a>
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
      <section className="house-block">
        <h2>{t.now}</h2>
        <a className="story-card" href={`/historia/${story.slug}`}>
          <span className="soon-kicker">{story.place}</span>
          <strong>{story.title}</strong>
          <em>
            {t.by} {story.author} · {story.rating} · {story.minutes} {t.minutes}
          </em>
          <p>{story.synopsis}</p>
        </a>
        <p className="house-note">{t.soonStory}</p>
      </section>
      <section className="house-luna">
        <MoonMascot mood="hi" size={96} />
        <p>{t.luna}</p>
      </section>
    </StoryShell>
  );
}
