import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ageFromBirth } from "@/lib/refugio/reading-local";

const progressInput = z.object({
  slug: z.string().trim().min(2).max(80),
  lang: z.enum(["pt", "es"]),
  sceneId: z.string().trim().min(1).max(40),
  affinity: z.number().int().min(-30).max(30),
  clues: z.array(z.string().trim().min(1).max(180)).max(12),
  endingKey: z.string().trim().max(40).optional(),
  endingTitle: z.string().trim().max(120).optional(),
  flower: z.string().trim().max(80).optional(),
  storyTitle: z.string().trim().min(1).max(160),
});

async function userId() {
  const { getSessionUser } = await import("@/lib/auth/verify.server");
  const user = await getSessionUser();
  return user?.id ?? null;
}

export const loadReading = createServerFn({ method: "POST" })
  .validator(z.object({ slug: z.string().min(2).max(80), lang: z.enum(["pt", "es"]) }))
  .handler(async ({ data }) => {
    const id = await userId();
    if (!id) return { signedIn: false as const, progress: null };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql.query<{
      scene_id: string;
      affinity: number;
      clues: unknown;
      ending_key: string | null;
      ending_title: string | null;
      flower: string | null;
      story_title: string | null;
    }>(
      `select scene_id, affinity, clues, ending_key, ending_title, flower, story_title
       from reader_progress where user_id = $1 and story_slug = $2 and lang = $3`,
      [id, data.slug, data.lang],
    );
    const row = rows[0];
    if (!row) return { signedIn: true as const, progress: null };
    const clues = Array.isArray(row.clues) ? row.clues.filter((item) => typeof item === "string") : [];
    return {
      signedIn: true as const,
      progress: {
        sceneId: row.scene_id,
        affinity: Number(row.affinity) || 0,
        clues,
        endingKey: row.ending_key,
        endingTitle: row.ending_title,
        flower: row.flower,
        storyTitle: row.story_title,
      },
    };
  });

export const saveReading = createServerFn({ method: "POST" })
  .validator(progressInput)
  .handler(async ({ data }) => {
    const id = await userId();
    if (!id) return { signedIn: false as const };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql.query(
      `insert into reader_progress
        (user_id, story_slug, lang, scene_id, affinity, clues, ending_key, ending_title, flower, story_title, updated_at)
       values ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, now())
       on conflict (user_id, story_slug, lang) do update set
        scene_id = excluded.scene_id,
        affinity = excluded.affinity,
        clues = excluded.clues,
        ending_key = excluded.ending_key,
        ending_title = excluded.ending_title,
        flower = excluded.flower,
        story_title = excluded.story_title,
        updated_at = now()`,
      [
        id,
        data.slug,
        data.lang,
        data.sceneId,
        data.affinity,
        JSON.stringify(data.clues),
        data.endingKey ?? null,
        data.endingTitle ?? null,
        data.flower ?? null,
        data.storyTitle,
      ],
    );
    return { signedIn: true as const };
  });

export const loadGardenCloud = createServerFn({ method: "POST" }).handler(async () => {
  const id = await userId();
  if (!id) return { signedIn: false as const, endings: [] as const };
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql.query<{
    story_slug: string;
    lang: string;
    ending_key: string;
    ending_title: string;
    flower: string;
    story_title: string;
    updated_at: string;
  }>(
    `select story_slug, lang, ending_key, ending_title, flower, story_title, updated_at
     from reader_progress
     where user_id = $1 and ending_key is not null
     order by updated_at desc`,
    [id],
  );
  return {
    signedIn: true as const,
    endings: rows.map((row) => ({
      slug: row.story_slug,
      lang: row.lang === "es" ? ("es" as const) : ("pt" as const),
      key: row.ending_key,
      title: row.ending_title,
      flower: row.flower,
      story: row.story_title,
      at: row.updated_at,
    })),
  };
});

const birthInput = z.object({
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const loadBirth = createServerFn({ method: "POST" }).handler(async () => {
  const id = await userId();
  if (!id) return { signedIn: false as const, birthDate: null as string | null };
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql.query<{ birth_date: string }>(
    `select birth_date::text as birth_date from reader_ages where user_id = $1`,
    [id],
  );
  return { signedIn: true as const, birthDate: rows[0]?.birth_date ?? null };
});

export const saveBirth = createServerFn({ method: "POST" })
  .validator(birthInput)
  .handler(async ({ data }) => {
    const id = await userId();
    const age = ageFromBirth(data.birthDate);
    if (!id) return { signedIn: false as const, age };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql.query(
      `insert into reader_ages (user_id, birth_date, updated_at)
       values ($1, $2::date, now())
       on conflict (user_id) do update set birth_date = excluded.birth_date, updated_at = now()`,
      [id, data.birthDate],
    );
    return { signedIn: true as const, age };
  });
