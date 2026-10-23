import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { StoryShell, useHouse } from "@/components/refugio/story-shell";
import { adminSubscriptions } from "@/lib/refugio/plan-cloud";

export const Route = createFileRoute("/admin/assinaturas")({
  component: AdminPlans,
});

function AdminPlans() {
  const { t } = useHouse();
  const [data, setData] = useState<Awaited<ReturnType<typeof adminSubscriptions>> | null>(null);
  useEffect(() => {
    void adminSubscriptions().then(setData).catch(() => setData({ allowed: false }));
  }, []);
  if (!data?.allowed) {
    return <StoryShell><section className="house-block"><h1>{t.adminClosed}</h1></section></StoryShell>;
  }
  return (
    <StoryShell>
      <section className="house-block">
        <h1>{t.navPlans}</h1>
        <p>{data.active} · R$ {(data.cents / 100).toFixed(2).replace(".", ",")}</p>
        <ul className="comment-list">
          {data.rows.map((row, index) => (
            <li key={`${row.plan}-${index}`}>{row.plan} · {row.status} · {row.interval}</li>
          ))}
        </ul>
      </section>
    </StoryShell>
  );
}
