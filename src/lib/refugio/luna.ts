import { islandCareSince, islandStage, islandTreeByKey, type IslandTreeKey } from "@/lib/refugio/islandTrees";
import { energyForSeed, growingAmazonSeed, treeByKey, type AmazonSeed } from "@/lib/refugio/amazonTrees";

/** A Luna é a lua da casa. Não é terapeuta, coach, ou arquivo do que doeu. */
export const lunaPhilosophy = {
  name: "Luna",
  is: [
    "Presença. Fica perto sem pedir explicação.",
    "Guardiã do jardim. Vê a planta, o orvalho, a pausa.",
    "Lembrete do Pacto: o encontro é a carta, não o perfil.",
  ],
  isNot: [
    "Não lê desabafos. Nunca cita o texto de uma carta.",
    "Não diagnostica, não anima à força, não cobra consistência.",
    "Não substitui o 188, um CAPS, nem uma pessoa de carne.",
  ],
} as const;

export const lunaSceneLines = {
  landing: "Pode entrar. Aqui ninguém precisa performar.",
  pacto: "A gente combina o cuidado antes da conversa.",
  mural: "Três cartas, e o jardim de ninguém se abre. Só o encontro.",
  write: "Pode ser bagunçado. Eu fico aqui. Não leio depois para te cobrar.",
  garden: "Eu olho a planta. Nunca o que você escreveu.",
  care: "Se o peito apertar, o 188 está acordado. Eu não tento ser ele.",
  rest: "Você já deu luz demais hoje. Agora é a sua vez.",
  letter: "Não precisa responder. Presença já é cuidado.",
} as const;

export type LunaScene = keyof typeof lunaSceneLines;

export function lunaGardenLine(input: {
  islandTreeKey: IslandTreeKey | null;
  islandBornCare: number;
  dewDropsReceived: number;
  energiesReceived: number;
  adviceSent: number;
  amazonSeeds: AmazonSeed[];
  adviceToday: number;
  adviceDay: string;
}) {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const growing = growingAmazonSeed(input.amazonSeeds, input.energiesReceived);
  if (growing) {
    const species = treeByKey(growing.speciesKey);
    const energy = energyForSeed(growing, input.energiesReceived);
    if (energy < 3) return `Uma semente de ${species.name} está na terra. Eu olho ela. Não o que você escreveu.`;
    return `A ${species.name} cresce no seu bosque. Sem pressa. Sem plateia.`;
  }
  if (input.amazonSeeds.length >= 8) return "O bosque está plantado. Eu fico na sombra com você.";
  if (input.amazonSeeds.length > 0) return "Tem árvore madura no bosque. O jardim não se mostra para ninguém.";

  const species = islandTreeByKey(input.islandTreeKey);
  if (!species) return "A terra está nua. Pode não plantar hoje. Eu fico mesmo assim.";
  const stage = islandStage(
    islandCareSince(
      {
        dewDropsReceived: input.dewDropsReceived,
        energiesReceived: input.energiesReceived,
        adviceSent: input.adviceSent,
      },
      input.islandBornCare,
    ),
  ).stage;
  if (stage === "seed" || stage === "sprout") return `Sua ${species.name} ainda é um gesto. Isso já é jardim.`;
  if (stage === "sapling") return `A muda de ${species.name} segurou. Eu vi. Ninguém mais.`;
  if (stage === "young") return `Sua ${species.name} abriu flor. Eu não conto o restante da noite.`;
  if (input.adviceDay !== today || input.adviceToday === 0) {
    return `Sua ${species.name} está aí. Hoje você não plantou nada, e tudo bem.`;
  }
  return `A copa da ${species.name} já faz sombra. Só você entra neste jardim.`;
}
