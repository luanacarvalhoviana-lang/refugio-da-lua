import type { Story } from "@/lib/refugio/stories";
import { cafeEn, tideEn } from "@/lib/refugio/stories-en";

const cafePt: Story = {
  slug: "a-chave",
  title: "A chave do café",
  author: "Luana Viana",
  rating: "16",
  genres: ["romance", "mistério"],
  minutes: 10,
  synopsis: "O café já fechou. A chuva não deixa você sair. A chave em cima do balcão não é sua, e a mulher que a procura também não.",
  place: "Café na chuva",
  start: "balcao",
  sound: "/sounds/rain.mp3",
  scenes: [
    {
      id: "balcao",
      body: "As cadeiras já estão em cima das mesas. Você ficou pelo último café e a chuva trancou a rua. No balcão, uma chave pequena, de gaveta, com um fio vermelho. A porta dos fundos abre. Entra uma mulher de casaco molhado, o cabelo grudado na bochecha. “Se você pegou a chave, devolve. Se não pegou, esquece que viu.”",
      choices: [
        { id: "devolver", label: "Dizer que a chave já estava aqui", to: "gaveta", affinity: 1, clue: "A chave do fio vermelho abre uma gaveta, não a porta." },
        { id: "quem", label: "Perguntar o nome dela antes de qualquer coisa", to: "nome", affinity: 1 },
        { id: "sair", label: "Sair na chuva mesmo assim", to: "fim-rua", affinity: -1 },
      ],
    },
    {
      id: "nome",
      speaker: "Lia",
      body: "“Lia.” Ela não oferece a mão. Olha a chave como quem olha uma pessoa. “Eu fechei o café cedo porque não queria testemunha. Aí esqueci isso. Testemunha, agora, é você.”",
      choices: [
        { id: "ficar", label: "Dizer que fica, se ela contar", to: "gaveta", affinity: 2 },
        { id: "medo", label: "Dizer que isso está grande demais para uma chave", to: "gaveta", affinity: 0 },
      ],
    },
    {
      id: "gaveta",
      speaker: "Lia",
      body: "A gaveta de baixo abre com um estalo. Dentro, uma foto de duas mulheres num barco pequeno e um papel: “Se ela voltar, não diga que eu esperei.” Lia encosta o dedo no rosto da outra. “Ela voltou hoje cedo. Pediu o café de sempre e não me reconheceu. Ou fingiu que não.”",
      choices: [
        { id: "verdade", label: "Perguntar se Lia quer ser reconhecida", to: "porta", affinity: 2, clue: "A outra mulher voltou hoje e não reconheceu Lia." },
        { id: "foto", label: "Perguntar quem tirou a foto", to: "porta", affinity: 1 },
        { id: "fechar", label: "Fechar a gaveta e dizer que não é da sua conta", to: "fim-rua", affinity: -1 },
      ],
    },
    {
      id: "porta",
      speaker: "Lia",
      body: "A chuva baixa um pouco. Lia gira a chave no dedo. “Posso ir atrás dela agora e estragar a noite das duas. Posso deixar o bilhete onde está e abrir o café amanhã como se nada tivesse acontecido. Ou você atravessa a rua comigo e a gente só olha, sem chamar.”",
      choices: [
        { id: "olhar", label: "Atravessar a rua com ela, sem chamar", to: "fim-rua-junta", affinity: 2 },
        { id: "amanha", label: "Convencer Lia a abrir o café amanhã", to: "fim-amanha", affinity: 1 },
        { id: "ir", label: "Dizer que cada uma vai para o seu lado", to: "fim-rua", affinity: -1 },
      ],
    },
    {
      id: "fim-rua-junta",
      ending: {
        key: "junto",
        title: "A rua sem chamada",
        flower: "Gardênia",
        body: "Vocês atravessam sem guarda-chuva. Do outro lado, a outra mulher sobe num táxi e não olha para trás. Lia não corre. Encosta o ombro no seu, rápido, como um agradecimento que ainda não sabe o nome. A chave fica na sua mão. “Amanhã você devolve”, ela diz. “Ou volta para tomar o café. As duas coisas servem.”",
      },
    },
    {
      id: "fim-amanha",
      ending: {
        key: "amanha",
        title: "O café de sempre",
        flower: "Café em flor",
        body: "Lia guarda a foto e deixa o bilhete. “Amanhã eu abro no horário.” Não é rendição. É um jeito de continuar existindo no lugar onde a outra pessoa sabe encontrar, se um dia quiser. Você sai com a chuva mais fina. Na mesa da janela, duas xícaras já estão de boca para baixo, esperando.",
      },
    },
    {
      id: "fim-rua",
      ending: {
        key: "sozinha",
        title: "Chave na chuva",
        flower: "Pétala molhada",
        body: "A rua engole a conversa. Lia fecha a gaveta, ou você nem chega a vê-la. A chave, se ficou para trás, não é mais um convite. É só metal. Tem noite que a gente atravessa sozinha e a história fica inteira do outro lado do balcão.",
      },
    },
  ],
};

const cafeEs: Story = {
  slug: "a-chave",
  title: "La llave del café",
  author: "Luana Viana",
  rating: "16",
  genres: ["romance", "misterio"],
  minutes: 10,
  synopsis: "El café ya cerró. La lluvia no te deja salir. La llave sobre la barra no es tuya, y la mujer que la busca tampoco.",
  place: "Café bajo la lluvia",
  start: "balcao",
  sound: "/sounds/rain.mp3",
  scenes: [
    {
      id: "balcao",
      body: "Las sillas ya están sobre las mesas. Te quedaste por el último café y la lluvia cerró la calle. En la barra, una llave pequeña, de cajón, con un hilo rojo. La puerta de atrás se abre. Entra una mujer con el abrigo mojado, el pelo pegado a la mejilla. “Si tomaste la llave, devuélvela. Si no la tomaste, olvida que la viste.”",
      choices: [
        { id: "devolver", label: "Decir que la llave ya estaba aquí", to: "gaveta", affinity: 1, clue: "La llave del hilo rojo abre un cajón, no la puerta." },
        { id: "quem", label: "Preguntar su nombre antes que nada", to: "nome", affinity: 1 },
        { id: "sair", label: "Salir a la lluvia igual", to: "fim-rua", affinity: -1 },
      ],
    },
    {
      id: "nome",
      speaker: "Lia",
      body: "“Lia.” No ofrece la mano. Mira la llave como quien mira a una persona. “Cerré el café temprano porque no quería testigo. Y olvidé esto. El testigo, ahora, eres tú.”",
      choices: [
        { id: "ficar", label: "Decir que te quedas, si ella cuenta", to: "gaveta", affinity: 2 },
        { id: "medo", label: "Decir que esto es demasiado grande para una llave", to: "gaveta", affinity: 0 },
      ],
    },
    {
      id: "gaveta",
      speaker: "Lia",
      body: "El cajón de abajo se abre con un chasquido. Dentro, una foto de dos mujeres en un bote chico y un papel: “Si ella vuelve, no digas que esperé.” Lia apoya el dedo en el rostro de la otra. “Volvió esta mañana. Pidió el café de siempre y no me reconoció. O fingió que no.”",
      choices: [
        { id: "verdade", label: "Preguntar si Lia quiere ser reconocida", to: "porta", affinity: 2, clue: "La otra mujer volvió hoy y no reconoció a Lia." },
        { id: "foto", label: "Preguntar quién sacó la foto", to: "porta", affinity: 1 },
        { id: "fechar", label: "Cerrar el cajón y decir que no es tu asunto", to: "fim-rua", affinity: -1 },
      ],
    },
    {
      id: "porta",
      speaker: "Lia",
      body: "La lluvia afloja un poco. Lia gira la llave en el dedo. “Puedo ir detrás de ella ahora y arruinar la noche de las dos. Puedo dejar la nota donde está y abrir el café mañana como si nada. O cruzas la calle conmigo y solo miramos, sin llamar.”",
      choices: [
        { id: "olhar", label: "Cruzar la calle con ella, sin llamar", to: "fim-rua-junta", affinity: 2 },
        { id: "amanha", label: "Convencer a Lia de abrir el café mañana", to: "fim-amanha", affinity: 1 },
        { id: "ir", label: "Decir que cada una se va por su lado", to: "fim-rua", affinity: -1 },
      ],
    },
    {
      id: "fim-rua-junta",
      ending: {
        key: "junto",
        title: "La calle sin llamada",
        flower: "Gardenia",
        body: "Cruzan sin paraguas. Del otro lado, la otra mujer sube a un taxi y no mira atrás. Lia no corre. Apoya el hombro en el tuyo, rápido, como un agradecimiento que todavía no sabe su nombre. La llave queda en tu mano. “Mañana la devuelves”, dice. “O vuelves a tomar el café. Las dos cosas sirven.”",
      },
    },
    {
      id: "fim-amanha",
      ending: {
        key: "amanha",
        title: "El café de siempre",
        flower: "Café en flor",
        body: "Lia guarda la foto y deja la nota. “Mañana abro a la hora.” No es una rendición. Es una manera de seguir existiendo en el lugar donde la otra persona sabe encontrarla, si algún día quiere. Sales con la lluvia más fina. En la mesa de la ventana, dos tazas ya están boca abajo, esperando.",
      },
    },
    {
      id: "fim-rua",
      ending: {
        key: "sozinha",
        title: "Llave en la lluvia",
        flower: "Pétalo mojado",
        body: "La calle se traga la conversación. Lia cierra el cajón, o tú ni llegas a verlo. La llave, si se quedó atrás, ya no es una invitación. Es solo metal. Hay noches en las que una cruza sola y la historia se queda entera del otro lado de la barra.",
      },
    },
  ],
};

const tidePt: Story = {
  slug: "a-mare",
  title: "A maré e o nome",
  author: "Luana Viana",
  rating: "16",
  genres: ["romance", "mistério"],
  minutes: 9,
  synopsis: "Na praia, de noite, uma mulher tenta reescrever um nome antes que a água apague. Ela não diz se o nome é dela.",
  place: "Praia à noite",
  start: "areia",
  sound: "/sounds/ocean.mp3",
  scenes: [
    {
      id: "areia",
      body: "A cidade fica atrás, só um rumor. Na areia molhada, letras pela metade. Uma mulher está ajoelhada, a barra da calça escura de água, recomeçando um nome que a maré come. Ela percebe você e não cobre o que escreveu. “Se chegar mais perto, vai ler. Se ficar aí, pode fingir que é desenho.”",
      choices: [
        { id: "perto", label: "Chegar perto e ler", to: "nome", affinity: 1, clue: "O nome na areia está pela metade. A maré está comendo o resto." },
        { id: "ajudar", label: "Oferecer a mão para segurar a lanterna", to: "luz", affinity: 2 },
        { id: "voltar", label: "Voltar para a calçada", to: "fim-mar", affinity: -1 },
      ],
    },
    {
      id: "luz",
      speaker: "Nara",
      body: "“Nara.” A lanterna é do celular, fraca. “Não é o meu nome que eu estou escrevendo. É o dela. A gente brigou neste mesmo ponto, semana passada, e eu disse um coisa que a água não lava. Se o nome sumir por completo, parece que eu aceitei.”",
      choices: [
        { id: "ouvir", label: "Pedir para ouvir a frase, sem julgar", to: "frase", affinity: 2 },
        { id: "escrever", label: "Ajoelhar e ajudar a reescrever", to: "frase", affinity: 1, clue: "Nara escreve o nome de outra mulher, não o dela." },
      ],
    },
    {
      id: "nome",
      speaker: "Nara",
      body: "O que dá para ler é só “—lia”. Nara cobre o resto com a mão, tarde. “Agora você sabe demais e de menos.” Ela se senta nos calcanhares. “O nome é dela. Eu sou a Nara. E eu não sei se quero que ela veja isso de manhã.”",
      choices: [
        { id: "ouvir", label: "Ficar e ouvir", to: "frase", affinity: 1 },
        { id: "apagar", label: "Dizer que a maré pode terminar o trabalho", to: "fim-mar", affinity: -1 },
      ],
    },
    {
      id: "frase",
      speaker: "Nara",
      body: "“Eu disse que amar ela era uma fase.” Nara ri sem graça. “Não era. A maré vem em linha reta. Eu posso deixar o nome ir, pedir desculpa em voz alta para ninguém, ou caminhar com você até a rua e mandar a mensagem que eu estou evitando desde sexta.”",
      choices: [
        { id: "mensagem", label: "Caminhar com ela até haver sinal", to: "fim-rua", affinity: 2 },
        { id: "mar", label: "Ficar até a água levar o nome, do lado dela", to: "fim-junto", affinity: 1 },
        { id: "ir", label: "Dizer que essa frase não se conserta com areia", to: "fim-mar", affinity: -1 },
      ],
    },
    {
      id: "fim-rua",
      ending: {
        key: "mensagem",
        title: "Onde o sinal volta",
        flower: "Ipoméia",
        body: "Vocês sobem a rua ainda com areia no sapato. Nara para debaixo de um poste, escreve, apaga, escreve de novo. Não mostra a tela. Quando manda, o ombro dela encosta no seu e fica. “Se ela responder, eu te conto. Se não responder, você já viu o nome. Isso também é uma resposta.”",
      },
    },
    {
      id: "fim-junto",
      ending: {
        key: "mare",
        title: "A maré termina a frase",
        flower: "Lírio da areia",
        body: "Vocês duas ficam sentadas até a água desmanchar as letras. Nara não corre atrás do nome. Apoia a testa no joelho e, um minuto depois, no seu ombro. Não é absolvição. É uma noite em que alguém ficou até o fim da frase, mesmo sem poder reescrever a anterior.",
      },
    },
    {
      id: "fim-mar",
      ending: {
        key: "sozinha",
        title: "A calçada",
        flower: "Concha vazia",
        body: "A praia continua o trabalho sozinha. Você volta para a luz da rua, e o nome, inteiro ou pela metade, fica com a água. Nara também fica, ou some quando você desvia o olhar. Tem desculpa que não cabe numa história de quem só estava de passagem.",
      },
    },
  ],
};

const tideEs: Story = {
  slug: "a-mare",
  title: "La marea y el nombre",
  author: "Luana Viana",
  rating: "16",
  genres: ["romance", "misterio"],
  minutes: 9,
  synopsis: "En la playa, de noche, una mujer intenta reescribir un nombre antes de que el agua lo borre. No dice si el nombre es el suyo.",
  place: "Playa de noche",
  start: "areia",
  sound: "/sounds/ocean.mp3",
  scenes: [
    {
      id: "areia",
      body: "La ciudad queda atrás, solo un rumor. En la arena mojada, letras a medias. Una mujer está arrodillada, el ruedo del pantalón oscuro de agua, recomenzando un nombre que la marea se come. Te nota y no tapa lo que escribió. “Si te acercas, vas a leer. Si te quedas ahí, puedes fingir que es un dibujo.”",
      choices: [
        { id: "perto", label: "Acercarte y leer", to: "nome", affinity: 1, clue: "El nombre en la arena está a medias. La marea se come el resto." },
        { id: "ajudar", label: "Ofrecer la mano para sostener la luz", to: "luz", affinity: 2 },
        { id: "voltar", label: "Volver a la vereda", to: "fim-mar", affinity: -1 },
      ],
    },
    {
      id: "luz",
      speaker: "Nara",
      body: "“Nara.” La luz es la del celular, floja. “No es mi nombre lo que estoy escribiendo. Es el de ella. Peleamos en este mismo punto, la semana pasada, y dije algo que el agua no lava. Si el nombre desaparece del todo, parece que lo acepté.”",
      choices: [
        { id: "ouvir", label: "Pedir oír la frase, sin juzgar", to: "frase", affinity: 2 },
        { id: "escrever", label: "Arrodillarte y ayudar a reescribir", to: "frase", affinity: 1, clue: "Nara escribe el nombre de otra mujer, no el suyo." },
      ],
    },
    {
      id: "nome",
      speaker: "Nara",
      body: "Lo que se alcanza a leer es solo “—lia”. Nara tapa el resto con la mano, tarde. “Ahora sabes demasiado y demasiado poco.” Se sienta sobre los talones. “El nombre es de ella. Yo soy Nara. Y no sé si quiero que ella vea esto por la mañana.”",
      choices: [
        { id: "ouvir", label: "Quedarte y oír", to: "frase", affinity: 1 },
        { id: "apagar", label: "Decir que la marea puede terminar el trabajo", to: "fim-mar", affinity: -1 },
      ],
    },
    {
      id: "frase",
      speaker: "Nara",
      body: "“Dije que amarla era una fase.” Nara se ríe sin ganas. “No lo era. La marea viene en línea recta. Puedo dejar que el nombre se vaya, pedir perdón en voz alta para nadie, o caminar contigo hasta la calle y mandar el mensaje que evito desde el viernes.”",
      choices: [
        { id: "mensagem", label: "Caminar con ella hasta que haya señal", to: "fim-rua", affinity: 2 },
        { id: "mar", label: "Quedarte hasta que el agua se lleve el nombre, a su lado", to: "fim-junto", affinity: 1 },
        { id: "ir", label: "Decir que esa frase no se arregla con arena", to: "fim-mar", affinity: -1 },
      ],
    },
    {
      id: "fim-rua",
      ending: {
        key: "mensagem",
        title: "Donde vuelve la señal",
        flower: "Campanilla",
        body: "Suben la calle todavía con arena en el zapato. Nara se detiene bajo un poste, escribe, borra, escribe otra vez. No muestra la pantalla. Cuando lo manda, su hombro se apoya en el tuyo y se queda. “Si responde, te cuento. Si no responde, tú ya viste el nombre. Eso también es una respuesta.”",
      },
    },
    {
      id: "fim-junto",
      ending: {
        key: "mare",
        title: "La marea termina la frase",
        flower: "Lirio de arena",
        body: "Las dos se quedan sentadas hasta que el agua deshace las letras. Nara no corre detrás del nombre. Apoya la frente en la rodilla y, un minuto después, en tu hombro. No es una absolución. Es una noche en la que alguien se quedó hasta el fin de la frase, aunque no pudiera reescribir la anterior.",
      },
    },
    {
      id: "fim-mar",
      ending: {
        key: "sozinha",
        title: "La vereda",
        flower: "Concha vacía",
        body: "La playa sigue el trabajo sola. Vuelves a la luz de la calle, y el nombre, entero o a medias, se queda con el agua. Nara también se queda, o desaparece cuando miras a otro lado. Hay disculpas que no caben en la historia de quien solo iba de paso.",
      },
    },
  ],
};

export const moreStories = {
  pt: [cafePt, tidePt],
  es: [cafeEs, tideEs],
  en: [cafeEn, tideEn],
};
