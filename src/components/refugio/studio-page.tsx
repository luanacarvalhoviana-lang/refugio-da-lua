import { useEffect, useState } from "react";
import { StoryShell, useHouse } from "@/components/refugio/story-shell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { checkStory, type StudioIssue, type StudioScene } from "@/lib/refugio/studio-check";
import { FREE_PUBLISHED_STORIES } from "@/lib/refugio/studio-limits";
import { tracks } from "@/lib/refugio/music";
import {
  authorChoiceStats,
  createStudioStory,
  listMyStories,
  loadStudioDraft,
  saveStudioDraft,
  studioAccess,
  submitStudioStory,
} from "@/lib/refugio/studio-cloud";

type Mine = { id: string; slug: string; titulo: string; status: string; motivo: string | null };
type StatScene = { sceneId: string; total: number; ready: boolean; choices: Array<{ choiceId: string; total: number; percent: number }> };
type Access = { ok: false; reason: "conta" | "pacto" | "perfil" } | { ok: true; nome: string; published: number; limit: number };

function StatsBlock({ title, wait, scenes }: { title: string; wait: string; scenes: StatScene[] }) {
  if (scenes.length === 0) return null;
  return (
    <div>
      <p className="soon-kicker">{title}</p>
      {scenes.map((scene) => (
        <p key={scene.sceneId} className="house-note">
          {scene.ready
            ? scene.choices.map((choice) => `${choice.choiceId} ${choice.percent}%`).join(" · ")
            : wait}
        </p>
      ))}
    </div>
  );
}

function blankScene(): StudioScene {
  return { id: crypto.randomUUID(), quem: "", texto: "", musica: "", final: false, endingTitle: "", endingBody: "", flower: "", choices: [] };
}

function issueText(issue: StudioIssue, t: ReturnType<typeof useHouse>["t"]) {
  if (issue.code === "empty") return t.studioEmpty;
  if (issue.code === "nowhere") return t.studioNowhere;
  if (issue.code === "dead") return t.studioDead.replace("{n}", String(issue.scene));
  if (issue.code === "many") return t.studioMany.replace("{n}", String(issue.scene));
  if (issue.code === "lost") return t.studioLost.replace("{n}", String(issue.scene));
  if (issue.code === "ending") return t.studioEnding.replace("{n}", String(issue.scene));
  return t.studioOrphan.replace("{n}", String(issue.scene));
}

export function StudioPage() {
  const { lang, t } = useHouse();
  const { user } = useCurrentUserState();
  const [access, setAccess] = useState<Access | null>(null);
  const [mine, setMine] = useState<Mine[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [meta, setMeta] = useState<Mine | null>(null);
  const [scenes, setScenes] = useState<StudioScene[]>([]);
  const [note, setNote] = useState("");
  const [fresh, setFresh] = useState({ titulo: "", sinopse: "", classificacao: "16" as "livre" | "14" | "16", generos: "", lugar: "" });
  const [original, setOriginal] = useState(false);
  const [stats, setStats] = useState<StatScene[]>([]);
  const [house, setHouse] = useState<Array<{ slug: string; scenes: StatScene[] }>>([]);

  function refresh() {
    void listMyStories().then(setMine).catch(() => setMine([]));
    void studioAccess().then((result) => setAccess(result)).catch(() => setAccess({ ok: false, reason: "conta" }));
  }

  useEffect(() => {
    if (!access?.ok) return;
    void Promise.all(
      ["o-bilhete", "a-chave", "a-mare"].map((slug) =>
        authorChoiceStats({ data: { slug, lang } }).then((result) => ({ slug, ok: result.ok, scenes: result.scenes })),
      ),
    ).then((rows) => {
      if (!rows[0]?.ok) {
        setHouse([]);
        return;
      }
      setHouse(rows.map((row) => ({ slug: row.slug, scenes: row.scenes })));
    }).catch(() => setHouse([]));
  }, [access, lang]);

  useEffect(() => {
    refresh();
  }, [user?.id]);

  function openStory(id: string) {
    setNote("");
    setOriginal(false);
    void loadStudioDraft({ data: { id } }).then((result) => {
      if (!result.ok) return;
      setOpenId(id);
      setMeta({ id, slug: result.story.slug, titulo: result.story.titulo, status: result.story.status, motivo: result.story.motivo });
      setScenes(result.scenes.length ? result.scenes : [blankScene()]);
      void authorChoiceStats({ data: { slug: result.story.slug, lang } })
        .then((statsResult) => setStats(statsResult.ok ? statsResult.scenes : []))
        .catch(() => setStats([]));
    });
  }

  const issues = checkStory(scenes);
  const statusLabel: Record<string, string> = {
    rascunho: t.studioDraft,
    em_revisao: t.studioReview,
    publicada: t.studioLive,
    recusada: t.studioNo,
  };

  if (!access) {
    return (
      <StoryShell>
        <section className="house-hero"><p className="soon-kicker">{t.writeStory}</p></section>
      </StoryShell>
    );
  }
  if (!access.ok) {
    return (
      <StoryShell>
        <section className="house-hero">
          <h1>{t.writeStory}</h1>
          <p className="soon-lead">{t.studioNeed}</p>
          <p><a className="house-primary" href={access.reason === "perfil" ? "/conta" : "/#entrar"}>{access.reason === "perfil" ? t.authorEdit : t.accountEnter}</a></p>
        </section>
      </StoryShell>
    );
  }

  return (
    <StoryShell>
      <section className="house-hero">
        <p className="soon-kicker">{access.nome}</p>
        <h1>{t.studioMine}</h1>
        <p className="house-note">{t.studioLimit.replace("{n}", String(FREE_PUBLISHED_STORIES))} · {access.published}/{access.limit}</p>
      </section>
      <section className="house-block">
        <ul className="story-list">
          {mine.map((story) => (
            <li key={story.id} className="story-card">
              <button type="button" onClick={() => openStory(story.id)}><strong>{story.titulo}</strong></button>
              <em>{statusLabel[story.status] || story.status}</em>
              {story.motivo ? <p>{story.motivo}</p> : null}
            </li>
          ))}
        </ul>
        {house.length > 0 ? (
          <div>
            {house.map((item) => (
              <StatsBlock key={item.slug} title={`${t.studioStats} · ${item.slug}`} wait={t.studioStatsWait} scenes={item.scenes} />
            ))}
          </div>
        ) : null}
      </section>
      {openId && meta ? (
        <section className="house-block studio">
          <h2>{meta.titulo}</h2>
          <p className="house-note">{statusLabel[meta.status] || meta.status}</p>
          <StatsBlock title={t.studioStats} wait={t.studioStatsWait} scenes={stats} />
          {scenes.map((scene, index) => (
            <article key={scene.id} className="studio-scene">
              <p className="soon-kicker">{t.studioScene} {index + 1}</p>
              <label>
                {t.studioWho}
                <input value={scene.quem} onChange={(event) => patchScene(index, { quem: event.target.value })} />
              </label>
              <label className="soon-check">
                <input type="checkbox" checked={scene.final} onChange={(event) => patchScene(index, { final: event.target.checked, choices: [] })} />
                <span>{t.studioFinal}</span>
              </label>
              {scene.final ? (
                <>
                  <label>{t.studioEndTitle}<input value={scene.endingTitle} onChange={(event) => patchScene(index, { endingTitle: event.target.value })} /></label>
                  <label>{t.studioEndBody}<textarea rows={4} value={scene.endingBody} onChange={(event) => patchScene(index, { endingBody: event.target.value })} /></label>
                  <label>{t.studioFlower}<input value={scene.flower} onChange={(event) => patchScene(index, { flower: event.target.value })} /></label>
                </>
              ) : (
                <>
                  <label>{t.studioText}<textarea rows={5} value={scene.texto} onChange={(event) => patchScene(index, { texto: event.target.value })} /></label>
                  <label>
                    {t.studioMusic}
                    <select value={scene.musica} onChange={(event) => patchScene(index, { musica: event.target.value })}>
                      <option value="">{t.studioMusicNone}</option>
                      {tracks.map((track) => (
                        <option key={track.id} value={track.id}>
                          {track.title[lang]}{track.premium ? " · premium" : ""}
                        </option>
                      ))}
                    </select>
                  </label>
                  {scene.choices.map((choice, choiceIndex) => (
                    <div key={choice.id} className="studio-choice">
                      <label>
                        {t.studioChoice}
                        <input value={choice.texto} onChange={(event) => patchChoice(index, choiceIndex, { texto: event.target.value })} />
                      </label>
                      <label>
                        {t.studioGoes}
                        <select value={choice.vai} onChange={(event) => patchChoice(index, choiceIndex, { vai: event.target.value })}>
                          <option value="">{t.studioPick}</option>
                          {scenes.map((target, targetIndex) => (
                            <option key={target.id} value={target.id}>{t.studioScene} {targetIndex + 1}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        {t.studioAffinity}
                        <select value={choice.afinidade} onChange={(event) => patchChoice(index, choiceIndex, { afinidade: Number(event.target.value) })}>
                          <option value={-1}>-1</option>
                          <option value={0}>0</option>
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                        </select>
                      </label>
                      <label>
                        {t.studioClue}
                        <input value={choice.pista} onChange={(event) => patchChoice(index, choiceIndex, { pista: event.target.value })} />
                      </label>
                    </div>
                  ))}
                  {scene.choices.length < 3 ? (
                    <button type="button" onClick={() => patchScene(index, { choices: [...scene.choices, { id: crypto.randomUUID(), texto: "", vai: "", afinidade: 0, pista: "" }] })}>
                      {t.studioAddChoice}
                    </button>
                  ) : null}
                </>
              )}
            </article>
          ))}
          {scenes.length < 24 ? <button type="button" onClick={() => setScenes((current) => [...current, blankScene()])}>{t.studioAddScene}</button> : null}
          {issues.length ? (
            <ul>{issues.map((issue, index) => <li key={index}>{issueText(issue, t)}</li>)}</ul>
          ) : (
            <p className="house-note">{t.studioClear}</p>
          )}
          <p className="house-cta">
            <button type="button" onClick={() => void save(false)}>{t.studioSave}</button>
            <a className="house-quiet" href={`/ler/${meta.slug}`}>{t.studioRead}</a>
          </p>
          {meta.status !== "publicada" && meta.status !== "em_revisao" ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void save(true);
              }}
            >
              <label className="soon-check">
                <input type="checkbox" checked={original} onChange={(event) => setOriginal(event.target.checked)} />
                <span>{t.studioOriginal}</span>
              </label>
              <button type="submit" disabled={!original || issues.length > 0}>{t.studioSend}</button>
            </form>
          ) : null}
          {note ? <p>{note}</p> : null}
        </section>
      ) : (
        <section className="house-block">
          <h2>{t.studioNew}</h2>
          <form
            className="soon-form"
            onSubmit={(event) => {
              event.preventDefault();
              setNote("");
              void createStudioStory({ data: { ...fresh, idioma: lang } })
                .then((result) => {
                  if (!result.ok) {
                    setNote(t.studioNeed);
                    return;
                  }
                  setFresh({ titulo: "", sinopse: "", classificacao: "16", generos: "", lugar: "" });
                  refresh();
                  openStory(result.id);
                })
                .catch(() => setNote(t.studioNeed));
            }}
          >
            <label>{t.studioTitle}<input required minLength={2} maxLength={80} value={fresh.titulo} onChange={(event) => setFresh({ ...fresh, titulo: event.target.value })} /></label>
            <label>{t.studioSynopsis}<textarea required minLength={8} maxLength={400} rows={3} value={fresh.sinopse} onChange={(event) => setFresh({ ...fresh, sinopse: event.target.value })} /></label>
            <label>
              {t.studioRating}
              <select value={fresh.classificacao} onChange={(event) => setFresh({ ...fresh, classificacao: event.target.value as "livre" | "14" | "16" })}>
                <option value="livre">{t.studioFree}</option>
                <option value="14">14</option>
                <option value="16">16</option>
              </select>
            </label>
            <label>{t.studioGenres}<input value={fresh.generos} onChange={(event) => setFresh({ ...fresh, generos: event.target.value })} /></label>
            <label>{t.studioPlace}<input required minLength={2} value={fresh.lugar} onChange={(event) => setFresh({ ...fresh, lugar: event.target.value })} /></label>
            <button type="submit">{t.studioNew}</button>
          </form>
        </section>
      )}
    </StoryShell>
  );

  function patchScene(index: number, patch: Partial<StudioScene>) {
    setScenes((current) => current.map((scene, item) => (item === index ? { ...scene, ...patch } : scene)));
  }

  function patchChoice(index: number, choiceIndex: number, patch: Partial<StudioScene["choices"][number]>) {
    setScenes((current) => current.map((scene, item) => {
      if (item !== index) return scene;
      return { ...scene, choices: scene.choices.map((choice, position) => (position === choiceIndex ? { ...choice, ...patch } : choice)) };
    }));
  }

  async function save(send: boolean) {
    if (!openId) return;
    setNote("");
    const saved = await saveStudioDraft({ data: { id: openId, scenes } }).catch(() => null);
    if (!saved?.ok) {
      setNote(t.studioNeed);
      return;
    }
    if (!send) {
      setNote(t.studioSaved);
      return;
    }
    const sent = await submitStudioStory({ data: { id: openId, original: true } }).catch(() => null);
    if (!sent?.ok) {
      setNote(t.studioCheck);
      return;
    }
    setMeta((current) => (current ? { ...current, status: "em_revisao" } : current));
    setNote(t.studioSent);
    refresh();
  }
}
