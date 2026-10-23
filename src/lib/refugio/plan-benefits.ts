export type HousePlan = "lua_nova" | "lua_cheia" | "constelacao";

export type Benefit =
  | "early"
  | "premium"
  | "memory"
  | "shop_discount"
  | "monthly_pack"
  | "seal_cheia"
  | "unlimited_stories"
  | "scene_assets"
  | "author_stats"
  | "featured"
  | "seal_star";

const CHEIA: Benefit[] = ["early", "premium", "memory", "shop_discount", "monthly_pack", "seal_cheia"];
const STAR: Benefit[] = [...CHEIA, "unlimited_stories", "scene_assets", "author_stats", "featured", "seal_star"];

export function hasBenefit(plan: HousePlan, benefit: Benefit) {
  if (plan === "constelacao") return STAR.includes(benefit);
  if (plan === "lua_cheia") return CHEIA.includes(benefit);
  return false;
}
