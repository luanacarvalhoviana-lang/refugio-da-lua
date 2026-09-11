export type LetterColor = "lavender" | "blue" | "peach";

export type LetterAdvice = {
  id: string;
  author: string;
  body: string;
  envelopeKey?: string;
  fontKey?: string;
  opened?: boolean;
};

export type Letter = {
  id: string;
  title: string;
  author: string;
  initials: string;
  topic: string;
  time: string;
  excerpt: string;
  color: LetterColor;
  energy: number;
  body: string;
  gender?: string | null;
  ageGroup?: string | null;
  emotion?: string | null;
  hour?: number;
  priority?: number;
  paperKey?: string;
  sealKey?: string;
  advice?: LetterAdvice[];
  afterMural?: "humus" | "diary";
  postedAt?: string;
};

export const demoLetters: Letter[] = [
  {
    id: "carta-1",
    title: "Hoje eu consegui respirar um pouco melhor",
    author: "Maré Serena",
    initials: "MS",
    topic: "Pequenas vitórias",
    time: "há 12 min",
    excerpt:
      "Não foi um dia perfeito, mas encontrei uma janela de calma entre uma coisa e outra. Estou aprendendo a reconhecer esses pequenos espaços.",
    color: "lavender",
    energy: 18,
    gender: "Mulher",
    ageGroup: "25–34",
    emotion: "Alívio",
    hour: 14,
    body: "A manhã começou pesada, como se o corpo tivesse acordado antes da coragem.\nDepois abri a janela, preparei um chá e deixei o vapor subir sem pedir nada em troca. Parece pequeno, mas hoje foi o meu jeito de voltar para mim.\nNão preciso que o dia inteiro fique leve. Só preciso lembrar que existe uma fresta, e que eu posso caber nela.",
  },
  {
    id: "carta-2",
    title: "Quando o corpo pede uma pausa",
    author: "Nuvem Baixa",
    initials: "NB",
    topic: "Burnout",
    time: "há 28 min",
    excerpt:
      "Escrevo daqui, do sofá, tentando não transformar descanso em culpa. Talvez hoje o cuidado seja justamente não produzir nada.",
    color: "blue",
    energy: 31,
    gender: "Não-binário",
    ageGroup: "35–44",
    emotion: "Cansaço",
    hour: 22,
    body: "O cansaço chegou sem pedir licença. Não é preguiça — é o corpo avisando que a conta fechou.\nEscrevo daqui, do sofá, tentando não transformar descanso em culpa. Talvez hoje o cuidado seja justamente não produzir nada.\nSe você também está nessa beira, fica aqui comigo um pouco. Não precisamos resolver o mês inteiro agora.",
  },
  {
    id: "carta-3",
    title: "Queria aprender a ficar sem me diminuir",
    author: "Jardim Aberto",
    initials: "JA",
    topic: "Relacionamentos",
    time: "há 1 h",
    excerpt:
      "Estou tentando entender que pedir espaço não é abandonar ninguém. Que caber em mim também é uma forma de amor.",
    color: "peach",
    energy: 12,
    gender: "Mulher",
    ageGroup: "18–24",
    emotion: "Saudade",
    hour: 1,
    body: "Tenho medo de que, se eu pedir silêncio, as pessoas entendam recuo.\nMas estou tentando entender que pedir espaço não é abandonar ninguém. Que caber em mim também é uma forma de amor.\nHoje eu só queria ficar, sem me explicar tanto. Sem me tornar menor para caber no ritmo do outro.",
  },
  {
    id: "carta-4",
    title: "Guardei o chá e abri a janela",
    author: "Girassol sereno",
    initials: "GS",
    topic: "Autocuidado",
    time: "há 2 h",
    excerpt: "Deixei o dia ser só isso por um minuto. O chá, a janela, o corpo ainda aqui.",
    color: "lavender",
    energy: 9,
    gender: "Homem",
    ageGroup: "45–59",
    emotion: "Gratidão",
    hour: 8,
    body: "Não fiz uma lista. Não consertei nada.\nGuardei o chá, abri a janela e deixei o dia ser só isso por um minuto.\nÀs vezes presença é exatamente essa recusa educada de continuar correndo.",
    advice: [
      {
        id: "adv-demo-1",
        author: "Maré Serena",
        body: "Esse minuto na janela já é um lugar. Você não precisa merecer o descanso para caber nele.",
      },
    ],
  },
  {
    id: "carta-5",
    title: "A casa ficou grande demais depois",
    author: "Lua Quente",
    initials: "LQ",
    topic: "Luto",
    time: "há 4 h",
    excerpt: "Ainda falo no plural, por costume. Estou aprendendo o singular com cuidado.",
    color: "blue",
    energy: 44,
    gender: "Mulher",
    ageGroup: "60+",
    emotion: "Saudade",
    hour: 19,
    body: "Tem um copo que eu ainda lavo como se fosse ser usado.\nA casa ficou grande demais depois. Não é drama — é o eco de uma rotina que não cabe mais.\nSe alguém ler isto: você pode chegar devagar. Eu também estou chegando.",
  },
  {
    id: "carta-6",
    title: "O trabalho cabe, eu que não estou cabendo",
    author: "Porta Entreaberta",
    initials: "PE",
    topic: "Trabalho",
    time: "ontem",
    excerpt: "Entrego tudo no prazo e mesmo assim sinto que estou atrasada da minha própria vida.",
    color: "peach",
    energy: 21,
    gender: "Mulher",
    ageGroup: "25–34",
    emotion: "Ansiedade",
    hour: 11,
    priority: 1,
    body: "As tarefas cabem na planilha. Eu que não estou cabendo entre uma e outra.\nEntrego tudo no prazo e mesmo assim sinto que estou atrasada da minha própria vida.\nHoje eu só queria dizer isso em voz alta, sem transformar em plano de ação.",
  },
];

export const demoLetterIds = new Set(demoLetters.map((letter) => letter.id));

export function withoutDemoLetters(letters: Letter[]) {
  return letters.filter((letter) => !demoLetterIds.has(letter.id));
}

export function withDemoLetters(letters: Letter[] | undefined) {
  const own = withoutDemoLetters(Array.isArray(letters) ? letters : []);
  return [...demoLetters, ...own];
}
