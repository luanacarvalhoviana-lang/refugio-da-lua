import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { StoryShell, useHouse } from "@/components/refugio/story-shell";
import { confirmStoryCheckout } from "@/lib/refugio/billing";

export const Route = createFileRoute("/planos/obrigada")({
  component: PlanThanks,
});

function PlanThanks() {
  const { t } = useHouse();
  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");
    if (sessionId) void confirmStoryCheckout({ data: { sessionId } }).catch(() => undefined);
  }, []);
  return (
    <StoryShell>
      <section className="house-hero">
        <h1>{t.planOpened}</h1>
        <a className="house-primary" href="/historias">{t.navStories}</a>
      </section>
    </StoryShell>
  );
}
