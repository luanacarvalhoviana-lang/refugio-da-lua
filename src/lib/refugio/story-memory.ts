import type { Lang, Story } from "@/lib/refugio/stories";
import { applyFrames } from "@/lib/refugio/scene-frames";

type Line = { if: string; line: string };
type Morning = { title: string; body: string };
type Beat = {
  slug: string;
  scene: string;
  after?: Line[];
  morning?: Morning;
  morningIf?: Array<Morning & { if: string }>;
};

const pt: Beat[] = [











  {
    slug: "depoimento",
    scene: "frase",
    after: [
      { if: "sala:tarde", line: "Você disse que a mão chegou tarde. A Elisa não escreve “tarde”. Espera, porque ouviu você escolher o nome menor para o que viu. O gravador está ligado. A frase verdadeira continua na sua boca, pela metade." },
      { if: "sala:pulo", line: "Você disse que a Soraia não pulou. A sala muda de temperatura. A caneta da Elisa para. Ela não agradece. Diz o preço da frase, inclusive a irmã, e não oferece a linha fácil de volta." },
    ],
  },
  {
    slug: "depoimento",
    scene: "fim-versao",
    after: [
      { if: "del:repetir", line: "Você assinou a versão da Duda no corredor, com a jaqueta ainda no prédio. A Elisa fechou o arquivo como quem fecha uma dívida de família." },
      { if: "hospital:segredo", line: "Você prometeu segredo à Soraia e o papel mesmo assim salvou a Duda. A omissão tem dois endereços. A Soraia vai ler os dois." },
    ],
    morning: {
      title: "O arquivo",
      body: "A Elisa não agradece de manhã. O arquivo fecha com a sua omissão dentro. A Soraia não responde. A Duda manda um áudio que você não toca. A jaqueta fica onde ficou. Você foi leal à pessoa que estava na frente. A de trás, hoje, não escreve o seu nome.",
    },
    morningIf: [
      {
        if: "hospital:segredo",
        title: "O segredo",
        body: "Você prometeu segredo à Soraia e o papel saiu com a versão da Duda. De manhã a Soraia manda uma linha: “Segredo também é assinatura.” A Elisa não procura você. O gravador não precisa. Você já sabe qual frase ficou de fora, e em que quarto ela foi pedida.",
      },
    ],
  },
  {
    slug: "depoimento",
    scene: "fim-nome",
    after: [
      { if: "frase:nome", line: "Você pôs o nome da Soraia no gravador antes de vê-la. A cara da Elisa fez a quebra limpa. A frase chegou ao arquivo sem o hospital." },
      { if: "del:rasgar", line: "Você rasgou a versão da Duda no corredor e recomeçou. O papel rasgado é o motivo de a Elisa acreditar. Papel mente mais fácil do que um rasgo." },
      { if: "hospital:gravar", line: "Você trouxe a frase da cama: elas iam embora juntas, a Elisa não sabia, a mão abriu. O gravador tem o hospital dentro, não só a cobertura." },
    ],
    morning: {
      title: "A cadeira",
      body: "De manhã a Elisa não pede consolo e não oferece. Manda: “Registrei. Não vem me explicar.” Você fica com a cadeira, o único pedido de desculpa que não mente. A Soraia, rouca, não chama. Se chamar, será para ouvir de novo, não para agradecer.",
    },
    morningIf: [
      {
        if: "hospital:gravar",
        title: "A frase dela",
        body: "Você voltou com a frase inteira. De manhã a Soraia escreve do hospital: “Eu ouvi a minha voz no que contaram. Não embelezou. Isso basta por hoje.” A Elisa não oferece conversa. A Duda passa a manhã sem a jaqueta e sem o por favor. O arquivo deixou de ser de vocês duas.",
      },
    ],
  },
  {
    slug: "depoimento",
    scene: "fim-silencio",
    after: [
      { if: "sala:advogada", line: "Você não falou sem alguém do seu lado. A Elisa desligou o gravador. A noite ficou sua, e outras pessoas já estão escrevendo ela." },
      { if: "del:sair", line: "Você saiu sem assinar, depois de ver a boca da Duda dizer por favor. A chuva ficou com a frase que você não deu à sala." },
      { if: "hospital:ficar", line: "Você ficou com a Soraia e não voltou à sala. O silêncio escolheu uma cadeira, não uma estratégia. Por isso, em casa, você sabe qual batida abrir." },
    ],
    morning: {
      title: "A batida",
      body: "Em casa, de manhã, a madeira ainda tem o ritmo das duas. Você abriu para a Soraia. A da Duda ficou sem resposta. Não há arquivo com a sua letra. Há uma cadeira que não é a do hospital. A Soraia senta. Não pede a cobertura hoje. Você também não oferece a frase fácil.",
    },
    morningIf: [
      {
        if: "sala:advogada",
        title: "Sem frase",
        body: "Você não falou. De manhã a Elisa não insiste. A noite, como ela avisou, já tem outra autora. A Duda conta a versão dela em algum corredor. A Soraia manda: “Não precisa da delegacia para dizer a frase. Precisa dizer.” Você ainda não diz. A porta, pelo menos, você sabe para quem abre.",
      },
      {
        if: "hospital:ficar",
        title: "A cadeira do hospital",
        body: "Você ficou. De manhã o depoimento continua sem a sua assinatura, e a Soraia continua com a sua presença, que não entra em arquivo. Ela manda, tarde: “Não volta na sala por mim. Se for falar, fala direito, e não hoje.” Você obedece ao hoje. A cadeira ainda está lá quando você levanta.",
      },
    ],
  },
];

const es: Beat[] = [











  {
    slug: "depoimento",
    scene: "frase",
    after: [
      { if: "sala:tarde", line: "Dijiste que la mano llegó tarde. Elisa no escribe “tarde”. Espera, porque te oyó elegir el nombre menor para lo que viste. La grabadora está encendida. La frase verdadera sigue en tu boca, a medias." },
      { if: "sala:pulo", line: "Dijiste que Soraia no saltó. La sala cambia de temperatura. La lapicera de Elisa se detiene. No agradece. Dice el precio de la frase, incluida la hermana, y no te devuelve la línea fácil." },
    ],
  },
  {
    slug: "depoimento",
    scene: "fim-versao",
    after: [
      { if: "del:repetir", line: "Firmaste la versión de Duda en el pasillo, con la chaqueta todavía en el edificio. Elisa cerró el archivo como quien cierra una deuda de familia." },
      { if: "hospital:segredo", line: "Le prometiste secreto a Soraia y el papel igual salvó a Duda. La omisión tiene dos direcciones. Soraia va a leer las dos." },
    ],
    morning: {
      title: "El archivo",
      body: "Elisa no agradece de mañana. El archivo se cierra con tu omisión adentro. Soraia no responde. Duda manda un audio que no reproduces. La chaqueta se queda donde se quedó. Fuiste leal a la persona que estaba delante. La de atrás, hoy, no escribe tu nombre.",
    },
    morningIf: [
      {
        if: "hospital:segredo",
        title: "El secreto",
        body: "Le prometiste secreto a Soraia y el papel salió con la versión de Duda. De mañana Soraia manda una línea: “El secreto también es una firma.” Elisa no te busca. La grabadora no hace falta. Ya sabes qué frase quedó afuera, y en qué cuarto se pidió.",
      },
    ],
  },
  {
    slug: "depoimento",
    scene: "fim-nome",
    after: [
      { if: "frase:nome", line: "Pusiste el nombre de Soraia en la grabadora antes de verla. La cara de Elisa hizo la quiebra limpia. La frase llegó al archivo sin el hospital." },
      { if: "del:rasgar", line: "Romiste la versión de Duda en el pasillo y empezaste de nuevo. El papel roto es el motivo de que Elisa crea. El papel miente más fácil que un desgarro." },
      { if: "hospital:gravar", line: "Trajiste la frase desde la cama: se iban juntas, Elisa no lo sabía, la mano se abrió. La grabadora tiene el hospital adentro, no solo la terraza." },
    ],
    morning: {
      title: "La silla",
      body: "De mañana Elisa no pide consuelo y no lo ofrece. Manda: “Lo registré. No vengas a explicarme.” Te quedas con la silla, el único pedido de disculpa que no miente. Soraia, ronca, no llama. Si llama, será para oír de nuevo, no para agradecer.",
    },
    morningIf: [
      {
        if: "hospital:gravar",
        title: "La frase de ella",
        body: "Volviste con la frase entera. De mañana Soraia escribe desde el hospital: “Oí mi voz en lo que contaron. No la adornaste. Con eso basta por hoy.” Elisa no ofrece conversación. Duda pasa la mañana sin la chaqueta y sin el por favor. El archivo dejó de ser de ustedes dos.",
      },
    ],
  },
  {
    slug: "depoimento",
    scene: "fim-silencio",
    after: [
      { if: "sala:advogada", line: "No hablaste sin alguien de tu lado. Elisa apagó la grabadora. La noche se quedó tuya, y otras personas ya la están escribiendo." },
      { if: "del:sair", line: "Saliste sin firmar, después de ver la boca de Duda decir por favor. La lluvia se quedó con la frase que no le diste a la sala." },
      { if: "hospital:ficar", line: "Te quedaste con Soraia y no volviste a la sala. El silencio eligió una silla, no una estrategia. Por eso, en casa, sabes qué golpe abrir." },
    ],
    morning: {
      title: "El golpe",
      body: "En casa, de mañana, la madera todavía tiene el ritmo de las dos. Abriste a Soraia. El de Duda se quedó sin respuesta. No hay archivo con tu letra. Hay una silla que no es la del hospital. Soraia se sienta. No pide la terraza hoy. Tú tampoco ofreces la frase fácil.",
    },
    morningIf: [
      {
        if: "sala:advogada",
        title: "Sin frase",
        body: "No hablaste. De mañana Elisa no insiste. La noche, como avisó, ya tiene otra autora. Duda cuenta su versión en algún pasillo. Soraia manda: “No hace falta la comisaría para decir la frase. Hace falta decirla.” Todavía no la dices. La puerta, al menos, sabes para quién se abre.",
      },
      {
        if: "hospital:ficar",
        title: "La silla del hospital",
        body: "Te quedaste. De mañana la declaración sigue sin tu firma, y Soraia sigue con tu presencia, que no entra en un archivo. Manda, tarde: “No vuelvas a la sala por mí. Si vas a hablar, habla bien, y no hoy.” Obedeces al hoy. La silla sigue ahí cuando te levantas.",
      },
    ],
  },
];

const en: Beat[] = [











  {
    slug: "depoimento",
    scene: "frase",
    after: [
      { if: "sala:tarde", line: "You said the hand arrived late. Elisa doesn’t write “late.” She waits, because she heard you choose the smaller name for what you saw. The recorder is on. The true sentence is still in your mouth, unfinished." },
      { if: "sala:pulo", line: "You said Soraia didn’t jump. The room changes temperature. Elisa’s pen stops. She doesn’t thank you. She tells you the price of the sentence, including her sister, and she does not hand the easy line back." },
    ],
  },
  {
    slug: "depoimento",
    scene: "fim-versao",
    after: [
      { if: "del:repetir", line: "You signed Duda’s version in the corridor, with the jacket still in the building. Elisa closed the file the way you close a family debt." },
      { if: "hospital:segredo", line: "You promised Soraia secrecy and the paper still saved Duda. The omission has two addresses. Soraia will read both." },
    ],
    morning: {
      title: "The file",
      body: "Elisa doesn’t thank you in the morning. The file closes with your omission inside it. Soraia doesn’t answer. Duda sends a voice note you don’t play. The jacket stays where it stayed. You were loyal to the person in front of you. The one behind, today, doesn’t write your name.",
    },
    morningIf: [
      {
        if: "hospital:segredo",
        title: "The secret",
        body: "You promised Soraia secrecy and the paper came out as Duda’s version. In the morning Soraia sends one line: “A secret is a signature too.” Elisa doesn’t look for you. The recorder doesn’t need to. You already know which sentence was left out, and in which room it was asked for.",
      },
    ],
  },
  {
    slug: "depoimento",
    scene: "fim-nome",
    after: [
      { if: "frase:nome", line: "You put Soraia’s name in the recorder before you saw her. Elisa’s face did the clean break. The sentence reached the file without the hospital." },
      { if: "del:rasgar", line: "You tore Duda’s version in the corridor and started over. The torn page is why Elisa believes you. Paper lies more easily than a tear." },
      { if: "hospital:gravar", line: "You brought the sentence back from the bed: they were leaving together, Elisa didn’t know, the hand opened. The recorder has the hospital in it, not only the terrace." },
    ],
    morning: {
      title: "The chair",
      body: "In the morning Elisa doesn’t ask for comfort and doesn’t offer it. She sends: “I filed it. Don’t come explain.” You keep the chair, the only apology that doesn’t lie. Soraia, hoarse, doesn’t call. If she calls, it will be to hear it again, not to thank you.",
    },
    morningIf: [
      {
        if: "hospital:gravar",
        title: "Her sentence",
        body: "You came back with the whole sentence. In the morning Soraia writes from the hospital: “I heard my voice in what they told. You didn’t decorate it. That’s enough for today.” Elisa doesn’t offer a conversation. Duda spends the morning without the jacket and without the please. The file stopped being the two of yours.",
      },
    ],
  },
  {
    slug: "depoimento",
    scene: "fim-silencio",
    after: [
      { if: "sala:advogada", line: "You wouldn’t speak without someone on your side. Elisa turned the recorder off. The night stayed yours, and other people are already writing it." },
      { if: "del:sair", line: "You walked out unsigned, after you saw Duda’s mouth say please. The rain kept the sentence you didn’t give the room." },
      { if: "hospital:ficar", line: "You stayed with Soraia and didn’t go back to the room. The silence chose a chair, not a strategy. That’s why, at home, you know which knock to open." },
    ],
    morning: {
      title: "The knock",
      body: "At home, in the morning, the wood still has both rhythms. You opened for Soraia. Duda’s knock went unanswered. There is no file in your handwriting. There is a chair that isn’t the hospital’s. Soraia sits. She doesn’t ask for the terrace today. You don’t offer the easy sentence either.",
    },
    morningIf: [
      {
        if: "sala:advogada",
        title: "No sentence",
        body: "You didn’t speak. In the morning Elisa doesn’t insist. The night, as she warned, already has another author. Duda tells her version in some corridor. Soraia sends: “You don’t need the station to say the sentence. You need to say it.” You still don’t. The door, at least, you know who it opens for.",
      },
      {
        if: "hospital:ficar",
        title: "The hospital chair",
        body: "You stayed. In the morning the statement is still without your signature, and Soraia still has your presence, which doesn’t go into a file. She sends, late: “Don’t go back to the room for me. If you’re going to speak, speak it right, and not today.” You obey today. The chair is still there when you stand up.",
      },
    ],
  },
];

const packs: Record<Lang, Beat[]> = { pt, es, en };

function knownPicks(story: Story) {
  const ids = new Set<string>();
  for (const scene of story.scenes) {
    for (const choice of scene.choices ?? []) ids.add(`${scene.id}:${choice.id}`);
  }
  return ids;
}

export function applyMemory(book: Record<Lang, Story[]>) {
  for (const lang of ["pt", "es", "en"] as const) {
    for (const beat of packs[lang]) {
      const story = book[lang].find((item) => item.slug === beat.slug);
      const scene = story?.scenes.find((item) => item.id === beat.scene);
      if (!story || !scene) throw new Error(`memory: ${lang} ${beat.slug} ${beat.scene}`);
      const known = knownPicks(story);
      const keys = [
        ...(beat.after ?? []).map((item) => item.if),
        ...(beat.morningIf ?? []).map((item) => item.if),
      ];
      for (const key of keys) {
        if (!known.has(key)) throw new Error(`memory pick: ${lang} ${beat.slug} ${key}`);
      }
      if (beat.after) scene.after = beat.after;
      if ((beat.morning || beat.morningIf) && !scene.ending) {
        throw new Error(`memory morning: ${lang} ${beat.slug} ${beat.scene}`);
      }
      if (beat.morning && scene.ending) scene.ending.morning = beat.morning;
      if (beat.morningIf && scene.ending) scene.ending.morningIf = beat.morningIf;
    }
  }
  applyFrames(book);
  return book;
}
