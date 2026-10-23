import { createFileRoute } from "@tanstack/react-router";
import { StoryShell, useHouse } from "@/components/refugio/story-shell";

export const Route = createFileRoute("/planos/cancelado")({
  component: PlanCancel,
});

function PlanCancel() {
  const { t } = useHouse();
  return (
    <StoryShell>
      <section className="house-hero">
        <h1>{t.planBack}</h1>
        <a href="/planos">{t.navPlans}</a>
      </section>
    </StoryShell>
  );
}
