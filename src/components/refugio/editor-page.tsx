import { useState, type FormEvent } from "react";
import { StoryShell, useHouse } from "@/components/refugio/story-shell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { saveCommunity } from "@/lib/refugio/room-cloud";

type PathDraft = {
  label: string;
  clue: string;
  affinity: -1 | 0 | 1;
  endingTitle: string;
  endingBody: string;
  flower: string;
};

const emptyPath = (): PathDraft => ({
  label: "",
  clue: "",
  affinity: 1,
  endingTitle: "",
  endingBody: "",
  flower: "",
});

export function EditorPage() {
  const { lang, t } = useHouse();
  const { user, isPending } = useCurrentUserState();
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [place, setPlace] = useState<"biblioteca" | "cafe" | "praia">("biblioteca");
  const [opening, setOpening] = useState("");
  const [paths, setPaths] = useState<PathDraft[]>([emptyPath(), emptyPath()]);
  const [original, setOriginal] = useState(false);
  const [slug, setSlug] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function updatePath(index: number, patch: Partial<PathDraft>) {
    setPaths((current) => current.map((path, item) => (item === index ? { ...path, ...patch } : path)));
  }

  async function publish(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!original) return;
    setBusy(true);
    const result = await saveCommunity({
      data: {
        lang,
        title,
        synopsis,
        place,
        authorName,
        original: true,
        opening,
        paths: paths.map((path) => ({
          label: path.label,
          clue: path.clue || undefined,
          affinity: path.affinity,
          endingTitle: path.endingTitle,
          endingBody: path.endingBody,
          flower: path.flower,
        })),
      },
    }).catch(() => null);
    setBusy(false);
    if (!result || !result.signedIn) {
      setError(t.writeNeedAccount);
      return;
    }
    if (result.error) {
      setError(lang === "es" ? "No se pudo publicar. Prueba otro título." : "Não deu para publicar. Tente outro título.");
      return;
    }
    if (result.slug) setSlug(result.slug);
  }

  return (
    <StoryShell>
      <section className="house-hero">
        <p className="soon-kicker">{t.writeStory}</p>
        <h1>{t.writeTitle}</h1>
        <p className="soon-lead">{t.writeLead}</p>
      </section>
      {isPending ? null : !user ? (
        <section className="house-block">
          <a className="house-primary" href="/conta">
            {t.writeNeedAccount}
          </a>
        </section>
      ) : slug ? (
        <section className="house-block">
          <p>{t.writeSaved}</p>
          <a className="house-primary" href={`/ler/${slug}`}>
            {t.play}
          </a>
        </section>
      ) : (
        <form className="soon-form editor-form" onSubmit={(event) => void publish(event)}>
          <label>
            {t.writeName}
            <input value={authorName} maxLength={40} required onChange={(event) => setAuthorName(event.target.value)} />
          </label>
          <label>
            {t.navStories}
            <input value={title} maxLength={80} required onChange={(event) => setTitle(event.target.value)} />
          </label>
          <label>
            {t.writePlace}
            <select value={place} onChange={(event) => setPlace(event.target.value as "biblioteca" | "cafe" | "praia")}>
              <option value="biblioteca">{t.placeLibrary}</option>
              <option value="cafe">{t.placeCafe}</option>
              <option value="praia">{t.placeBeach}</option>
            </select>
          </label>
          <label>
            {t.heroLead}
            <textarea value={synopsis} maxLength={280} required onChange={(event) => setSynopsis(event.target.value)} />
          </label>
          <label>
            {t.writeOpening}
            <textarea value={opening} maxLength={1500} required onChange={(event) => setOpening(event.target.value)} />
          </label>
          {paths.map((path, index) => (
            <fieldset key={index}>
              <legend>
                {t.writePath} {index + 1}
              </legend>
              <label>
                {t.writeLabel}
                <input value={path.label} maxLength={120} required onChange={(event) => updatePath(index, { label: event.target.value })} />
              </label>
              <label>
                {t.writeClue}
                <input value={path.clue} maxLength={180} onChange={(event) => updatePath(index, { clue: event.target.value })} />
              </label>
              <label>
                {t.writeAffinity}
                <select
                  value={String(path.affinity)}
                  onChange={(event) => updatePath(index, { affinity: Number(event.target.value) as -1 | 0 | 1 })}
                >
                  <option value="-1">{t.writeNear}</option>
                  <option value="0">{t.writeMid}</option>
                  <option value="1">{t.writeClose}</option>
                </select>
              </label>
              <label>
                {t.writeEndTitle}
                <input value={path.endingTitle} maxLength={80} required onChange={(event) => updatePath(index, { endingTitle: event.target.value })} />
              </label>
              <label>
                {t.writeEndBody}
                <textarea value={path.endingBody} maxLength={1200} required onChange={(event) => updatePath(index, { endingBody: event.target.value })} />
              </label>
              <label>
                {t.writeFlower}
                <input value={path.flower} maxLength={40} required onChange={(event) => updatePath(index, { flower: event.target.value })} />
              </label>
            </fieldset>
          ))}
          {paths.length < 3 ? (
            <button type="button" className="house-quiet" onClick={() => setPaths((current) => [...current, emptyPath()])}>
              {t.writePath}
            </button>
          ) : null}
          <label className="soon-check">
            <input type="checkbox" checked={original} onChange={(event) => setOriginal(event.target.checked)} required />
            <span>{t.writeOriginal}</span>
          </label>
          {error ? <p className="soon-error">{error}</p> : null}
          <button type="submit" disabled={busy}>
            {t.writeSave}
          </button>
        </form>
      )}
    </StoryShell>
  );
}
