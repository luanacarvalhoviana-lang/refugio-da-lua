import { useEffect, useMemo, useRef, useState } from "react";
import { MoonMascot } from "@/components/refugio/moon-mascot";
import { StoryShell, useHouse } from "@/components/refugio/story-shell";
import { saveEnding } from "@/lib/refugio/reading-local";
import { getStory, sceneOf, type Choice } from "@/lib/refugio/stories";

export function StoryReader({ slug }: { slug: string }) {
  const { lang, t } = useHouse();
  const story = getStory(lang, slug);
  const [sceneId, setSceneId] = useState(story?.start ?? "");
  const [affinity, setAffinity] = useState(0);
  const [clues, setClues] = useState<string[]>([]);
  const [sound, setSound] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (story) setSceneId(story.start);
    setAffinity(0);
    setClues([]);
  }, [story, lang]);

  useEffect(() => {
    return () => audio.current?.pause();
  }, []);

  const scene = useMemo(() => (story ? sceneOf(story, sceneId) : null), [story, sceneId]);

  useEffect(() => {
    if (scene?.ending && story) saveEnding({ slug: story.slug, lang, story: story.title, ending: scene.ending });
  }, [scene?.ending, story, lang]);

  if (!story || !scene) {
    return (
      <StoryShell>
        <section className="house-hero">
          <h1>{t.back}</h1>
          <a href="/historias">{t.navStories}</a>
        </section>
      </StoryShell>
    );
  }

  function choose(choice: Choice) {
    if (choice.clue) setClues((list) => (list.includes(choice.clue!) ? list : [...list, choice.clue!]));
    setAffinity((value) => value + (choice.affinity ?? 0));
    setSceneId(choice.to);
  }

  function toggleSound() {
    if (!audio.current) {
      const el = new Audio("/sounds/rain.mp3");
      el.loop = true;
      el.volume = 0.35;
      audio.current = el;
    }
    if (sound) {
      audio.current.pause();
      setSound(false);
      return;
    }
    void audio.current.play().then(() => setSound(true)).catch(() => setSound(false));
  }

  const moons = Math.max(0, Math.min(5, affinity + 2));

  return (
    <StoryShell>
      <article className="reader">
        <header className="reader-top">
          <a href={`/historia/${story.slug}`}>{story.title}</a>
          <button type="button" onClick={toggleSound}>
            {sound ? t.soundOn : t.soundOff}
          </button>
        </header>
        <div className="reader-layout">
          <div className="reader-sheet">
            {scene.speaker ? <p className="reader-who">{scene.speaker}</p> : null}
            <p className="reader-body">{scene.ending ? scene.ending.body : scene.body}</p>
            {scene.ending ? (
              <div className="reader-end">
                <MoonMascot mood="rest" size={84} />
                <p className="soon-kicker">{t.found}</p>
                <h2>{scene.ending.title}</h2>
                <p>
                  {scene.ending.flower}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSceneId(story.start);
                    setAffinity(0);
                    setClues([]);
                  }}
                >
                  {t.replay}
                </button>
              </div>
            ) : (
              <div className="reader-choices">
                {scene.choices?.map((choice) => (
                  <button key={choice.id} type="button" onClick={() => choose(choice)}>
                    {choice.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <aside className="reader-side">
            <p className="soon-kicker">{t.affinity}</p>
            <p className="reader-moons" aria-label={`${t.affinity} ${moons}`}>
              {"☾".repeat(moons)}
              <span>{"☾".repeat(5 - moons)}</span>
            </p>
            <p className="soon-kicker">{t.clues}</p>
            {clues.length === 0 ? <p>{t.noClue}</p> : <ul>{clues.map((clue) => <li key={clue}>{clue}</li>)}</ul>}
          </aside>
        </div>
      </article>
    </StoryShell>
  );
}

export function StoryPage({ slug }: { slug: string }) {
  const { lang, t } = useHouse();
  const story = getStory(lang, slug);
  if (!story) {
    return (
      <StoryShell>
        <section className="house-hero">
          <a href="/historias">{t.back}</a>
        </section>
      </StoryShell>
    );
  }
  return (
    <StoryShell>
      <section className="house-hero">
        <p className="soon-kicker">
          {story.place} · {t.rating} {story.rating}
        </p>
        <h1>{story.title}</h1>
        <p className="soon-lead">{story.synopsis}</p>
        <p className="house-note">
          {t.by} {story.author} · {story.genres.join(" · ")} · {story.minutes} {t.minutes}
        </p>
        <div className="house-cta">
          <a className="house-primary" href={`/ler/${story.slug}`}>
            {t.play}
          </a>
          <a className="house-quiet" href="/historias">
            {t.back}
          </a>
        </div>
      </section>
    </StoryShell>
  );
}

export function StoryList() {
  const { lang, t } = useHouse();
  return (
    <StoryShell>
      <section className="house-block">
        <h1>{t.navStories}</h1>
        <div className="story-list">
          {storiesOf(lang).map((story) => (
            <a key={story.slug} className="story-card" href={`/historia/${story.slug}`}>
              <span className="soon-kicker">{story.place}</span>
              <strong>{story.title}</strong>
              <em>
                {story.rating} · {story.minutes} {t.minutes}
              </em>
              <p>{story.synopsis}</p>
            </a>
          ))}
        </div>
      </section>
    </StoryShell>
  );
}

function storiesOf(lang: "pt" | "es") {
  return getStory(lang, "o-bilhete") ? [getStory(lang, "o-bilhete")!] : [];
}
