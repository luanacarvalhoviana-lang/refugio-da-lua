import type { Lang } from "@/lib/refugio/stories";

type Letter = { from: string; text: string };

const thoughts: Record<string, Record<string, string>> = {
  "pt:o-bilhete": {
    "mesa:abrir": "Se eu abrir agora, não tem mais como fingir que não vi.",
    "mesa:ir": "A luz no fim do corredor parece um convite, não um aviso.",
    "mesa:apagar": "Apagar a luz é mais fácil do que perguntar quem me chamou.",
    "corredor:guardar": "A flor cabe no bolso. O nome dela, ainda não.",
    "corredor:chamar": "Dizer o nome em voz alta faz a sala ficar menor.",
    "helena:porque": "Quero saber se fui escolhida ou se só cheguei cedo demais.",
    "helena:medo": "Meu corpo recua, mas os pés ficam.",
    "helena:devolver": "Devolver o livro é um jeito de não dever nada.",
    "margem:ficar": "Ficar não é coragem. É não querer ir embora dela.",
    "margem:nome": "Se eu souber o nome, a ausência fica concreta.",
    "margem:ir": "Digo que é tarde. O que tenho é medo de que não seja.",
    "porta:sair": "A chuva não me assusta. Ir sem ela, sim.",
    "porta:amanha": "Amanhã me dá um tempo para querer de verdade.",
    "porta:fechar": "A fechadura faz um barulho pequeno e definitivo.",
  },
  "es:o-bilhete": {
    "mesa:abrir": "Si lo abro ahora, ya no puedo fingir que no lo vi.",
    "mesa:ir": "La luz al final del pasillo parece una invitación, no un aviso.",
    "mesa:apagar": "Apagar la luz es más fácil que preguntar quién me llamó.",
    "corredor:guardar": "La flor cabe en el bolsillo. Su nombre, todavía no.",
    "corredor:chamar": "Decir el nombre en voz alta hace la sala más chica.",
    "helena:porque": "Quiero saber si me eligió o si solo llegué demasiado temprano.",
    "helena:medo": "El cuerpo retrocede, pero los pies se quedan.",
    "helena:devolver": "Devolver el libro es una forma de no deber nada.",
    "margem:ficar": "Quedarme no es valentía. Es no querer irme de ella.",
    "margem:nome": "Si sé el nombre, la ausencia se vuelve concreta.",
    "margem:ir": "Digo que es tarde. Lo que tengo es miedo de que no lo sea.",
    "porta:sair": "La lluvia no me asusta. Irme sin ella, sí.",
    "porta:amanha": "Mañana me da tiempo para querer de verdad.",
    "porta:fechar": "La cerradura hace un ruido chico y definitivo.",
  },
  "pt:a-chave": {
    "balcao:devolver": "Dizer a verdade me deixa do lado dela, não do lado da chave.",
    "balcao:quem": "Quero o nome antes da história. Um nome cabe melhor na chuva.",
    "balcao:sair": "A rua é fria, mas não pede explicação.",
    "nome:ficar": "Se eu ficar, viro parte da noite que ela queria sem testemunha.",
    "nome:medo": "Está grande demais. Eu fico mesmo assim, um passo atrás.",
    "gaveta:verdade": "Reconhecer alguém é uma escolha. Eu quero saber se ela quer isso.",
    "gaveta:foto": "A foto é mais segura do que a pergunta certa.",
    "gaveta:fechar": "Fechar a gaveta também fecha a minha parte.",
    "porta:olhar": "Olhar sem chamar é o jeito mais gentil de não decidir por ela.",
    "porta:amanha": "Amanhã o café abre. A gente também pode.",
    "porta:ir": "Cada uma para o seu lado. Dói menos se eu disser primeiro.",
  },
  "es:a-chave": {
    "balcao:devolver": "Decir la verdad me deja de su lado, no del lado de la llave.",
    "balcao:quem": "Quiero el nombre antes que la historia. Un nombre cabe mejor en la lluvia.",
    "balcao:sair": "La calle está fría, pero no pide explicación.",
    "nome:ficar": "Si me quedo, soy parte de la noche que ella quería sin testigo.",
    "nome:medo": "Es demasiado grande. Me quedo igual, un paso atrás.",
    "gaveta:verdade": "Que te reconozcan es una elección. Quiero saber si ella la quiere.",
    "gaveta:foto": "La foto es más segura que la pregunta justa.",
    "gaveta:fechar": "Cerrar el cajón también cierra mi parte.",
    "porta:olhar": "Mirar sin llamar es la forma más suave de no decidir por ella.",
    "porta:amanha": "Mañana el café abre. Nosotras también podemos.",
    "porta:ir": "Cada una por su lado. Duele menos si lo digo yo primero.",
  },
  "pt:a-mare": {
    "areia:perto": "Se eu ler, não posso mais fingir que é desenho.",
    "areia:ajudar": "Segurar a luz é um jeito de ficar sem invadir o nome.",
    "areia:voltar": "A calçada é seca. Também é longe dela.",
    "luz:ouvir": "Quero a frase inteira, sem consertar nada ainda.",
    "luz:escrever": "Ajoelhar na água é aceitar que o nome importa.",
    "nome:ouvir": "Fico. Ouvir custa menos do que ir embora agora.",
    "nome:apagar": "A maré termina o que eu não tenho coragem de apagar.",
    "frase:mensagem": "O sinal volta na rua. A coragem, talvez também.",
    "frase:mar": "Ficar até a água levar o nome é ficar com ela no que dói.",
    "frase:ir": "Tem frase que areia nenhuma conserta. Eu sei disso e mesmo assim queria.",
  },
  "es:a-mare": {
    "areia:perto": "Si leo, ya no puedo fingir que es un dibujo.",
    "areia:ajudar": "Sostener la luz es quedarme sin invadir el nombre.",
    "areia:voltar": "La vereda está seca. También está lejos de ella.",
    "luz:ouvir": "Quiero la frase entera, sin arreglar nada todavía.",
    "luz:escrever": "Arrodillarme en el agua es aceptar que el nombre importa.",
    "nome:ouvir": "Me quedo. Oír cuesta menos que irme ahora.",
    "nome:apagar": "La marea termina lo que yo no me animo a borrar.",
    "frase:mensagem": "La señal vuelve en la calle. El coraje, quizá también.",
    "frase:mar": "Quedarme hasta que el agua se lleve el nombre es quedarme con ella en lo que duele.",
    "frase:ir": "Hay frases que ninguna arena arregla. Lo sé, y aun así quería.",
  },
  "en:o-bilhete": {
    "mesa:abrir": "If I open it now, I can no longer pretend I did not see it.",
    "mesa:ir": "The light at the end of the hall looks like an invitation, not a warning.",
    "mesa:apagar": "Turning off the light is easier than asking who called me.",
    "corredor:guardar": "The flower fits in a pocket. Her name does not, not yet.",
    "corredor:chamar": "Saying the name out loud makes the room smaller.",
    "helena:porque": "I want to know if I was chosen or if I only arrived too early.",
    "helena:medo": "My body steps back, but my feet stay.",
    "helena:devolver": "Returning the book is a way of owing nothing.",
    "margem:ficar": "Staying is not courage. It is not wanting to leave her.",
    "margem:nome": "If I know the name, the absence becomes solid.",
    "margem:ir": "I say it is late. What I have is fear that it is not.",
    "porta:sair": "The rain does not scare me. Leaving without her does.",
    "porta:amanha": "Tomorrow gives me time to want this for real.",
    "porta:fechar": "The lock makes a small and final sound.",
  },
  "en:a-chave": {
    "balcao:devolver": "Telling the truth puts me on her side, not on the key’s.",
    "balcao:quem": "I want the name before the story. A name fits better in the rain.",
    "balcao:sair": "The street is cold, but it does not ask for an explanation.",
    "nome:ficar": "If I stay, I become part of the night she wanted with no witness.",
    "nome:medo": "This is too big. I stay anyway, one step back.",
    "gaveta:verdade": "Being recognized is a choice. I want to know if she wants it.",
    "gaveta:foto": "The photo is safer than the right question.",
    "gaveta:fechar": "Closing the drawer also closes my part.",
    "porta:olhar": "Looking without calling is the gentlest way not to decide for her.",
    "porta:amanha": "Tomorrow the café opens. We can too.",
    "porta:ir": "Each of us to her own side. It hurts less if I say it first.",
  },
  "en:a-mare": {
    "areia:perto": "If I read it, I can no longer pretend it is a drawing.",
    "areia:ajudar": "Holding the light is a way to stay without invading the name.",
    "areia:voltar": "The sidewalk is dry. It is also far from her.",
    "luz:ouvir": "I want the whole sentence, without fixing anything yet.",
    "luz:escrever": "Kneeling in the water is accepting that the name matters.",
    "nome:ouvir": "I stay. Listening costs less than leaving now.",
    "nome:apagar": "The tide finishes what I do not have the courage to erase.",
    "frase:mensagem": "The signal comes back on the street. The courage, maybe too.",
    "frase:mar": "Staying until the water takes the name is staying with her in what hurts.",
    "frase:ir": "Some sentences no sand can fix. I know that, and I wanted to anyway.",
  },
};

const letters: Record<string, Record<string, Letter>> = {
  "pt:o-bilhete": {
    chuva: {
      from: "Helena",
      text: "Você saiu comigo e o livro ficou seco entre a gente. Ainda não contei tudo. Não precisa ser hoje. Se a chuva passar e você ainda estiver perto, eu termino o nome que não coube no bilhete.",
    },
    espera: {
      from: "Helena",
      text: "Deixei o romance na sua mesa, com a flor que você não devolveu. Amanhã a última estante acende de novo. Se você vier, eu entendo que ficou. Se não vier, eu também entendo. As duas coisas são honestas.",
    },
    fechado: {
      from: "Helena",
      text: "A luz apagou e eu não fui atrás. Nem todo segredo quer a primeira noite. Se um dia o livro voltar para a sua mão, saiba que eu ainda estava na última estante quando você foi embora.",
    },
  },
  "es:o-bilhete": {
    chuva: {
      from: "Helena",
      text: "Saliste conmigo y el libro quedó seco entre las dos. Todavía no conté todo. No tiene que ser hoy. Si la lluvia pasa y sigues cerca, termino el nombre que no cupo en la nota.",
    },
    espera: {
      from: "Helena",
      text: "Dejé la novela en tu mesa, con la flor que no devolviste. Mañana el último estante se enciende otra vez. Si vienes, entiendo que te quedaste. Si no vienes, también entiendo. Las dos cosas son honestas.",
    },
    fechado: {
      from: "Helena",
      text: "La luz se apagó y no te seguí. No todo secreto quiere la primera noche. Si algún día el libro vuelve a tu mano, sabe que yo seguía en el último estante cuando te fuiste.",
    },
  },
  "pt:a-chave": {
    junto: {
      from: "Lia",
      text: "A gente atravessou e eu não chamei o nome dela. Obrigada por não chamar por mim. A chave continua na sua mão se você quiser devolver amanhã. Ou sentar na janela. O café abre. Eu também.",
    },
    amanha: {
      from: "Lia",
      text: "Vou abrir no horário. A foto fica na gaveta, e o bilhete também, até eu saber o que fazer com os dois. Se você passar para o café de sempre, eu vou saber que esta noite não foi só chuva.",
    },
    sozinha: {
      from: "Lia",
      text: "Você foi embora e eu fechei a gaveta. Não estou brava. Tem noite em que a testemunha precisa ir embora para a história continuar do lado de cá. Se a chave aparecer no balcão, pode deixar. Eu encontro.",
    },
  },
  "es:a-chave": {
    junto: {
      from: "Lia",
      text: "Cruzamos y no dije su nombre. Gracias por no llamarla por mí. La llave sigue en tu mano si quieres devolverla mañana. O sentarte en la ventana. El café abre. Yo también.",
    },
    amanha: {
      from: "Lia",
      text: "Voy a abrir a la hora. La foto se queda en el cajón, y la nota también, hasta que sepa qué hacer con las dos. Si pasas por el café de siempre, voy a saber que esta noche no fue solo lluvia.",
    },
    sozinha: {
      from: "Lia",
      text: "Te fuiste y cerré el cajón. No estoy enojada. Hay noches en que el testigo tiene que irse para que la historia siga de este lado. Si la llave aparece en el mostrador, puedes dejarla. Yo la encuentro.",
    },
  },
  "pt:a-mare": {
    mensagem: {
      from: "Nara",
      text: "O sinal voltou na esquina e eu mandei a mensagem. Não contei o que você ouviu. Só disse que eu estava errada, e que amar ela nunca foi uma fase. Se ela responder, eu te conto. Se não responder, obrigada por caminhar até aqui.",
    },
    mare: {
      from: "Nara",
      text: "A água levou o nome e você ficou. Eu não pedi isso. Fico feliz que tenha acontecido. De manhã a areia vai estar lisa. O que eu disse na semana passada, não. Mas esta noite ficou menos sozinha.",
    },
    sozinha: {
      from: "Nara",
      text: "Você voltou para a calçada, ou disse que areia não conserta frase. Tudo bem. O nome foi com a maré. Eu ainda estou na praia, com a lanterna fraca, caso você olhe para trás e queira o resto da história.",
    },
  },
  "es:a-mare": {
    mensagem: {
      from: "Nara",
      text: "La señal volvió en la esquina y mandé el mensaje. No conté lo que oíste. Solo dije que me equivoqué, y que amarla nunca fue una fase. Si responde, te cuento. Si no responde, gracias por caminar hasta aquí.",
    },
    mare: {
      from: "Nara",
      text: "El agua se llevó el nombre y tú te quedaste. No te lo pedí. Me alegra que haya pasado. Por la mañana la arena va a estar lisa. Lo que dije la semana pasada, no. Pero esta noche quedó menos sola.",
    },
    sozinha: {
      from: "Nara",
      text: "Volviste a la vereda, o dijiste que la arena no arregla una frase. Está bien. El nombre se fue con la marea. Yo sigo en la playa, con la luz débil, por si miras atrás y quieres el resto de la historia.",
    },
  },
  "en:o-bilhete": {
    chuva: {
      from: "Helena",
      text: "You left with me and the book stayed dry between us. I still have not told everything. It does not have to be today. If the rain passes and you are still close, I finish the name that did not fit on the note.",
    },
    espera: {
      from: "Helena",
      text: "I left the novel on your desk, with the flower you did not return. Tomorrow the last shelf lights up again. If you come, I understand that you stayed. If you do not come, I understand that too. Both things are honest.",
    },
    fechado: {
      from: "Helena",
      text: "The light went out and I did not follow you. Not every secret wants the first night. If the book ever comes back to your hand, know that I was still on the last shelf when you left.",
    },
  },
  "en:a-chave": {
    junto: {
      from: "Lia",
      text: "We crossed and I did not say her name. Thank you for not calling it for me. The key stays in your hand if you want to return it tomorrow. Or sit by the window. The café opens. So do I.",
    },
    amanha: {
      from: "Lia",
      text: "I will open on time. The photo stays in the drawer, and the note too, until I know what to do with both. If you come by for the usual coffee, I will know this night was not only rain.",
    },
    sozinha: {
      from: "Lia",
      text: "You left and I closed the drawer. I am not angry. Some nights the witness has to leave so the story can go on from this side. If the key shows up on the counter, you can leave it. I will find it.",
    },
  },
  "en:a-mare": {
    mensagem: {
      from: "Nara",
      text: "The signal came back on the corner and I sent the message. I did not tell what you heard. I only said I was wrong, and that loving her was never a phase. If she answers, I will tell you. If she does not, thank you for walking this far.",
    },
    mare: {
      from: "Nara",
      text: "The water took the name and you stayed. I did not ask for that. I am glad it happened. In the morning the sand will be smooth. What I said last week will not. But this night was less alone.",
    },
    sozinha: {
      from: "Nara",
      text: "You went back to the sidewalk, or you said sand does not fix a sentence. That is all right. The name went with the tide. I am still on the beach, with the weak light, in case you look back and want the rest of the story.",
    },
  },
};

export function thoughtFor(slug: string, lang: Lang, sceneId: string, choiceId: string) {
  return thoughts[`${lang}:${slug}`]?.[`${sceneId}:${choiceId}`] || "";
}

export function letterFor(slug: string, lang: Lang, endingKey: string): Letter | null {
  return letters[`${lang}:${slug}`]?.[endingKey] ?? null;
}
