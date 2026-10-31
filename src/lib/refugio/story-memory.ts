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
    slug: "corredor",
    scene: "corredor",
    after: [
      { if: "porta714:braco", line: "O braço é a coisa concreta. Quando a voz doce diz o seu nome inteiro, os dedos da Iara apertam esse mesmo braço. A regra deixou de ser ideia. É a marca que você aceitou." },
      { if: "porta714:perguntar", line: "Você perguntou o que fica para trás antes de caminhar. Quando a voz pede para entrar, você já sabe qual frase é dela e qual é a outra. A boca da Iara forma: não. Você pediu a regra inteira. Isto é o resto." },
    ],
  },
  {
    slug: "corredor",
    scene: "elevador",
    after: [
      { if: "corredor:nao", line: "Você não virou. Por isso o espelho mostra duas Iaras e depois uma. A do seu braço entra de costas. Ela confia mais na sua nuca do que nas suas perguntas." },
      { if: "corredor:responder", line: "Você respondeu sem virar: não. A voz sabe que você ouviu. A Iara também. No espelho ela não agradece. Só diz para não perguntar qual das duas. Um não dito já é muito pescoço." },
    ],
  },
  {
    slug: "corredor",
    scene: "fim-saguao",
    after: [
      { if: "elevador:descer", line: "Você desceu com ela. O saguão feio é a regra funcionando. Ela bebe o café ruim porque você não a deixou no espelho." },
      { if: "elevador:segurar", line: "Você segurou a porta até ela entrar inteira. Por isso a segunda Iara não coube. Ela vai lembrar da porta mais do que de qualquer frase." },
    ],
    morning: {
      title: "Azul",
      body: "No café, ela está de azul. Come. Olha a sua mesa. Você senta na frente, como ela pediu. O pão é ruim e é o pão. Ninguém pede para entrar. Daqui para a frente, três batidas vêm com a cor dita antes. Você guarda isso como quem guarda a chave da pessoa certa.",
    },
    morningIf: [
      {
        if: "elevador:segurar",
        title: "A porta",
        body: "Ela escreve no papel do hotel, não no celular: “Você segurou a porta até eu entrar inteira. Hoje eu como de azul. Se eu não comer, passa reto.” No café, ela come. A cadeira da frente está no lugar. Você senta. De dia, o elevador é só um elevador.",
      },
    ],
  },
  {
    slug: "corredor",
    scene: "fim-virar",
    after: [
      { if: "corredor:virar", line: "Você virou no corredor. A mulher atrás tinha a boca da Iara e nenhuma das cautelas. O braço que você segurava esvaziou antes de o elevador escolher." },
      { if: "elevador:qual", line: "Você perguntou qual das duas estava no elevador. A pergunta foi um jeito de virar. O espelho respondeu primeiro. Se a carta chegar, não vai estar na mão dela." },
    ],
    morning: {
      title: "A cama quente",
      body: "De manhã a cadeira da Iara está vazia. O seu cartão abre o 714. A cama está quente e você não lembra de ter deitado. No banheiro, por um instante, alguém pisca com a sua cara. Você desce sem olhar o corredor. O saguão ainda funciona. Ninguém de azul está comendo.",
    },
    morningIf: [
      {
        if: "elevador:qual",
        title: "A pergunta",
        body: "Você não virou o pescoço. Virou com a frase. De manhã o espelho do elevador mostra só você, e isso não tranquiliza. O 714 abre. A cama quente não é memória sua. No saguão, uma mulher de azul olha o seu prato e não come. Você passa reto. A regra era essa, dita tarde.",
      },
    ],
  },
  {
    slug: "corredor",
    scene: "fim-batida",
    morning: {
      title: "A cadeira a menos",
      body: "O recepcionista repete que o 714 saiu à meia-noite. Debaixo da sua porta, o papel na sua letra continua: “Eu virei.” Você não virou. Ainda. No café, a cadeira da frente foi tirada. Você toma o café ruim de pé. Se ela estiver em algum lugar, é comendo. Não está. Você não sobe para procurar.",
    },
  },
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
    slug: "corredor",
    scene: "corredor",
    after: [
      { if: "porta714:braco", line: "El brazo es la cosa concreta. Cuando la voz dulce dice tu nombre entero, los dedos de Iara aprietan ese mismo brazo. La regla dejó de ser una idea. Es la marca que aceptaste." },
      { if: "porta714:perguntar", line: "Preguntaste qué queda atrás antes de caminar. Cuando la voz pide entrar, ya sabes cuál frase es de ella y cuál es la otra. La boca de Iara forma: no. Pediste la regla entera. Esto es el resto." },
    ],
  },
  {
    slug: "corredor",
    scene: "elevador",
    after: [
      { if: "corredor:nao", line: "No te diste vuelta. Por eso el espejo muestra dos Iaras y después una. La de tu brazo entra de espaldas. Confía más en tu nuca que en tus preguntas." },
      { if: "corredor:responder", line: "Respondiste sin volverte: no. La voz sabe que oíste. Iara también. En el espejo no agradece. Solo dice que no preguntes cuál de las dos. Un no dicho ya es mucho cuello." },
    ],
  },
  {
    slug: "corredor",
    scene: "fim-saguao",
    after: [
      { if: "elevador:descer", line: "Bajaste con ella. El vestíbulo feo es la regla funcionando. Bebe el café malo porque no la dejaste en el espejo." },
      { if: "elevador:segurar", line: "Sostuviste la puerta hasta que ella entró entera. Por eso la segunda Iara no cupo. Va a recordar la puerta más que cualquier frase." },
    ],
    morning: {
      title: "Azul",
      body: "En el desayuno está de azul. Come. Mira tu mesa. Te sientas enfrente, como pidió. El pan es malo y es el pan. Nadie pide entrar. De aquí en adelante, tres golpes vienen con el color dicho antes. Lo guardas como quien guarda la llave de la persona correcta.",
    },
    morningIf: [
      {
        if: "elevador:segurar",
        title: "La puerta",
        body: "Escribe en el papel del hotel, no en el celular: “Sostuviste la puerta hasta que entré entera. Hoy como de azul. Si no como, pasa de largo.” En el desayuno, come. La silla de enfrente está en su lugar. Te sientas. De día, el ascensor es solo un ascensor.",
      },
    ],
  },
  {
    slug: "corredor",
    scene: "fim-virar",
    after: [
      { if: "corredor:virar", line: "Te diste vuelta en el pasillo. La mujer de atrás tenía la boca de Iara y ninguna de sus cautelas. El brazo que sostenías se vació antes de que el ascensor eligiera." },
      { if: "elevador:qual", line: "Preguntaste cuál de las dos estaba en el ascensor. La pregunta fue una manera de volverte. El espejo respondió primero. Si la carta llega, no va a estar en su mano." },
    ],
    morning: {
      title: "La cama tibia",
      body: "De mañana la silla de Iara está vacía. Tu tarjeta abre el 714. La cama está tibia y no recuerdas haberte acostado. En el baño, por un instante, alguien parpadea con tu cara. Bajas sin mirar el pasillo. El vestíbulo todavía funciona. Nadie de azul está comiendo.",
    },
    morningIf: [
      {
        if: "elevador:qual",
        title: "La pregunta",
        body: "No giraste el cuello. Giraste con la frase. De mañana el espejo del ascensor te muestra solo a ti, y eso no tranquiliza. El 714 se abre. La cama tibia no es un recuerdo tuyo. En el vestíbulo, una mujer de azul mira tu plato y no come. Pasas de largo. La regla era esa, dicha tarde.",
      },
    ],
  },
  {
    slug: "corredor",
    scene: "fim-batida",
    morning: {
      title: "La silla de menos",
      body: "El recepcionista repite que el 714 hizo el check-out a medianoche. Debajo de tu puerta, el papel con tu letra sigue: “Me di vuelta.” Tú no te diste vuelta. Todavía. En el desayuno, la silla de enfrente fue retirada. Tomas el café malo de pie. Si ella está en algún lugar, es comiendo. No está. No subes a buscarla.",
    },
  },
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
    slug: "corredor",
    scene: "corredor",
    after: [
      { if: "porta714:braco", line: "The arm is the concrete thing. When the sweet voice says your whole name, Iara’s fingers tighten on that same arm. The rule is no longer an idea. It is the mark you agreed to." },
      { if: "porta714:perguntar", line: "You asked what stays behind before you walked. When the voice asks to come in, you already know which sentence is hers and which is the other. Iara’s mouth forms: no. You asked for the whole rule. This is the rest." },
    ],
  },
  {
    slug: "corredor",
    scene: "elevador",
    after: [
      { if: "corredor:nao", line: "You didn’t turn. That’s why the mirror shows two Iaras and then one. The one on your arm steps in backward. She trusts the back of your head more than your questions." },
      { if: "corredor:responder", line: "You answered without turning: no. The voice knows you heard. Iara heard too. In the mirror she doesn’t thank you. She only says don’t ask which of us. A spoken no is already a lot of neck." },
    ],
  },
  {
    slug: "corredor",
    scene: "fim-saguao",
    after: [
      { if: "elevador:descer", line: "You went down with her. The ugly lobby is the rule working. She drinks the bad coffee because you didn’t leave her at the mirror." },
      { if: "elevador:segurar", line: "You held the door until she was all the way in. That’s why the second Iara didn’t fit. She will remember the door more than any sentence." },
    ],
    morning: {
      title: "Blue",
      body: "At breakfast she is in blue. She eats. She looks at your table. You sit across from her, as she asked. The bread is bad and it is the bread. No one asks to come in. From here on, three knocks come with the color said first. You keep that the way you keep the key to the right person.",
    },
    morningIf: [
      {
        if: "elevador:segurar",
        title: "The door",
        body: "She writes on hotel paper, not on the phone: “You held the door until I was all the way in. Today I eat in blue. If I’m not eating, walk past.” At breakfast, she eats. The chair across from you is in its place. You sit. By day, the elevator is only an elevator.",
      },
    ],
  },
  {
    slug: "corredor",
    scene: "fim-virar",
    after: [
      { if: "corredor:virar", line: "You turned in the corridor. The woman behind had Iara’s mouth and none of her caution. The arm you were holding emptied before the elevator chose." },
      { if: "elevador:qual", line: "You asked which of them was in the elevator. The question was a way of turning. The mirror answered first. If the letter comes, it will not be in her hand." },
    ],
    morning: {
      title: "The warm bed",
      body: "In the morning Iara’s chair is empty. Your card opens 714. The bed is warm and you don’t remember lying down. In the bathroom, for a moment, someone blinks with your face. You go down without looking at the corridor. The lobby still works. No one in blue is eating.",
    },
    morningIf: [
      {
        if: "elevador:qual",
        title: "The question",
        body: "You didn’t turn your neck. You turned with the sentence. In the morning the elevator mirror shows only you, and that doesn’t settle anything. 714 opens. The warm bed is not a memory of yours. In the lobby, a woman in blue looks at your plate and doesn’t eat. You walk past. That was the rule, said late.",
      },
    ],
  },
  {
    slug: "corredor",
    scene: "fim-batida",
    morning: {
      title: "The missing chair",
      body: "The receptionist repeats that 714 checked out at midnight. Under your door, the paper in your handwriting is still there: “I turned.” You didn’t turn. Not yet. At breakfast the chair across from you has been taken away. You drink the bad coffee standing up. If she is anywhere, she is eating. She isn’t. You don’t go up to look.",
    },
  },
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
