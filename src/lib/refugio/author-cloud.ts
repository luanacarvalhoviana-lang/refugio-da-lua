import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authorSlug } from "@/lib/refugio/stories";

const OWNERS = new Set(["contato.refugiodalua@gmail.com", "contato@refugiodalua.com.br"]);
const HOUSE_SLUG = "luana-viana";

const house = {
  nome: "Luana Viana",
  slug: HOUSE_SLUG,
  bio: "Escreve as histórias da casa. Romance e mistério entre mulheres, de noite.",
  foto: "/icons/logo-day.png",
  idioma: "pt" as const,
  fundadora: true,
  userId: "casa:luana-viana",
};

type ProfileRow = {
  user_id: string | null;
  nome_publico: string;
  slug: string;
  bio: string;
  foto: string | null;
  idioma: "pt" | "es" | "en";
  selo_fundadora: boolean;
};

function shape(row: ProfileRow, followers: number, following: boolean) {
  return {
    nome: row.nome_publico,
    slug: row.slug,
    bio: row.bio,
    foto: row.foto || house.foto,
    idioma: row.idioma,
    fundadora: row.selo_fundadora,
    userId: row.user_id,
    followers,
    following,
  };
}

async function sessionUser() {
  const { getSessionUser } = await import("@/lib/auth/verify.server");
  return getSessionUser();
}

function photoOk(foto: string | null) {
  if (!foto) return true;
  if (foto.startsWith("/icons/") || foto.startsWith("/mascot/")) return foto.length < 200;
  if (!foto.startsWith("data:image/")) return false;
  if (foto.length > 2_800_000) return false;
  return true;
}

export const loadAuthor = createServerFn({ method: "POST" })
  .validator(z.object({ slug: z.string().trim().min(2).max(60) }))
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const user = await sessionUser();
    const rows = await sql.query<ProfileRow>(
      `select user_id, nome_publico, slug, bio, foto, idioma, selo_fundadora
       from author_profiles where slug = $1 limit 1`,
      [data.slug],
    );
    const row = rows[0] ?? (data.slug === HOUSE_SLUG ? {
      user_id: house.userId,
      nome_publico: house.nome,
      slug: house.slug,
      bio: house.bio,
      foto: house.foto,
      idioma: house.idioma,
      selo_fundadora: true,
    } : null);
    if (!row) return { found: false as const };
    const count = await sql.query<{ n: number }>(
      `select count(*)::int as n from follows where autora_id = $1`,
      [row.slug],
    );
    const mine = user?.id
      ? await sql.query<{ ok: number }>(
          `select 1 as ok from follows where seguidora_id = $1 and autora_id = $2 limit 1`,
          [user.id, row.slug],
        )
      : [];
    return { found: true as const, profile: shape(row, Number(count[0]?.n) || 0, mine.length > 0) };
  });

export const toggleFollow = createServerFn({ method: "POST" })
  .validator(z.object({ slug: z.string().trim().min(2).max(60) }))
  .handler(async ({ data }) => {
    const user = await sessionUser();
    if (!user?.id) return { ok: false as const, reason: "conta" as const };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql.query<{ user_id: string | null }>(
      `select user_id from author_profiles where slug = $1 limit 1`,
      [data.slug],
    );
    const authorId = rows[0]?.user_id ?? (data.slug === HOUSE_SLUG ? house.userId : null);
    if (!authorId) return { ok: false as const, reason: "sumiu" as const };
    if (authorId === user.id) return { ok: false as const, reason: "self" as const };
    const existing = await sql.query<{ ok: number }>(
      `select 1 as ok from follows where seguidora_id = $1 and autora_id = $2 limit 1`,
      [user.id, data.slug],
    );
    if (existing[0]) {
      await sql.query(`delete from follows where seguidora_id = $1 and autora_id = $2`, [user.id, data.slug]);
    } else {
      await sql.query(`insert into follows (seguidora_id, autora_id) values ($1, $2)`, [user.id, data.slug]);
    }
    const count = await sql.query<{ n: number }>(
      `select count(*)::int as n from follows where autora_id = $1`,
      [data.slug],
    );
    return { ok: true as const, following: !existing[0], followers: Number(count[0]?.n) || 0 };
  });

export const saveAuthorProfile = createServerFn({ method: "POST" })
  .validator(z.object({
    nome: z.string().trim().min(2).max(40),
    bio: z.string().trim().max(300),
    foto: z.string().max(2_800_000).nullable(),
    idioma: z.enum(["pt", "es", "en"]),
  }))
  .handler(async ({ data }) => {
    if (!photoOk(data.foto)) return { ok: false as const, reason: "foto" as const };
    const user = await sessionUser();
    if (!user?.id) return { ok: false as const, reason: "conta" as const };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const email = user.email?.trim().toLowerCase() || "";
    const mine = await sql.query<ProfileRow>(
      `select user_id, nome_publico, slug, bio, foto, idioma, selo_fundadora
       from author_profiles where user_id = $1 limit 1`,
      [user.id],
    );
    let current = mine[0];
    if (!current && OWNERS.has(email)) {
      const houseRow = await sql.query<ProfileRow>(
        `select user_id, nome_publico, slug, bio, foto, idioma, selo_fundadora
         from author_profiles where slug = $1 limit 1`,
        [HOUSE_SLUG],
      );
      current = houseRow[0];
    }
    if (current) {
      await sql.query(
        `update author_profiles
         set user_id = $1, nome_publico = $2, bio = $3, foto = $4, idioma = $5
         where slug = $6`,
        [user.id, data.nome, data.bio, data.foto, data.idioma, current.slug],
      );
      return { ok: true as const, slug: current.slug };
    }
    const slug = authorSlug(data.nome);
    if (slug.length < 2) return { ok: false as const, reason: "nome" as const };
    const taken = await sql.query<{ slug: string }>(`select slug from author_profiles where slug = $1`, [slug]);
    if (taken[0]) return { ok: false as const, reason: "nome" as const };
    await sql.query(
      `insert into author_profiles (user_id, nome_publico, slug, bio, foto, idioma, selo_fundadora)
       values ($1, $2, $3, $4, $5, $6, false)`,
      [user.id, data.nome, slug, data.bio, data.foto, data.idioma],
    );
    return { ok: true as const, slug };
  });

export const myAuthorProfile = createServerFn({ method: "GET" })
  .handler(async () => {
    const user = await sessionUser();
    if (!user?.id) return { profile: null };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const email = user.email?.trim().toLowerCase() || "";
    const rows = await sql.query<ProfileRow>(
      `select user_id, nome_publico, slug, bio, foto, idioma, selo_fundadora
       from author_profiles where user_id = $1 limit 1`,
      [user.id],
    );
    let row = rows[0];
    if (!row && OWNERS.has(email)) {
      const houseRow = await sql.query<ProfileRow>(
        `select user_id, nome_publico, slug, bio, foto, idioma, selo_fundadora
         from author_profiles where slug = $1 limit 1`,
        [HOUSE_SLUG],
      );
      row = houseRow[0];
    }
    if (!row) return { profile: null };
    return {
      profile: {
        nome: row.nome_publico,
        slug: row.slug,
        bio: row.bio,
        foto: row.foto,
        idioma: row.idioma,
      },
    };
  });
