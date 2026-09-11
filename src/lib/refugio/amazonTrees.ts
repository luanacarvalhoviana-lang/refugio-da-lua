export type AmazonTreeKey =
  | "samauma"
  | "castanheira"
  | "acai"
  | "seringueira"
  | "andiroba"
  | "copaiba"
  | "buriti"
  | "cacau";

export type GrowthStage = "seed" | "sprout" | "sapling" | "young" | "mature";

export type AmazonTreeSpecies = {
  key: AmazonTreeKey;
  name: string;
  scientific: string;
  meaning: string;
  note: string;
};

export type AmazonSeed = {
  id: string;
  speciesKey: AmazonTreeKey;
  bornAtEnergy: number;
  createdAt: string;
};

export const amazonTrees: AmazonTreeSpecies[] = [
  {
    key: "samauma",
    name: "Samaúma",
    scientific: "Ceiba pentandra",
    meaning: "A árvore-mãe da floresta",
    note: "Emergente, enorme, guarda o dossel.",
  },
  {
    key: "castanheira",
    name: "Castanheira-do-pará",
    scientific: "Bertholletia excelsa",
    meaning: "Abundância compartilhada",
    note: "Dá a castanha-do-pará, alimento da floresta.",
  },
  {
    key: "acai",
    name: "Açaizeiro",
    scientific: "Euterpe oleracea",
    meaning: "Sustento às margens dos rios",
    note: "Palmeira de igapó e várzea, fruto violeta.",
  },
  {
    key: "seringueira",
    name: "Seringueira",
    scientific: "Hevea brasiliensis",
    meaning: "Seiva que resiste ao tempo",
    note: "Árvore da borracha nativa da Amazônia.",
  },
  {
    key: "andiroba",
    name: "Andiroba",
    scientific: "Carapa guianensis",
    meaning: "Cuidado que vem da semente",
    note: "Óleo tradicional das sementes.",
  },
  {
    key: "copaiba",
    name: "Copaíba",
    scientific: "Copaifera langsdorffii",
    meaning: "Bálsamo da mata",
    note: "Resina dourada usada como cuidado da floresta.",
  },
  {
    key: "buriti",
    name: "Buriti",
    scientific: "Mauritia flexuosa",
    meaning: "Árvore da vida nas veredas",
    note: "Palmeira de frutos cor de fogo.",
  },
  {
    key: "cacau",
    name: "Cacaueiro",
    scientific: "Theobroma cacao",
    meaning: "Alimento dos deuses",
    note: "Cacau nativo, com frutos no tronco.",
  },
];

export const growthStages: { key: GrowthStage; label: string; min: number }[] = [
  { key: "seed", label: "Semente", min: 0 },
  { key: "sprout", label: "Broto", min: 3 },
  { key: "sapling", label: "Muda", min: 8 },
  { key: "young", label: "Árvore florida", min: 15 },
  { key: "mature", label: "Árvore frondosa", min: 26 },
];

export function treeByKey(key: AmazonTreeKey) {
  return amazonTrees.find((tree) => tree.key === key) ?? amazonTrees[0];
}

export function energyForSeed(seed: AmazonSeed, energiesReceived: number) {
  return Math.max(0, energiesReceived - seed.bornAtEnergy);
}

export function stageForEnergy(energy: number): GrowthStage {
  let stage: GrowthStage = "seed";
  for (const item of growthStages) {
    if (energy >= item.min) stage = item.key;
  }
  return stage;
}

export function stageMeta(energy: number) {
  const stage = stageForEnergy(energy);
  const index = growthStages.findIndex((item) => item.key === stage);
  const current = growthStages[index];
  const next = growthStages[index + 1];
  const span = (next?.min ?? current.min + 8) - current.min;
  const progress = next ? Math.min(1, (energy - current.min) / span) : 1;
  return {
    stage,
    label: current.label,
    nextLabel: next?.label ?? "Copa plena",
    progress,
    energy,
    remaining: next ? Math.max(0, next.min - energy) : 0,
  };
}

export function nextUnearnedTree(owned: AmazonTreeKey[]) {
  return amazonTrees.find((tree) => !owned.includes(tree.key)) ?? null;
}

export function createSeed(speciesKey: AmazonTreeKey, energiesReceived: number): AmazonSeed {
  return {
    id: `seed-${speciesKey}-${Date.now()}`,
    speciesKey,
    bornAtEnergy: energiesReceived,
    createdAt: new Date().toISOString(),
  };
}

export function growingAmazonSeed(seeds: AmazonSeed[], energiesReceived: number) {
  return seeds.find((seed) => stageForEnergy(energyForSeed(seed, energiesReceived)) !== "mature") ?? null;
}

export function canPlantNextAmazon(seeds: AmazonSeed[], energiesReceived: number) {
  return !growingAmazonSeed(seeds, energiesReceived);
}
