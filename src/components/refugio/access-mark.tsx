import type { Story } from "@/lib/refugio/stories";

export function AccessMark({ story, cheia, early }: { story: Story; cheia: string; early: string }) {
  if (story.locked || story.access === "cheia") return <span className="access-pill">{cheia}</span>;
  if (story.access === "antecipada") return <span className="access-pill">{early}</span>;
  return null;
}
