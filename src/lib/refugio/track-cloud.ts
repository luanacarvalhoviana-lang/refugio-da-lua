import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { PACTO_VERSION } from "@/lib/refugio/pacto";

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
      `insert into author_tracks (id, user_id, titulo, mime, audio, direitos) values ($1, $2, $3, $4, $5, true)`,
      [id, author.id, data.titulo, data.mime, audio],
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

export async function readPublicTrack(id: string, userId?: string) {
  if (!/^t[a-f0-9]{12}$/.test(id)) return null;
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql.query<{ mime: string; audio: string; user_id: string }>(
    `select mime, audio, user_id from author_tracks where id = $1 limit 1`,
    [id],
  );
  const track = rows[0];
  if (!track) return null;
  if (userId && track.user_id === userId) return track;
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
