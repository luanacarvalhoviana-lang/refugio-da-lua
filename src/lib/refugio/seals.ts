import { islandCareScore, type IslandPlan } from "@/lib/refugio/islandTrees";
import type { AmazonSeed } from "@/lib/refugio/amazonTrees";
import type { Letter } from "@/lib/refugio/letters";

export type PresenceSeal = {
  icon: string;
  title: string;
  detail: string;
  earned: boolean;
  annual?: boolean;
};

export function listPresenceSeals(input: {
  pactOk: boolean;
  energiesSent: number;
  adviceSent: number;
  dewDropsReceived: number;
  lettersPublished: number;
  days: number;
  amazonSeeds: AmazonSeed[];
  plan: IslandPlan;
  energiesReceived: number;
  userName: string;
  letters: Letter[];
}): PresenceSeal[] {
  const care = islandCareScore({
    dewDropsReceived: input.dewDropsReceived,
    energiesReceived: input.energiesReceived,
    adviceSent: input.adviceSent,
  });
  const wrote = input.lettersPublished > 0 || input.letters.some((letter) => letter.author === input.userName);
  return [
    { icon: "🌱", title: "Primeiro pouso", detail: "Você chegou ao Refúgio", earned: input.pactOk },
    { icon: "💌", title: "Primeira carta", detail: "Publicou um desabafo", earned: wrote },
    { icon: "🤍", title: "Mão estendida", detail: "Enviou sua primeira energia", earned: input.energiesSent > 0 },
    { icon: "🕊️", title: "Primeiro conselho", detail: "Acolheu alguém com palavras suas", earned: input.adviceSent > 0 },
    { icon: "💧", title: "Ouvinte calmo", detail: "Um conselho seu recebeu orvalho", earned: input.dewDropsReceived >= 2 },
    { icon: "🌙", title: "Noite tranquila", detail: "Voltou por 7 dias", earned: input.days >= 7 },
    { icon: "🌳", title: "Sábio do jardim", detail: "Árvore frondosa e presença constante", earned: care >= 26 },
    {
      icon: "🌰",
      title: "Primeira semente",
      detail: "Uma nativa da Amazônia nasceu no bosque",
      earned: input.plan === "annual" && input.amazonSeeds.length > 0,
      annual: true,
    },
    {
      icon: "🌿",
      title: "Floresta plena",
      detail: "As oito árvores da Amazônia estão plantadas",
      earned: input.amazonSeeds.length >= 8,
      annual: true,
    },
  ];
}
