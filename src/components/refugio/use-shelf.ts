import { useEffect, useMemo, useState } from "react";
import { listNightStories } from "@/lib/refugio/night-cloud";
import { listCommunity } from "@/lib/refugio/room-cloud";
import { listPublishedStories } from "@/lib/refugio/studio-cloud";
import { stories, type Lang, type Story } from "@/lib/refugio/stories";

export function useShelf(lang: Lang) {
  const [extra, setExtra] = useState<Story[]>([]);
  const [night, setNight] = useState<Story[]>([]);
  useEffect(() => {
    let cancel = false;
    void Promise.all([
      listCommunity({ data: { lang } }).catch(() => [] as Story[]),
      listPublishedStories({ data: { lang } }).catch(() => [] as Story[]),
    ]).then(([community, published]) => {
      if (!cancel) setExtra([...published, ...community]);
    });
    void listNightStories({ data: { lang } })
      .then((rows) => {
        if (!cancel) setNight(rows);
      })
      .catch(() => {
        if (!cancel) setNight([]);
      });
    return () => {
      cancel = true;
    };
  }, [lang]);
  return useMemo(() => {
    const own = stories[lang];
    const seen = new Set(own.map((story) => story.slug));
    return [
      ...own,
      ...night.filter((story) => story.slug && !seen.has(story.slug)),
      ...extra.filter((story) => story.slug && !seen.has(story.slug) && !night.some((item) => item.slug === story.slug)),
    ];
  }, [lang, extra, night]);
}