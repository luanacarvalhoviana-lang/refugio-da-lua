import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { MoonMascot } from "@/components/refugio/moon-mascot";
import { StoryShell, useHouse } from "@/components/refugio/story-shell";
import { useShelf } from "@/components/refugio/use-shelf";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { loadBirth, loadReading, saveBirth, saveReading } from "@/lib/refugio/progress-cloud";
import { ageFromBirth, readBirth, readProgress, saveEnding, writeBirth, writeProgress } from "@/lib/refugio/reading-local";
import { addNote, listNotes } from "@/lib/refugio/room-cloud";
import { tallyChoice } from "@/lib/refugio/community-cloud";
import { AccessMark } from "@/components/refugio/access-mark";
import { saveKeepsake } from "@/lib/refugio/night-cloud";
import { loadStudioStory } from "@/lib/refugio/studio-cloud";
import { CommunityDesk } from "@/components/refugio/community";
import { artOf, authorSlug, sceneOf, type Choice, type Lang, type Story } from "@/lib/refugio/stories";
import { crossfade, sourceForScene } from "@/lib/refugio/music";

export function StoryReader({ slug }: { slug: string }) {
  const { lang, t } = useHouse();
  const shelf = useShelf(lang);
  const fromShelf = shelf.find((item) => item.slug === slug) ?? null;
  const [preview, setPreview] = useState<Story | null>(null);
  const story = fromShelf ?? preview;
  useEffect(() => {
    if (fromShelf) return;
    let cancel = false;
    void loadStudioStory({ data: { slug, lang } })
      .then((result) => {
        if (!cancel) setPreview(result.story);
      })
      .catch(() => {
        if (!cancel) setPreview(null);
      });
    return () => {
      cancel = true;
    };
  }, [fromShelf, slug, lang]);
  const [sceneId, setSceneId] = useState(story?.start ?? "");
  const [affinity, setAffinity] = useState(0);
  const [clues, setClues] = useState<string[]>([]);
  const [sound, setSound] = useState(false);
  const [birth, setBirth] = useState<string | null>(null);
  const [ageReady, setAgeReady] = useState(false);
  const [kept, setKept] = useState(false);
  const [trail, setTrail] = useState<Array<{ sceneId: string; affinity: number; clues: string[] }>>([]);
  const [arrived, setArrived] = useState<{ from: string; choiceId: string } | null>(null);
  const [samePercent, setSamePercent] = useState<number | null>(null);
  const [volume, setVolume] = useState(0.35);
  const slots = useRef<Array<HTMLAudioElement | null>>([null, null]);
  const activeSlot = useRef(0);
  const fadeFrame = useRef(0);
  const volumeRef = useRef(0.35);
  const soundRef = useRef(false);
  const premiumOn = !story?.locked;
  const [boxNote, setBoxNote] = useState("");

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
    return () => {
      cancelAnimationFrame(fadeFrame.current);
      for (const el of slots.current) el?.pause();
    };
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

  if (!ageReady || !story || (!scene && !story.locked)) {
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

  if (story.locked || !scene) {
    return (
      <StoryShell>
        <section className="house-hero">
          <AccessMark story={story} cheia={t.accessCheia} early={t.accessEarly} />
          <h1>{story.title}</h1>
          <p className="soon-lead">{story.synopsis}</p>
          <p>{t.lockLead}</p>
          <p><a className="house-primary" href="/planos">{t.navPlans}</a></p>
        </section>
      </StoryShell>
    );
  }

  function choose(choice: Choice) {
    const nextClues = choice.clue && !clues.includes(choice.clue) ? [...clues, choice.clue] : clues;
    const nextAffinity = affinity + (choice.affinity ?? 0);
    if (choice.clue) setClues(nextClues);
    setAffinity(nextAffinity);
    setTrail((current) => [...current, { sceneId, affinity, clues }]);
    setArrived({ from: sceneId, choiceId: choice.id });
    setSamePercent(null);
    setSceneId(choice.to);
    persist(story!, choice.to, nextAffinity, nextClues);
    if (soundRef.current) {
      playSource(sourceForScene(story!, [...trail.map((step) => step.sceneId), sceneId, choice.to], premiumOn));
    }
    const key = readerKey();
    const chosenScene = sceneId;
    void tallyChoice({
      data: { slug: story!.slug, lang, sceneId: chosenScene, choiceId: choice.id, readerKey: key },
    })
      .then((result) => setSamePercent(result.percent))
      .catch(() => setSamePercent(null));
  }

  function stepBack() {
    const previous = trail[trail.length - 1];
    if (!previous || !story) return;
    setTrail((current) => current.slice(0, -1));
    setArrived(null);
    setSamePercent(null);
    setSceneId(previous.sceneId);
    setAffinity(previous.affinity);
    setClues(previous.clues);
    persist(story, previous.sceneId, previous.affinity, previous.clues);
    if (soundRef.current) {
      const ids = trail.slice(0, -1).map((step) => step.sceneId);
      ids.push(previous.sceneId);
      playSource(sourceForScene(story, ids, premiumOn));
    }
  }

  function playSource(src: string) {
    crossfade(slots.current, activeSlot, src, volumeRef.current, fadeFrame);
  }

  function toggleSound() {
    if (soundRef.current) {
      cancelAnimationFrame(fadeFrame.current);
      for (const el of slots.current) el?.pause();
      soundRef.current = false;
      localStorage.setItem("refugio-sound", "off");
      setSound(false);
      return;
    }
    soundRef.current = true;
    localStorage.setItem("refugio-sound", "on");
    setSound(true);
    if (!story) return;
    const ids = [...trail.map((step) => step.sceneId), scene.id];
    playSource(sourceForScene(story, ids, premiumOn));
  }

  function changeVolume(value: number) {
    const next = Math.min(1, Math.max(0, value));
    volumeRef.current = next;
    setVolume(next);
    const current = slots.current[activeSlot.current];
    if (current && !current.paused) current.volume = next;
  }

  const moons = Math.max(0, Math.min(5, affinity + 2));

  return (
    <StoryShell>
      <article
        className={story.art || artOf(story) ? "reader has-art" : "reader"}
        style={{ backgroundImage: `linear-gradient(180deg, rgba(12,52,66,.45), rgba(12,52,66,.62)), url(${artOf(story)})` }}
      >
        <header className="reader-top">
          <a href={`/historia/${story.slug}`}>{story.title}</a>
          <div className="reader-sound">
            <button type="button" onClick={toggleSound} aria-pressed={sound}>
              {sound ? t.soundOn : t.soundOff}
            </button>
            <label className="reader-volume">
              {t.volume}
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                aria-label={t.volume}
                onChange={(event) => changeVolume(Number(event.target.value))}
              />
            </label>
          </div>
        </header>
        <p className="house-note reader-keep">{kept ? t.savedAccount : t.savedDevice}</p>
        <div className="reader-layout">
          <aside className="reader-side">
            <p className="soon-kicker">{t.affinity}</p>
            <p className="reader-moons" aria-label={`${t.affinity} ${moons}`}>
              {"☾".repeat(moons)}
              <span>{"☾".repeat(5 - moons)}</span>
            </p>
            <p className="soon-kicker">{t.clues}</p>
            {clues.length === 0 ? <p>{t.noClue}</p> : <ul>{clues.map((clue) => <li key={clue}>{clue}</li>)}</ul>}
          </aside>
          <div className="reader-sheet">
            {scene.speaker ? <p className="reader-who">{scene.speaker}</p> : null}
            <p className="reader-body">{scene.ending ? scene.ending.body : scene.body}</p>
            <p className="house-note">
              <button
                type="button"
                onClick={() => {
                  const trecho = (scene.ending?.body || scene.body || "").slice(0, 280);
                  void saveKeepsake({
                    data: { slug: story.slug, lang, sceneId: scene.id, titulo: story.title, trecho },
                  })
                    .then((result) => setBoxNote(result.ok ? t.keepSaved : result.reason === "conta" ? t.keepNeed : t.keepPact))
                    .catch(() => setBoxNote(t.keepNeed));
                }}
              >
                {t.keepScene}
              </button>
              {boxNote ? <span> {boxNote}</span> : null}
              {" · "}
              <a href="/lembrancas">{t.keepBox}</a>
            </p>
            {scene.ending ? (
              <div className="reader-end">
                <MoonMascot mood="rest" size={84} />
                <p className="soon-kicker">{t.found}</p>
                <h2>{scene.ending.title}</h2>
                <p>{scene.ending.flower}</p>
                {trail.length > 0 ? (
                  <button type="button" onClick={stepBack}>
                    {t.backPath}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    setTrail([]);
                    setArrived(null);
                    setSamePercent(null);
                    setSceneId(story.start);
                    setAffinity(0);
                    setClues([]);
                    persist(story, story.start, 0, []);
                    if (soundRef.current) playSource(sourceForScene(story, [story.start], premiumOn));
                  }}
                >
                  {t.replay}
                </button>
                <a className="house-note" href={`/contato?historia=${encodeURIComponent(story.title)}`}>
                  {t.report}
                </a>
                <CommunityDesk slug={story.slug} lang={lang} sceneId={scene.id} />
              </div>
            ) : (
              <div className="reader-choices">
                {scene.choices?.map((choice) => (
                  <button key={choice.id} type="button" onClick={() => choose(choice)}>
                    <span>{choice.label}</span>
                  </button>
                ))}
              </div>
            )}
            {samePercent !== null ? <p className="same-choice">{t.sameChoice.replace("{n}", String(samePercent))}</p> : null}
            {arrived && !scene.ending ? <CommunityDesk slug={story.slug} lang={lang} sceneId={arrived.from} /> : null}
          </div>
        </div>
      </article>
    </StoryShell>
  );
}

export function StoryPage({ slug }: { slug: string }) {
  const { lang, t } = useHouse();
  const shelf = useShelf(lang);
  const story = shelf.find((item) => item.slug === slug) ?? null;
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
        <AccessMark story={story} cheia={t.accessCheia} early={t.accessEarly} />
        <h1>{story.title}</h1>
        <p className="soon-lead">{story.synopsis}</p>
        <p className="house-note">
          {t.by} <a href={`/autora/${authorSlug(story.author)}`}>{story.author}</a> · {story.genres.join(" · ")} · {story.minutes} {t.minutes}
        </p>
        <div className="house-cta">
          <a className="house-primary" href={`/ler/${story.slug}`}>
            {t.play}
          </a>
          <a className="house-quiet" href="/historias">
            {t.back}
          </a>
        </div>
        <p className="house-note">
          <a href={`/contato?historia=${encodeURIComponent(story.title)}`}>{t.report}</a>
        </p>
      </section>
    </StoryShell>
  );
}

export function StoryList() {
  const { lang, t } = useHouse();
  const shelf = useShelf(lang);
  return (
    <StoryShell>
      <section className="house-block">
        <h1>{t.navStories}</h1>
        <div className="story-list">
          {shelf.map((story) => (
            <a key={story.slug} className="story-card" href={`/historia/${story.slug}`}>
              <span className="soon-kicker">{story.place} <AccessMark story={story} cheia={t.accessCheia} early={t.accessEarly} /></span>
              <strong>{story.title}</strong>
              <em>
                {story.rating} · {story.minutes} {t.minutes}
              </em>
              <p>{story.synopsis}</p>
            </a>
          ))}
        </div>
        <p className="house-note">
          <a href="/escrever">{t.writeStory}</a>
        </p>
      </section>
    </StoryShell>
  );
}

function AgeGate({ birth, tooYoung, onSave }: { birth: string | null; tooYoung: boolean; onSave: (value: string) => void }) {
  const { t } = useHouse();
  const parts = birth?.split("-") ?? [];
  const [day, setDay] = useState(parts[2] ?? "");
  const [month, setMonth] = useState(parts[1] ?? "");
  const [year, setYear] = useState(parts[0] ?? "");
  const [invalid, setInvalid] = useState(false);
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
            const iso = birthIso(day, month, year);
            if (!iso) {
              setInvalid(true);
              return;
            }
            setInvalid(false);
            onSave(iso);
          }}
        >
          <div className="age-row">
            <label>
              {t.ageDay}
              <input inputMode="numeric" autoComplete="bday-day" required maxLength={2} value={day} onChange={(event) => setDay(event.target.value.replace(/\D/g, "").slice(0, 2))} />
            </label>
            <label>
              {t.ageMonth}
              <input inputMode="numeric" autoComplete="bday-month" required maxLength={2} value={month} onChange={(event) => setMonth(event.target.value.replace(/\D/g, "").slice(0, 2))} />
            </label>
            <label>
              {t.ageYear}
              <input inputMode="numeric" autoComplete="bday-year" required maxLength={4} value={year} onChange={(event) => setYear(event.target.value.replace(/\D/g, "").slice(0, 4))} />
            </label>
          </div>
          {invalid ? <p className="soon-error">{t.ageInvalid}</p> : null}
          <button type="submit">{t.ageSave}</button>
        </form>
      )}
      <a className="soon-back" href="/historias">
        {t.back}
      </a>
    </section>
  );
}

function birthIso(day: string, month: string, year: string) {
  const d = Number(day);
  const m = Number(month);
  const y = Number(year);
  if (!Number.isInteger(y) || y < 1900 || y > new Date().getFullYear()) return null;
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null;
  if (date.getTime() > Date.now()) return null;
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function readerKey() {
  const stored = localStorage.getItem("refugio-reader-key");
  if (stored && stored.length >= 8) return stored;
  const next = crypto.randomUUID();
  localStorage.setItem("refugio-reader-key", next);
  return next;
}

function PathNotes({
  slug,
  lang,
  sceneId,
  choiceId,
}: {
  slug: string;
  lang: Lang;
  sceneId: string;
  choiceId: string;
}) {
  const { t } = useHouse();
  const { user } = useCurrentUserState();
  const [notes, setNotes] = useState<Array<{ id: string; penName: string; body: string }>>([]);
  const [pen, setPen] = useState("");
  const [body, setBody] = useState("");
  const [full, setFull] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("refugio-pen");
    if (saved) setPen(saved);
  }, []);

  useEffect(() => {
    let cancel = false;
    void listNotes({ data: { slug, lang, sceneId, choiceId } })
      .then((result) => {
        if (!cancel) setNotes(result.notes);
      })
      .catch(() => {
        if (!cancel) setNotes([]);
      });
    return () => {
      cancel = true;
    };
  }, [slug, lang, sceneId, choiceId]);

  async function send(event: FormEvent) {
    event.preventDefault();
    const name = pen.trim();
    const text = body.trim();
    if (name.length < 2 || text.length < 2) return;
    localStorage.setItem("refugio-pen", name);
    const result = await addNote({ data: { slug, lang, sceneId, choiceId, penName: name, body: text } }).catch(() => null);
    if (!result?.signedIn) return;
    if (result.full) {
      setFull(true);
      return;
    }
    setBody("");
    setNotes((current) => [{ id: result.id, penName: name, body: text }, ...current]);
  }

  return (
    <section className="path-notes">
      <p className="soon-kicker">{t.notesTitle}</p>
      {notes.length === 0 ? <p className="house-note">{t.noteEmpty}</p> : null}
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <strong>{note.penName}</strong>
            <span>{note.body}</span>
          </li>
        ))}
      </ul>
      {user ? (
        <form onSubmit={(event) => void send(event)}>
          <label>
            {t.notePen}
            <input value={pen} maxLength={40} onChange={(event) => setPen(event.target.value)} required />
          </label>
          <label>
            {t.notePlaceholder}
            <textarea value={body} maxLength={280} onChange={(event) => setBody(event.target.value)} required />
          </label>
          {full ? <p className="house-note">{t.noteFull}</p> : null}
          <button type="submit">{t.noteSend}</button>
        </form>
      ) : (
        <p className="house-note">
          <a href="/conta">{t.noteSignIn}</a>
        </p>
      )}
    </section>
  );
}
