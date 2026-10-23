import { useEffect, useState } from "react";
import { useHouse } from "@/components/refugio/story-shell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { addComment, deleteComment, listComments, reportComment } from "@/lib/refugio/community-cloud";
import { readPact } from "@/lib/refugio/pacto";
import type { Lang } from "@/lib/refugio/stories";

export function CommunityDesk({ slug, lang, sceneId }: { slug: string; lang: Lang; sceneId: string }) {
  const { t } = useHouse();
  const { user } = useCurrentUserState();
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<Array<{ id: string; texto: string; spoiler: boolean; mine: boolean; plan?: string }>>([]);
  const [shown, setShown] = useState<Record<string, boolean>>({});
  const [texto, setTexto] = useState("");
  const [spoiler, setSpoiler] = useState(false);
  const [note, setNote] = useState("");
  const signed = Boolean(user && !user.isDevFallback);
  const mayWrite = signed && Boolean(readPact());

  function load() {
    void listComments({ data: { slug, lang, sceneId } })
      .then((result) => setComments(result.comments))
      .catch(() => setComments([]));
  }

  useEffect(() => {
    load();
  }, [slug, lang, sceneId]);

  return (
    <div className="community">
      <button type="button" className="house-quiet" onClick={() => setOpen((value) => !value)}>
        {t.commentsLink.replace("{n}", String(comments.length))}
      </button>
      {open ? (
        <div className="comment-list">
          {comments.length === 0 ? <p className="house-note">{t.commentEmpty}</p> : null}
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>
                {comment.spoiler && !shown[comment.id] ? (
                  <button type="button" className="house-quiet" onClick={() => setShown((current) => ({ ...current, [comment.id]: true }))}>
                    {t.commentSpoiler}. {t.commentReveal}
                  </button>
                ) : (
                  <p>{comment.texto}</p>
                )}
                {comment.plan === "constelacao" ? <p className="soon-kicker">{t.sealStar}</p> : comment.plan === "lua_cheia" ? <p className="soon-kicker">{t.sealCheia}</p> : null}
                <p className="house-note">
                  <button type="button" onClick={() => void reportComment({ data: { id: comment.id } }).then(load)}>
                    {t.report}
                  </button>
                  {comment.mine ? (
                    <button
                      type="button"
                      onClick={() => {
                        void deleteComment({ data: { id: comment.id } }).then(() => {
                          setNote(t.commentGone);
                          load();
                        });
                      }}
                    >
                      {t.commentDelete}
                    </button>
                  ) : null}
                </p>
              </li>
            ))}
          </ul>
          {mayWrite ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setNote("");
                void addComment({ data: { slug, lang, sceneId, texto, spoiler } })
                  .then((result) => {
                    if (!result.ok) {
                      setNote(t.commentNeed);
                      return;
                    }
                    setTexto("");
                    setSpoiler(false);
                    load();
                  })
                  .catch(() => setNote(t.commentNeed));
              }}
            >
              <textarea required maxLength={500} rows={3} value={texto} placeholder={t.commentWrite} onChange={(event) => setTexto(event.target.value)} />
              <label className="soon-check">
                <input type="checkbox" checked={spoiler} onChange={(event) => setSpoiler(event.target.checked)} />
                <span>{t.commentSpoiler}</span>
              </label>
              <button type="submit">{t.commentSend}</button>
            </form>
          ) : (
            <p className="house-note">{t.commentNeed}</p>
          )}
          {note ? <p className="house-note">{note}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
