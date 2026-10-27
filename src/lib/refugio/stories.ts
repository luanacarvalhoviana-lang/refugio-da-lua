import { moreStories } from "@/lib/refugio/stories-more";
import { ticketEn } from "@/lib/refugio/stories-en";

export type Lang = "pt" | "es" | "en";

export type Choice = {
  id: string;
  label: string;
  to: string;
  affinity?: number;
  clue?: string;
  thought?: string;
};

export type Ending = {
  key: string;
  title: string;
  body: string;
  flower: string;
  letter?: { from: string; text: string };
};

export type Scene = {
  id: string;
  speaker?: string;
  body?: string;
  choices?: Choice[];
  ending?: Ending;
  music?: string;
  /** Se houver, a música toca só esses segundos e o som ambiente volta. */
  musicFor?: number;
};

export type Story = {
  slug: string;
  title: string;
  author: string;
  rating: "16" | "14" | "livre";
  genres: string[];
  minutes: number;
  synopsis: string;
  place: string;
  art?: string;
  start: string;
  sound?: string;
  scenes: Scene[];
  access?: "aberta" | "cheia" | "antecipada";
  opensOn?: string;
  locked?: boolean;
  moonNight?: boolean;
};

const pt: Story = {
  slug: "o-bilhete",
  title: "O bilhete na última estante",
  author: "Luana Viana",
  rating: "16",
  genres: ["romance", "mistério", "slow burn"],
  minutes: 12,
  synopsis: "Depois do expediente, um livro sem ficha espera na mesa. O bilhete lá dentro não pede para ser lido. Pede para não ser devolvido.",
  place: "Biblioteca antiga",
  start: "mesa",
  sound: "/sounds/rain.mp3",
  scenes: [
    {
      id: "mesa",
      music: "calma",
      body: "A chuva encosta na vidraça. O último leitor já foi embora, e a biblioteca fica só com o cheiro de papel molhado de quem chegou da rua. Na mesa de devolução há um romance sem ficha. Dentro, um bilhete estreito, escrito com letra firme: “Não devolva este livro. Se quiser saber por quê, a última estante ainda está acesa.”",
      choices: [
        { id: "abrir", label: "Abrir o livro antes de ir", to: "corredor", affinity: 1, clue: "O bilhete pede para o livro não ser devolvido." },
        { id: "ir", label: "Ir direto à última estante", to: "helena", affinity: 1, clue: "Alguém deixou a última estante acesa de propósito." },
        { id: "apagar", label: "Deixar o bilhete e apagar a luz", to: "fim-fechado", affinity: -1 },
      ],
    },
    {
      id: "corredor",
      speaker: "Você",
      body: "A primeira página tem uma flor seca, fina como papel de seda. Na margem, um nome quase apagado: Helena. Não é dedicatória. Parece um aviso que alguém teve medo de completar.",
      choices: [
        { id: "guardar", label: "Guardar a flor no bolso", to: "helena", affinity: 1, clue: "Uma flor seca marca o nome Helena." },
        { id: "chamar", label: "Chamar por Helena, baixo", to: "helena", affinity: 2 },
      ],
    },
    {
      id: "helena",
      music: "romance",
      speaker: "Helena",
      body: "Ela está de joelhos entre os volumes grandes, a luz do abajur cortando só o rosto. Cabelo preso de qualquer jeito, mãos manchadas de cola de restauro. Não se assusta. “Você não devolveu”, ela diz, e isso soa menos como pergunta do que como alívio. “Esse livro não é da biblioteca. É meu. Eu o deixei para quem fosse capaz de não cumprir a regra.”",
      choices: [
        { id: "porque", label: "Perguntar por que justo você", to: "margem", affinity: 1 },
        { id: "medo", label: "Dizer que aquilo parece uma armadilha", to: "margem", affinity: 0 },
        { id: "devolver", label: "Estender o livro de volta", to: "fim-espera", affinity: -1 },
      ],
    },
    {
      id: "margem",
      music: "suspense",
      speaker: "Helena",
      body: "“Porque a pessoa que escreveu comigo nesse livro sumiu sem se despedir. O nome na margem era o jeito dela dizer que ia voltar. Faz um ano. Eu fico depois da hora porque, se ela entrar, quero que alguém ainda esteja aqui. Hoje você chegou primeiro.” A chuva engrossa. Helena olha a sua boca e depois desvia, como quem se corrige.",
      choices: [
        { id: "ficar", label: "Dizer que fica com ela até a chuva passar", to: "porta", affinity: 2 },
        { id: "nome", label: "Perguntar o nome de quem sumiu", to: "porta", affinity: 1, clue: "Alguém escreveu com Helena e sumiu sem se despedir." },
        { id: "ir", label: "Dizer que já é tarde demais para essa história", to: "fim-fechado", affinity: -1 },
      ],
    },
    {
      id: "porta",
      speaker: "Helena",
      body: "Vocês duas estão na porta dos fundos. A cidade é só um brilho molhado. Helena segura o livro contra o peito. “Se sair comigo, eu conto o resto no caminho. Se ficar, eu deixo o livro na sua mesa amanhã, e a gente finge que esta noite não aconteceu. As duas coisas são honestas. Só não são a mesma.”",
      choices: [
        { id: "sair", label: "Sair com ela na chuva", to: "fim-chuva", affinity: 2 },
        { id: "amanha", label: "Pedir o livro amanhã, sem pressa", to: "fim-espera", affinity: 1 },
        { id: "fechar", label: "Trancar a porta e ir embora sozinha", to: "fim-fechado", affinity: -1 },
      ],
    },
    {
      id: "fim-chuva",
      music: "revelacao",
      ending: {
        key: "chuva",
        title: "A chuva não devolve",
        flower: "Jasmim-da-noite",
        body: "Helena abre o guarda-chuva pequeno demais para duas. Vocês riem disso e andam perto mesmo assim. No meio do quarteirão ela diz o nome da outra mulher, baixo, e em seguida o seu, como se estivesse trocando um segredo por outro. O beijo é breve, de quem ainda tem história para contar. O livro fica entre as duas, seco, enquanto a cidade molha o resto.",
      },
    },
    {
      id: "fim-espera",
      ending: {
        key: "espera",
        title: "Amanhã, na mesma mesa",
        flower: "Camélia",
        body: "Você devolve o livro, mas não a flor. Helena entende. “Amanhã”, ela diz, e não parece uma desculpa. De manhã, o romance está na mesa, com um bilhete novo: “Eu ainda estou. Se quiser, a última estante acende de novo.” A noite não se fecha. Só muda de hora.",
      },
    },
    {
      id: "fim-fechado",
      music: "despedida",
      ending: {
        key: "fechado",
        title: "A luz que se apaga",
        flower: "Folha seca",
        body: "A biblioteca volta a ser só uma sala. Você deixa o livro onde o encontrou, ou não chega a perguntar quem o escreveu. Lá fora, a chuva segue sem testemunha. Em algum lugar da última estante, uma luz espera mais um pouco e depois desiste. Nem todo segredo quer ser achado na primeira noite.",
      },
    },
  ],
};

const es: Story = {
  slug: "o-bilhete",
  title: "La nota en el último estante",
  author: "Luana Viana",
  rating: "16",
  genres: ["romance", "misterio", "slow burn"],
  minutes: 12,
  synopsis: "Después del cierre, un libro sin ficha espera en la mesa. La nota que hay dentro no pide ser leída. Pide que no lo devuelvan.",
  place: "Biblioteca antigua",
  start: "mesa",
  sound: "/sounds/rain.mp3",
  scenes: [
    {
      id: "mesa",
      music: "calma",
      body: "La lluvia se apoya en el vidrio. El último lector ya se fue, y la biblioteca se queda con el olor del papel mojado de quien llegó de la calle. En la mesa de devolución hay una novela sin ficha. Dentro, una nota breve, con letra firme: “No devuelvas este libro. Si quieres saber por qué, el último estante sigue encendido.”",
      choices: [
        { id: "abrir", label: "Abrir el libro antes de irte", to: "corredor", affinity: 1, clue: "La nota pide que el libro no sea devuelto." },
        { id: "ir", label: "Ir directo al último estante", to: "helena", affinity: 1, clue: "Alguien dejó el último estante encendido a propósito." },
        { id: "apagar", label: "Dejar la nota y apagar la luz", to: "fim-fechado", affinity: -1 },
      ],
    },
    {
      id: "corredor",
      speaker: "Tú",
      body: "La primera página tiene una flor seca, fina como papel de seda. Al margen, un nombre casi borrado: Helena. No es una dedicatoria. Parece un aviso que alguien tuvo miedo de terminar.",
      choices: [
        { id: "guardar", label: "Guardar la flor en el bolsillo", to: "helena", affinity: 1, clue: "Una flor seca marca el nombre Helena." },
        { id: "chamar", label: "Llamar a Helena, en voz baja", to: "helena", affinity: 2 },
      ],
    },
    {
      id: "helena",
      music: "romance",
      speaker: "Helena",
      body: "Está de rodillas entre los volúmenes grandes, y la lámpara le corta solo el rostro. El pelo mal recogido, las manos manchadas de cola de restauración. No se asusta. “No lo devolviste”, dice, y suena menos a pregunta que a alivio. “Este libro no es de la biblioteca. Es mío. Lo dejé para quien fuera capaz de no cumplir la regla.”",
      choices: [
        { id: "porque", label: "Preguntar por qué justo tú", to: "margem", affinity: 1 },
        { id: "medo", label: "Decir que esto parece una trampa", to: "margem", affinity: 0 },
        { id: "devolver", label: "Extenderle el libro de vuelta", to: "fim-espera", affinity: -1 },
      ],
    },
    {
      id: "margem",
      music: "suspense",
      speaker: "Helena",
      body: "“Porque la persona que escribió conmigo en este libro desapareció sin despedirse. El nombre al margen era su manera de decir que iba a volver. Hace un año. Me quedo después de hora porque, si entra, quiero que alguien siga aquí. Hoy llegaste tú primero.” La lluvia arrecia. Helena mira tu boca y luego aparta la vista, como quien se corrige.",
      choices: [
        { id: "ficar", label: "Decir que te quedas hasta que pase la lluvia", to: "porta", affinity: 2 },
        { id: "nome", label: "Preguntar el nombre de quien desapareció", to: "porta", affinity: 1, clue: "Alguien escribió con Helena y desapareció sin despedirse." },
        { id: "ir", label: "Decir que ya es demasiado tarde para esta historia", to: "fim-fechado", affinity: -1 },
      ],
    },
    {
      id: "porta",
      speaker: "Helena",
      body: "Las dos están en la puerta de atrás. La ciudad es solo un brillo mojado. Helena aprieta el libro contra el pecho. “Si sales conmigo, te cuento el resto en el camino. Si te quedas, dejo el libro en tu mesa mañana, y fingimos que esta noche no ocurrió. Las dos cosas son honestas. Solo que no son la misma.”",
      choices: [
        { id: "sair", label: "Salir con ella bajo la lluvia", to: "fim-chuva", affinity: 2 },
        { id: "amanha", label: "Pedir el libro mañana, sin prisa", to: "fim-espera", affinity: 1 },
        { id: "fechar", label: "Cerrar la puerta e irte sola", to: "fim-fechado", affinity: -1 },
      ],
    },
    {
      id: "fim-chuva",
      music: "revelacao",
      ending: {
        key: "chuva",
        title: "La lluvia no devuelve",
        flower: "Jazmín de noche",
        body: "Helena abre un paraguas demasiado chico para dos. Se ríen de eso y caminan cerca igual. A mitad de la cuadra dice el nombre de la otra mujer, bajo, y después el tuyo, como si cambiara un secreto por otro. El beso es breve, de quien todavía tiene historia que contar. El libro queda entre las dos, seco, mientras la ciudad moja todo lo demás.",
      },
    },
    {
      id: "fim-espera",
      ending: {
        key: "espera",
        title: "Mañana, en la misma mesa",
        flower: "Camelia",
        body: "Devuelves el libro, pero no la flor. Helena lo entiende. “Mañana”, dice, y no parece una excusa. Por la mañana, la novela está en la mesa, con una nota nueva: “Sigo aquí. Si quieres, el último estante se enciende otra vez.” La noche no se cierra. Solo cambia de hora.",
      },
    },
    {
      id: "fim-fechado",
      music: "despedida",
      ending: {
        key: "fechado",
        title: "La luz que se apaga",
        flower: "Hoja seca",
        body: "La biblioteca vuelve a ser solo una sala. Dejas el libro donde lo encontraste, o no llegas a preguntar quién lo escribió. Afuera, la lluvia sigue sin testigo. En algún lugar del último estante, una luz espera un poco más y después se rinde. No todo secreto quiere ser encontrado la primera noche.",
      },
    },
  ],
};

export const stories: Record<Lang, Story[]> = {
  pt: [pt, ...moreStories.pt],
  es: [es, ...moreStories.es],
  en: [ticketEn, ...moreStories.en],
};

export function getStory(lang: Lang, slug: string) {
  return stories[lang].find((story) => story.slug === slug) ?? null;
}

export function sceneOf(story: Story, id: string) {
  return story.scenes.find((scene) => scene.id === id) ?? story.scenes[0];
}

export function artOf(story: Story) {
  if (story.art) return story.art;
  const place = story.place.toLowerCase();
  if (place.includes("templ")) return "/scenes/templo.jpg";
  if (place.includes("varanda") || place.includes("balc")) return "/scenes/varanda.jpg";
  if (place.includes("caf")) return "/scenes/cafe.jpg";
  if (place.includes("praia") || place.includes("playa") || place.includes("beach")) return "/scenes/praia.jpg";
  return "/scenes/biblioteca.jpg";
}

export function authorSlug(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
