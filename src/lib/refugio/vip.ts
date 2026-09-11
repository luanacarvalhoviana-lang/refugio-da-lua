export type VipPlanKey = "monthly" | "annual";
export type VipSubscriptionStatus =
  | "incomplete"
  | "incomplete_expired"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "paused";

export const FREE_LETTER_WEEKLY_LIMIT = 3;
export const MONTHLY_LETTER_WEEKLY_LIMIT = 5;
export const ANNUAL_LETTER_WEEKLY_LIMIT = 7;

export function weeklyLetterLimit(plan: "free" | "monthly" | "annual" | null | undefined) {
  if (plan === "monthly") return MONTHLY_LETTER_WEEKLY_LIMIT;
  if (plan === "annual") return ANNUAL_LETTER_WEEKLY_LIMIT;
  return FREE_LETTER_WEEKLY_LIMIT;
}

export const vipPlanCatalog = {
  monthly: {
    key: "monthly" as const,
    name: "VIP Mensal",
    stripeName: "Refúgio da Lua VIP Mensal",
    priceLabel: "R$ 19,99",
    cadenceLabel: "/mês",
    unitAmount: 1999,
    interval: "month" as const,
    description: "Mais espaço para criar um ritmo de cuidado dentro do Refúgio.",
    cta: "Assinar Mensal",
    benefits: [
      "5 cartas no mural por semana",
      "Fila prioritária",
      "Filtro parcial (Gênero ou Idade)",
      "Diário emocional com senha",
      "Filtros avançados (tags + emoções)",
      "Avatares VIP Prata",
      "Árvore da Mata: Quaresmeira, Jacarandá ou Pau-brasil — uma de cada vez",
      "Até 5 conselhos por dia",
      "5 papéis e envelopes exclusivos",
      "Envelopes e letras de conselho (VIP)",
      "Proteção contra captura de tela nas cartas",
    ],
  },
  annual: {
    key: "annual" as const,
    name: "VIP Anual",
    stripeName: "Refúgio da Lua VIP Anual",
    priceLabel: "R$ 99,99",
    cadenceLabel: "/ano",
    unitAmount: 9999,
    interval: "year" as const,
    description: "A experiência mais completa para aprofundar seu caminho de cuidado.",
    cta: "Assinar Anual (Ofertão)",
    benefits: [
      "7 cartas no mural por semana",
      "Super prioridade (topo do mural)",
      "Filtro completo (Gênero e Idade)",
      "Diário + Análise semanal em gráficos",
      "Proteção contra captura de tela",
      "Filtro por horário de envio",
      "Avatares Dourados + Molduras",
      "Aura iluminada + Frutos dourados na Árvore",
      "Bosque Amazônico: uma nativa por vez, até o bosque inteiro",
      "Conselhos ilimitados",
      "Caixa da Memória (guardar conselhos)",
      "Player de Sons de Paz (ASMR)",
      "Biblioteca completa de papéis + selos de cera",
      "Envelopes de cera e caligrafia da lua",
    ],
  },
} as const;

export const freePlanBenefits = [
  "Árvore da Ilha: Ipê-amarelo ou Manacá-da-serra — uma de cada vez",
  "3 cartas no mural por semana",
  "Até 3 conselhos por dia",
  "Avatares básicos",
  "Envelope kraft e uma letra serena",
] as const;

export const REST_MESSAGE =
  "Sua luz ajudou muitos hoje. Hora de cuidar do seu próprio jardim e descansar.";

export function dailyAdviceLimit(plan: "free" | "monthly" | "annual" | null | undefined) {
  if (plan === "monthly") return 5;
  if (plan === "annual") return null;
  return 3;
}

export type VipEntitlements = {
  unlimitedLetters: boolean;
  priorityQueue: boolean;
  superPriority: boolean;
  filterPartial: boolean;
  filterFull: boolean;
  advancedFilters: boolean;
  diaryPassword: boolean;
  weeklyCharts: boolean;
  screenshotGuard: boolean;
  hourFilter: boolean;
  avatarsSilver: boolean;
  avatarsGold: boolean;
  extraFlowers: boolean;
  goldenFruit: boolean;
  papersStarter: boolean;
  papersFull: boolean;
  memoryBox: boolean;
  peaceSounds: boolean;
  amazonGrove: boolean;
};

export const emptyEntitlements: VipEntitlements = {
  unlimitedLetters: false,
  priorityQueue: false,
  superPriority: false,
  filterPartial: false,
  filterFull: false,
  advancedFilters: false,
  diaryPassword: false,
  weeklyCharts: false,
  screenshotGuard: false,
  hourFilter: false,
  avatarsSilver: false,
  avatarsGold: false,
  extraFlowers: false,
  goldenFruit: false,
  papersStarter: false,
  papersFull: false,
  memoryBox: false,
  peaceSounds: false,
  amazonGrove: false,
};

export function hasVipAccess(status: VipSubscriptionStatus | null | undefined) {
  return status === "active" || status === "trialing";
}

export function entitlementsFor(plan: VipPlanKey | null | undefined, status?: VipSubscriptionStatus | null): VipEntitlements {
  if (!hasVipAccess(status) || !plan) return emptyEntitlements;
  const monthly: VipEntitlements = {
    ...emptyEntitlements,
    unlimitedLetters: false,
    priorityQueue: true,
    filterPartial: true,
    advancedFilters: true,
    diaryPassword: true,
    avatarsSilver: true,
    extraFlowers: true,
    papersStarter: true,
    screenshotGuard: true,
  };
  if (plan === "monthly") return monthly;
  return {
    ...monthly,
    superPriority: true,
    filterFull: true,
    weeklyCharts: true,
    screenshotGuard: true,
    hourFilter: true,
    avatarsGold: true,
    goldenFruit: true,
    papersFull: true,
    memoryBox: true,
    peaceSounds: true,
    amazonGrove: true,
  };
}

export const genderOptions = ["Mulher", "Homem", "Não-binário", "Prefiro não dizer"] as const;
export const ageOptions = ["18–24", "25–34", "35–44", "45–59", "60+"] as const;
export const emotionOptions = ["Cansaço", "Esperança", "Tristeza", "Alívio", "Ansiedade", "Gratidão", "Raiva", "Saudade"] as const;
export const hourBuckets = [
  { key: "dawn", label: "Madrugada", from: 0, to: 5 },
  { key: "morning", label: "Manhã", from: 6, to: 11 },
  { key: "afternoon", label: "Tarde", from: 12, to: 17 },
  { key: "night", label: "Noite", from: 18, to: 23 },
] as const;
