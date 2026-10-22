import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { StoryShell, useHouse } from "@/components/refugio/story-shell";
import { decideComment, moderateComments } from "@/lib/refugio/community-cloud";

export const Route = createFileRoute("/admin/moderacao")({
  component: ModerationPage,
});

function ModerationPage() {
  const { t } = useHouse();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [comments, setComments] = useState<Array<{ id: string; story_slug: string; texto: string; reports: number }>>([]);

  function load() {
    void moderateComments()
      .then((result) => {
        setAllowed(result.allowed);
        setComments(result.comments);
      })
      .catch(() => setAllowed(false));
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
            <p>{t.adminLead}</p>
            {comments.length === 0 ? <p>{t.adminEmpty}</p> : null}
            <ul className="comment-list">
              {comments.map((comment) => (
                <li key={comment.id}>
                  <p className="soon-kicker">{comment.story_slug} · {comment.reports}</p>
                  <p>{comment.texto}</p>
                  <p className="house-note">
                    <button type="button" onClick={() => void decideComment({ data: { id: comment.id, status: "visivel" } }).then(load)}>
                      {t.adminApprove}
                    </button>
                    <button type="button" onClick={() => void decideComment({ data: { id: comment.id, status: "removido" } }).then(load)}>
                      {t.adminRemove}
                    </button>
                  </p>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </section>
    </StoryShell>
  );
}
