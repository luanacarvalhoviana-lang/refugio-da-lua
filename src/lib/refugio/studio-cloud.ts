import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { PACTO_VERSION } from "@/lib/refugio/pacto";
import { FREE_PUBLISHED_STORIES } from "@/lib/refugio/studio-limits";
import { ACTIVE_PASS_SQL } from "@/lib/refugio/story-plans";
import { checkStory, type StudioScene } from "@/lib/refugio/studio-check";
import type { Story } from "@/lib/refugio/stories";

const OWNERS = new Set(["contato.refugiodalua@gmail.com", "contato@refugiodalua.com.br"]);
const RESERVED = new Set(["o-bilhete", "a-chave", "a-mare"]);
const lang = z.enum(["pt", "es"]);

const choiceSchema = z.object({
  id: z.string().trim().min(2).max(40),
  texto: z.string().trim().max(200),
  vai: z.string().trim().max(40),
  afinidade: z.number().int().min(-1).max(2),
  pista: z.string().trim().max(80),
  diario: z.string().trim().max(280).optional().default(""),
});

const sceneSchema = z.object({
  id: z.string().trim().min(2).max(40),
  quem: z.string().trim().max(40),
  texto: z.string().trim().max(4000),
  musica: z.string().trim().max(20),
  final: z.boolean(),
  endingTitle: z.string().trim().max(80),
  endingBody: z.string().trim().max(2000),
  flower: z.string().trim().max(80),
  carta: z.string().trim().max(600).optional().default(""),
  cartaDe: z.string().trim().max(40).optional().default(""),
  choices: z.array(choiceSchema).max(3),
});

async function sessionUser() {
  const { getSessionUser } = await import("@/lib/auth/verify.server");
  return getSessionUser();
}

function slugFrom(title: string) {
  const base = title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 36);
  return `${base || "historia"}-${crypto.randomUUID().slice(0, 4)}`;
}

function minutesOf(scenes: StudioScene[]) {
  const words = scenes.reduce((sum, scene) => sum + scene.texto.split(/\s+/).filter(Boolean).length, 0);
  return Math.max(3, Math.min(40, Math.round(words / 160) || 3));
}

type StoryRow = {
  id: string;
  autora_id: string;
  slug: string;
  titulo: string;
  sinopse: string;
  idioma: "pt" | "es";
  classificacao: "livre" | "14" | "16";
  generos: string;
  lugar: string;
  som: string | null;
  status: string;
  motivo: string | null;
};

async function authorName(sql: { query: <T>(q: string, p?: unknown[]) => Promise<T[]> }, autoraId: string) {
  const rows = await sql.query<{ nome_publico: string }>(
    `select nome_publico from author_profiles where user_id = $1 limit 1`,
    [autoraId],
  );
  return rows[0]?.nome_publico || "Autora";
}

async function scenesOf(sql: { query: <T>(q: string, p?: unknown[]) => Promise<T[]> }, storyId: string): Promise<StudioScene[]> {
  const scenes = await sql.query<{ id: string; quem_fala: string | null; texto: string; musica: string | null; ordem: number }>(
    `select id, quem_fala, texto, musica, ordem from scenes where story_id = $1 order by ordem`,
    [storyId],
  );
  const endings = await sql.query<{ scene_id: string; titulo: string; texto: string; flor: string; carta: string | null; carta_de: string | null }>(
    `select scene_id, titulo, texto, flor, carta, carta_de from endings where story_id = $1`,
    [storyId],
  );
  const choices = await sql.query<{ id: string; scene_id: string; texto: string; vai_para_cena: string | null; afinidade: number; pista: string | null; diario: string | null; ordem: number }>(
    `select c.id, c.scene_id, c.texto, c.vai_para_cena, c.afinidade, c.pista, c.diario, c.ordem
     from choices c
     join scenes s on s.id = c.scene_id
     where s.story_id = $1
     order by c.ordem`,
    [storyId],
  );
  const endingByScene = new Map(endings.map((ending) => [ending.scene_id, ending]));
  return scenes.map((scene) => {
    const ending = endingByScene.get(scene.id);
    return {
      id: scene.id,
      quem: scene.quem_fala || "",
      texto: scene.texto,
      musica: scene.musica || "",
      final: Boolean(ending),
      endingTitle: ending?.titulo || "",
      endingBody: ending?.texto || "",
      flower: ending?.flor || "",
      carta: ending?.carta || "",
      cartaDe: ending?.carta_de || "",
      choices: ending
        ? []
        : choices
            .filter((choice) => choice.scene_id === scene.id)
            .map((choice) => ({
              id: choice.id,
              texto: choice.texto,
              vai: choice.vai_para_cena || "",
              afinidade: choice.afinidade,
              pista: choice.pista || "",
              diario: choice.diario || "",
            })),
    };
  });
}

function toStory(row: StoryRow, author: string, scenes: StudioScene[]): Story {
  return {
    slug: row.slug,
    title: row.titulo,
    author,
    rating: row.classificacao,
    genres: row.generos.split(",").map((item) => item.trim()).filter(Boolean),
    minutes: minutesOf(scenes),
    synopsis: row.sinopse,
    place: row.lugar,
    start: scenes[0]?.id || "inicio",
    sound: row.som || undefined,
    scenes: scenes.map((scene) => ({
      id: scene.id,
      speaker: scene.quem || undefined,
      body: scene.final ? undefined : scene.texto,
      music: scene.musica || undefined,
      choices: scene.final
        ? undefined
        : scene.choices.map((choice) => ({
            id: choice.id,
            label: choice.texto,
            to: choice.vai,
            affinity: choice.afinidade,
            clue: choice.pista || undefined,
            thought: choice.diario || undefined,
          })),
      ending: scene.final
        ? {
            key: scene.id,
            title: scene.endingTitle,
            body: scene.endingBody,
            flower: scene.flower,
            letter: scene.carta.trim() ? { from: scene.cartaDe || author, text: scene.carta } : undefined,
          }
        : undefined,
    })),
  };
}

async function gate(sql: { query: <T>(q: string, p?: unknown[]) => Promise<T[]> }, userId: string) {
  const pact = await sql.query<{ ok: number }>(
    `select 1 as ok from pacto_acceptances where user_id = $1 and versao = $2 limit 1`,
    [userId, PACTO_VERSION],
  );
  if (!pact[0]) return null;
  const profile = await sql.query<{ slug: string; nome_publico: string }>(
    `select slug, nome_publico from author_profiles where user_id = $1 limit 1`,
    [userId],
  );
  return profile[0] ?? null;
}

export const studioAccess = createServerFn({ method: "GET" })
  .handler(async () => {
    const user = await sessionUser();
    if (!user?.id) return { ok: false as const, reason: "conta" as const };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const profile = await gate(sql, user.id);
    if (!profile) {
      const pact = await sql.query<{ ok: number }>(
        `select 1 as ok from pacto_acceptances where user_id = $1 and versao = $2 limit 1`,
        [user.id, PACTO_VERSION],
      );
      return { ok: false as const, reason: pact[0] ? ("perfil" as const) : ("pacto" as const) };
    }
    const published = await sql.query<{ n: number }>(
      `select count(*)::int as n from stories where autora_id = $1 and status = 'publicada'`,
      [user.id],
    );
    const { getUserPlan } = await import("@/lib/refugio/plan-cloud");
    const { hasBenefit } = await import("@/lib/refugio/plan-benefits");
    const plan = await getUserPlan(user.id);
    const unlimited = hasBenefit(plan, "unlimited_stories");
    return {
      ok: true as const,
      nome: profile.nome_publico,
      published: Number(published[0]?.n) || 0,
      limit: unlimited ? null : FREE_PUBLISHED_STORIES,
      plan,
    };
  });

export const authorSky = createServerFn({ method: "GET" }).handler(async () => {
  const user = await sessionUser();
  if (!user?.id) return { ok: false as const };
  const { getUserPlan } = await import("@/lib/refugio/plan-cloud");
  const { hasBenefit } = await import("@/lib/refugio/plan-benefits");
  if (!hasBenefit(await getUserPlan(user.id), "author_stats")) return { ok: false as const };
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const profile = await gate(sql, user.id);
  if (!profile) return { ok: false as const };
  const readers = await sql.query<{ n: number }>(
    `select count(*)::int as n from reader_progress where story_slug in (select slug from stories where autora_id = $1)`,
    [user.id],
  );
  const tips = await sql.query<{ n: number }>(
    `select count(*)::int as n from tips where author_slug = $1 and status = 'paid'`,
    [profile.slug],
  );
  return { ok: true as const, readers: Number(readers[0]?.n) || 0, tips: Number(tips[0]?.n) || 0 };
});

export const featuredAuthors = createServerFn({ method: "GET" }).handler(async () => {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  return sql.query<{ slug: string; nome: string }>(
    `select p.slug, p.nome_publico as nome from author_profiles p
     join subscriptions s on s.user_id = p.user_id
     where s.plan = 'constelacao' and s.status in ('active', 'trialing')
       and (s.current_period_end is null or s.current_period_end > now())
     order by s.updated_at desc limit 6`,
  );
});

export const listMyStories = createServerFn({ method: "GET" })
  .handler(async () => {
    const user = await sessionUser();
    if (!user?.id) return [];
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    return sql.query<{ id: string; slug: string; titulo: string; status: string; motivo: string | null }>(
      `select id, slug, titulo, status, motivo from stories where autora_id = $1 order by criada_em desc`,
      [user.id],
    );
  });

export const createStudioStory = createServerFn({ method: "POST" })
  .validator(z.object({
    titulo: z.string().trim().min(2).max(80),
    sinopse: z.string().trim().min(8).max(400),
    classificacao: z.enum(["livre", "14", "16"]),
    generos: z.string().trim().max(80),
    lugar: z.string().trim().min(2).max(60),
    idioma: lang,
  }))
  .handler(async ({ data }) => {
    const user = await sessionUser();
    if (!user?.id) return { ok: false as const, reason: "conta" as const };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    if (!(await gate(sql, user.id))) return { ok: false as const, reason: "perfil" as const };
    let slug = slugFrom(data.titulo);
    if (RESERVED.has(slug)) slug = `${slug}-2`;
    const id = crypto.randomUUID();
    await sql.query(
      `insert into stories (id, autora_id, slug, titulo, sinopse, idioma, classificacao, generos, lugar, status)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'rascunho')`,
      [id, user.id, slug, data.titulo, data.sinopse, data.idioma, data.classificacao, data.generos, data.lugar],
    );
    const sceneId = crypto.randomUUID();
    await sql.query(
      `insert into scenes (id, story_id, ordem, texto) values ($1, $2, 0, '')`,
      [sceneId, id],
    );
    return { ok: true as const, id, slug };
  });

export const loadStudioDraft = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const user = await sessionUser();
    if (!user?.id) return { ok: false as const };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql.query<StoryRow>(`select * from stories where id = $1 and autora_id = $2 limit 1`, [data.id, user.id]);
    const row = rows[0];
    if (!row) return { ok: false as const };
    return {
      ok: true as const,
      story: {
        id: row.id,
        slug: row.slug,
        titulo: row.titulo,
        sinopse: row.sinopse,
        classificacao: row.classificacao,
        generos: row.generos,
        lugar: row.lugar,
        status: row.status,
        motivo: row.motivo,
      },
      scenes: await scenesOf(sql, row.id),
    };
  });

export const saveStudioDraft = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid(), scenes: z.array(sceneSchema).min(1).max(24) }))
  .handler(async ({ data }) => {
    const user = await sessionUser();
    if (!user?.id) return { ok: false as const, reason: "conta" as const };
    const issues = checkStory(data.scenes);
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const owned = await sql.query<{ status: string }>(
      `select status from stories where id = $1 and autora_id = $2 limit 1`,
      [data.id, user.id],
    );
    if (!owned[0] || owned[0].status === "publicada") return { ok: false as const, reason: "sumiu" as const };
    const ownTracks = new Set(
      (await sql.query<{ id: string }>(`select id from author_tracks where user_id = $1`, [user.id])).map((row) => row.id),
    );
    for (const scene of data.scenes) {
      if (scene.musica.startsWith("t") && !ownTracks.has(scene.musica)) scene.musica = "";
    }
    const { storyBillingLocks } = await import("@/lib/refugio/studio-limits");
    if (storyBillingLocks()) {
      const premiumMusic = data.scenes.some((scene) => scene.musica === "templo" || scene.musica === "luar");
      const place = await sql.query<{ lugar: string }>(`select lugar from stories where id = $1 limit 1`, [data.id]);
      const premiumPlace = /templ|varanda|balc/i.test(place[0]?.lugar || "");
      if (premiumMusic || premiumPlace) {
        const pass = await sql.query<{ plan: string }>(ACTIVE_PASS_SQL, [user.id]);
        const pack = await sql.query<{ id: string }>(
          `select id from story_purchases where user_id = $1 and item = 'pack-noite' and status = 'paid' limit 1`,
          [user.id],
        );
        if (pass[0]?.plan !== "constelacao" && !pack[0]) return { ok: false as const, reason: "plano" as const };
      }
    }
    const ids = data.scenes.map((scene) => scene.id);
    if (new Set(ids).size !== ids.length) return { ok: false as const, reason: "cena" as const };
    await sql.query(`delete from choices where scene_id in (select id from scenes where story_id = $1)`, [data.id]);
    await sql.query(`delete from endings where story_id = $1`, [data.id]);
    await sql.query(`delete from scenes where story_id = $1`, [data.id]);
    for (let index = 0; index < data.scenes.length; index += 1) {
      const scene = data.scenes[index];
      await sql.query(
        `insert into scenes (id, story_id, ordem, quem_fala, texto, musica) values ($1, $2, $3, $4, $5, $6)`,
        [scene.id, data.id, index, scene.quem || null, scene.final ? scene.endingBody : scene.texto, scene.musica || null],
      );
      if (scene.final) {
        await sql.query(
          `insert into endings (id, story_id, scene_id, titulo, texto, flor, carta, carta_de) values ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [crypto.randomUUID(), data.id, scene.id, scene.endingTitle, scene.endingBody, scene.flower, scene.carta || null, scene.cartaDe || null],
        );
      } else {
        for (let choiceIndex = 0; choiceIndex < scene.choices.length; choiceIndex += 1) {
          const choice = scene.choices[choiceIndex];
          await sql.query(
            `insert into choices (id, scene_id, texto, vai_para_cena, afinidade, pista, diario, ordem)
             values ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [choice.id, scene.id, choice.texto, choice.vai, choice.afinidade, choice.pista || null, choice.diario || null, choiceIndex],
          );
        }
      }
    }
    if (owned[0].status === "recusada") {
      await sql.query(`update stories set status = 'rascunho', motivo = null where id = $1`, [data.id]);
    }
    return { ok: true as const, issues };
  });

export const submitStudioStory = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid(), original: z.literal(true) }))
  .handler(async ({ data }) => {
    const user = await sessionUser();
    if (!user?.id) return { ok: false as const, reason: "conta" as const };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const owned = await sql.query<{ id: string }>(
      `select id from stories where id = $1 and autora_id = $2 limit 1`,
      [data.id, user.id],
    );
    if (!owned[0]) return { ok: false as const, reason: "sumiu" as const };
    const scenes = await scenesOf(sql, data.id);
    const issues = checkStory(scenes);
    if (issues.length) return { ok: false as const, reason: "verificar" as const, issues };
    await sql.query(`update stories set status = 'em_revisao', motivo = null where id = $1`, [data.id]);
    return { ok: true as const };
  });

export const listPublishedStories = createServerFn({ method: "POST" })
  .validator(z.object({ lang }))
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql.query<StoryRow>(
      `select * from stories where idioma = $1 and status = 'publicada' order by criada_em desc limit 24`,
      [data.lang],
    );
    const stories: Story[] = [];
    for (const row of rows) {
      const scenes = await scenesOf(sql, row.id);
      if (!scenes.length) continue;
      stories.push(toStory(row, await authorName(sql, row.autora_id), scenes));
    }
    return stories;
  });

export const loadStudioStory = createServerFn({ method: "POST" })
  .validator(z.object({ slug: z.string().trim().min(2).max(48), lang }))
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql.query<StoryRow>(
      `select * from stories where slug = $1 and idioma = $2 limit 1`,
      [data.slug, data.lang],
    );
    const row = rows[0];
    if (!row) return { story: null };
    const user = await sessionUser();
    const email = user?.email?.trim().toLowerCase() || "";
    const allowed = row.status === "publicada" || user?.id === row.autora_id || OWNERS.has(email);
    if (!allowed) return { story: null };
    const scenes = await scenesOf(sql, row.id);
    if (!scenes.length) return { story: null };
    return { story: toStory(row, await authorName(sql, row.autora_id), scenes) };
  });

export const reviewStories = createServerFn({ method: "GET" })
  .handler(async () => {
    const user = await sessionUser();
    const email = user?.email?.trim().toLowerCase() || "";
    if (!user?.id || !OWNERS.has(email)) return { allowed: false as const, stories: [] };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql.query<StoryRow>(
      `select * from stories where status = 'em_revisao' order by criada_em`,
    );
    const stories = [];
    for (const row of rows) {
      stories.push({
        id: row.id,
        slug: row.slug,
        titulo: row.titulo,
        sinopse: row.sinopse,
        autora: await authorName(sql, row.autora_id),
      });
    }
    return { allowed: true as const, stories };
  });

export const decideStory = createServerFn({ method: "POST" })
  .validator(z.object({
    id: z.string().uuid(),
    status: z.enum(["publicada", "recusada"]),
    motivo: z.string().trim().max(300).optional(),
  }))
  .handler(async ({ data }) => {
    const user = await sessionUser();
    const email = user?.email?.trim().toLowerCase() || "";
    if (!user?.id || !OWNERS.has(email)) return { ok: false as const, reason: "porta" as const };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql.query<{ autora_id: string }>(`select autora_id from stories where id = $1 limit 1`, [data.id]);
    if (!rows[0]) return { ok: false as const, reason: "sumiu" as const };
    if (data.status === "publicada") {
      const { getUserPlan } = await import("@/lib/refugio/plan-cloud");
      const { hasBenefit } = await import("@/lib/refugio/plan-benefits");
      const unlimited = hasBenefit(await getUserPlan(rows[0].autora_id), "unlimited_stories");
      const count = await sql.query<{ n: number }>(
        `select count(*)::int as n from stories where autora_id = $1 and status = 'publicada' and id <> $2`,
        [rows[0].autora_id, data.id],
      );
      if (!unlimited && (Number(count[0]?.n) || 0) >= FREE_PUBLISHED_STORIES) return { ok: false as const, reason: "limite" as const };
      await sql.query(`update stories set status = 'publicada', motivo = null where id = $1`, [data.id]);
      return { ok: true as const };
    }
    if (!data.motivo) return { ok: false as const, reason: "motivo" as const };
    await sql.query(`update stories set status = 'recusada', motivo = $2 where id = $1`, [data.id, data.motivo]);
    return { ok: true as const };
  });

const HOUSE = ["o-bilhete", "a-chave", "a-mare"];

export const authorChoiceStats = createServerFn({ method: "POST" })
  .validator(z.object({ slug: z.string().trim().min(2).max(48), lang }))
  .handler(async ({ data }) => {
    const user = await sessionUser();
    if (!user?.id) return { ok: false as const, scenes: [] as Array<{ sceneId: string; total: number; ready: boolean; choices: Array<{ choiceId: string; total: number; percent: number }> }> };
    const email = user.email?.trim().toLowerCase() || "";
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const owned = await sql.query<{ id: string }>(
      `select id from stories where slug = $1 and autora_id = $2 limit 1`,
      [data.slug, user.id],
    );
    if (!owned[0] && !(HOUSE.includes(data.slug) && OWNERS.has(email))) return { ok: false as const, scenes: [] };
    const rows = await sql.query<{ scene_id: string; choice_id: string; total: number }>(
      `select scene_id, choice_id, total from choice_stats where story_slug = $1 and lang = $2`,
      [data.slug, data.lang],
    );
    const byScene = new Map<string, Array<{ choiceId: string; total: number }>>();
    for (const row of rows) {
      const list = byScene.get(row.scene_id) ?? [];
      list.push({ choiceId: row.choice_id, total: Number(row.total) || 0 });
      byScene.set(row.scene_id, list);
    }
    const scenes = [...byScene.entries()].map(([sceneId, choices]) => {
      const total = choices.reduce((sum, choice) => sum + choice.total, 0);
      const ready = total >= 10;
      return {
        sceneId,
        total,
        ready,
        choices: choices.map((choice) => ({
          ...choice,
          percent: ready && total ? Math.round((choice.total / total) * 100) : 0,
        })),
      };
    });
    return { ok: true as const, scenes };
  });
