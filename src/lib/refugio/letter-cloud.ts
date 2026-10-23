import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const letter = z.object({
  slug: z.string().trim().min(2).max(48),
  lang: z.enum(["pt", "es"]),
  key: z.string().trim().min(1).max(40),
  story: z.string().trim().min(1).max(80),
  from: z.string().trim().min(1).max(40),
  text: z.string().trim().min(1).max(600),
});

export const keepStoryLetter = createServerFn({ method: "POST" })
  .validator(letter)
  .handler(async ({ data }) => {
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const user = await getSessionUser();
    if (!user?.id) return { ok: false as const, reason: "conta" as const };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql.query(
      `insert into kept_letters (user_id, story_slug, lang, ending_key, story_title, de, texto)
       values ($1, $2, $3, $4, $5, $6, $7)
       on conflict (user_id, story_slug, lang, ending_key) do update set de = excluded.de, texto = excluded.texto, story_title = excluded.story_title`,
      [user.id, data.slug, data.lang, data.key, data.story, data.from, data.text],
    );
    return { ok: true as const };
  });

export const listStoryLetters = createServerFn({ method: "GET" }).handler(async () => {
  const { getSessionUser } = await import("@/lib/auth/verify.server");
  const user = await getSessionUser();
  if (!user?.id) return { signedIn: false as const, letters: [] as Array<{ slug: string; lang: string; key: string; story: string; from: string; text: string }> };
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql.query<{ story_slug: string; lang: string; ending_key: string; story_title: string; de: string; texto: string }>(
    `select story_slug, lang, ending_key, story_title, de, texto from kept_letters where user_id = $1 order by criado_em desc limit 40`,
    [user.id],
  );
  return {
    signedIn: true as const,
    letters: rows.map((row) => ({ slug: row.story_slug, lang: row.lang, key: row.ending_key, story: row.story_title, from: row.de, text: row.texto })),
  };
});
