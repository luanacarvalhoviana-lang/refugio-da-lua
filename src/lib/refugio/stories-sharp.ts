import { cartasPt } from "@/lib/refugio/stories-cartas";
import { passageiraPt } from "@/lib/refugio/stories-passageira";
import type { Story } from "@/lib/refugio/stories";

const corredorPt: Story = {
  slug: "corredor",
  title: "Corredor",
  author: "Luana Viana",
  rating: "16",
  genres: ["terror", "drama psicológico"],
  minutes: 11,
  synopsis: "O corredor do hotel é mais longo na volta. A mulher do 714 pede para você levá-la até o elevador. Se ouvir a voz dela atrás, não vire. A de trás pede para entrar. Ela, não.",
  place: "Hotel",
  art: "/scenes/templo.jpg",
  start: "porta714",
  sound: "/sounds/wind.mp3",
  scenes: [
    {
      id: "porta714",
      speaker: "Iara",
      music: "templo",
      body: "O hotel finge silêncio com um zumbido de ar. São três da manhã menos vinte, a hora em que o corredor pertence a quem não dorme. A Iara está na porta do 714, descalça, o cabelo preso de qualquer jeito, os olhos de quem já explicou isso e não foi acreditada. Você a viu no café da manhã três vezes. Ela não come. Olha a sua mesa como quem confere uma saída. “Me leva até o elevador. Se você ouvir a minha voz atrás, não vira. A de trás pede para entrar. Eu não peço. Eu só quero descer até onde a luz é feia e ela não atravessa.” O número da porta, atrás dela, parece recuado meio palmo.",
      choices: [
        { id: "braco", label: "Oferecer o braço", to: "corredor", affinity: 2, clue: "A Iara não pede para entrar. A outra pede.", thought: "O braço é uma coisa concreta. Eu ofereço concreto." },
        { id: "perguntar", label: "Perguntar o que fica para trás", to: "corredor", affinity: 1, thought: "Eu quero a regra inteira antes de caminhar dentro dela." },
        { id: "fechar", label: "Fechar a sua porta", to: "fim-batida", affinity: -1, thought: "Trancar é um instinto antigo. Esta noite ele pode estar certo ou atrasado." },
      ],
    },
    {
      id: "corredor",
      music: "suspense",
      body: "O seu quarto era quatro portas à esquerda. Você conta oito. O carpete engole o passo e devolve, atrás, um passo que não é o seu. A mão da Iara está fria e muito humana, o que assusta mais do que se não fosse. Aí a voz. A voz dela, mais doce, no ponto exato da sua nuca. Diz o seu nome inteiro, inclusive o que você não usa no hotel. A Iara, ao lado, aperta o seu braço até doer de um jeito útil. A boca dela forma: não. A outra insiste, macia: deixa eu entrar, você está cansada, eu sei a cama. Nenhuma porta do corredor tem número agora. Só a distância até o elevador, que aumentou.",
      choices: [
        { id: "nao", label: "Não virar", to: "elevador", affinity: 2, thought: "A nuca quer obedecer à doçura. O braço da Iara é a frase mais clara do corredor." },
        { id: "responder", label: "Responder sem virar", to: "elevador", affinity: 1, clue: "A voz de trás sabe o seu nome inteiro.", thought: "Se eu falo, eu confirmo que ouvi. Eu falo mesmo assim, baixo: não." },
        { id: "virar", label: "Virar", to: "fim-virar", affinity: -1, thought: "Eu preciso ver. Essa necessidade é exatamente o que ela usa." },
      ],
    },
    {
      id: "elevador",
      speaker: "Iara",
      music: "templo",
      body: "A porta do elevador abre com um suspiro de metal velho. No espelho, por um segundo, duas Iaras. Depois uma. A que está no seu braço entra de costas, sem dar a coluna ao corredor. “Desce comigo até o saguão. Lá ela não entra. Não me pergunta qual de nós está aqui dentro. Pergunta é uma forma de virar.” O espelho insiste em mostrar o corredor mais longo do que o prédio. Uma das lâmpadas pisca no ritmo de quem respira. A Iara olha o botão do térreo como se ele pudesse ser convencido.",
      choices: [
        { id: "descer", label: "Descer com ela", to: "fim-saguao", affinity: 2, thought: "O térreo é feio. Feio, esta noite, é santuário." },
        { id: "segurar", label: "Segurar a porta até ela entrar inteira", to: "fim-saguao", affinity: 1, thought: "Eu não deixo o elevador decidir sozinho quem fica de fora." },
        { id: "qual", label: "Perguntar qual das duas está no elevador", to: "fim-virar", affinity: -1, thought: "A pergunta sai e eu já sei que virei sem o pescoço." },
      ],
    },
    {
      id: "fim-saguao",
      music: "luar",
      ending: {
        key: "saguao",
        title: "O saguão",
        flower: "Lírio",
        body: "O saguão é amarelo, barulhento de geladeira e seguro de um jeito sem poesia. A Iara bebe o café ruim como quem volta a ter fome. Agradece sem tocar você. “Amanhã, no café, eu vou de azul. Se eu não comer, não sou eu. Se eu comer e não olhar para a sua mesa, também não sou. Pode sentar na frente. Eu vou saber.” O horror não acaba. Ganha uma regra, e a regra é uma forma de cuidar. Você sobe sozinha quando o sol já mente na calçada. O corredor, de manhã, tem o tamanho do corredor. O 714 está fechado. No café, ela está de azul. Come. Olha. Você senta na frente.",
        letter: { from: "Iara", text: "Eu comi. Era eu. Não sobe no corredor sozinha depois da uma, por um tempo. Se eu bater, são três batidas e eu digo a cor da roupa antes de você abrir. Se a voz não disser a cor, não é visita. Obrigada por não virar. Quase ninguém consegue." },
      },
    },
    {
      id: "fim-virar",
      music: "suspense",
      ending: {
        key: "virar",
        title: "A que pede",
        flower: "Vidro",
        body: "Você vira, ou faz a pergunta que é uma maneira de virar. A mulher atrás tem a boca da Iara e nenhuma das suas cautelas. Sorri como quem já foi convidada. “Eu só quero entrar. Você está cansada.” A Iara do seu braço não está mais no seu braço. O elevador fecha com uma pessoa só, e não é você quem escolhe qual. De manhã a cadeira da Iara no café está vazia. O seu cartão abre o 714. A cama está quente. Você não lembra de ter deitado. No espelho do banheiro, por um instante, alguém atrás de você pisca com a sua cara e a paciência errada.",
        letter: { from: "Iara", text: "Se esta carta está na sua letra, não fui eu que escrevi. Eu deixo bilhete com a cor da roupa e três batidas. Qualquer outra frase doce, no corredor, você não abre. Se você já abriu, deixa a porta encostada e desce. O saguão ainda funciona. Eu espero de azul, se ainda for eu." },
      },
    },
    {
      id: "fim-batida",
      music: "despedida",
      ending: {
        key: "batida",
        title: "Três batidas",
        flower: "Chave fria",
        body: "Você fecha. A fechadura é alta e pequena. Às três e doze, três batidas, pacientes, no ritmo em que a Iara teria apertado o botão do elevador. Você não abre. De manhã o recepcionista diz que o 714 deu saída à meia-noite, o que é impossível e está no sistema. Debaixo da sua porta, um papel na sua letra: “Eu virei.” Você não virou. Ainda. A chave do quarto, na sua mão, está fria dos dois lados. No café, ninguém de azul. A cadeira em frente à sua mesa foi retirada, como se o hotel preferisse não contar lugares.",
        letter: { from: "Iara", text: "Eu bati três vezes. Você não abriu, e isso pode ter sido o certo. O papel debaixo da porta não é meu se estiver na sua letra. Não sobe para me procurar. Se eu ainda estiver em algum lugar deste prédio, é no saguão, de azul, comendo. Se não estiver comendo, passa reto." },
      },
    },
  ],
};

const depoimentoPt: Story = {
  slug: "depoimento",
  title: "Depoimento",
  author: "Luana Viana",
  rating: "16",
  genres: ["crime", "thriller", "traição"],
  minutes: 14,
  synopsis: "Você viu o que aconteceu na cobertura. Quem toma o seu depoimento é a sua ex. Ela já sabe qual versão você vai contar. Ela quer a outra.",
  place: "Delegacia",
  art: "/scenes/biblioteca.jpg",
  start: "sala",
  sound: "/sounds/rain.mp3",
  scenes: [
    {
      id: "sala",
      speaker: "Elisa",
      music: "suspense",
      body: "A sala cheira a café requentado e a papel que já ouviu mentira demais. Do outro lado da mesa, a Elisa. Sua ex. Distintivo, cabelo preso, a mesma boca que um dia pediu para você ficar e ouviu que você não sabia. Entre vocês, a foto da cobertura: a mureta, a cidade, um copo quebrado. “A Soraia está viva. A Duda diz que ela pulou. Eu preciso da sua frase, não da dela.” A Elisa não eleva a voz. Ela nunca precisou. “Você estava lá porque a minha irmã pediu. Não faz essa cara. Eu sei que você e a Duda não eram só conversa. Eu sou irmã dela e também sou a pessoa que ainda reconhece quando você escolhe a frase fácil.”",
      choices: [
        { id: "tarde", label: "Dizer que a mão da Duda chegou tarde", to: "frase", affinity: 1, clue: "Você viu a mão da Duda chegar depois.", thought: "Tarde demais ainda não é o nome do que eu vi. É o nome que cabe nesta sala." },
        { id: "pulo", label: "Dizer que a Soraia não pulou", to: "frase", affinity: 2, clue: "Não foi um pulo.", thought: "A frase verdadeira deixa a minha boca seca. Eu digo assim mesmo." },
        { id: "advogada", label: "Não falar sem alguém do seu lado", to: "fim-silencio", affinity: 0, thought: "Calar não é neutro. Eu escolho o silêncio sabendo o preço." },
      ],
    },
    {
      id: "frase",
      speaker: "Elisa",
      music: "revelacao",
      body: "A Elisa espera. O gravador é uma luz pequena, indecente. “Não usa contra mim o fato de eu ser irmã dela. Usa direito. A Duda vai dizer que segurou. A Soraia, quando acordou, pediu você, não a polícia. Isso me interessa e me machuca, e eu não vou misturar as duas coisas na sua frente.” Ela empurra um copo d’água que você não bebe. “Se você proteger a Duda, eu fecho o arquivo com a sua frase e durmo mal. Se você disser o que a mureta viu, a minha irmã atravessa esta noite algemada a uma verdade. Eu assino mesmo assim. Eu só não quero que você minta para me poupar.”",
      choices: [
        { id: "proteger", label: "Proteger a Duda", to: "del", affinity: -1, thought: "Lealdade é um bicho que morde a pessoa errada. Eu sinto o dente." },
        { id: "nome", label: "Dizer o nome da Soraia no gravador", to: "fim-nome", affinity: 2, thought: "O nome dela no gravador não desfaz a mureta. Impede que a mureta minta sozinha." },
        { id: "ver", label: "Pedir para ver a Soraia antes de assinar", to: "hospital", affinity: 1, thought: "Eu não vou assinar uma mulher que eu ainda não ouvi." },
      ],
    },
    {
      id: "del",
      speaker: "Duda",
      music: "suspense",
      body: "O corredor da delegacia entrega a Duda por um segundo: jaqueta sua, que ela nunca devolveu, o olho inchado de choro e não de pancada. Ela move a boca. Por favor. Não é um som. A Elisa olha a sua boca, não a da irmã. Há uma caneta e duas frases já impressas, uma em que a Soraia sobe na mureta sozinha, outra em branco. A Duda some na curva do corredor. Fica o cheiro de chuva na jaqueta que um dia dormiu na sua cadeira. A Elisa diz, baixo: “Ela é minha irmã. Você é a única que não é obrigada a escolhê-la. Por isso a sua frase vale mais do que a minha.”",
      choices: [
        { id: "repetir", label: "Assinar a versão da Duda", to: "fim-versao", affinity: -1, thought: "A caneta pesa como se a Soraia estivesse do outro lado da tinta." },
        { id: "rasgar", label: "Rasgar e recomeçar pela Soraia", to: "fim-nome", affinity: 2, thought: "O papel rasga fácil. O resto, não. Eu rasgo mesmo assim." },
        { id: "sair", label: "Sair sem assinar", to: "fim-silencio", affinity: 0, thought: "Sem assinatura, a noite continua aberta. Aberta também corta." },
      ],
    },
    {
      id: "hospital",
      speaker: "Soraia",
      music: "luar",
      body: "A Soraia está acordada. O lábio aberto, a voz rouca, a mão com soro não treme. “Eu não soltei. A gente ia embora juntas. A Duda pediu para eu não contar, porque a Elisa não sabe da gente, e a Duda teve medo da irmã mais do que da mureta. A mão dela chegou em mim e abriu. Não foi um pulo. Foi um medo.” Ela olha você sem romance e sem ódio, o que é mais difícil de sustentar. “Se você repetir a versão dela, eu sobrevivo e fico mentirosa no papel. Se você disser o meu nome direito, a Duda quebra e talvez mereça quebrar. Eu não vou te pedir heroína. Vou pedir que você não me deixe sozinha na frase.”",
      choices: [
        { id: "gravar", label: "Voltar e gravar o que ela disse", to: "fim-nome", affinity: 2, clue: "Elas iam embora juntas. A Elisa não sabia.", thought: "Eu levo a frase dela inteira. Sem enfeite, sem irmã no meio." },
        { id: "segredo", label: "Prometer segredo", to: "fim-versao", affinity: -1, thought: "Segredo, esta noite, é só a versão da Duda com outro nome." },
        { id: "ficar", label: "Ficar com a Soraia e não voltar à sala", to: "fim-silencio", affinity: 1, thought: "A cadeira do hospital é o único depoimento que eu consigo sustentar agora." },
      ],
    },
    {
      id: "fim-versao",
      music: "despedida",
      ending: {
        key: "versao",
        title: "A versão",
        flower: "Ferro",
        body: "Você assina a frase que salva a Duda. A Elisa fecha o arquivo como quem fecha uma dívida de família e não agradece com a boca. No corredor ela diz apenas: “Você sempre soube ser leal à pessoa que está na sua frente. O problema é quem fica atrás.” A Soraia não responde você nos dias seguintes. A Duda manda um áudio que você não toca. A jaqueta continua na delegacia, ou na cadeira de alguém, ou no passado. Você foi leal ao silêncio errado. O gravador guarda a sua voz com uma calma ofensiva. De noite, a cidade vista de baixo não tem mureta. Você sabe que isso é mentira.",
        letter: { from: "Soraia", text: "Eu li o papel. A sua letra não está nele, mas a sua omissão está. Eu vou ficar boa. Não preciso que você apareça para completar a versão. Se um dia você quiser dizer a frase que não disse, diz para o gravador, não para mim. Eu já ouvi o suficiente daquela cobertura." },
      },
    },
    {
      id: "fim-nome",
      music: "revelacao",
      ending: {
        key: "nome",
        title: "O nome dela",
        flower: "Linha vermelha",
        body: "Você diz no gravador, com a voz que a Elisa conhece de outra vida: a Soraia não pulou. A mão da Duda abriu. Elas iam embora, e o medo chegou antes do amor. A cara da Elisa faz a coisa que fazia quando você foi embora dela, uma quebra limpa, sem súplica. Ela escreve mesmo assim. A Duda passa por você sem a jaqueta, sem o por favor. A Soraia, rouca, pergunta por que a verdade precisou de um distintivo para sair. Você não tem resposta bonita. Fica na cadeira. Às vezes ficar é o único pedido de desculpa que não mente.",
        letter: { from: "Elisa", text: "Eu registrei. Não vem me explicar a minha irmã nem a Soraia. Você fez a parte que eu pedi e a parte que eu temia. As duas podem ser a mesma. Não me procura para ser consolada. Se a Soraia quiser você no hospital, isso é dela. O arquivo não é mais uma conversa nossa." },
      },
    },
    {
      id: "fim-silencio",
      music: "despedida",
      ending: {
        key: "silencio",
        title: "Sem assinar",
        flower: "Porta entreaberta",
        body: "Você não dá à Elisa uma frase. Ela desliga o gravador sem pleitear. “Então a noite continua sua. Cuidado: noite sem frase é que outras pessoas escrevem.” Você sai na chuva com as mãos vazias e o ouvido cheio. Em casa, duas batidas, com horas de distância. Você conhece os dois ritmos. A mão fica na fechadura um tempo que não cabe em depoimento. O silêncio também escolheu um lado. Você abre para a Soraia. A batida da Duda fica sem resposta, e a falta de resposta é uma frase, finalmente, dita na madeira.",
        letter: { from: "Soraia", text: "Obrigada por abrir. Eu não vim buscar a versão. Vim buscar uma cadeira que não seja a do hospital nem a da irmã dela. Não precisa falar da cobertura hoje. Se falar, fala direito. Eu já sobrevivi à frase fácil. Não preciso de outra." },
      },
    },
  ],
};

export const sharpPt: Story[] = [passageiraPt, cartasPt, corredorPt, depoimentoPt];
