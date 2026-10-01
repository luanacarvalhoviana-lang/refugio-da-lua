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
  energyKinds?: Record<string, number>;
  afterMural?: "humus" | "diary";
  postedAt?: string;
};

export const demoLetters: Letter[] = [
  {
    id: "carta-demo-porta",
    title: "A chave ficou na mão e eu voltei",
    author: "Casa comigo",
    initials: "CC",
    topic: "Ansiedade",
    time: "há 18 min",
    excerpt: "Vesti a blusa, abri a porta e o sol estava lá. Mesmo assim o sofá me puxou de volta, como se sair fosse uma prova.",
    color: "lavender",
    energy: 1,
    gender: "Mulher",
    ageGroup: "25–34",
    emotion: "Ansiedade",
    hour: 15,
    body: "Hoje eu vesti a blusa certa. A que não aperta. Peguei a chave. Fiquei parada na porta o tempo de ouvir uma moto passar.\nDo lado de fora tinha sol, e mesmo assim eu fechei de novo. Não foi drama. Foi o peito dizendo que a calçada estava longe demais para hoje.\nSe alguém também voltou para dentro, eu estou aqui. Não preciso que me empurrem. Só que não finjam que isso é preguiça.",
  },
  {
    id: "carta-demo-domingo",
    title: "No almoço eu falei, e o feijão continuou",
    author: "Nome antigo",
    initials: "NA",
    topic: "Família",
    time: "há 40 min",
    excerpt: "Ninguém gritou. O pior foi o garfo seguir, a conversa do feijão, e meu nome antigo ainda na boca de quem passou a sobremesa.",
    color: "peach",
    energy: 2,
    gender: "Não-binário",
    ageGroup: "18–24",
    emotion: "Tristeza",
    hour: 13,
    body: "Eu esperei o almoço de domingo acabar para falar. Não acabou. Eu falei mesmo assim.\nNinguém bateu na mesa. Ninguém levantou. O arroz passou de mão em mão e alguém perguntou se o feijão estava salgado. Quando chegou o pudim, me chamaram pelo nome que eu já tinha pedido para deixar.\nEu voltei para o quarto com o prato vazio e a garganta cheia. Queria que silêncio não doesse mais do que um grito.",
  },
  {
    id: "carta-demo-plantao",
    title: "Chorei no carro com o pisca ligado",
    author: "Turno das três",
    initials: "TT",
    topic: "Trabalho",
    time: "há 1 h",
    excerpt: "O jaleco ficou no banco. Não foi por um paciente só. Foi por todos os 'depois a gente se fala' que eu mesma empurrei.",
    color: "blue",
    energy: 0,
    gender: "Mulher",
    ageGroup: "35–44",
    emotion: "Cansaço",
    hour: 3,
    body: "Saí do plantão às três. O jaleco ficou embolado no banco do carona, cheirando a álcool e café velho.\nEu chorei com o pisca ligado, parado no meio fio, porque se eu dirigisse assim ia errar a rua. Não foi por uma pessoa só. Foi a pilha de 'pode deixar comigo' que eu aceitei para não parecer fraca.\nAmanhã eu volto. Hoje eu só queria que alguém soubesse que eu também canso de ser a que aguenta.",
  },
  {
    id: "carta-demo-visto",
    title: "Eu disse que não estava bem, e ela sumiu",
    author: "Visto por último",
    initials: "VU",
    topic: "Amizade",
    time: "há 3 h",
    excerpt: "A resposta foi 'força'. Depois o visto por último parou. Eu ainda abro a conversa, como quem escuta uma porta.",
    color: "lavender",
    energy: 1,
    gender: "Mulher",
    ageGroup: "25–34",
    emotion: "Saudade",
    hour: 21,
    body: "Mandei um áudio curto. Disse que a semana tinha me derrubado e que eu não queria conselho, só companhia.\nEla respondeu 'força' com um coração. Eu esperei o resto. O visto por último ficou naquela hora e não andou mais.\nNão estou brava. Estou com vergonha de ter pedido. E mesmo assim abro a conversa de noite, só para ver se o horário mudou.",
  },
  {
    id: "carta-demo-cadeira",
    title: "Ainda separo o pedaço maior do frango",
    author: "Cadeira da ponta",
    initials: "CP",
    topic: "Luto",
    time: "há 6 h",
    excerpt: "Ele não morreu. Saiu quando eu tinha nove e a cadeira da ponta continua sem ninguém puxar.",
    color: "blue",
    energy: 0,
    gender: "Homem",
    ageGroup: "35–44",
    emotion: "Saudade",
    hour: 19,
    body: "Meu pai não morreu. Ele foi comprar cigarro quando eu tinha nove anos e a rua engoliu ele.\nA cadeira da ponta da mesa continua lá. Ninguém encosta. Eu, burro de costume, ainda corto o pedaço maior do frango e deixo de lado, como se a porta fosse abrir no cheiro.\nMinha mãe finge que não vê. Eu finjo que é para levar no outro dia. Nenhum dos dois joga fora.",
  },
  {
    id: "carta-demo-print",
    title: "Escrevi que gosto e apaguei",
    author: "Quase mandei",
    initials: "QM",
    topic: "Identidade",
    time: "ontem",
    excerpt: "A frase estava pronta. O medo não era dele. Era da cidade inteira caber num print.",
    color: "peach",
    energy: 2,
    gender: "Homem",
    ageGroup: "18–24",
    emotion: "Vergonha",
    hour: 23,
    body: "Ele mandou uma foto do rio à noite e escreveu 'queria você aqui'. Meu dedo escreveu 'eu gosto de você' sem eu mandar a cabeça acompanhar.\nApaguei. Não porque ele não mereça. Porque nesta cidade um print anda mais rápido do que uma pessoa.\nFiquei olhando a tela até o celular escurecer. O gosto ficou. A coragem, não. Se alguém já viveu isso, não precisa me explicar. Só fica.",
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
