import { useEffect, useMemo, useState } from "react";
import { listCommunity } from "@/lib/refugio/room-cloud";
import { stories, type Lang, type Story } from "@/lib/refugio/stories";

export function useShelf(lang: Lang) {
  const [extra, setExtra] = useState<Story[]>([]);
  useEffect(() => {
    let cancel = false;
    void listCommunity({ data: { lang } })
      .then((rows) => {
        if (!cancel) setExtra(rows);
      })
      .catch(() => {
        if (!cancel) setExtra([]);
      });
    return () => {
      cancel = true;
    };
  }, [lang]);
  return useMemo(() => {
    const own = stories[lang];
    const seen = new Set(own.map((story) => story.slug));
    return [...own, ...extra.filter((story) => story.slug && !seen.has(story.slug))];
  }, [lang, extra]);
}
