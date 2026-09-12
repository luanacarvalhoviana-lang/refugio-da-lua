import { useCallback, useEffect, useState } from "react";
import type { Letter } from "@/lib/refugio/letters";
import { listMuralLetters } from "@/lib/refugio/mural-cloud";
import { useRefugioStore } from "@/lib/refugio/store";

function mergeLetters(remote: Letter[], local: Letter[], myName: string) {
  const byId = new Map<string, Letter>();
  for (const letter of remote) byId.set(letter.id, letter);
  for (const letter of local) {
    if (letter.author !== myName) continue;
    const existing = byId.get(letter.id);
    if (!existing) byId.set(letter.id, letter);
    else {
      byId.set(letter.id, {
        ...existing,
        energy: Math.max(existing.energy, letter.energy),
        advice:
          (existing.advice?.length || 0) >= (letter.advice?.length || 0) ? existing.advice : letter.advice,
      });
    }
  }
  return [...byId.values()].sort((a, b) => {
    const ta = a.postedAt ? new Date(a.postedAt).getTime() : 0;
    const tb = b.postedAt ? new Date(b.postedAt).getTime() : 0;
    if (tb !== ta) return tb - ta;
    return (b.priority || 0) - (a.priority || 0);
  });
}

let muralCache: Letter[] = [];

export function cachedMuralLetters() {
  return muralCache;
}

export function useMuralLetters() {
  const local = useRefugioStore((s) => s.letters);
  const myName = useRefugioStore((s) => s.userName);
  const [remote, setRemote] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    return listMuralLetters()
      .then((rows) => {
        muralCache = rows;
        setRemote(rows);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 20000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  return {
    data: mergeLetters(remote, local, myName),
    isLoading: loading,
    refresh,
  };
}
