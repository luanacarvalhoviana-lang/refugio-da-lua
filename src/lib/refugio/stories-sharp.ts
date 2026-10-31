import { cartasPt } from "@/lib/refugio/stories-cartas";
import type { Story } from "@/lib/refugio/stories";

const passageiraPt: Story = {
  slug: "passageira",
  title: "Passageira",
  author: "Luana Viana",
  rating: "16",
  genres: ["thriller", "crime", "romance"],
  minutes: 14,
  synopsis: "Ela entra no seu carro depois da meia-noite com a chave que você nunca pediu de volta. O casaco no banco de trás ainda está quente. Ela pede para você dirigir e não olhar.",
  place: "Marginal",
  art: "/scenes/varanda.jpg",
  start: "banco",
  sound: "/sounds/rain.mp3",
  scenes: [
    {
      id: "banco",
      music: "suspense",
      body: "A chuva costura a marginal. O farol acima de você pisca e desiste. Alguém bate no vidro do passageiro com a familiaridade de quem não precisa pedir licença. É a Renata. Onze meses sem uma frase. Ela mostra a chave reserva, a que você deu numa terça e esqueceu no meio do término. O banco de trás carrega um casaco escuro, dobrado demais para estar vazio de calor. “Dirige. Não olha pra trás. Se olhar, a gente perde o único minuto em que o carro de trás ainda não sabe que eu entrei no seu.”",
      choices: [
        { id: "dirigir", label: "Dirigir sem olhar", to: "marginal", affinity: 1, clue: "A Renata ainda tem a chave reserva do seu carro.", thought: "Se eu olhar, eu viro testemunha. Se eu dirigir, eu viro cúmplice. Os dois doem menos do que deixá-la na chuva." },
        { id: "olhar", label: "Olhar o banco de trás antes", to: "tras", affinity: 1, clue: "O casaco ainda está quente.", thought: "Eu preciso saber o tamanho da noite antes de emprestar o meu carro a ela." },
        { id: "descer", label: "Mandar ela descer", to: "fim-porta", affinity: -1, thought: "Onze meses ensinaram a minha mão a trancar. A mão obedece. O resto de mim não aplaude." },
      ],
    },
    {
      id: "tras",
      speaker: "Renata",
      music: "suspense",
      body: "O casaco cheira a chuva e a um perfume que você só encontrou uma vez, numa festa em que a Renata passou a noite inteira olhando para outra mulher. No bolso, um cartão de hotel com o número 4 escrito a lápis, e um batom escuro que não é o dela. Renata não tenta esconder. “A Marina desceu viva. Eu juro pela coisa mais idiota que eu tenho, que é você. O carro que vem atrás não é o meu. É o da Celina. A Marina saiu dela hoje. Eu só abri uma porta. Aí a porta ficou perigosa, e a única chave que a Celina não conhece é a do seu carro.”",
      choices: [
        { id: "guardar", label: "Guardar o cartão do quarto 4", to: "marginal", affinity: 2, clue: "O cartão do hotel é do quarto 4, escrito a lápis.", thought: "Guardar isso é decidir que a noite vai ter prova. Eu guardo mesmo assim." },
        { id: "ferida", label: "Perguntar se a Marina está ferida", to: "marginal", affinity: 1, thought: "A pergunta certa chega tarde. Eu faço assim mesmo, porque chegar tarde ainda é chegar." },
        { id: "devolver", label: "Devolver o casaco e parar", to: "fim-casaco", affinity: 0, thought: "Se eu devolvo o casaco, eu devolvo a noite inteira. Parte de mim quer as mãos limpas." },
      ],
    },
    {
      id: "marginal",
      speaker: "Renata",
      music: "suspense",
      body: "A cidade abre um corredor molhado. Renata olha o retrovisor como quem olha uma pessoa. Um carro mantém a mesma distância, sem pressa, que é o jeito mais antigo de ameaçar. “A Celina acha que a Marina foi embora comigo. Não foi. A Marina foi embora dela. Eu apareci porque a Marina me ligou de um posto fechado e a voz estava pequena. Quando eu cheguei, a Marina já tinha descido do meu carro e pedido para eu não ir atrás. Eu vi o outro farol. Entrei no seu porque o seu ela não marca.” A mão da Renata fica no joelho, sem pedir colo. Só para não tremer sozinha.",
      choices: [
        { id: "quem", label: "Perguntar quem é a Celina para a Marina", to: "posto", affinity: 1, clue: "Celina é a mulher da Marina.", thought: "Nome troca medo de lugar. Eu quero o nome." },
        { id: "silencio", label: "Não falar. Só dirigir", to: "posto", affinity: 2, thought: "Ela conta mais quando eu não arranco a frase. Eu sei disso desde antes." },
        { id: "encostar", label: "Encostar o carro agora", to: "fim-casaco", affinity: -1, thought: "Parar é um tipo de coragem que parece abandono. Eu paro." },
      ],
    },
    {
      id: "posto",
      music: "revelacao",
      body: "O posto está fechado, a luz da loja cortada no meio. O telefone da Renata acende no porta-copos: Marina. Toca como se o som pudesse denunciar vocês para a rua inteira. No retrovisor, o outro carro passou reto e sumiu na curva, o que não é alívio. É alguém escolhendo outro ângulo. Renata não pega o telefone. Olha para você do jeito de quem já entregou o volante e agora entrega o resto. “Se você atender, ela vai pedir uma coisa. Se eu atender, eu vou prometer. As duas opções deixam a gente dentro.”",
      choices: [
        { id: "atender", label: "Atender a Marina", to: "farol", affinity: 2, clue: "A Marina pediu para não deixar a Celina encontrar vocês.", thought: "A voz dela vai me tornar responsável. Eu já estou dirigindo. Responsável é só o nome novo." },
        { id: "tocar", label: "Deixar tocar até parar", to: "farol", affinity: 0, thought: "O silêncio também escolhe. Eu finjo que é neutro." },
        { id: "viva", label: "Pôr no viva-voz", to: "farol", affinity: 1, clue: "A Marina está a dois quarteirões, a pé, sem casaco.", thought: "Eu quero a frase sem ser a dona dela. Covardia educada." },
      ],
    },
    {
      id: "farol",
      speaker: "Marina",
      music: "suspense",
      body: "A Marina está sob o farol, sem casaco, o cabelo colado na boca. Ela não corre. Quem corre parece culpa. O carro da Celina desce a rua de baixo, devagar, procurando um rosto. A Marina vê o seu carro e não o reconhece. Reconhece a Renata no banco. A boca dela forma uma frase sem som: não para, ou para, você não distingue. Renata abre a mão no console, entre o freio e você. “Se a gente para, ela entra e a Celina passa sem ver o rosto. Se a gente segue, eu desço no próximo ponto e levo o casaco. Você fica só com a noite. Eu não vou te odiar. Eu vou lembrar.”",
      choices: [
        { id: "parar", label: "Parar e abrir a porta para a Marina", to: "fim-curva", affinity: 2, thought: "Abrir a porta é a coisa mais alta que eu faço em meses. A maçaneta está fria." },
        { id: "reto", label: "Passar reto", to: "fim-casaco", affinity: -1, thought: "O farol fica para trás como uma pessoa que eu podia ter sido." },
        { id: "buzina", label: "Buzinar para ela saber qual é o carro", to: "fim-curva", affinity: 1, clue: "A buzina também avisa a Celina.", thought: "O som me entrega. Também entrega a Marina a uma saída. Eu aceito os dois." },
      ],
    },
    {
      id: "fim-curva",
      music: "romance",
      ending: {
        key: "curva",
        title: "A curva",
        flower: "Jasmim-do-cabo",
        body: "Você para. A Marina entra sem teatro, molhada, viva, e se deita no banco de baixo do casaco como quem apaga o próprio contorno. A Celina passa a meio metro. Não vê o rosto. Vê um carro qualquer na chuva, e carros quaisquer são a única bondade da cidade. No farol seguinte, longo demais, a Renata encosta a testa no seu ombro. Não beija. Diz amanhã com a voz de quem pretende pagar o que deve. A Marina, atrás, diz o seu nome. Ela não deveria saber. A Renata contou. Ninguém explica o ano em silêncio. O sinal abre. Você dirige as três até a luz feia de um hospital e não desce. Ficar no volante, esta noite, também é ficar.",
        letter: { from: "Renata", text: "A Marina está no quarto, dormindo de verdade. A Celina não entrou. Eu não vou transformar você em álibi nem em heroína. Amanhã, se você quiser a chave de volta, eu levo. Se quiser que eu fique com ela mais um dia, diz. Eu sei a diferença." },
      },
    },
    {
      id: "fim-casaco",
      music: "despedida",
      ending: {
        key: "casaco",
        title: "O que ficou no bolso",
        flower: "Cravo branco",
        body: "A Marina fica sob o farol. A Renata abre a porta no movimento seguinte e corre com o casaco aberto, duas pessoas tentando caber num pano só. Você segue porque parar agora seria escolher um lado com plateia. Duas ruas depois, o banco cheira a elas e não a você. No bolso que ficou, uma tira de papel molhado: “Se for ela dirigindo, diz que eu vi o carro.” Você não sabe qual ela. De manhã o papel seca torto e continua verdadeiro. A chave reserva não volta. Algumas noites não fecham. Elas apenas mudam de dona.",
        letter: { from: "Marina", text: "Eu vi o seu carro passar. Não te culpo. A Renata chegou até mim a pé, o que é mais do que eu pedi a qualquer uma das duas. Se a frase do bolso era para você, agora você sabe: eu vi. Não precisa responder. Só não entrega o papel para a Celina." },
      },
    },
    {
      id: "fim-porta",
      music: "despedida",
      ending: {
        key: "porta",
        title: "A porta que você fechou",
        flower: "Folha molhada",
        body: "A Renata desce antes do sinal abrir. Não bate a porta. Isso é pior: ela ainda está sendo cuidadosa com uma coisa sua. No retrovisor, duas mulheres dividem um casaco debaixo da chuva e nenhuma olha para o seu carro. Você era a única porta que a Celina não conhecia. Você fechou. A marginal segue lisa, inocente, cheia de gente que não deve nada a esta noite. A chave reserva continua fora do seu molho. Você vai lembrar dela cada vez que trancar alguma coisa.",
        letter: { from: "Renata", text: "Eu não vou pedir de novo. A Marina chegou em casa. Não na minha. Eu devolvia a chave se soubesse como te ver sem parecer um pedido. Fica com o silêncio. Você já escolheu o tamanho dele." },
      },
    },
  ],
};

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
