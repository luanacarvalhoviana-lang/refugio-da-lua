/** Hidden clue prefix. The path rides along in the saved clue list and is not shown. */
const MARK = "#p:";

export function picksIn(clues: string[]): string[] {
  const row = clues.find((clue) => clue.startsWith(MARK));
  if (!row) return [];
  return row.slice(MARK.length).split(",").filter(Boolean);
}

export function shownClues(clues: string[]): string[] {
  return clues.filter((clue) => !clue.startsWith(MARK));
}

export function cluesWithPick(clues: string[], picks: string[], clue?: string): string[] {
  const shown = shownClues(clues);
  const next = clue && !shown.includes(clue) ? [...shown, clue] : shown;
  let kept = picks;
  let stamp = MARK + kept.join(",");
  while (stamp.length > 180 && kept.length > 1) {
    kept = kept.slice(1);
    stamp = MARK + kept.join(",");
  }
  return [stamp, ...next].slice(0, 12);
}

export function remembered<T extends { if: string }>(rows: T[] | undefined, picks: string[]): T | null {
  if (!rows?.length) return null;
  let found: T | null = null;
  for (const pick of picks) {
    const row = rows.find((item) => item.if === pick);
    if (row) found = row;
  }
  return found;
}

export function stingKind(percent: number | null): "high" | "low" | null {
  if (percent === null) return null;
  if (percent >= 70) return "high";
  if (percent <= 30) return "low";
  return null;
}
