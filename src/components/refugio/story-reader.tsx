import { useEffect, useMemo, useRef, useState } from "react";
import { MoonMascot } from "@/components/refugio/moon-mascot";
import { StoryShell, useHouse } from "@/components/refugio/story-shell";
import { loadBirth, loadReading, saveBirth, saveReading } from "@/lib/refugio/progress-cloud";
import { ageFromBirth, readBirth, readProgress, saveEnding, writeBirth, writeProgress } from "@/lib/refugio/reading-local";
import { getStory, sceneOf, stories, type Choice, type Story } from "@/lib/refugio/stories";

export function StoryReader({ slug }: { slug: string }) {
  const { lang, t } = useHouse();
  const story = getStory(lang, slug);
  const [sceneId, setSceneId] = useState(story?.start ?? "");
  const [affinity, setAffinity] = useState(0);
  const [clues, setClues] = useState<string[]>([]);
  const [sound, setSound] = useState(false);
  const [birth, setBirth] = useState<string | null>(null);
  const [ageReady, setAgeReady] = useState(false);
  const [kept, setKept] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let cancel = false;
    const localBirth = readBirth();
    void loadBirth()
      .then((result) => {
        if (cancel) return;
        const date = result.birthDate || localBirth;
        if (date) writeBirth(date);
        setBirth(date);
        setAgeReady(true);
      })
      .catch(() => {
        if (cancel) return;
        setBirth(localBirth);
        setAgeReady(true);
      });
    return () => {
      cancel = true;
    };
  }, []);

  useEffect(() => {
    if (!story) return;
    let cancel = false;
    const local = readProgress(story.slug, lang);
    void loadReading({ data: { slug: story.slug, lang } })
      .then((result) => {
        if (cancel) return;
        const remote = result.progress;
        if (remote?.sceneId) {
          setSceneId(remote.sceneId);
          setAffinity(remote.affinity);
          setClues(remote.clues);
          setKept(result.signedIn);
        } else if (local) {
          setSceneId(local.sceneId);
          setAffinity(local.affinity);
          setClues(local.clues);
          setKept(false);
        } else {
          setSceneId(story.start);
          setAffinity(0);
          setClues([]);
          setKept(result.signedIn);
        }
      })
      .catch(() => {
        if (cancel || !local) return;
        setSceneId(local.sceneId);
        setAffinity(local.affinity);
        setClues(local.clues);
      });
    return () => {
      cancel = true;
    };
  }, [story, lang]);

  useEffect(() => {
    return () => audio.current?.pause();
  }, []);

  const scene = useMemo(() => (story ? sceneOf(story, sceneId) : null), [story, sceneId]);

  useEffect(() => {
    if (!scene?.ending || !story) return;
    saveEnding({ slug: story.slug, lang, story: story.title, ending: scene.ending });
    persist(story, scene.id, affinity, clues, {
      key: scene.ending.key,
      title: scene.ending.title,
      flower: scene.ending.flower,
    });
  }, [scene?.ending, scene?.id, story, lang, affinity, clues]);

  function persist(
    current: Story,
    nextScene: string,
    nextAffinity: number,
    nextClues: string[],
    ending?: { key: string; title: string; flower: string },
  ) {
    writeProgress({ slug: current.slug, lang, sceneId: nextScene, affinity: nextAffinity, clues: nextClues });
    void saveReading({
      data: {
        slug: current.slug,
        lang,
        sceneId: nextScene,
        affinity: nextAffinity,
        clues: nextClues,
        storyTitle: current.title,
        endingKey: ending?.key,
        endingTitle: ending?.title,
        flower: ending?.flower,
      },
    })
      .then((result) => setKept(result.signedIn))
      .catch(() => setKept(false));
  }

  if (!ageReady || !story || !scene) {
    return (
      <StoryShell>
        <section className="house-hero">
          <p className="soon-kicker">{t.brand}</p>
        </section>
      </StoryShell>
    );
  }

  const age = birth ? ageFromBirth(birth) : null;
  if (!birth || age === null || age < 16) {
    return (
      <StoryShell>
        <AgeGate
          birth={birth}
          tooYoung={age !== null && age < 16}
          onSave={(value) => {
            writeBirth(value);
            setBirth(value);
            void saveBirth({ data: { birthDate: value } }).catch(() => undefined);
          }}
        />
      </StoryShell>
    );
  }

  function choose(choice: Choice) {
    const nextClues = choice.clue && !clues.includes(choice.clue) ? [...clues, choice.clue] : clues;
    const nextAffinity = affinity + (choice.affinity ?? 0);
    if (choice.clue) setClues(nextClues);
    setAffinity(nextAffinity);
    setSceneId(choice.to);
    persist(story!, choice.to, nextAffinity, nextClues);
  }

  function toggleSound() {
    const src = story?.sound || "/sounds/rain.mp3";
    if (!audio.current) {
      const el = new Audio(src);
      el.loop = true;
      el.volume = 0.35;
      audio.current = el;
    }
    if (sound) {
      audio.current.pause();
      setSound(false);
      return;
    }
    if (!audio.current.src.includes(src)) {
      audio.current.src = src;
      audio.current.load();
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
        <p className="house-note reader-keep">{kept ? t.savedAccount : t.savedDevice}</p>
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
                    persist(story, story.start, 0, []);
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
  return stories[lang];
}

function AgeGate({ birth, tooYoung, onSave }: { birth: string | null; tooYoung: boolean; onSave: (value: string) => void }) {
  const { t } = useHouse();
  const [value, setValue] = useState(birth && !tooYoung ? birth : "");
  return (
    <section className="house-hero">
      <p className="soon-kicker">16+</p>
      <h1>{tooYoung ? t.ageYoungTitle : t.ageTitle}</h1>
      <p className="soon-lead">{tooYoung ? t.ageYoung : t.ageLead}</p>
      {tooYoung ? null : (
        <form
          className="soon-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (value) onSave(value);
          }}
        >
          <label>
            {t.ageLabel}
            <input type="date" required max={new Date().toISOString().slice(0, 10)} value={value} onChange={(event) => setValue(event.target.value)} />
          </label>
          <button type="submit">{t.ageSave}</button>
        </form>
      )}
      <a className="soon-back" href="/historias">
        {t.back}
      </a>
    </section>
  );
}
