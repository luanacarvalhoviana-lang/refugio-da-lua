export type CollectionTier = "free" | "monthly" | "annual";

export type CollectionItem = {
  key: string;
  label: string;
  glyph: string;
  tier: CollectionTier;
};

export const avatars: CollectionItem[] = [
  { key: "sprout", label: "Broto", glyph: "🌱", tier: "free" },
  { key: "leaf", label: "Folha", glyph: "🌿", tier: "free" },
  { key: "moon", label: "Lua prata", glyph: "🌙", tier: "monthly" },
  { key: "cloud", label: "Nuvem", glyph: "☁️", tier: "monthly" },
  { key: "pot", label: "Vaso", glyph: "🪴", tier: "monthly" },
  { key: "sunflower", label: "Girassol", glyph: "🌻", tier: "monthly" },
  { key: "spark", label: "Faísca", glyph: "✨", tier: "monthly" },
  { key: "gold-moon", label: "Lua dourada", glyph: "🌕", tier: "annual" },
  { key: "butterfly", label: "Borboleta", glyph: "🦋", tier: "annual" },
  { key: "blossom", label: "Flor de cerejeira", glyph: "🌸", tier: "annual" },
  { key: "planet", label: "Planeta", glyph: "🪐", tier: "annual" },
];

export const frames: CollectionItem[] = [
  { key: "none", label: "Sem moldura", glyph: "○", tier: "free" },
  { key: "silver", label: "Prata suave", glyph: "◇", tier: "monthly" },
  { key: "lavender", label: "Lavanda", glyph: "❀", tier: "monthly" },
  { key: "gold", label: "Aura dourada", glyph: "✦", tier: "annual" },
  { key: "constellation", label: "Constelação", glyph: "✧", tier: "annual" },
];

export const papers: CollectionItem[] = [
  { key: "plain", label: "Papel simples", glyph: "📄", tier: "free" },
  { key: "lunar", label: "Papel lunar", glyph: "📃", tier: "monthly" },
  { key: "lavender", label: "Lavanda", glyph: "💜", tier: "monthly" },
  { key: "garden", label: "Carta jardim", glyph: "🌿", tier: "monthly" },
  { key: "night", label: "Noite azul", glyph: "💙", tier: "monthly" },
  { key: "cream", label: "Creme antigo", glyph: "📜", tier: "monthly" },
  { key: "gold-leaf", label: "Folha dourada", glyph: "🥇", tier: "annual" },
  { key: "wax-night", label: "Noite com cera", glyph: "🕯️", tier: "annual" },
  { key: "linen", label: "Linho", glyph: "🤍", tier: "annual" },
];

export const seals: CollectionItem[] = [
  { key: "none", label: "Sem selo", glyph: "○", tier: "free" },
  { key: "moon", label: "Selo da lua", glyph: "🌙", tier: "annual" },
  { key: "leaf", label: "Selo da folha", glyph: "🌿", tier: "annual" },
  { key: "letter", label: "Selo da carta", glyph: "💌", tier: "annual" },
  { key: "spark", label: "Selo da luz", glyph: "✨", tier: "annual" },
  { key: "candle", label: "Selo da vela", glyph: "🕯️", tier: "annual" },
];

export const envelopes: CollectionItem[] = [
  { key: "kraft", label: "Kraft sereno", glyph: "✉️", tier: "free" },
  { key: "linen", label: "Linho claro", glyph: "🤍", tier: "monthly" },
  { key: "moonlight", label: "Clarão da lua", glyph: "🌙", tier: "monthly" },
  { key: "garden", label: "Folha de jardim", glyph: "🌿", tier: "monthly" },
  { key: "wax", label: "Cera dourada", glyph: "✦", tier: "annual" },
  { key: "nightwax", label: "Cera da noite", glyph: "🕯️", tier: "annual" },
];

export const letterFonts: CollectionItem[] = [
  { key: "lora", label: "Serifa quieta", glyph: "Aa", tier: "free" },
  { key: "cormorant", label: "Garamond da carta", glyph: "Aa", tier: "monthly" },
  { key: "caveat", label: "À mão", glyph: "Aa", tier: "monthly" },
  { key: "fraunces", label: "Fraunces", glyph: "Aa", tier: "monthly" },
  { key: "tangerine", label: "Caligrafia da lua", glyph: "Aa", tier: "annual" },
];

export function canUseItem(tier: CollectionTier, plan: "free" | "monthly" | "annual") {
  if (tier === "free") return true;
  if (tier === "monthly") return plan === "monthly" || plan === "annual";
  return plan === "annual";
}
