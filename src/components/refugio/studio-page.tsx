import { useEffect, useState } from "react";
import { StoryShell, useHouse } from "@/components/refugio/story-shell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { checkStory, type StudioIssue, type StudioPerson, type StudioScene } from "@/lib/refugio/studio-check";
import { tracks } from "@/lib/refugio/music";
import { listAuthorTracks, removeAuthorTrack, saveAuthorTrack } from "@/lib/refugio/track-cloud";
import {
  authorChoiceStats,
  authorSky,
  createStudioStory,
  listMyStories,
  loadStudioDraft,
  saveStudioDraft,
  studioAccess,
  submitStudioStory,
} from "@/lib/refugio/studio-cloud";

type Mine = { id: string; slug: string; titulo: string; status: string; motivo: string | null };
type StatScene = { sceneId: string; total: number; ready: boolean; choices: Array<{ choiceId: string; total: number; percent: number }> };
type Access = { ok: false; reason: "conta" | "pacto" | "perfil" } | { ok: true; nome: string; published: number; limit: number | null; plan: string };

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
  return { id: crypto.randomUUID(), quem: "", texto: "", musica: "", musicaSegundos: 0, final: false, endingTitle: "", endingBody: "", flower: "", carta: "", cartaDe: "", choices: [] };
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
  const [cast, setCast] = useState<StudioPerson[]>([]);
  const [note, setNote] = useState("");
  const [fresh, setFresh] = useState({ titulo: "", sinopse: "", classificacao: "16" as "livre" | "14" | "16", generos: "", lugar: "" });
  const [original, setOriginal] = useState(false);
  const [stats, setStats] = useState<StatScene[]>([]);
  const [house, setHouse] = useState<Array<{ slug: string; scenes: StatScene[] }>>([]);
  const [ownTracks, setOwnTracks] = useState<Array<{ id: string; titulo: string }>>([]);

  function refresh() {
    void listMyStories().then(setMine).catch(() => setMine([]));
    void studioAccess().then((result) => setAccess(result)).catch(() => setAccess({ ok: false, reason: "conta" }));
  }

  useEffect(() => {
    if (!access?.ok) return;
    void listAuthorTracks().then(setOwnTracks).catch(() => setOwnTracks([]));
    void Promise.all(
      ["passageira", "correspondencia", "sobremesa", "corredor", "depoimento"].map((slug) =>
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
      setCast(result.cast ?? []);
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
        <p className="house-note">
          {access.limit === null ? t.passStar : access.published >= access.limit ? t.skyLimit : t.studioLimit.replace("{n}", String(access.limit))}
          {access.limit !== null ? ` · ${access.published}/${access.limit}` : ""}
        </p>
        {access.plan === "constelacao" ? <SkyLine /> : null}
      </section>
      <section className="house-block">
        <AuthorTracks tracks={ownTracks} onChange={setOwnTracks} />
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
          <div className="studio-cast">
            <p className="soon-kicker">{t.studioCast}</p>
            <p className="house-note">{t.studioCastLead}</p>
            {cast.map((person, index) => (
              <div key={person.id} className="studio-person">
                <label>
                  {t.studioCastName}
                  <input value={person.nome} onChange={(event) => setCast((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, nome: event.target.value } : item))} />
                </label>
                <label>
                  {t.studioCastLife}
                  <input value={person.vida} maxLength={180} onChange={(event) => setCast((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, vida: event.target.value } : item))} />
                </label>
                <button type="button" onClick={() => setCast((current) => current.filter((item) => item.id !== person.id))}>{t.studioCastRemove}</button>
              </div>
            ))}
            {cast.length < 6 ? (
              <button type="button" onClick={() => setCast((current) => [...current, { id: crypto.randomUUID(), nome: "", vida: "" }])}>{t.studioCastAdd}</button>
            ) : null}
          </div>
          {scenes.map((scene, index) => (
            <article key={scene.id} className="studio-scene">
              <p className="soon-kicker">{t.studioScene} {index + 1}</p>
              <label>
                {t.studioWho}
                <input list={`cast-${scene.id}`} value={scene.quem} onChange={(event) => patchScene(index, { quem: event.target.value })} />
                <datalist id={`cast-${scene.id}`}>
                  {cast.filter((person) => person.nome.trim()).map((person) => <option key={person.id} value={person.nome} />)}
                </datalist>
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
                  <label>{t.studioLetterFrom}<input value={scene.cartaDe} onChange={(event) => patchScene(index, { cartaDe: event.target.value })} /></label>
                  <label>{t.studioLetter}<textarea rows={3} value={scene.carta} onChange={(event) => patchScene(index, { carta: event.target.value })} /></label>
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
                      {ownTracks.map((track) => (
                        <option key={track.id} value={track.id}>{track.titulo}</option>
                      ))}
                    </select>
                  </label>
                  {scene.musica ? (
                    <label>
                      {t.musicSeconds}
                      <select value={scene.musicaSegundos || 0} onChange={(event) => patchScene(index, { musicaSegundos: Number(event.target.value) })}>
                        <option value={0}>{t.musicWhole}</option>
                        <option value={5}>5</option>
                        <option value={8}>8</option>
                        <option value={12}>12</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                      </select>
                    </label>
                  ) : null}
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
                      <label>
                        {t.studioDiary}
                        <input value={choice.diario} onChange={(event) => patchChoice(index, choiceIndex, { diario: event.target.value })} />
                      </label>
                    </div>
                  ))}
                  {scene.choices.length < 3 ? (
                    <button type="button" onClick={() => patchScene(index, { choices: [...scene.choices, { id: crypto.randomUUID(), texto: "", vai: "", afinidade: 0, pista: "", diario: "" }] })}>
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
            <button type="button" className="house-primary" onClick={() => void save(false)}>{t.studioSave}</button>
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
    const saved = await saveStudioDraft({ data: { id: openId, scenes, cast: cast.filter((person) => person.nome.trim()) } }).catch(() => null);
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

function AuthorTracks({ tracks: mine, onChange }: { tracks: Array<{ id: string; titulo: string }>; onChange: (next: Array<{ id: string; titulo: string }>) => void }) {
  const { lang, t } = useHouse();
  const [titulo, setTitulo] = useState("");
  const [direitos, setDireitos] = useState(false);
  const [note, setNote] = useState("");

  function send(file: File) {
    if (!direitos) {
      setNote(t.trackNeed);
      return;
    }
    if (file.size > 2_500_000) {
      setNote(t.trackBig);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const audio = String(reader.result || "");
      void saveAuthorTrack({ data: { titulo, mime: file.type || "audio/mpeg", audio, direitos: true, lang } })
        .then((result) => {
          if (!result.ok || !result.id) {
            setNote(result.reason === "limite" ? t.trackFull : result.reason === "grande" || result.reason === "tipo" ? t.trackBig : t.trackNeed);
            return;
          }
          onChange([{ id: result.id, titulo: result.titulo || titulo }, ...mine]);
          setTitulo("");
          setDireitos(false);
          setNote("");
        })
        .catch(() => setNote(t.trackBig));
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="house-block">
      <h2>{t.trackMine}</h2>
      <p className="house-note">{t.trackLead}</p>
      <p className="house-note">{t.trackKept}</p>
      <ul>
        {mine.map((track) => (
          <li key={track.id}>
            {track.titulo}{" "}
            <button type="button" onClick={() => {
              void removeAuthorTrack({ data: { id: track.id } }).then(() => {
                onChange(mine.filter((item) => item.id !== track.id));
                setNote(t.trackGone);
              });
            }}>{t.commentDelete}</button>
          </li>
        ))}
      </ul>
      <label>
        {t.trackName}
        <input value={titulo} maxLength={40} onChange={(event) => setTitulo(event.target.value)} />
      </label>
      <label className="soon-check">
        <input type="checkbox" checked={direitos} onChange={(event) => setDireitos(event.target.checked)} />
        <span>{t.trackRights}</span>
      </label>
      <label>
        {t.trackFile}
        <input
          type="file"
          accept="audio/mpeg,audio/ogg,audio/wav,audio/mp4,.mp3,.ogg,.wav,.m4a"
          disabled={titulo.trim().length < 2}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) send(file);
          }}
        />
      </label>
      {note ? <p className="house-note">{note}</p> : null}
    </div>
  );
}

function SkyLine() {
  const { t } = useHouse();
  const [line, setLine] = useState("");
  useEffect(() => {
    void authorSky().then((result) => {
      if (result.ok) setLine(`${result.readers} ${t.readersHere} · ✦ ${result.tips} ${t.shopMoons}`);
    }).catch(() => undefined);
  }, [t.readersHere, t.shopMoons]);
  if (!line) return null;
  return <p className="house-note">{line}</p>;
}
