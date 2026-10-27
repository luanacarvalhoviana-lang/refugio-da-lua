import { useEffect, useState } from "react";
import { StoryShell, useHouse } from "@/components/refugio/story-shell";
import { listReadings } from "@/lib/refugio/progress-cloud";
import { readShelf } from "@/lib/refugio/reading-local";
import { getStory } from "@/lib/refugio/stories";

type ShelfItem = {
  slug: string;
  lang: "pt" | "es" | "en";
  title: string;
  ended: boolean;
  endingTitle?: string | null;
};

export function LibraryPage() {
  const { lang, t } = useHouse();
  const [items, setItems] = useState<ShelfItem[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const local = readShelf()
      .filter((item) => item.lang === lang)
      .map((item) => ({
        slug: item.slug,
        lang: item.lang,
        title: item.title || getStory(item.lang, item.slug)?.title || item.slug,
        ended: Boolean(item.ended),
      }));
    setItems(local);
    void listReadings()
      .then((result) => {
        if (!result.signedIn) return;
        const cloud = result.readings.filter((item) => item.lang === lang);
        const seen = new Set(cloud.map((item) => item.slug));
        setItems([...cloud, ...local.filter((item) => !seen.has(item.slug))]);
      })
      .catch(() => undefined);
  }, [lang]);

  const needle = query.trim().toLocaleLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
  const named = needle
    ? items.filter((item) => item.title.toLocaleLowerCase().normalize("NFD").replace(/\p{M}/gu, "").includes(needle))
    : items;
  const open = named.filter((item) => !item.ended);
  const done = named.filter((item) => item.ended);

  return (
    <StoryShell>
      <section className="house-block">
        <p className="soon-kicker">{t.navLibrary}</p>
        <h1>{t.libraryTitle}</h1>
        <p>{t.libraryLead}</p>
        <label className="house-search">
          {t.searchName}
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchHint} />
        </label>
        {items.length === 0 ? <p className="house-note">{t.libraryEmpty}</p> : null}
        {items.length > 0 && named.length === 0 ? <p className="house-note">{t.searchEmpty}</p> : null}
        {open.length > 0 ? (
          <>
            <h2>{t.libraryContinue}</h2>
            <ul className="comment-list">
              {open.map((item) => (
                <li key={item.slug}>
                  <p>{item.title}</p>
                  <p><a href={`/ler/${item.slug}`}>{t.libraryOpen}</a></p>
                </li>
              ))}
            </ul>
          </>
        ) : null}
        {done.length > 0 ? (
          <>
            <h2>{t.libraryDone}</h2>
            <ul className="comment-list">
              {done.map((item) => (
                <li key={item.slug}>
                  <p>{item.title}</p>
                  {item.endingTitle ? <p className="house-note">{item.endingTitle}</p> : null}
                  <p><a href={`/ler/${item.slug}`}>{t.libraryAgain}</a></p>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </section>
    </StoryShell>
  );
}
