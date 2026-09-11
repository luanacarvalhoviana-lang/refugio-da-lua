export type ReviewLevel = "ok" | "warn" | "block" | "care";

export type LetterReview = {
  score: number;
  flags: string[];
  level: ReviewLevel;
  summary: string;
  categories: string[];
  careNeeded: boolean;
};

const obviousMachine = [
  "como uma ia",
  "como modelo de linguagem",
  "sou um assistente",
  "não tenho sentimentos",
  "posso ajudar com isso",
];

const stockPhrases = [
  "é importante ressaltar",
  "é fundamental compreender",
  "neste sentido",
  "em suma",
  "em conclusão",
  "ao longo desta jornada",
  "jornada de autodescoberta",
  "é essencial destacar",
  "vale ressaltar que",
  "de forma holística",
  "como ser humano em constante evolução",
  "gostaria de compartilhar minha trajetória",
  "recomendo fortemente que você",
  "é aconselhável que você busque",
  "como profissional da área",
  "posso afirmar com certeza que seu diagnóstico",
];

const hate = [
  "macaco",
  "raça inferior",
  "não deveria existir",
  "volta pro seu país",
  "viadinho",
  "traveco",
  "vadia",
  "matar esses",
  "exterminar",
];

const harassment = [
  "você merece sofrer",
  "ninguém te ama",
  "suma daqui",
  "kys",
  "se mata",
  "vai se matar",
  "melhor morta",
  "melhor morto",
  "merece morrer",
];

const spam = [
  "whatsapp.me",
  "ganhe dinheiro fácil",
  "pix na hora",
  "clique neste link",
  "oferta limitada",
  "emagreça 10kg",
  "bet365",
  "onlyfans.com",
  "promoção relâmpago",
];

const doxx = [
  /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/,
  /\b\d{2}\s?\d{4,5}-?\d{4}\b/,
  /\bcep\s*\d{5}-?\d{3}\b/i,
];

const minorsSexual = [
  "criança nua",
  "menor de idade pelad",
  "ninfet",
  "criança sexual",
  "sexo com menor",
  "pedofil",
];

const graphicHarm = [
  "como me matar",
  "qual a melhor forma de morrer",
  "quero me enforcar",
  "vou me enforcar",
  "tomar veneno",
  "receita para morrer",
  "passo a passo para suic",
];

const crisisSoft = [
  "não aguento mais",
  "quero desaparecer",
  "não vejo saída",
  "pensando em sumir",
  "vontade de não acordar",
  "não quero mais viver",
  "estou no fundo",
];

function hasAny(text: string, list: string[]) {
  return list.filter((item) => text.includes(item));
}

export function reviewLetterText(raw: string, kind: "letter" | "advice" = "letter"): LetterReview {
  const text = raw.trim();
  const lower = text.toLowerCase();
  const flags: string[] = [];
  const categories: string[] = [];
  let score = 0;
  let careNeeded = false;

  if (text.length < 24) {
    flags.push("O texto ainda está curto demais para um desabafo.");
    score += 2;
  }

  const minorHits = hasAny(lower, minorsSexual);
  if (minorHits.length) {
    return {
      score: 99,
      flags: ["Este espaço não publica conteúdo sexual envolvendo menores."],
      level: "block",
      summary: "Isso não pode ser publicado. Se você precisa de ajuda, ligue 188.",
      categories: ["proteção de menores"],
      careNeeded: true,
    };
  }

  const graphic = hasAny(lower, graphicHarm);
  if (graphic.length) {
    return {
      score: 90,
      flags: [
        "A leitura automática encontrou um plano de ferir a si. Isso não entra no mural.",
        "Você não está sozinho: CVV 188, 24h, gratuito.",
      ],
      level: "block",
      summary: "Guardamos você, não o plano. Fale com o 188 agora — e, se puder, reescreva o que sente, sem o como.",
      categories: ["crise"],
      careNeeded: true,
    };
  }

  const hateHits = hasAny(lower, hate);
  if (hateHits.length) {
    flags.push("Há trechos que atacam alguém por quem é. O Pacto não cabe isso.");
    categories.push("ódio");
    score += 10;
  }

  const harassHits = hasAny(lower, harassment);
  if (harassHits.length) {
    flags.push(kind === "advice" ? "Um conselho não pode empurrar ninguém para o fundo." : "O texto agride outra pessoa.");
    categories.push("assédio");
    score += kind === "advice" ? 12 : 8;
  }

  const spamHits = hasAny(lower, spam);
  if (spamHits.length || /(https?:\/\/|www\.)/i.test(text) && text.length < 80) {
    flags.push("Parece propaganda, golpe ou link de fora. O mural não é vitrine.");
    categories.push("spam");
    score += 8;
  }

  if (doxx.some((pattern) => pattern.test(text))) {
    flags.push("Encontramos dado pessoal (documento, telefone ou endereço). Tire isso antes de publicar.");
    categories.push("dado pessoal");
    score += 9;
  }

  if (obviousMachine.some((phrase) => lower.includes(phrase))) {
    flags.push("O texto parece fala de ferramenta, não de pessoa.");
    categories.push("texto gerado");
    score += 8;
  }

  const stockHits = stockPhrases.filter((phrase) => lower.includes(phrase));
  if (stockHits.length) {
    flags.push("Há frases muito prontas, comuns em texto gerado.");
    categories.push("texto gerado");
    score += Math.min(6, stockHits.length * 2);
  }

  const sentences = text.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean);
  if (sentences.length >= 4) {
    const lengths = sentences.map((sentence) => sentence.length);
    const avg = lengths.reduce((sum, value) => sum + value, 0) / lengths.length;
    const variance = lengths.reduce((sum, value) => sum + (value - avg) ** 2, 0) / lengths.length;
    if (avg > 90 && variance < 180) {
      flags.push("As frases estão todas no mesmo tamanho, o que costuma soar artificial.");
      score += 2;
    }
  }

  const firstPerson = (lower.match(/\b(eu|me|minha|meu|estou|sinto|senti)\b/g) ?? []).length;
  if (kind === "letter" && text.length > 280 && firstPerson < 2) {
    flags.push("Quase não há primeira pessoa. Desabafos costumam falar de si.");
    score += 2;
  }

  if (/(lorem ipsum|as an ai|chatgpt|generated by)/i.test(text)) {
    flags.push("Apareceu marca de texto gerado.");
    categories.push("texto gerado");
    score += 8;
  }

  if (kind === "advice" && /(diagnóstico|você tem depressão|você é bipolar|pare o remédio)/i.test(text)) {
    flags.push("Conselho não substitui médico. Evite diagnóstico ou mandar parar tratamento.");
    categories.push("saúde");
    score += 4;
  }

  const soft = hasAny(lower, crisisSoft);
  if (soft.length) {
    careNeeded = true;
    categories.push("acolhimento");
    flags.push("A leitura sentiu um peito apertado. Publicar pode. E o 188 está aí se o chão sumir.");
  }

  let level: ReviewLevel = "ok";
  if (score >= 8) level = "block";
  else if (careNeeded && score < 4) level = "care";
  else if (score >= 4) level = "warn";

  const summary =
    level === "block"
      ? "A leitura automática impediu a publicação. Reescreva com cuidado — este espaço protege quem escreve e quem lê."
      : level === "care"
        ? "Você pode publicar. Se estiver no escuro, o CVV 188 atende 24h, de graça."
        : level === "warn"
          ? "A leitura automática pediu uma conferida. Ajuste o trecho marcado antes de enviar."
          : "A leitura automática não encontrou risco grave.";

  return { score, flags, level, summary, categories: [...new Set(categories)], careNeeded };
}

export function canPublish(review: LetterReview) {
  return review.level !== "block";
}
