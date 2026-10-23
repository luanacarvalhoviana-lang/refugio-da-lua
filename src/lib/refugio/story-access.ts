import type { Story } from "@/lib/refugio/stories";

/** Tira o texto de uma história fechada. A data abre o episódio antecipado. A lua cheia abre a noite. */
export function presentStory(story: Story, allowed: boolean, today: string, moonOpen = false): Story {
  if (story.access === "antecipada" && story.opensOn && story.opensOn <= today) {
    return { ...story, access: "aberta", locked: false };
  }
  if (!story.access || story.access === "aberta" || allowed) return { ...story, locked: false };
  if (moonOpen) return { ...story, locked: false, moonNight: true };
  return { ...story, scenes: [], start: "", locked: true };
}
