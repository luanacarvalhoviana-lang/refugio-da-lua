import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { PACTO_VERSION } from "@/lib/refugio/pacto";

const DECLARACAO = {
  pt: "Confirmo que esta música é sintética, que eu fiz, e que os direitos são meus. Não é música de outra pessoa. A responsabilidade pelo que publico, inclusive a música, é toda minha.",
  es: "Confirmo que esta música es sintética, que yo la hice, y que los derechos son míos. No es música de otra persona. La responsabilidad de lo que publico, incluso la música, es toda mía.",
} as const;

const OWNERS = new Set(["contato.refugiodalua@gmail.com", "contato@refugiodalua.com.br"]);
const MAX_TRACKS = 6;
const MAX_BYTES = 2_500_000;
const MIME = new Set(["audio/mpeg", "audio/mp3", "audio/ogg", "audio/wav", "audio/x-wav", "audio/mp4", "audio/m4a", "audio/x-m4a", "audio/aac"]);

function trackId() {
  return `t${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

function payload(audio: string) {
  const body = audio.includes(",") ? audio.slice(audio.indexOf(",") + 1) : audio;
  if (!/^[A-Za-z0-9+/=\s]+$/.test(body)) return null;
  const clean = body.replace(/\s/g, "");
  if (Math.floor((clean.length * 3) / 4) > MAX_BYTES) return null;
  return clean;
}

async function authorId() {
  const { getSessionUser } = await import("@/lib/auth/verify.server");
  const user = await getSessionUser();
  if (!user?.id) return null;
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const pact = await sql.query<{ ok: number }>(
    `select 1 as ok from pacto_acceptances where user_id = $1 and versao = $2 limit 1`,
    [user.id, PACTO_VERSION],
  );
  const profile = await sql.query<{ ok: number }>(`select 1 as ok from author_profiles where user_id = $1 limit 1`, [user.id]);
  if (!pact[0] || !profile[0]) return null;
  return { id: user.id, sql };
}

export const listAuthorTracks = createServerFn({ method: "GET" }).handler(async () => {
  const author = await authorId();
  if (!author) return [];
  return author.sql.query<{ id: string; titulo: string }>(
    `select id, titulo from author_tracks where user_id = $1 order by criado_em desc`,
    [author.id],
  );
});

export const saveAuthorTrack = createServerFn({ method: "POST" })
  .validator(z.object({
    titulo: z.string().trim().min(2).max(40),
    mime: z.string().trim().max(40),
    audio: z.string().min(32).max(3_500_000),
    direitos: z.literal(true),
    lang: z.enum(["pt", "es"]),
  }))
  .handler(async ({ data }) => {
    const author = await authorId();
    if (!author) return { ok: false as const, reason: "perfil" as const };
    if (!MIME.has(data.mime)) return { ok: false as const, reason: "tipo" as const };
    const audio = payload(data.audio);
    if (!audio) return { ok: false as const, reason: "grande" as const };
    const count = await author.sql.query<{ n: number }>(`select count(*)::int as n from author_tracks where user_id = $1`, [author.id]);
    if ((Number(count[0]?.n) || 0) >= MAX_TRACKS) return { ok: false as const, reason: "limite" as const };
    const id = trackId();
    await author.sql.query(
      `insert into author_tracks (id, user_id, titulo, mime, audio, direitos, declaracao) values ($1, $2, $3, $4, $5, true, $6)`,
      [id, author.id, data.titulo, data.mime, audio, DECLARACAO[data.lang]],
    );
    return { ok: true as const, id, titulo: data.titulo };
  });

export const removeAuthorTrack = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().regex(/^t[a-f0-9]{12}$/) }))
  .handler(async ({ data }) => {
    const author = await authorId();
    if (!author) return { ok: false as const, reason: "perfil" as const };
    await author.sql.query(`update scenes set musica = null where musica = $1 and story_id in (select id from stories where autora_id = $2)`, [data.id, author.id]);
    await author.sql.query(`delete from author_tracks where id = $1 and user_id = $2`, [data.id, author.id]);
    return { ok: true as const };
  });

export async function readPublicTrack(id: string, user?: { id?: string; email?: string | null }) {
  if (!/^t[a-f0-9]{12}$/.test(id)) return null;
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql.query<{ mime: string; audio: string; user_id: string; status: string }>(
    `select mime, audio, user_id, status from author_tracks where id = $1 limit 1`,
    [id],
  );
  const track = rows[0];
  if (!track || track.status === "removida") return null;
  const email = user?.email?.trim().toLowerCase() || "";
  if (OWNERS.has(email)) return track;
  if (user?.id && track.user_id === user.id) return track;
  if (track.status !== "ativa") return null;
  const published = await sql.query<{ ok: number }>(
    `select 1 as ok from scenes s
     join stories st on st.id = s.story_id
     where s.musica = $1 and st.status = 'publicada'
     limit 1`,
    [id],
  );
  if (!published[0]) return null;
  return track;
}

export const reportTrack = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().regex(/^t[a-f0-9]{12}$/) }))
  .handler(async ({ data }) => {
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const user = await getSessionUser();
    if (!user?.id) return { ok: false as const, reason: "conta" as const };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const pact = await sql.query<{ ok: number }>(
      `select 1 as ok from pacto_acceptances where user_id = $1 and versao = $2 limit 1`,
      [user.id, PACTO_VERSION],
    );
    if (!pact[0]) return { ok: false as const, reason: "pacto" as const };
    await sql.query(
      `insert into track_reports (track_id, user_id) values ($1, $2) on conflict do nothing`,
      [data.id, user.id],
    );
    const rows = await sql.query<{ n: number }>(`select count(*)::int as n from track_reports where track_id = $1`, [data.id]);
    if (Number(rows[0]?.n) >= 3) {
      await sql.query(`update author_tracks set status = 'oculto' where id = $1 and status = 'ativa'`, [data.id]);
    }
    return { ok: true as const };
  });

export const moderateTracks = createServerFn({ method: "GET" }).handler(async () => {
  const { getSessionUser } = await import("@/lib/auth/verify.server");
  const user = await getSessionUser();
  const email = user?.email?.trim().toLowerCase() || "";
  if (!OWNERS.has(email)) return { allowed: false as const, tracks: [] };
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const tracks = await sql.query<{ id: string; titulo: string; declaracao: string | null; criado_em: string; status: string; email: string | null; reports: number }>(
    `select t.id, t.titulo, t.declaracao, t.criado_em, t.status, u.email, count(r.user_id)::int as reports
     from author_tracks t
     join track_reports r on r.track_id = t.id
     left join "user" u on u.id = t.user_id
     where t.status <> 'removida'
     group by t.id, u.email
     order by count(r.user_id) desc, t.criado_em desc
     limit 40`,
    [],
  );
  return { allowed: true as const, tracks };
});

export const decideTrack = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().regex(/^t[a-f0-9]{12}$/), keep: z.boolean() }))
  .handler(async ({ data }) => {
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const user = await getSessionUser();
    const email = user?.email?.trim().toLowerCase() || "";
    if (!OWNERS.has(email)) return { ok: false as const };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    if (data.keep) {
      await sql.query(`update author_tracks set status = 'ativa' where id = $1`, [data.id]);
      await sql.query(`delete from track_reports where track_id = $1`, [data.id]);
      return { ok: true as const };
    }
    await sql.query(`update scenes set musica = null where musica = $1`, [data.id]);
    await sql.query(`delete from track_reports where track_id = $1`, [data.id]);
    await sql.query(`delete from author_tracks where id = $1`, [data.id]);
    return { ok: true as const };
  });
