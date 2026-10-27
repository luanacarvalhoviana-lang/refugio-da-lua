import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Story } from "@/lib/refugio/stories";

const lang = z.enum(["pt", "es", "en"]);

const statsInput = z.object({
  slug: z.string().trim().min(2).max(80),
  lang,
  sceneId: z.string().trim().min(1).max(40),
});

const choiceInput = statsInput.extend({
  choiceId: z.string().trim().min(1).max(40),
  readerKey: z.string().trim().min(8).max(80),
});

const notesInput = statsInput.extend({
  choiceId: z.string().trim().min(1).max(40),
});

const noteInput = notesInput.extend({
  penName: z.string().trim().min(2).max(40),
  body: z.string().trim().min(2).max(280),
});

const pathInput = z.object({
  label: z.string().trim().min(2).max(120),
  clue: z.string().trim().max(180).optional(),
  affinity: z.number().int().min(-1).max(2),
  endingTitle: z.string().trim().min(2).max(80),
  endingBody: z.string().trim().min(20).max(1200),
  flower: z.string().trim().min(2).max(40),
});

const draftInput = z.object({
  slug: z.string().trim().regex(/^[a-z0-9-]{3,60}$/).optional(),
  title: z.string().trim().min(3).max(80),
  synopsis: z.string().trim().min(10).max(280),
  place: z.enum(["biblioteca", "cafe", "praia"]),
  authorName: z.string().trim().min(2).max(40),
  original: z.literal(true),
  opening: z.string().trim().min(40).max(1500),
  paths: z.array(pathInput).min(2).max(3),
  lang,
});

async function userId() {
  const { getSessionUser } = await import("@/lib/auth/verify.server");
  const user = await getSessionUser();
  return user?.id ?? null;
}

function asStory(value: unknown): Story | null {
  if (!value || typeof value !== "object") return null;
  const story = value as Story;
  if (!story.slug || !story.title || !Array.isArray(story.scenes) || story.scenes.length < 2) return null;
  return story;
}

export const choiceStats = createServerFn({ method: "POST" })
  .validator(statsInput)
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql.query<{ choice_id: string; n: number }>(
      `select choice_id, count(*)::int as n
       from reader_choices
       where story_slug = $1 and lang = $2 and scene_id = $3
       group by choice_id`,
      [data.slug, data.lang, data.sceneId],
    );
    const counts: Record<string, number> = {};
    let total = 0;
    for (const row of rows) {
      const n = Number(row.n) || 0;
      counts[row.choice_id] = n;
      total += n;
    }
    return { total, counts };
  });

export const recordChoice = createServerFn({ method: "POST" })
  .validator(choiceInput)
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql.query(
      `insert into reader_choices (story_slug, lang, scene_id, choice_id, reader_key, updated_at)
       values ($1, $2, $3, $4, $5, now())
       on conflict (story_slug, lang, scene_id, reader_key)
       do update set choice_id = excluded.choice_id, updated_at = now()`,
      [data.slug, data.lang, data.sceneId, data.choiceId, data.readerKey],
    );
    return { ok: true as const };
  });

export const listNotes = createServerFn({ method: "POST" })
  .validator(notesInput)
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const id = await userId();
    const rows = await sql.query<{ id: string; pen_name: string; body: string; user_id: string; created_at: string }>(
      `select id, pen_name, body, user_id, created_at
       from reader_notes
       where story_slug = $1 and lang = $2 and scene_id = $3 and choice_id = $4
       order by created_at desc
       limit 20`,
      [data.slug, data.lang, data.sceneId, data.choiceId],
    );
    return {
      notes: rows.map((row) => ({
        id: row.id,
        penName: row.pen_name,
        body: row.body,
        mine: Boolean(id && row.user_id === id),
        at: row.created_at,
      })),
    };
  });

export const addNote = createServerFn({ method: "POST" })
  .validator(noteInput)
  .handler(async ({ data }) => {
    const id = await userId();
    if (!id) return { signedIn: false as const };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const count = await sql.query<{ n: number }>(
      `select count(*)::int as n from reader_notes where user_id = $1 and story_slug = $2`,
      [id, data.slug],
    );
    if ((Number(count[0]?.n) || 0) >= 8) return { signedIn: true as const, full: true as const };
    const noteId = crypto.randomUUID();
    await sql.query(
      `insert into reader_notes (id, story_slug, lang, scene_id, choice_id, user_id, pen_name, body)
       values ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [noteId, data.slug, data.lang, data.sceneId, data.choiceId, id, data.penName, data.body],
    );
    return { signedIn: true as const, full: false as const, id: noteId };
  });

function placeOf(place: "biblioteca" | "cafe" | "praia", storyLang: "pt" | "es" | "en") {
  if (place === "cafe") {
    return {
      label: storyLang === "en" ? "Café in the rain" : storyLang === "es" ? "Café bajo la lluvia" : "Café na chuva",
      art: "/scenes/cafe.jpg",
      sound: "/sounds/rain.mp3",
    };
  }
  if (place === "praia") {
    return {
      label: storyLang === "en" ? "Night beach" : storyLang === "es" ? "Playa de noche" : "Praia à noite",
      art: "/scenes/praia.jpg",
      sound: "/sounds/ocean.mp3",
    };
  }
  return {
    label: storyLang === "en" ? "Old library" : storyLang === "es" ? "Biblioteca antigua" : "Biblioteca antiga",
    art: "/scenes/biblioteca.jpg",
    sound: "/sounds/rain.mp3",
  };
}

function buildStory(data: z.infer<typeof draftInput>, slug: string): Story {
  const place = placeOf(data.place, data.lang);
  return {
    slug,
    title: data.title,
    author: data.authorName,
    rating: "16",
    genres: ["romance"],
    minutes: 8,
    synopsis: data.synopsis,
    place: place.label,
    art: place.art,
    sound: place.sound,
    start: "inicio",
    scenes: [
      {
        id: "inicio",
        body: data.opening,
        choices: data.paths.map((path, index) => ({
          id: `c${index + 1}`,
          label: path.label,
          to: `fim-${index + 1}`,
          affinity: path.affinity,
          clue: path.clue || undefined,
        })),
      },
      ...data.paths.map((path, index) => ({
        id: `fim-${index + 1}`,
        ending: {
          key: `fim-${index + 1}`,
          title: path.endingTitle,
          body: path.endingBody,
          flower: path.flower,
        },
      })),
    ],
  };
}

export const listCommunity = createServerFn({ method: "POST" })
  .validator(z.object({ lang }))
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql.query<{ payload: unknown }>(
      `select payload from community_stories
       where lang = $1 and published = true
       order by updated_at desc
       limit 24`,
      [data.lang],
    );
    return rows.map((row) => asStory(row.payload)).filter((story): story is Story => Boolean(story));
  });

export const saveCommunity = createServerFn({ method: "POST" })
  .validator(draftInput)
  .handler(async ({ data }) => {
    const id = await userId();
    if (!id) return { signedIn: false as const };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    let slug = data.slug;
    if (slug) {
      const owned = await sql.query<{ user_id: string }>(
        `select user_id from community_stories where slug = $1`,
        [slug],
      );
      if (owned[0] && owned[0].user_id !== id) return { signedIn: true as const, error: "ocupado" as const };
    } else {
      const ownedCount = await sql.query<{ n: number }>(
        `select count(*)::int as n from community_stories where user_id = $1`,
        [id],
      );
      if ((Number(ownedCount[0]?.n) || 0) >= 12) return { signedIn: true as const, error: "cheio" as const };
      const base = data.title
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 36);
      slug = `${base || "historia"}-${crypto.randomUUID().slice(0, 4)}`;
    }
    const story = buildStory(data, slug);
    await sql.query(
      `insert into community_stories (slug, lang, user_id, title, published, payload, updated_at)
       values ($1, $2, $3, $4, true, $5::jsonb, now())
       on conflict (slug) do update set
         title = excluded.title,
         lang = excluded.lang,
         payload = excluded.payload,
         published = true,
         updated_at = now()`,
      [slug, data.lang, id, data.title, JSON.stringify(story)],
    );
    return { signedIn: true as const, slug, error: null };
  });
