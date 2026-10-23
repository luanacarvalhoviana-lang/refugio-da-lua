import { createServerFn } from "@tanstack/react-start";
import { ACTIVE_PASS_SQL } from "@/lib/refugio/story-plans";
import type { HousePlan } from "@/lib/refugio/plan-benefits";

export async function getUserPlan(userId?: string): Promise<HousePlan> {
  if (!userId) return "lua_nova";
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql.query<{ plan: string; status: string; current_period_end: string | Date | null }>(
    `select plan, status, current_period_end from subscriptions where user_id = $1 limit 1`,
    [userId],
  );
  const row = rows[0];
  if (row) {
    const end = row.current_period_end ? new Date(row.current_period_end).getTime() : Infinity;
    const open = (row.status === "active" || row.status === "trialing") && end > Date.now();
    if (open && (row.plan === "lua_cheia" || row.plan === "constelacao")) return row.plan;
    return "lua_nova";
  }
  const pass = await sql.query<{ plan: string }>(ACTIVE_PASS_SQL, [userId]);
  if (pass[0]?.plan === "constelacao" || pass[0]?.plan === "lua_cheia") return pass[0].plan;
  return "lua_nova";
}

export const adminSubscriptions = createServerFn({ method: "GET" }).handler(async () => {
  const { getSessionUser } = await import("@/lib/auth/verify.server");
  const user = await getSessionUser();
  const email = user?.email?.trim().toLowerCase() || "";
  if (!["contato.refugiodalua@gmail.com", "contato@refugiodalua.com.br"].includes(email)) return { allowed: false as const };
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const rows = await sql.query<{ plan: string; status: string; interval: string }>(
    `select plan, status, interval from subscriptions order by created_at desc limit 80`,
  );
  const active = rows.filter((row) => row.status === "active" || row.status === "trialing");
  const cents = active.reduce((sum, row) => {
    if (row.plan === "constelacao") return sum + (row.interval === "year" ? Math.round(16990 / 12) : 1990);
    return sum + (row.interval === "year" ? Math.round(10990 / 12) : 1290);
  }, 0);
  return { allowed: true as const, rows, active: active.length, cents };
});
