export const STORY_PLAN_KEYS = ["lua_cheia", "constelacao"] as const;
export type StoryPlanKey = (typeof STORY_PLAN_KEYS)[number];
export type StoryInterval = "month" | "year";

export const STORY_PLANS: Record<
  StoryPlanKey,
  { name: string; month: number; year: number }
> = {
  lua_cheia: { name: "Lua Cheia", month: 1290, year: 10990 },
  constelacao: { name: "Constelação", month: 1990, year: 16990 },
};

export const REFUND_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export function withinRefundWindow(startedAt: string | Date, now = Date.now()) {
  const start = new Date(startedAt).getTime();
  if (!Number.isFinite(start)) return false;
  return now >= start && now - start <= REFUND_WINDOW_MS;
}

export const ACTIVE_PASS_SQL = `select plan from story_passes
  where user_id = $1 and status = 'active' and (cancel_at is null or cancel_at > now())
  limit 1`;
