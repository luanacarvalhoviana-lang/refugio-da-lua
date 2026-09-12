import { stageMeta, type GrowthStage } from "@/lib/refugio/amazonTrees";

export type IslandPlan = "free" | "monthly" | "annual";

export type IslandTreeKey = "ipe" | "manaca" | "quaresmeira" | "jacaranda" | "pau-brasil";

export type IslandTreeSpecies = {
  key: IslandTreeKey;
  name: string;
  scientific: string;
  meaning: string;
  note: string;
  biome: "esperanca" | "mata";
  image: string;
  plans: IslandPlan[];
};

export const islandTrees: IslandTreeSpecies[] = [
  {
    key: "ipe",
    name: "Ipê-amarelo",
    scientific: "Handroanthus albus",
    meaning: "Luz que nasce no meio da seca",
    note: "Floresce quando a terra pede esperança.",
    biome: "esperanca",
    image: "/trees/ipe.jpg",
    plans: ["free"],
  },
  {
    key: "manaca",
    name: "Manacá-da-serra",
    scientific: "Tibouchina mutabilis",
    meaning: "A cor muda com o tempo",
    note: "Branco, rosa e roxo na mesma copa — transformação.",
    biome: "esperanca",
    image: "/trees/manaca.jpg",
    plans: ["free"],
  },
  {
    key: "quaresmeira",
    name: "Quaresmeira",
    scientific: "Tibouchina granulosa",
    meaning: "Serenidade em flor roxa",
    note: "Copa intensa da Mata Atlântica.",
    biome: "mata",
    image: "/trees/quaresmeira.jpg",
    plans: ["monthly"],
  },
  {
    key: "jacaranda",
    name: "Jacarandá-mimoso",
    scientific: "Jacaranda mimosifolia",
    meaning: "Paz em tom de céu",
    note: "Folhas leves e uma nuvem azul-lilás.",
    biome: "mata",
    image: "/trees/jacaranda.jpg",
    plans: ["monthly"],
  },
  {
    key: "pau-brasil",
    name: "Pau-brasil",
    scientific: "Paubrasilia echinata",
    meaning: "Ancestralidade e resiliência",
    note: "Flores amarelas delicadas, raiz deste chão.",
    biome: "mata",
    image: "/trees/pau-brasil.jpg",
    plans: ["monthly"],
  },
];

export function islandTreeByKey(key: IslandTreeKey | null | undefined) {
  return islandTrees.find((tree) => tree.key === key) ?? null;
}

export function islandChoicesFor(plan: IslandPlan) {
  if (plan === "monthly") return islandTrees.filter((tree) => tree.biome === "mata");
  return islandTrees.filter((tree) => tree.biome === "esperanca");
}

export function canKeepIslandTree(_plan: IslandPlan, key: IslandTreeKey | null) {
  return Boolean(islandTreeByKey(key));
}

export function islandCareScore(input: { dewDropsReceived: number; energiesReceived: number; adviceSent: number }) {
  const firstAdvice = input.adviceSent > 0 ? 3 : 0;
  return Math.max(0, input.dewDropsReceived + input.energiesReceived + firstAdvice);
}

export function islandCareSince(
  input: { dewDropsReceived: number; energiesReceived: number; adviceSent: number },
  bornCare: number,
) {
  return Math.max(0, islandCareScore(input) - bornCare);
}

export function islandStage(care: number) {
  return stageMeta(care);
}

export function canPlantNextIsland(input: {
  currentKey: IslandTreeKey | null;
  bornCare: number;
  dewDropsReceived: number;
  energiesReceived: number;
  adviceSent: number;
}) {
  if (!input.currentKey) return true;
  return islandStage(islandCareSince(input, input.bornCare)).stage === "mature";
}

export const islandStageArt: Partial<Record<GrowthStage, string>> = {
  seed: "/trees/seed.jpg",
  sprout: "/trees/sprout-clear.png",
  sapling: "/trees/sapling.jpg",
};

export function islandArtSrc(species: IslandTreeSpecies | null, stage: GrowthStage) {
  if (stage === "seed" || stage === "sprout" || stage === "sapling") {
    return islandStageArt[stage] ?? "/trees/sprout-clear.png";
  }
  return species?.image ?? "/trees/ipe.jpg";
}
