import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { PACTO_VERSION } from "@/lib/refugio/pacto";
import { presentStory } from "@/lib/refugio/story-access";
import { ACTIVE_PASS_SQL } from "@/lib/refugio/story-plans";
import { storyBillingLocks } from "@/lib/refugio/studio-limits";
import type { Story } from "@/lib/refugio/stories";

const OWNERS = new Set(["contato.refugiodalua@gmail.com", "contato@refugiodalua.com.br"]);
const lang = z.enum(["pt", "es"]);

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

async function sessionUser() {
  const { getSessionUser } = await import("@/lib/auth/verify.server");
  return getSessionUser();
}

async function mayOpen(userId: string | undefined, email: string) {
  if (!storyBillingLocks()) return true;
  if (OWNERS.has(email)) return true;
  if (!userId) return false;
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql.query<{ plan: string }>(ACTIVE_PASS_SQL, [userId]);
  return rows[0]?.plan === "lua_cheia" || rows[0]?.plan === "constelacao";
}

export const listNightStories = createServerFn({ method: "POST" })
  .validator(z.object({ lang }))
  .handler(async ({ data }) => {
    const { nightStories } = await import("@/lib/refugio/night-stories");
    const user = await sessionUser();
    const email = user?.email?.trim().toLowerCase() || "";
    const allowed = await mayOpen(user?.id, email);
    let bought = new Set<string>();
    if (!allowed && user?.id && storyBillingLocks()) {
      const { getSql } = await import("@/lib/db");
      const sql = await getSql();
      const rows = await sql.query<{ item: string }>(
        `select item from story_purchases where user_id = $1 and status = 'paid' and item in ('a-lampada', 'antes-da-lua')`,
        [user.id],
      );
      bought = new Set(rows.map((row) => row.item));
    }
    return nightStories[data.lang].map((story: Story) => presentStory(story, allowed || bought.has(story.slug), todayISO()));
  });

export const listKeepsakes = createServerFn({ method: "GET" })
  .handler(async () => {
    const user = await sessionUser();
    if (!user?.id) return { signedIn: false as const, items: [] };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const items = await sql.query<{ id: string; story_slug: string; lang: string; scene_id: string; titulo: string; trecho: string }>(
      `select id, story_slug, lang, scene_id, titulo, trecho from lembrancas where user_id = $1 order by criado_em desc limit 40`,
      [user.id],
    );
    return { signedIn: true as const, items };
  });

export const saveKeepsake = createServerFn({ method: "POST" })
  .validator(z.object({
    slug: z.string().trim().min(2).max(48),
    lang,
    sceneId: z.string().trim().min(1).max(40),
    titulo: z.string().trim().min(1).max(80),
    trecho: z.string().trim().min(1).max(280),
  }))
  .handler(async ({ data }) => {
    const user = await sessionUser();
    if (!user?.id) return { ok: false as const, reason: "conta" as const };
    const email = user.email?.trim().toLowerCase() || "";
    if (!(await mayOpen(user.id, email))) return { ok: false as const, reason: "plano" as const };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const pact = await sql.query<{ ok: number }>(
      `select 1 as ok from pacto_acceptances where user_id = $1 and versao = $2 limit 1`,
      [user.id, PACTO_VERSION],
    );
    if (!pact[0]) return { ok: false as const, reason: "pacto" as const };
    await sql.query(
      `insert into lembrancas (id, user_id, story_slug, lang, scene_id, titulo, trecho)
       values ($1, $2, $3, $4, $5, $6, $7)
       on conflict (user_id, story_slug, scene_id) do update set trecho = excluded.trecho, titulo = excluded.titulo`,
      [crypto.randomUUID(), user.id, data.slug, data.lang, data.sceneId, data.titulo, data.trecho],
    );
    return { ok: true as const };
  });
