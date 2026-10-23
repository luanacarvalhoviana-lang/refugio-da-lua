import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { StoryShell, useHouse } from "@/components/refugio/story-shell";
import { decideComment, moderateComments } from "@/lib/refugio/community-cloud";
import { decideStory, reviewStories } from "@/lib/refugio/studio-cloud";
import { decideTrack, moderateTracks } from "@/lib/refugio/track-cloud";

export const Route = createFileRoute("/admin/moderacao")({
  component: ModerationPage,
});

function ModerationPage() {
  const { t } = useHouse();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [comments, setComments] = useState<Array<{ id: string; story_slug: string; texto: string; reports: number }>>([]);
  const [tab, setTab] = useState<"comments" | "stories" | "music">("comments");
  const [stories, setStories] = useState<Array<{ id: string; slug: string; titulo: string; sinopse: string; autora: string }>>([]);
  const [tracks, setTracks] = useState<Array<{ id: string; titulo: string; declaracao: string | null; criado_em: string; status: string; email: string | null; reports: number }>>([]);
  const [reason, setReason] = useState<Record<string, string>>({});
  const [note, setNote] = useState("");

  function load() {
    void moderateComments()
      .then((result) => {
        setAllowed(result.allowed);
        setComments(result.comments);
      })
      .catch(() => setAllowed(false));
    void reviewStories()
      .then((result) => {
        if (result.allowed) setStories(result.stories);
      })
      .catch(() => undefined);
    void moderateTracks()
      .then((result) => {
        if (result.allowed) setTracks(result.tracks);
      })
      .catch(() => undefined);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <StoryShell>
      <section className="house-block prose">
        <h1>{t.adminTitle}</h1>
        {allowed === false ? <p>{t.adminClosed}</p> : null}
        {allowed ? (
          <>
            <p className="house-cta">
              <button type="button" onClick={() => setTab("comments")}>{t.adminComments}</button>
              <button type="button" onClick={() => setTab("stories")}>{t.adminStories}</button>
              <button type="button" onClick={() => setTab("music")}>{t.adminMusic}</button>
            </p>
            {tab === "comments" ? (
              <>
                <p>{t.adminLead}</p>
                {comments.length === 0 ? <p>{t.adminEmpty}</p> : null}
                <ul className="comment-list">
                  {comments.map((comment) => (
                    <li key={comment.id}>
                      <p className="soon-kicker">{comment.story_slug} · {comment.reports}</p>
                      <p>{comment.texto}</p>
                      <p className="house-note">
                        <button type="button" onClick={() => void decideComment({ data: { id: comment.id, status: "visivel" } }).then(load)}>{t.adminApprove}</button>
                        <button type="button" onClick={() => void decideComment({ data: { id: comment.id, status: "removido" } }).then(load)}>{t.adminRemove}</button>
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {tab === "stories" ? (
              <>
                {stories.length === 0 ? <p>{t.adminEmpty}</p> : null}
                <ul className="comment-list">
                  {stories.map((story) => (
                    <li key={story.id}>
                      <p className="soon-kicker">{story.autora}</p>
                      <p><a href={`/ler/${story.slug}`}>{story.titulo}</a></p>
                      <p>{story.sinopse}</p>
                      <label>
                        {t.adminReason}
                        <input value={reason[story.id] || ""} onChange={(event) => setReason((current) => ({ ...current, [story.id]: event.target.value }))} />
                      </label>
                      <p className="house-note">
                        <button type="button" onClick={() => {
                          setNote("");
                          void decideStory({ data: { id: story.id, status: "publicada" } }).then((result) => {
                            if (!result.ok && result.reason === "limite") setNote(t.adminLimit);
                            else load();
                          });
                        }}>{t.adminApprove}</button>
                        <button type="button" onClick={() => {
                          const motivo = (reason[story.id] || "").trim();
                          if (!motivo) return;
                          void decideStory({ data: { id: story.id, status: "recusada", motivo } }).then(load);
                        }}>{t.adminRemove}</button>
                      </p>
                    </li>
                  ))}
                </ul>
                {note ? <p>{note}</p> : null}
              </>
            ) : null}
            {tab === "music" ? (
              <>
                <p>{t.adminMusicLead}</p>
                {tracks.length === 0 ? <p>{t.adminEmpty}</p> : null}
                <ul className="comment-list">
                  {tracks.map((track) => (
                    <li key={track.id}>
                      <p className="soon-kicker">{track.email || "conta"} · {track.reports} · {track.status}</p>
                      <p>{track.titulo}</p>
                      <p className="house-note">{track.declaracao}</p>
                      <audio controls preload="none" src={`/trilha/${track.id}`} />
                      <p className="house-note">
                        <button type="button" onClick={() => void decideTrack({ data: { id: track.id, keep: true } }).then(load)}>{t.adminApprove}</button>
                        <button type="button" onClick={() => void decideTrack({ data: { id: track.id, keep: false } }).then(load)}>{t.adminRemove}</button>
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </>
        ) : null}
      </section>
    </StoryShell>
  );
}
