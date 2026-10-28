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

const retired = new Set(["o-bilhete", "a-chave", "a-mare", "a-lampada", "antes-da-lua"]);

export function LibraryPage() {
  const { lang, t } = useHouse();
  const [items, setItems] = useState<ShelfItem[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const local = readShelf()
      .filter((item) => item.lang === lang && !retired.has(item.slug))
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
        const cloud = result.readings.filter((item) => item.lang === lang && !retired.has(item.slug));
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
            <div className="story-list">
              {open.map((item) => {
                const story = getStory(lang, item.slug);
                return (
                  <a key={item.slug} className="story-card" href={`/ler/${item.slug}`}>
                    {story?.art ? <img className="story-poster" src={story.art} alt="" /> : null}
                    <strong>{item.title}</strong>
                    <em>{t.libraryOpen}</em>
                  </a>
                );
              })}
            </div>
          </>
        ) : null}
        {done.length > 0 ? (
          <>
            <h2>{t.libraryDone}</h2>
            <div className="story-list">
              {done.map((item) => {
                const story = getStory(lang, item.slug);
                return (
                  <a key={item.slug} className="story-card" href={`/historia/${item.slug}`}>
                    {story?.art ? <img className="story-poster" src={story.art} alt="" /> : null}
                    <strong>{item.title}</strong>
                    <em>{item.endingTitle || t.libraryDone}</em>
                  </a>
                );
              })}
            </div>
          </>
        ) : null}
      </section>
    </StoryShell>
  );
}
