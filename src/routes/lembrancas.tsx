import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PactGuard } from "@/components/refugio/pact-guard";
import { StoryShell, useHouse } from "@/components/refugio/story-shell";
import { listKeepsakes } from "@/lib/refugio/night-cloud";

export const Route = createFileRoute("/lembrancas")({
  component: () => (
    <PactGuard>
      <KeepsakePage />
    </PactGuard>
  ),
});

function KeepsakePage() {
  const { t } = useHouse();
  const [items, setItems] = useState<Array<{ id: string; titulo: string; trecho: string; story_slug: string }>>([]);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  useEffect(() => {
    void listKeepsakes()
      .then((result) => {
        setSignedIn(result.signedIn);
        setItems(result.items);
      })
      .catch(() => setSignedIn(false));
  }, []);
  return (
    <StoryShell>
      <section className="house-block">
        <p className="soon-kicker">{t.accessCheia}</p>
        <h1>{t.keepBox}</h1>
        <p className="soon-lead">{t.keepLead}</p>
        {signedIn === false ? <p><a className="house-primary" href="/#entrar">{t.keepNeed}</a></p> : null}
        {signedIn && items.length === 0 ? <p className="house-note">{t.keepEmpty}</p> : null}
        <div className="keep-list">
          {items.map((item) => (
            <article key={item.id}>
              <strong><a href={`/ler/${item.story_slug}`}>{item.titulo}</a></strong>
              <p>{item.trecho}</p>
            </article>
          ))}
        </div>
      </section>
    </StoryShell>
  );
}
