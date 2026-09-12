import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { demoLetters, type Letter, type LetterAdvice } from "@/lib/refugio/letters";

function relativeTime(iso: string) {
  const then = new Date(iso).getTime();
  const s = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (s < 45) return "agora";
  if (s < 3600) return `há ${Math.max(1, Math.floor(s / 60))} min`;
  if (s < 86400) return `há ${Math.floor(s / 3600)} h`;
  if (s < 86400 * 2) return "ontem";
  return `há ${Math.floor(s / 86400)} d`;
}

type MuralRow = {
  id: string;
  author_id: string;
  author_name: string;
  initials: string;
  title: string;
  body: string;
  excerpt: string;
  topic: string;
  color: string;
  energy: number;
  gender: string | null;
  age_group: string | null;
  emotion: string | null;
  hour: number | null;
  priority: number;
  paper_key: string | null;
  seal_key: string | null;
  after_mural: string | null;
  advice: LetterAdvice[] | string;
  posted_at: string;
};

function rowToLetter(row: MuralRow): Letter {
  const posted = typeof row.posted_at === "string" ? row.posted_at : new Date(row.posted_at).toISOString();
  const advice = Array.isArray(row.advice)
    ? row.advice
    : typeof row.advice === "string"
      ? (JSON.parse(row.advice) as LetterAdvice[])
      : [];
  return {
    id: row.id,
    title: row.title,
    author: row.author_name,
    initials: row.initials || "RL",
    topic: row.topic,
    time: relativeTime(posted),
    excerpt: row.excerpt,
    color: (row.color as Letter["color"]) || "lavender",
    energy: Number(row.energy) || 0,
    body: row.body,
    gender: row.gender,
    ageGroup: row.age_group,
    emotion: row.emotion,
    hour: row.hour ?? undefined,
    priority: row.priority || 0,
    paperKey: row.paper_key || undefined,
    sealKey: row.seal_key || undefined,
    afterMural: row.after_mural === "diary" || row.after_mural === "humus" ? row.after_mural : undefined,
    postedAt: posted,
    advice,
  };
}

async function seedIfEmpty(sql: { query: Function }) {
  const count = await sql.query<{ n: string | number }>(`select count(*)::int as n from mural_letters`);
  if (Number(count[0]?.n) > 0) return;
  for (const letter of demoLetters) {
    await sql.query(
      `insert into mural_letters
        (id, author_id, author_name, initials, title, body, excerpt, topic, color, energy, gender, age_group, emotion, hour, priority, advice, posted_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16::jsonb, now() - ($17 || ' minutes')::interval)
       on conflict (id) do nothing`,
      [
        letter.id,
        "seed",
        letter.author,
        letter.initials,
        letter.title,
        letter.body,
        letter.excerpt,
        letter.topic,
        letter.color,
        letter.energy,
        letter.gender ?? null,
        letter.ageGroup ?? null,
        letter.emotion ?? null,
        letter.hour ?? null,
        letter.priority ?? 0,
        JSON.stringify(letter.advice || []),
        String(12 + demoLetters.indexOf(letter) * 20),
      ],
    );
  }
}

export const listMuralLetters = createServerFn({ method: "POST" }).handler(async () => {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  await seedIfEmpty(sql);
  const rows = await sql.query<MuralRow>(
    `select id, author_id, author_name, initials, title, body, excerpt, topic, color, energy,
            gender, age_group, emotion, hour, priority, paper_key, seal_key, after_mural, advice,
            posted_at::text as posted_at
     from mural_letters
     where hidden = false
     order by posted_at desc
     limit 80`,
  );
  return rows.map(rowToLetter);
});

const letterInput = z.object({
  id: z.string().min(4).max(80),
  title: z.string().max(120),
  author: z.string().max(40),
  initials: z.string().max(6),
  topic: z.string().max(60),
  excerpt: z.string().max(280),
  body: z.string().min(8).max(8000),
  color: z.string().max(20).optional(),
  gender: z.string().max(40).optional(),
  ageGroup: z.string().max(40).optional(),
  emotion: z.string().max(40).optional(),
  hour: z.number().optional(),
  priority: z.number().optional(),
  paperKey: z.string().max(40).optional(),
  sealKey: z.string().max(40).optional(),
  afterMural: z.enum(["humus", "diary"]).optional(),
});

export const publishMuralLetter = createServerFn({ method: "POST" })
  .validator(letterInput)
  .handler(async ({ data }) => {
    const { getSessionUser, UnauthorizedError } = await import("@/lib/auth/verify.server");
    const { reviewLetterText, canPublish } = await import("@/lib/refugio/letterReview");
    const user = await getSessionUser();
    if (!user) throw new UnauthorizedError();
    const review = reviewLetterText(data.body, "letter");
    if (!canPublish(review)) throw new Error(review.summary);
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const week = await sql.query<{ n: string | number }>(
      `select count(*)::int as n from mural_letters
       where author_id = $1 and posted_at > now() - interval '7 days' and hidden = false`,
      [user.id],
    );
    if (Number(week[0]?.n) >= 7) throw new Error("O mural desta semana já está cheio.");
    await sql.query(
      `insert into mural_letters
        (id, author_id, author_name, initials, title, body, excerpt, topic, color, gender, age_group, emotion, hour, priority, paper_key, seal_key, after_mural)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
       on conflict (id) do nothing`,
      [
        data.id,
        user.id,
        data.author,
        data.initials,
        data.title,
        data.body,
        data.excerpt,
        data.topic,
        data.color || "lavender",
        data.gender || null,
        data.ageGroup || null,
        data.emotion || null,
        data.hour ?? null,
        data.priority ?? 0,
        data.paperKey || null,
        data.sealKey || null,
        data.afterMural || null,
      ],
    );
    return { ok: true as const };
  });

export const energyMuralLetter = createServerFn({ method: "POST" })
  .validator(z.object({ letterId: z.string().min(3).max(80) }))
  .handler(async ({ data }) => {
    const { getSessionUser, UnauthorizedError } = await import("@/lib/auth/verify.server");
    const user = await getSessionUser();
    if (!user) throw new UnauthorizedError();
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql.query(`update mural_letters set energy = energy + 1 where id = $1 and hidden = false`, [data.letterId]);
    return { ok: true as const };
  });

export const adviseMuralLetter = createServerFn({ method: "POST" })
  .validator(
    z.object({
      letterId: z.string().min(3).max(80),
      advice: z.object({
        id: z.string(),
        author: z.string().max(40),
        body: z.string().min(4).max(2000),
        envelopeKey: z.string().optional(),
        fontKey: z.string().optional(),
      }),
    }),
  )
  .handler(async ({ data }) => {
    const { getSessionUser, UnauthorizedError } = await import("@/lib/auth/verify.server");
    const { reviewLetterText, canPublish } = await import("@/lib/refugio/letterReview");
    const user = await getSessionUser();
    if (!user) throw new UnauthorizedError();
    const review = reviewLetterText(data.advice.body, "advice");
    if (!canPublish(review)) throw new Error(review.summary);
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql.query(
      `update mural_letters
       set advice = coalesce(advice, '[]'::jsonb) || $2::jsonb
       where id = $1 and hidden = false`,
      [data.letterId, JSON.stringify([data.advice])],
    );
    return { ok: true as const };
  });

export const hideMuralLetter = createServerFn({ method: "POST" })
  .validator(z.object({ letterId: z.string().min(3).max(80) }))
  .handler(async ({ data }) => {
    const { getSessionUser, UnauthorizedError } = await import("@/lib/auth/verify.server");
    const user = await getSessionUser();
    if (!user) throw new UnauthorizedError();
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql.query(`update mural_letters set hidden = true where id = $1 and author_id = $2`, [data.letterId, user.id]);
    return { ok: true as const };
  });
