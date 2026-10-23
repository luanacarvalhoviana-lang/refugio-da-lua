import type { Story } from "@/lib/refugio/stories";

export function AccessMark({ story, cheia, early, moon }: { story: Story; cheia: string; early: string; moon?: string }) {
  if (story.moonNight) return <span className="access-pill">{moon || "Lua cheia"}</span>;
  if (story.locked || story.access === "cheia") return <span className="access-pill">{cheia}</span>;
  if (story.access === "antecipada") return <span className="access-pill">{early}</span>;
  return null;
}
