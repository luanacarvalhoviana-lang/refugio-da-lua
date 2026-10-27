import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { PACTO_VERSION } from "@/lib/refugio/pacto";

const OWNERS = new Set(["contato.refugiodalua@gmail.com", "contato@refugiodalua.com.br"]);
const lang = z.enum(["pt", "es", "en"]);

const sceneInput = z.object({
  slug: z.string().trim().min(2).max(80),
  lang,
  sceneId: z.string().trim().min(1).max(40),
});

const tallyInput = sceneInput.extend({
  choiceId: z.string().trim().min(1).max(40),
  readerKey: z.string().trim().min(8).max(80),
});

async function sessionUser() {
  const { getSessionUser } = await import("@/lib/auth/verify.server");
  return getSessionUser();
}

async function requireOwner() {
  const user = await sessionUser();
  const email = user?.email?.trim().toLowerCase() || "";
  if (!user?.id || !OWNERS.has(email)) return null;
  return user;
}

function percentFor(rows: Array<{ choice_id: string; total: number }>, choiceId: string) {
  let total = 0;
  let mine = 0;
  for (const row of rows) {
    const n = Number(row.total) || 0;
    total += n;
    if (row.choice_id === choiceId) mine = n;
  }
  if (total < 10) return { total, percent: null as number | null };
  return { total, percent: Math.round((mine / total) * 100) };
}

export const tallyChoice = createServerFn({ method: "POST" })
  .validator(tallyInput)
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const user = await sessionUser();
    const voter = user?.id ? `user:${user.id}` : `anon:${data.readerKey}`;
    const previous = await sql.query<{ choice_id: string }>(
      `select choice_id from choice_voters
       where story_slug = $1 and lang = $2 and scene_id = $3 and voter = $4`,
      [data.slug, data.lang, data.sceneId, voter],
    );
    const old = previous[0]?.choice_id;
    if (old && old !== data.choiceId) {
      await sql.query(
        `update choice_stats set total = greatest(total - 1, 0)
         where story_slug = $1 and lang = $2 and scene_id = $3 and choice_id = $4`,
        [data.slug, data.lang, data.sceneId, old],
      );
    }
    if (old !== data.choiceId) {
      await sql.query(
        `insert into choice_voters (story_slug, lang, scene_id, voter, choice_id)
         values ($1, $2, $3, $4, $5)
         on conflict (story_slug, lang, scene_id, voter)
         do update set choice_id = excluded.choice_id`,
        [data.slug, data.lang, data.sceneId, voter, data.choiceId],
      );
      await sql.query(
        `insert into choice_stats (story_slug, lang, scene_id, choice_id, total)
         values ($1, $2, $3, $4, 1)
         on conflict (story_slug, lang, scene_id, choice_id)
         do update set total = choice_stats.total + 1`,
        [data.slug, data.lang, data.sceneId, data.choiceId],
      );
    }
    const rows = await sql.query<{ choice_id: string; total: number }>(
      `select choice_id, total from choice_stats
       where story_slug = $1 and lang = $2 and scene_id = $3`,
      [data.slug, data.lang, data.sceneId],
    );
    return percentFor(rows, data.choiceId);
  });

export const listComments = createServerFn({ method: "POST" })
  .validator(sceneInput)
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const user = await sessionUser();
    const rows = await sql.query<{
      id: string;
      user_id: string;
      texto: string;
      criado_em: string;
      spoiler: boolean;
      plan: string | null;
    }>(
      `select c.id, c.user_id, c.texto, c.criado_em, c.spoiler, s.plan
       from comments c
       left join subscriptions s on s.user_id = c.user_id
         and s.status in ('active', 'trialing')
         and (s.current_period_end is null or s.current_period_end > now())
       where c.story_slug = $1 and c.lang = $2 and c.scene_id = $3 and c.status = 'visivel'
       order by c.criado_em desc
       limit 40`,
      [data.slug, data.lang, data.sceneId],
    );
    return {
      mine: user?.id ?? null,
      comments: rows.map((row) => ({
        id: row.id,
        texto: row.texto,
        at: row.criado_em,
        spoiler: Boolean(row.spoiler),
        mine: user?.id === row.user_id,
        plan: row.plan === "constelacao" || row.plan === "lua_cheia" ? row.plan : "",
      })),
    };
  });

export const addComment = createServerFn({ method: "POST" })
  .validator(sceneInput.extend({
    texto: z.string().trim().min(2).max(500),
    spoiler: z.boolean(),
  }))
  .handler(async ({ data }) => {
    const { randomUUID } = await import("node:crypto");
    const { getSql } = await import("@/lib/db");
    const user = await sessionUser();
    if (!user?.id) return { ok: false as const, reason: "conta" as const };
    const sql = await getSql();
    const pact = await sql.query<{ ok: number }>(
      `select 1 as ok from pacto_acceptances where user_id = $1 and versao = $2 limit 1`,
      [user.id, PACTO_VERSION],
    );
    if (!pact[0]) return { ok: false as const, reason: "pacto" as const };
    await sql.query(
      `insert into comments (id, story_slug, lang, scene_id, user_id, texto, spoiler)
       values ($1, $2, $3, $4, $5, $6, $7)`,
      [randomUUID(), data.slug, data.lang, data.sceneId, user.id, data.texto, data.spoiler],
    );
    return { ok: true as const };
  });

export const reportComment = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const user = await sessionUser();
    if (!user?.id) return { ok: false as const };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql.query(
      `insert into comment_reports (comment_id, user_id) values ($1, $2)
       on conflict do nothing`,
      [data.id, user.id],
    );
    const rows = await sql.query<{ n: number }>(
      `select count(*)::int as n from comment_reports where comment_id = $1`,
      [data.id],
    );
    if (Number(rows[0]?.n) >= 3) {
      await sql.query(`update comments set status = 'oculto' where id = $1 and status = 'visivel'`, [data.id]);
    }
    return { ok: true as const };
  });

export const deleteComment = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const user = await sessionUser();
    if (!user?.id) return { ok: false as const };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const saved = await sql.query<{ id: string }>(
      `update comments set status = 'removido' where id = $1 and user_id = $2 and status <> 'removido' returning id`,
      [data.id, user.id],
    );
    return { ok: saved.length > 0 };
  });

export const moderateComments = createServerFn({ method: "GET" })
  .handler(async () => {
    const owner = await requireOwner();
    if (!owner) return { allowed: false as const, comments: [] };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql.query<{
      id: string;
      story_slug: string;
      lang: string;
      scene_id: string;
      texto: string;
      status: string;
      reports: number;
    }>(
      `select c.id, c.story_slug, c.lang, c.scene_id, c.texto, c.status, count(r.user_id)::int as reports
       from comments c
       left join comment_reports r on r.comment_id = c.id
       where c.status = 'oculto'
       group by c.id
       order by c.criado_em desc
       limit 80`,
    );
    return { allowed: true as const, comments: rows };
  });

export const decideComment = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid(), status: z.enum(["visivel", "removido"]) }))
  .handler(async ({ data }) => {
    const owner = await requireOwner();
    if (!owner) return { ok: false as const };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql.query(`update comments set status = $2 where id = $1`, [data.id, data.status]);
    return { ok: true as const };
  });
