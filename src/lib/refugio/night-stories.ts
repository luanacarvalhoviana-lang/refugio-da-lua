import type { Lang, Story } from "@/lib/refugio/stories";

const lampadaPt: Story = {
  slug: "a-lampada",
  title: "A lâmpada que não devia acender",
  author: "Luana Viana",
  rating: "16",
  genres: ["romance", "mistério"],
  minutes: 8,
  synopsis: "Depois que o jardim fecha, uma lâmpada continua acesa no pátio. Quem a acendeu pediu para não ser chamada pelo nome antigo.",
  place: "Templo de areia",
  art: "/scenes/templo.jpg",
  start: "patio",
  access: "cheia",
  sound: "/sounds/rain.mp3",
  scenes: [
    {
      id: "patio",
      music: "templo",
      body: "O portão lateral está só encostado. Lá dentro, o pátio cheira a jasmim molhado e a pedra quente do dia. Todas as lâmpadas deviam estar apagadas. Uma não está. Debaixo dela, um lenço claro, dobrado, e um bilhete: “Se for ela, não me chame pelo nome antigo.”",
      choices: [
        { id: "ler", label: "Ler o bilhete outra vez", to: "sombra", affinity: 1, clue: "O bilhete pede para não usar o nome antigo." },
        { id: "chamar", label: "Chamar baixinho, sem nome", to: "sombra", affinity: 2 },
        { id: "ir", label: "Sair e deixar a lâmpada acesa", to: "fim-porta", affinity: -1 },
      ],
    },
    {
      id: "sombra",
      music: "luar",
      speaker: "Mali",
      body: "Mali está descalça na beira da água rasa. O cabelo preso com o próprio lenço que você achou que estava no chão. Ela não se vira logo. “Eu apago essa lâmpada toda noite. Alguém acende de novo. Durante um ano eu achei que era o vento.”",
      choices: [
        { id: "quem", label: "Perguntar quem ela espera", to: "nome", affinity: 1, clue: "Faz um ano que a lâmpada acende sozinha." },
        { id: "ficar", label: "Dizer que pode esperar com ela", to: "nome", affinity: 2 },
        { id: "medo", label: "Dizer que isso parece uma carta para outra pessoa", to: "fim-nome", affinity: 0 },
      ],
    },
    {
      id: "nome",
      speaker: "Mali",
      body: "“O nome dela era Areum, e eu não digo isso em voz alta desde que ela foi embora para um trabalho que não cabia neste pátio. Ontem o lenço voltou. Não sei se é ela. Sei que você ficou, e isso já é mais do que a lâmpada faz.”",
      choices: [
        { id: "esperar", label: "Ficar até a lâmpada apagar", to: "fim-lampada", affinity: 2 },
        { id: "verdade", label: "Perguntar o que Mali quer, se for Areum", to: "fim-nome", affinity: 1, clue: "Areum foi embora para um trabalho longe do pátio." },
        { id: "embora", label: "Dizer que nome antigo não se devolve", to: "fim-porta", affinity: -1 },
      ],
    },
    {
      id: "fim-lampada",
      music: "luar",
      ending: {
        key: "lampada",
        title: "A lâmpada aceita companhia",
        flower: "Lótus",
        body: "Mali deixa você acender a segunda lâmpada, a pequena, a que nunca foi ritual. Vocês sentam no degrau. Quando a primeira se apaga sozinha, ela ri baixo, quase um susto. “Então não era o vento.” O ombro dela encosta no seu. Não é despedida e não é pressa. É a noite concordando em ficar um pouco maior.",
      },
    },
    {
      id: "fim-nome",
      ending: {
        key: "nome",
        title: "O nome que volta devagar",
        flower: "Gardênia",
        body: "Você não promete achar Areum. Mali também não pede. Ela dobra o lenço e coloca na sua mão. “Se ela vier, devolve. Se não vier, fica comigo até eu aprender outro jeito de apagar a luz.” No portão, o beijo é curto, de quem ainda tem cuidado. A lâmpada continua acesa atrás de vocês, mas já não parece um chamado. Parece uma casa.",
      },
    },
    {
      id: "fim-porta",
      music: "despedida",
      ending: {
        key: "porta",
        title: "O portão encostado",
        flower: "Pedra lisa",
        body: "Você sai antes de saber o nome. A lâmpada fica para trás, fiel a alguém que talvez não volte nesta noite. O pátio não corre atrás de você. Algumas esperas são de uma pessoa só, e forçar a porta seria outra forma de não ouvir.",
      },
    },
  ],
};

const lampadaEs: Story = {
  slug: "a-lampada",
  title: "La lámpara que no debía encenderse",
  author: "Luana Viana",
  rating: "16",
  genres: ["romance", "misterio"],
  minutes: 8,
  synopsis: "Cuando el jardín cierra, una lámpara sigue encendida en el patio. Quien la encendió pidió que no la llamaran por el nombre antiguo.",
  place: "Templo de arena",
  art: "/scenes/templo.jpg",
  start: "patio",
  access: "cheia",
  sound: "/sounds/rain.mp3",
  scenes: [
    {
      id: "patio",
      music: "templo",
      body: "La puerta lateral está apenas apoyada. Adentro, el patio huele a jazmín mojado y a piedra caliente del día. Todas las lámparas debían estar apagadas. Una no lo está. Debajo, un pañuelo claro, doblado, y una nota: “Si es ella, no me llames por el nombre antiguo.”",
      choices: [
        { id: "ler", label: "Leer la nota otra vez", to: "sombra", affinity: 1, clue: "La nota pide no usar el nombre antiguo." },
        { id: "chamar", label: "Llamar bajito, sin nombre", to: "sombra", affinity: 2 },
        { id: "ir", label: "Salir y dejar la lámpara encendida", to: "fim-porta", affinity: -1 },
      ],
    },
    {
      id: "sombra",
      music: "luar",
      speaker: "Mali",
      body: "Mali está descalza al borde del agua baja. El pelo sujeto con el mismo pañuelo que creíste ver en el suelo. No se vuelve enseguida. “Apago esa lámpara todas las noches. Alguien la enciende de nuevo. Durante un año creí que era el viento.”",
      choices: [
        { id: "quem", label: "Preguntar a quién espera", to: "nome", affinity: 1, clue: "Hace un año que la lámpara se enciende sola." },
        { id: "ficar", label: "Decir que puedes esperar con ella", to: "nome", affinity: 2 },
        { id: "medo", label: "Decir que esto parece una carta para otra persona", to: "fim-nome", affinity: 0 },
      ],
    },
    {
      id: "nome",
      speaker: "Mali",
      body: "“Su nombre era Areum, y no lo digo en voz alta desde que se fue por un trabajo que no cabía en este patio. Ayer volvió el pañuelo. No sé si es ella. Sé que tú te quedaste, y eso ya es más de lo que hace la lámpara.”",
      choices: [
        { id: "esperar", label: "Quedarte hasta que la lámpara se apague", to: "fim-lampada", affinity: 2 },
        { id: "verdade", label: "Preguntar qué quiere Mali, si es Areum", to: "fim-nome", affinity: 1, clue: "Areum se fue por un trabajo lejos del patio." },
        { id: "embora", label: "Decir que un nombre antiguo no se devuelve", to: "fim-porta", affinity: -1 },
      ],
    },
    {
      id: "fim-lampada",
      music: "luar",
      ending: {
        key: "lampada",
        title: "La lámpara acepta compañía",
        flower: "Loto",
        body: "Mali deja que enciendas la segunda lámpara, la pequeña, la que nunca fue ritual. Se sientan en el escalón. Cuando la primera se apaga sola, ella ríe bajo, casi un susto. “Entonces no era el viento.” Su hombro se apoya en el tuyo. No es despedida y no es prisa. Es la noche aceptando quedarse un poco más grande.",
      },
    },
    {
      id: "fim-nome",
      ending: {
        key: "nome",
        title: "El nombre que vuelve despacio",
        flower: "Gardenia",
        body: "No prometes encontrar a Areum. Mali tampoco lo pide. Dobla el pañuelo y lo pone en tu mano. “Si ella viene, devuélvelo. Si no viene, quédate conmigo hasta que aprenda otra forma de apagar la luz.” En la puerta, el beso es corto, de quien todavía tiene cuidado. La lámpara sigue encendida detrás, pero ya no parece un llamado. Parece una casa.",
      },
    },
    {
      id: "fim-porta",
      music: "despedida",
      ending: {
        key: "porta",
        title: "La puerta apoyada",
        flower: "Piedra lisa",
        body: "Sales antes de saber el nombre. La lámpara se queda atrás, fiel a alguien que quizá no vuelva esta noche. El patio no corre detrás de ti. Algunas esperas son de una sola persona, y forzar la puerta sería otra forma de no escuchar.",
      },
    },
  ],
};

const luaPt: Story = {
  slug: "antes-da-lua",
  title: "Um dia antes da lua",
  author: "Luana Viana",
  rating: "16",
  genres: ["romance"],
  minutes: 6,
  synopsis: "A lua cheia é amanhã. O bilhete debaixo da porta chegou hoje, com a letra de uma mulher que disse que só voltaria quando a lua estivesse inteira.",
  place: "Varanda",
  art: "/scenes/varanda.jpg",
  start: "porta",
  access: "antecipada",
  opensOn: "2026-11-05",
  sound: "/sounds/rain.mp3",
  scenes: [
    {
      id: "porta",
      music: "calma",
      body: "O prédio está quieto. Debaixo da porta, um papel dobrado em quatro. “Não espera a lua. Eu errei o dia, ou a lua errou. Estou na varanda do terceiro, se ainda quiser a conversa que a gente não teve.”",
      choices: [
        { id: "subir", label: "Subir agora", to: "varanda", affinity: 2, clue: "O bilhete chegou um dia antes da lua cheia." },
        { id: "esperar", label: "Esperar a lua de verdade", to: "fim-tarde", affinity: 0 },
        { id: "guardar", label: "Guardar o bilhete e não responder", to: "fim-gaveta", affinity: -1 },
      ],
    },
    {
      id: "varanda",
      music: "luar",
      speaker: "Nima",
      body: "Nima está sentada no chão da varanda, as costas na grade, uma caneca nas duas mãos. “Eu disse lua cheia porque tive medo de chegar cedo demais. Aí cheguei cedo mesmo assim.” A cidade embaixo é só janela acesa.",
      choices: [
        { id: "cedo", label: "Dizer que cedo, hoje, está certo", to: "fim-cedo", affinity: 2 },
        { id: "medo", label: "Perguntar do que ela teve medo", to: "fim-cedo", affinity: 1, clue: "Nima adiantou a volta porque teve medo de chegar tarde." },
        { id: "descer", label: "Dizer que a conversa combinada era amanhã", to: "fim-tarde", affinity: -1 },
      ],
    },
    {
      id: "fim-cedo",
      music: "luar",
      ending: {
        key: "cedo",
        title: "A lua não se ofende",
        flower: "Jasmim",
        body: "Nima abre espaço no chão. Vocês ficam olhando um céu que ainda não está inteiro. “Amanhã a lua vem”, ela diz, “e eu já estou aqui.” O beijo tem gosto de chá frio. Nenhuma das duas levanta para ir embora. A conversa que faltava cabe antes da data.",
      },
    },
    {
      id: "fim-tarde",
      ending: {
        key: "tarde",
        title: "Amanhã, como foi dito",
        flower: "Camélia branca",
        body: "Você não sobe, ou sobe e desce. Nima aceita. “Então amanhã”, ela diz, e desta vez não parece medo. De manhã o bilhete não está mais debaixo da porta. No lugar, um grão de arroz doce embrulhado em papel: “A lua pode chegar no horário. Eu também.”",
      },
    },
    {
      id: "fim-gaveta",
      music: "despedida",
      ending: {
        key: "gaveta",
        title: "O papel na gaveta",
        flower: "Folha",
        body: "O bilhete fica fechado junto com coisas que você não está pronta para responder. A lua, amanhã, vai estar inteira do mesmo jeito. Nem todo chamado precisa ser atendido na noite em que chega. Alguns só precisam ser guardados sem serem rasgados.",
      },
    },
  ],
};

const luaEs: Story = {
  slug: "antes-da-lua",
  title: "Un día antes de la luna",
  author: "Luana Viana",
  rating: "16",
  genres: ["romance"],
  minutes: 6,
  synopsis: "La luna llena es mañana. La nota bajo la puerta llegó hoy, con la letra de una mujer que dijo que solo volvería cuando la luna estuviera entera.",
  place: "Balcón",
  art: "/scenes/varanda.jpg",
  start: "porta",
  access: "antecipada",
  opensOn: "2026-11-05",
  sound: "/sounds/rain.mp3",
  scenes: [
    {
      id: "porta",
      music: "calma",
      body: "El edificio está quieto. Bajo la puerta, un papel doblado en cuatro. “No esperes la luna. Me equivoqué de día, o la luna se equivocó. Estoy en el balcón del tercero, si todavía quieres la conversación que no tuvimos.”",
      choices: [
        { id: "subir", label: "Subir ahora", to: "varanda", affinity: 2, clue: "La nota llegó un día antes de la luna llena." },
        { id: "esperar", label: "Esperar la luna de verdad", to: "fim-tarde", affinity: 0 },
        { id: "guardar", label: "Guardar la nota y no responder", to: "fim-gaveta", affinity: -1 },
      ],
    },
    {
      id: "varanda",
      music: "luar",
      speaker: "Nima",
      body: "Nima está sentada en el suelo del balcón, la espalda en la reja, una taza en las dos manos. “Dije luna llena porque tuve miedo de llegar demasiado pronto. Y llegué pronto igual.” La ciudad abajo es solo ventana encendida.",
      choices: [
        { id: "cedo", label: "Decir que pronto, hoy, está bien", to: "fim-cedo", affinity: 2 },
        { id: "medo", label: "Preguntar de qué tuvo miedo", to: "fim-cedo", affinity: 1, clue: "Nima adelantó la vuelta por miedo a llegar tarde." },
        { id: "descer", label: "Decir que la conversación era mañana", to: "fim-tarde", affinity: -1 },
      ],
    },
    {
      id: "fim-cedo",
      music: "luar",
      ending: {
        key: "cedo",
        title: "La luna no se ofende",
        flower: "Jazmín",
        body: "Nima abre espacio en el suelo. Se quedan mirando un cielo que todavía no está entero. “Mañana viene la luna”, dice, “y yo ya estoy aquí.” El beso sabe a té frío. Ninguna de las dos se levanta para irse. La conversación que faltaba cabe antes de la fecha.",
      },
    },
    {
      id: "fim-tarde",
      ending: {
        key: "tarde",
        title: "Mañana, como se dijo",
        flower: "Camelia blanca",
        body: "No subes, o subes y bajas. Nima acepta. “Entonces mañana”, dice, y esta vez no parece miedo. Por la mañana la nota ya no está bajo la puerta. En su lugar, un grano de arroz dulce envuelto en papel: “La luna puede llegar a horario. Yo también.”",
      },
    },
    {
      id: "fim-gaveta",
      music: "despedida",
      ending: {
        key: "gaveta",
        title: "El papel en el cajón",
        flower: "Hoja",
        body: "La nota se queda cerrada junto a cosas que no estás lista para responder. La luna, mañana, va a estar entera igual. No todo llamado tiene que atenderse la noche en que llega. Algunos solo necesitan guardarse sin romperse.",
      },
    },
  ],
};

export const nightStories: Record<Lang, Story[]> = {
  pt: [lampadaPt, luaPt],
  es: [lampadaEs, luaEs],
};
