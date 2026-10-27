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
    slug: "passageira",
    scene: "marginal",
    after: [
      { if: "banco:dirigir", line: "Você não olhou. A Renata sabe. Fala com o retrovisor como se o banco de trás ainda pudesse ser um boato, e como se vocês duas estivessem mais seguras enquanto isso for verdade." },
      { if: "tras:guardar", line: "O cartão do quarto 4 está no seu bolso. Ela viu você guardar. Não pede de volta. O número a lápis fica mais alto do que a chuva." },
      { if: "tras:ferida", line: "Você perguntou se a Marina está ferida. A Renata só responde agora, para o para-brisa: “Viva. Não bem. Não me faz dizer o resto com aquele carro atrás.”" },
    ],
  },
  {
    slug: "passageira",
    scene: "posto",
    after: [
      { if: "marginal:quem", line: "O nome já é seu. Quando o telefone acende Marina, a Renata não repete Celina. Só olha, como quem entrega um nome que agora também pesa na sua boca." },
      { if: "marginal:silencio", line: "Porque você não perguntou, ela diz aqui, menor: “A Celina é a mulher dela. Eu sou a porta, não o motivo.” O silêncio comprou a frase." },
    ],
  },
  {
    slug: "passageira",
    scene: "farol",
    after: [
      { if: "posto:atender", line: "A voz da Marina ainda está no seu ouvido. Ela pediu para a Celina não encontrar vocês. Debaixo do farol, vê o seu rosto e sabe qual das duas atendeu. A boca completa o resto daquela frase." },
      { if: "posto:tocar", line: "O toque morreu no porta-copos. A Marina não sabe que você ouviu. Só sabe um carro. Por isso a boca não decide entre para e não para." },
      { if: "posto:viva", line: "Vocês duas ouviram. Dois quarteirões, a pé, sem casaco. A Renata não traduz. O farol é exatamente o lugar que a voz disse. A covardia educada veio com endereço." },
    ],
  },
  {
    slug: "passageira",
    scene: "fim-curva",
    after: [
      { if: "farol:parar", line: "Você parou sem buzina. O carro da Celina passou um desconhecido na chuva. O silêncio é o motivo de o rosto não ter sido visto." },
      { if: "farol:buzina", line: "A buzina continua na noite. A Celina olhou. Não viu o rosto. Ouviu qual era o carro. A testa da Renata no seu ombro também é um pedido de desculpa pelo som." },
    ],
    morning: {
      title: "A chave, de manhã",
      body: "A Renata manda uma frase só, às oito: “A Marina dormiu. A Celina não entrou. A chave fica comigo até você dizer.” Você ainda não responde. O banco do carona seca torto. No porta-luvas, o 4 a lápis continua capaz de provar a noite.",
    },
    morningIf: [
      {
        if: "farol:buzina",
        title: "O som que ficou",
        body: "Às oito quem escreve é a Marina, não a Renata: “Ela ouviu a buzina. Não viu o meu rosto. Viu o seu carro.” A Renata manda em seguida, só: “Eu levo a chave hoje, se você quiser sumir do número.” De dia o farol é um poste. O som não.",
      },
    ],
  },
  {
    slug: "passageira",
    scene: "fim-casaco",
    after: [
      { if: "tras:devolver", line: "Você devolveu o casaco antes de a cidade abrir. O que secou no bolso ainda era delas. Você só levou o cheiro até a calçada." },
      { if: "marginal:encostar", line: "Você encostou na marginal. Elas desceram na mesma chuva. O papel no bolso era para quem estivesse dirigindo. Era você." },
      { if: "farol:reto", line: "Você passou reto no farol. A Renata correu o casaco de volta a pé. O papel sabe que você viu o carro e não parou." },
    ],
    morning: {
      title: "O papel seco",
      body: "De manhã o papel cabe na mesa: “Se for ela dirigindo, diz que eu vi o carro.” Você não responde à Marina. Também não joga fora. A chave reserva não volta para o molho. A Renata não escreve. Algumas noites mudam de dona e não avisam.",
    },
    morningIf: [
      {
        if: "tras:devolver",
        title: "O casaco devolvido",
        body: "A Renata escreve de manhã, sem pedido: “A Marina chegou na casa dela. O casaco ficou comigo, como você quis. A chave eu ainda tenho. Não vou usar.” Você olha a fechadura do próprio carro e sente a falta de uma cópia que já não era sua antes da chuva.",
      },
      {
        if: "marginal:encostar",
        title: "Na calçada",
        body: "Você parou cedo demais para ser heroína e tarde demais para ser neutra. De manhã o banco do carona está vazio e a chave reserva está no tapete, sem bilhete. A Marina não escreve. A Renata manda uma linha: “A gente desceu. Você não precisava ver o resto.”",
      },
    ],
  },
  {
    slug: "passageira",
    scene: "fim-porta",
    morning: {
      title: "A marginal de manhã",
      body: "A Renata não pede de novo. Às nove, uma mensagem sem saudação: “Ela chegou. Não na minha casa.” A chave continua fora do molho. Você tranca o carro duas vezes, como se a segunda pudesse fechar a porta que você já fechou na chuva.",
    },
  },
  {
    slug: "correspondencia",
    scene: "escada",
    after: [
      { if: "caixa:nao", line: "A carta continua fechada na sua mão. A Helena vê o envelope, não a frase. Pede um nome porque você não deu o papel." },
      { if: "leitura:guardar", line: "Você já sabe a cozinha, o trem, o ano. Subiu sem resposta. A Helena não sabe que você leu. Por isso ainda oferece qualquer um dos dois nomes." },
    ],
  },
  {
    slug: "correspondencia",
    scene: "mesa",
    after: [
      { if: "leitura:escrever", line: "As três linhas já estão no verso da conta. O interfone é só o último palmo. Você não decide mais se diz a verdade. Decide se desce com ela na mão." },
      { if: "portaria:ler", line: "A segunda carta usou o seu nome de agora. As três linhas tremem mais, porque ela atravessou o nome antigo sem você." },
      { if: "portaria:endereco", line: "O número está no telefone e você não ligou. No papel, a frase continua devida. O interfone toca como se ela ouvisse o número parado." },
    ],
  },
  {
    slug: "correspondencia",
    scene: "fim-resposta",
    after: [
      { if: "escada:carta", line: "Você mostrou a carta em vez de falar. Ela já leu o seu silêncio na escada. O papel que você entrega agora é a segunda voz." },
      { if: "mesa:descer", line: "Você desceu com a resposta na mão. Ela lê a frase do trem de pé. A escada não precisou falar." },
    ],
    morning: {
      title: "O ônibus",
      body: "A Helena escreve antes do meio-dia, do trabalho, sem poesia: “Li de novo. Não apareço hoje. Se você responder uma linha, eu respondo uma. A cozinha foi real.” Você lê duas vezes e não transforma isso em plano. Deixa o nome de agora na caixa, sem apagar o antigo da memória.",
    },
    morningIf: [
      {
        if: "escada:carta",
        title: "O papel falou",
        body: "De manhã ela escreve: “Você me mostrou a carta e não a boca. Eu entendi as duas. Não subo sem convite. Escrevo para o nome que você usa agora.” O envelope de ontem continua na mesa, aberto, sem ter precisado de discurso.",
      },
    ],
  },
  {
    slug: "correspondencia",
    scene: "fim-escada",
    after: [
      { if: "escada:sou", line: "Você disse na escada: sou eu. Ela não precisou subir para ouvir o nome. Os vinte minutos de água começaram ali." },
      { if: "mesa:subir", line: "Você pediu que ela cruzasse a porta. O apartamento deixou de ser esconderijo antes de o nome novo ser dito em voz alta." },
    ],
    morning: {
      title: "Vinte minutos",
      body: "A Helena não dormiu aqui. De manhã manda: “Cheguei. Não vou romantizar a escada. Escrevo na quinta, se não for cedo.” Você lava o copo que ela usou. É um sim pequeno e cabe na pia.",
    },
    morningIf: [
      {
        if: "mesa:subir",
        title: "A porta que abriu",
        body: "Ela subiu porque você pediu. De manhã o casaco dela não está na cadeira, só na memória do patamar. A mensagem diz: “Obrigada pelo último degrau ao contrário. Eu desci inteira. Escrevo na quinta para este endereço, não para o nome antigo.”",
      },
    ],
  },
  {
    slug: "correspondencia",
    scene: "fim-nome",
    after: [
      { if: "leitura:jogar", line: "Os pedaços da carta estão no lixo. Ela vai escrever mais uma mesmo assim. Você já sabe o que vai dizer, porque rasgou a verdadeira." },
      { if: "escada:morto", line: "Você disse que esse nome não mora aqui. Ela acreditou no prédio. A segunda morte foi dita em voz alta, e isso pesa mais do que papel." },
      { if: "portaria:devolver", line: "Você devolveu o segundo envelope sem ler. Ela sabe que você recusou o nome de agora, não só o enterrado." },
      { if: "mesa:nao", line: "O interfone parou. Ela estava embaixo, com a paciência que você não gastou. O ano recomeça idêntico, e você ouviu isso acontecer." },
    ],
    morning: {
      title: "Sexta",
      body: "Na sexta chega a última carta. Você não abre. O papel amarela no prazo em que papel amarela. A Helena não aparece. O porteiro não comenta. De noite a caixa faz um barulho de metal. Quase sempre é o vento. Quase.",
    },
    morningIf: [
      {
        if: "leitura:jogar",
        title: "Os pedaços",
        body: "Você rasgou antes de responder. De manhã os pedaços ainda estão no lixo, legíveis demais se alguém quiser. Ninguém quer. Na sexta chega outra, fechada. Você não cola a primeira. Enterrar um nome duas vezes não pede simetria. Pede que você pare de abrir.",
      },
    ],
  },
  {
    slug: "sobremesa",
    scene: "sala",
    after: [
      { if: "forno:voz", line: "Você disse alto, ainda na cozinha: é a minha ex. O brinde da Clara não apresenta. Responde. A Nanda, na janela, já ouviu a frase verdadeira antes da taça." },
    ],
  },
  {
    slug: "sobremesa",
    scene: "sal",
    after: [
      { if: "gelo:rir", line: "O riso ainda está na despensa, feio e necessário. A Clara abre a porta no som, não num discurso. Ouviu você escolher a Nanda antes de qualquer confissão." },
      { if: "gelo:terminar", line: "Você perguntou se ela ia terminar. A Nanda disse domingo. A Clara entra já sabendo que a piada é pequena para o que você perguntou. A arma não é o sal. Foi a pergunta." },
    ],
  },
  {
    slug: "sobremesa",
    scene: "fim-conta",
    after: [
      { if: "sala:brinde", line: "Você sentou ao lado da Nanda. A verdade saiu mal contada, mas a cadeira já tinha escolhido." },
      { if: "sala:corrigir", line: "Você corrigiu a Clara na frente de todo mundo. A mesa ainda mastiga a frase feia. Por isso a Clara manda comer: controle, depois de você ter tomado o microfone." },
      { if: "sal:desculpa", line: "O pedido de desculpa foi sem plateia. O que a mesa ouviu depois era a versão menor. A Clara sabe qual das duas foi real." },
      { if: "sal:armou", line: "Você disse que ela armou a noite. Ela não negou. O pagamento em dobro, mais tarde, é o jeito dela de fechar um enredo que admite." },
    ],
    morning: {
      title: "Domingo",
      body: "Domingo, quatro da tarde, a Nanda aparece sem vela. Não termina. Começa a conversa difícil, com pão, como prometeu. A Clara não escreve. O reembolso caiu. A cozinha de serviço, de dia, é só uma cozinha. Você não entra.",
    },
    morningIf: [
      {
        if: "sala:corrigir",
        title: "A frase feia",
        body: "A Clara manda, cedo: “A mesa comeu. Eu também. Não repete a correção em lugar nenhum. Eu ouvi da primeira vez.” A Nanda, às quatro, ri torto e não pede discurso. Pede o pão. Você leva. A frase feia ficou na sala, que era o lugar dela.",
      },
      {
        if: "sal:armou",
        title: "O enredo",
        body: "A Clara escreve uma linha sem charme: “Eu contratei sabendo. Você disse em voz alta. Estamos quites no enredo. Não no dinheiro, que já caiu.” A Nanda chega às quatro e não pergunta da despensa. Pergunta se domingo ainda é domingo. É.",
      },
    ],
  },
  {
    slug: "sobremesa",
    scene: "fim-prato",
    after: [
      { if: "gelo:muda", line: "Você voltou muda para o risoto. O recibo debaixo do prato é a primeira frase da noite. A Nanda lê porque você não disse." },
      { if: "sala:cozinha", line: "Você se escondeu no serviço. A Clara entendeu uma hora tarde e com precisão. O recado não passou pela sala. Por isso o prato dela saiu limpo." },
      { if: "sal:servir", line: "Você serviu a sobremesa e saiu calada. O recibo falou debaixo do prato da Nanda. O açúcar queimado ficou para os convidados. Eles vão chamar de técnica." },
    ],
    morning: {
      title: "Desce",
      body: "A mensagem da Nanda ainda está na tela: desce. Você desceu ontem com o avental. De manhã o avental está na cadeira e ela manda o endereço de um café sem peixe. “Se você vier, vem sem uniforme. Eu leio melhor a sua cara do que o recibo.”",
    },
    morningIf: [
      {
        if: "sala:cozinha",
        title: "O avental",
        body: "Você se escondeu no serviço e mesmo assim ela leu. De manhã a Clara não se despede de novo. O dinheiro em dobro já caiu. A Nanda escreve: “Eu vi você voltar para a cozinha. Desci mesmo assim. Se for me encontrar, deixa o avental. Eu não quero a versão funcionária.”",
      },
    ],
  },
  {
    slug: "sobremesa",
    scene: "fim-cozinha",
    morning: {
      title: "O vazio",
      body: "De manhã o celular continua sem o domingo. A Clara manda o pagamento e nada além. A pia ainda tem a marca do balde. Você lava de novo, sem plateia. A piada acabou de madrugada. O que ficou foi uma boca que escolheu o lado errado na frente da mulher certa.",
    },
  },
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
    slug: "passageira",
    scene: "marginal",
    after: [
      { if: "banco:dirigir", line: "No miraste. Renata lo sabe. Habla con el retrovisor como si el asiento de atrás todavía pudiera ser un rumor, y como si las dos estuvieran más a salvo mientras eso sea verdad." },
      { if: "tras:guardar", line: "La tarjeta de la habitación 4 está en tu bolsillo. Ella te vio guardarla. No la pide. El número a lápiz suena más alto que la lluvia." },
      { if: "tras:ferida", line: "Preguntaste si Marina está herida. Renata recién responde ahora, al parabrisas: “Viva. No bien. No me hagas decir el resto con ese coche atrás.”" },
    ],
  },
  {
    slug: "passageira",
    scene: "posto",
    after: [
      { if: "marginal:quem", line: "El nombre ya es tuyo. Cuando el teléfono se enciende con Marina, Renata no repite Celina. Solo mira, como quien entrega un nombre que ahora también pesa en tu boca." },
      { if: "marginal:silencio", line: "Porque no preguntaste, lo dice aquí, más bajo: “Celina es la mujer de ella. Yo soy la puerta, no el motivo.” El silencio compró la frase." },
    ],
  },
  {
    slug: "passageira",
    scene: "farol",
    after: [
      { if: "posto:atender", line: "La voz de Marina sigue en tu oído. Pidió que Celina no las encontrara. Bajo el semáforo ve tu cara y sabe cuál de las dos atendió. La boca completa el resto de aquella frase." },
      { if: "posto:tocar", line: "El timbre murió en el posavasos. Marina no sabe que oíste. Solo sabe un coche. Por eso la boca no decide entre para y no pares." },
      { if: "posto:viva", line: "Las dos oyeron. Dos cuadras, a pie, sin abrigo. Renata no traduce. El semáforo es exactamente el lugar que dijo la voz. La cobardía educada vino con dirección." },
    ],
  },
  {
    slug: "passageira",
    scene: "fim-curva",
    after: [
      { if: "farol:parar", line: "Paraste sin bocina. El coche de Celina pasó a una desconocida en la lluvia. El silencio es el motivo de que la cara no se viera." },
      { if: "farol:buzina", line: "La bocina sigue en la noche. Celina miró. No vio la cara. Oyó cuál era el coche. La frente de Renata en tu hombro también es una disculpa por el sonido." },
    ],
    morning: {
      title: "La llave, de mañana",
      body: "Renata manda una sola frase, a las ocho: “Marina durmió. Celina no entró. La llave se queda conmigo hasta que tú digas.” Todavía no respondes. El asiento del copiloto se seca torcido. En la guantera, el 4 a lápiz sigue pudiendo probar la noche.",
    },
    morningIf: [
      {
        if: "farol:buzina",
        title: "El sonido que quedó",
        body: "A las ocho escribe Marina, no Renata: “Ella oyó la bocina. No vio mi cara. Vio tu coche.” Renata manda después, solo: “Llevo la llave hoy, si quieres desaparecer del número.” De día el semáforo es un poste. El sonido no.",
      },
    ],
  },
  {
    slug: "passageira",
    scene: "fim-casaco",
    after: [
      { if: "tras:devolver", line: "Devolviste el abrigo antes de que la ciudad se abriera. Lo que se secó en el bolsillo seguía siendo de ellas. Tú solo llevaste el olor hasta la vereda." },
      { if: "marginal:encostar", line: "Paraste en la avenida. Ellas bajaron a la misma lluvia. El papel del bolsillo era para quien estuviera conduciendo. Eras tú." },
      { if: "farol:reto", line: "Seguiste de largo en el semáforo. Renata corrió el abrigo de vuelta a pie. El papel sabe que viste el coche y no paraste." },
    ],
    morning: {
      title: "El papel seco",
      body: "De mañana el papel cabe en la mesa: “Si es ella la que conduce, dile que vi el coche.” No le respondes a Marina. Tampoco lo tiras. La llave de repuesto no vuelve al llavero. Renata no escribe. Algunas noches cambian de dueña y no avisan.",
    },
    morningIf: [
      {
        if: "tras:devolver",
        title: "El abrigo devuelto",
        body: "Renata escribe de mañana, sin pedido: “Marina llegó a su casa. El abrigo se quedó conmigo, como quisiste. La llave todavía la tengo. No la voy a usar.” Miras la cerradura de tu propio coche y extrañas una copia que ya no era tuya antes de la lluvia.",
      },
      {
        if: "marginal:encostar",
        title: "En la vereda",
        body: "Paraste demasiado pronto para ser heroína y demasiado tarde para ser neutra. De mañana el asiento del copiloto está vacío y la llave de repuesto está en el tapete, sin nota. Marina no escribe. Renata manda una línea: “Bajamos. No tenías que ver el resto.”",
      },
    ],
  },
  {
    slug: "passageira",
    scene: "fim-porta",
    morning: {
      title: "La avenida de mañana",
      body: "Renata no pide otra vez. A las nueve, un mensaje sin saludo: “Llegó. No a mi casa.” La llave sigue fuera del llavero. Cierras el coche dos veces, como si la segunda pudiera cerrar la puerta que ya cerraste en la lluvia.",
    },
  },
  {
    slug: "correspondencia",
    scene: "escada",
    after: [
      { if: "caixa:nao", line: "La carta sigue cerrada en tu mano. Helena ve el sobre, no la frase. Pide un nombre porque no le diste el papel." },
      { if: "leitura:guardar", line: "Ya sabes la cocina, el tren, el año. Subiste sin respuesta. Helena no sabe que leíste. Por eso todavía ofrece cualquiera de los dos nombres." },
    ],
  },
  {
    slug: "correspondencia",
    scene: "mesa",
    after: [
      { if: "leitura:escrever", line: "Las tres líneas ya están al dorso de la cuenta. El interfono es solo el último palmo. Ya no decides si dices la verdad. Decides si bajas con ella en la mano." },
      { if: "portaria:ler", line: "La segunda carta usó tu nombre de ahora. Las tres líneas tiemblan más, porque ella cruzó el nombre antiguo sin ti." },
      { if: "portaria:endereco", line: "El número está en el teléfono y no llamaste. En el papel, la frase sigue debida. El interfono suena como si ella oyera el número quieto." },
    ],
  },
  {
    slug: "correspondencia",
    scene: "fim-resposta",
    after: [
      { if: "escada:carta", line: "Mostraste la carta en vez de hablar. Ella ya leyó tu silencio en la escalera. El papel que entregas ahora es la segunda voz." },
      { if: "mesa:descer", line: "Bajaste con la respuesta en la mano. Ella lee la frase del tren de pie. La escalera no tuvo que hablar." },
    ],
    morning: {
      title: "El autobús",
      body: "Helena escribe antes del mediodía, desde el trabajo, sin poesía: “La leí de nuevo. No aparezco hoy. Si respondes una línea, yo respondo una. La cocina fue real.” La lees dos veces y no conviertes eso en un plan. Dejas el nombre de ahora en el buzón, sin borrar el antiguo de la memoria.",
    },
    morningIf: [
      {
        if: "escada:carta",
        title: "Habló el papel",
        body: "De mañana ella escribe: “Me mostraste la carta y no la boca. Entendí las dos. No subo sin invitación. Escribo al nombre que usas ahora.” El sobre de ayer sigue en la mesa, abierto, sin haber necesitado un discurso.",
      },
    ],
  },
  {
    slug: "correspondencia",
    scene: "fim-escada",
    after: [
      { if: "escada:sou", line: "Lo dijiste en la escalera: soy yo. Ella no tuvo que subir para oír el nombre. Los veinte minutos de agua empezaron ahí." },
      { if: "mesa:subir", line: "Le pediste que cruzara la puerta. El departamento dejó de ser escondite antes de que el nombre nuevo se dijera en voz alta." },
    ],
    morning: {
      title: "Veinte minutos",
      body: "Helena no durmió aquí. De mañana manda: “Llegué. No voy a romantizar la escalera. Escribo el jueves, si no es pronto.” Lavas el vaso que ella usó. Es un sí pequeño y cabe en el fregadero.",
    },
    morningIf: [
      {
        if: "mesa:subir",
        title: "La puerta que se abrió",
        body: "Subió porque tú se lo pediste. De mañana su abrigo no está en la silla, solo en la memoria del rellano. El mensaje dice: “Gracias por el último escalón al revés. Bajé entera. Escribo el jueves a esta dirección, no al nombre antiguo.”",
      },
    ],
  },
  {
    slug: "correspondencia",
    scene: "fim-nome",
    after: [
      { if: "leitura:jogar", line: "Los pedazos de la carta están en la basura. Ella va a escribir otra igual. Tú ya sabes lo que va a decir, porque rompiste la verdadera." },
      { if: "escada:morto", line: "Dijiste que ese nombre no vive aquí. Ella le creyó al edificio. La segunda muerte se dijo en voz alta, y eso pesa más que el papel." },
      { if: "portaria:devolver", line: "Devolviste el segundo sobre sin leer. Ella sabe que rechazaste el nombre de ahora, no solo el enterrado." },
      { if: "mesa:nao", line: "El interfono paró. Ella estaba abajo, con la paciencia que tú no gastaste. El año vuelve a empezar idéntico, y tú oíste cómo pasaba." },
    ],
    morning: {
      title: "Viernes",
      body: "El viernes llega la última carta. No la abres. El papel amarillea en el plazo en que el papel amarillea. Helena no aparece. El portero no comenta. De noche el buzón hace un ruido de metal. Casi siempre es el viento. Casi.",
    },
    morningIf: [
      {
        if: "leitura:jogar",
        title: "Los pedazos",
        body: "Romiste antes de responder. De mañana los pedazos siguen en la basura, demasiado legibles si alguien quiere. Nadie quiere. El viernes llega otra, cerrada. No pegas la primera. Enterrar un nombre dos veces no pide simetría. Pide que dejes de abrir.",
      },
    ],
  },
  {
    slug: "sobremesa",
    scene: "sala",
    after: [
      { if: "forno:voz", line: "Lo dijiste alto, todavía en la cocina: es mi ex. El brindis de Clara no presenta. Responde. Nanda, en la ventana, ya oyó la frase verdadera antes de la copa." },
    ],
  },
  {
    slug: "sobremesa",
    scene: "sal",
    after: [
      { if: "gelo:rir", line: "La risa sigue en la despensa, fea y necesaria. Clara abre la puerta al sonido, no a un discurso. Te oyó elegir a Nanda antes de cualquier confesión." },
      { if: "gelo:terminar", line: "Preguntaste si ella iba a terminar. Nanda dijo el domingo. Clara entra ya sabiendo que el chiste es pequeño para lo que preguntaste. El arma no es la sal. Fue la pregunta." },
    ],
  },
  {
    slug: "sobremesa",
    scene: "fim-conta",
    after: [
      { if: "sala:brinde", line: "Te sentaste al lado de Nanda. La verdad salió mal contada, pero la silla ya había elegido." },
      { if: "sala:corrigir", line: "Corregiste a Clara delante de todo el mundo. La mesa todavía mastica la frase fea. Por eso Clara manda comer: control, después de que tomaste el micrófono." },
      { if: "sal:desculpa", line: "La disculpa fue sin público. Lo que la mesa oyó después era la versión menor. Clara sabe cuál de las dos fue real." },
      { if: "sal:armou", line: "Dijiste que ella armó la noche. No lo negó. El pago doble, más tarde, es su modo de cerrar un enredo que admite." },
    ],
    morning: {
      title: "Domingo",
      body: "Domingo, a las cuatro, Nanda aparece sin vela. No termina. Empieza la conversación difícil, con pan, como prometió. Clara no escribe. El reembolso cayó. La cocina de servicio, de día, es solo una cocina. Tú no entras.",
    },
    morningIf: [
      {
        if: "sala:corrigir",
        title: "La frase fea",
        body: "Clara manda, temprano: “La mesa comió. Yo también. No repitas la corrección en ningún lado. La oí la primera vez.” Nanda, a las cuatro, se ríe torcido y no pide discurso. Pide el pan. Lo llevas. La frase fea se quedó en la sala, que era su lugar.",
      },
      {
        if: "sal:armou",
        title: "El enredo",
        body: "Clara escribe una línea sin encanto: “Contraté sabiendo. Tú lo dijiste en voz alta. Estamos a mano en el enredo. No en el dinero, que ya cayó.” Nanda llega a las cuatro y no pregunta por la despensa. Pregunta si el domingo sigue siendo domingo. Lo es.",
      },
    ],
  },
  {
    slug: "sobremesa",
    scene: "fim-prato",
    after: [
      { if: "gelo:muda", line: "Volviste muda al risotto. El recibo debajo del plato es la primera frase de la noche. Nanda lo lee porque tú no lo dijiste." },
      { if: "sala:cozinha", line: "Te escondiste en el servicio. Clara entendió una hora tarde y con precisión. El recado no pasó por la sala. Por eso su plato salió limpio." },
      { if: "sal:servir", line: "Serviste el postre y te fuiste callada. El recibo habló debajo del plato de Nanda. El azúcar quemada se quedó para los invitados. Van a llamarlo técnica." },
    ],
    morning: {
      title: "Baja",
      body: "El mensaje de Nanda sigue en la pantalla: baja. Ayer bajaste con el delantal. De mañana el delantal está en la silla y ella manda la dirección de un café sin pescado. “Si vienes, ven sin uniforme. Leo mejor tu cara que el recibo.”",
    },
    morningIf: [
      {
        if: "sala:cozinha",
        title: "El delantal",
        body: "Te escondiste en el servicio y aun así ella leyó. De mañana Clara no se despide otra vez. El dinero doble ya cayó. Nanda escribe: “Te vi volver a la cocina. Bajé igual. Si vas a encontrarme, deja el delantal. No quiero la versión empleada.”",
      },
    ],
  },
  {
    slug: "sobremesa",
    scene: "fim-cozinha",
    morning: {
      title: "El vacío",
      body: "De mañana el celular sigue sin el domingo. Clara manda el pago y nada más. El fregadero todavía tiene la marca del balde. Lo lavas de nuevo, sin público. El chiste se acabó de madrugada. Lo que quedó fue una boca que eligió el lado equivocado delante de la mujer correcta.",
    },
  },
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
    slug: "passageira",
    scene: "marginal",
    after: [
      { if: "banco:dirigir", line: "You didn’t look. Renata knows. She talks to the mirror as if the back seat could still be a rumor, and as if the two of you are safer while that stays true." },
      { if: "tras:guardar", line: "The card for room 4 is in your pocket. She saw you keep it. She doesn’t ask for it back. The pencil number is louder than the rain." },
      { if: "tras:ferida", line: "You asked if Marina is hurt. Renata answers only now, to the windshield: “Alive. Not well. Don’t make me say the rest with that car behind us.”" },
    ],
  },
  {
    slug: "passageira",
    scene: "posto",
    after: [
      { if: "marginal:quem", line: "The name is already yours. When the phone lights up Marina, Renata doesn’t repeat Celina. She only looks, like someone handing over a name that now weighs in your mouth too." },
      { if: "marginal:silencio", line: "Because you didn’t ask, she says it here, smaller: “Celina is her wife. I am the door, not the reason.” The silence bought the sentence." },
    ],
  },
  {
    slug: "passageira",
    scene: "farol",
    after: [
      { if: "posto:atender", line: "Marina’s voice is still in your ear. She asked you not to let Celina find you. Under the light she sees your face and knows which of you answered. Her mouth finishes that sentence." },
      { if: "posto:tocar", line: "The ringing died in the cup holder. Marina doesn’t know you heard. She only knows a car. That’s why her mouth can’t decide between stop and don’t." },
      { if: "posto:viva", line: "You both heard her. Two blocks, on foot, no coat. Renata doesn’t translate. The light is exactly where the voice said. Polite cowardice came with an address." },
    ],
  },
  {
    slug: "passageira",
    scene: "fim-curva",
    after: [
      { if: "farol:parar", line: "You stopped without a horn. Celina’s car passed a stranger in the rain. The quiet is why the face was not seen." },
      { if: "farol:buzina", line: "The horn is still in the night. Celina looked. She didn’t see the face. She heard which car. Renata’s forehead on your shoulder is also an apology for the sound." },
    ],
    morning: {
      title: "The key, in the morning",
      body: "Renata sends one sentence, at eight: “Marina slept. Celina didn’t come in. The key stays with me until you say.” You don’t answer yet. The passenger seat dries crooked. In the glove box, the pencil 4 can still prove the night.",
    },
    morningIf: [
      {
        if: "farol:buzina",
        title: "The sound that stayed",
        body: "At eight it is Marina who writes, not Renata: “She heard the horn. She didn’t see my face. She saw your car.” Renata sends, after that, only: “I’ll bring the key today, if you want to disappear from the number.” By day the light is a pole. The sound isn’t.",
      },
    ],
  },
  {
    slug: "passageira",
    scene: "fim-casaco",
    after: [
      { if: "tras:devolver", line: "You gave the coat back before the city opened. What dried in the pocket was still theirs. You only drove the smell as far as the curb." },
      { if: "marginal:encostar", line: "You pulled over on the overpass. They got out into the same rain. The paper in the pocket was for whoever was driving. That was you." },
      { if: "farol:reto", line: "You drove past the light. Renata ran the coat back on foot. The paper knows you saw the car and did not stop." },
    ],
    morning: {
      title: "The dry paper",
      body: "In the morning the paper fits on the table: “If she’s the one driving, tell her I saw the car.” You don’t answer Marina. You don’t throw it away either. The spare key does not come back to the ring. Renata doesn’t write. Some nights change owners and don’t send word.",
    },
    morningIf: [
      {
        if: "tras:devolver",
        title: "The coat returned",
        body: "Renata writes in the morning, without asking: “Marina got to her house. The coat stayed with me, the way you wanted. I still have the key. I won’t use it.” You look at your own car lock and miss a copy that wasn’t yours even before the rain.",
      },
      {
        if: "marginal:encostar",
        title: "On the curb",
        body: "You stopped too early to be a heroine and too late to be neutral. In the morning the passenger seat is empty and the spare key is on the mat, no note. Marina doesn’t write. Renata sends one line: “We got out. You didn’t need to see the rest.”",
      },
    ],
  },
  {
    slug: "passageira",
    scene: "fim-porta",
    morning: {
      title: "The overpass in the morning",
      body: "Renata doesn’t ask again. At nine, a message with no greeting: “She got there. Not to my house.” The key is still off the ring. You lock the car twice, as if the second time could close the door you already closed in the rain.",
    },
  },
  {
    slug: "correspondencia",
    scene: "escada",
    after: [
      { if: "caixa:nao", line: "The letter is still sealed in your hand. Helena sees the envelope, not the sentence. She asks for a name because you didn’t give her the paper." },
      { if: "leitura:guardar", line: "You already know the kitchen, the train, the year. You came up without an answer. Helena doesn’t know you’ve read it. That’s why she still offers either name." },
    ],
  },
  {
    slug: "correspondencia",
    scene: "mesa",
    after: [
      { if: "leitura:escrever", line: "The three lines are already on the back of the bill. The intercom is only the last inch. You are no longer deciding whether to tell the truth. You are deciding whether to carry it down." },
      { if: "portaria:ler", line: "The second letter used the name you use now. The three lines shake more, because she crossed the old name without you." },
      { if: "portaria:endereco", line: "The number is in your phone and you have not called. On the paper the sentence is still owed. The intercom rings as if she can hear the number sitting still." },
    ],
  },
  {
    slug: "correspondencia",
    scene: "fim-resposta",
    after: [
      { if: "escada:carta", line: "You showed the letter instead of speaking. She already read your silence on the stair. The paper you hand her now is the second voice." },
      { if: "mesa:descer", line: "You came down with the answer in your hand. She reads the sentence about the train standing up. The stair never had to speak." },
    ],
    morning: {
      title: "The bus",
      body: "Helena writes before noon, from work, with no poetry: “I read it again. I won’t show up today. If you answer one line, I’ll answer one. The kitchen was real.” You read it twice and don’t turn it into a plan. You leave the name you use now on the mailbox, without erasing the old one from memory.",
    },
    morningIf: [
      {
        if: "escada:carta",
        title: "The paper spoke",
        body: "In the morning she writes: “You showed me the letter and not your mouth. I understood both. I won’t come up without an invitation. I’ll write to the name you use now.” Yesterday’s envelope is still on the table, open, without having needed a speech.",
      },
    ],
  },
  {
    slug: "correspondencia",
    scene: "fim-escada",
    after: [
      { if: "escada:sou", line: "You said it on the stair: it’s me. She didn’t have to come up to hear the name. The twenty minutes of water started there." },
      { if: "mesa:subir", line: "You asked her to cross the door. The apartment stopped being a hiding place before the new name was said out loud." },
    ],
    morning: {
      title: "Twenty minutes",
      body: "Helena didn’t sleep here. In the morning she sends: “I got home. I won’t romanticize the stair. I’ll write on Thursday, if that isn’t soon.” You wash the glass she used. It is a small yes and it fits in the sink.",
    },
    morningIf: [
      {
        if: "mesa:subir",
        title: "The door that opened",
        body: "She came up because you asked. In the morning her coat is not on the chair, only in the memory of the landing. The message says: “Thank you for the last step the other way. I went down whole. I’ll write on Thursday to this address, not to the old name.”",
      },
    ],
  },
  {
    slug: "correspondencia",
    scene: "fim-nome",
    after: [
      { if: "leitura:jogar", line: "The pieces of the letter are in the trash. She will write one more anyway. You already know what it will say, because you tore the true one." },
      { if: "escada:morto", line: "You said that name doesn’t live here. She believed the building. The second death was said out loud, and that weighs more than paper." },
      { if: "portaria:devolver", line: "You gave the second envelope back unread. She knows you refused the name you use now, not only the buried one." },
      { if: "mesa:nao", line: "The intercom stopped. She was downstairs, with the patience you didn’t spend. The year starts over identical, and you heard it happen." },
    ],
    morning: {
      title: "Friday",
      body: "On Friday the last letter arrives. You don’t open it. The paper yellows the way paper yellows. Helena doesn’t appear. The doorman doesn’t comment. At night the mailbox makes a metal sound. Almost always it is the wind. Almost.",
    },
    morningIf: [
      {
        if: "leitura:jogar",
        title: "The pieces",
        body: "You tore it before you answered. In the morning the pieces are still in the trash, too readable if anyone wants them. No one does. On Friday another arrives, sealed. You don’t tape the first one back together. Burying a name twice doesn’t ask for symmetry. It asks you to stop opening.",
      },
    ],
  },
  {
    slug: "sobremesa",
    scene: "sala",
    after: [
      { if: "forno:voz", line: "You said it loud, still in the kitchen: she’s my ex. Clara’s toast doesn’t introduce. It answers. Nanda, at the window, already heard the true sentence before the glass." },
    ],
  },
  {
    slug: "sobremesa",
    scene: "sal",
    after: [
      { if: "gelo:rir", line: "The laugh is still in the pantry, ugly and necessary. Clara opens the door on the sound, not on a speech. She heard you choose Nanda before anyone confessed." },
      { if: "gelo:terminar", line: "You asked if she was going to end it. Nanda said Sunday. Clara walks in already knowing the joke is too small for what you asked. The weapon isn’t the salt. It was the question." },
    ],
  },
  {
    slug: "sobremesa",
    scene: "fim-conta",
    after: [
      { if: "sala:brinde", line: "You sat beside Nanda. The truth came out badly told, but the chair had already chosen." },
      { if: "sala:corrigir", line: "You corrected Clara in front of everyone. The table is still chewing the ugly sentence. That’s why Clara tells them to eat: control, after you took the microphone." },
      { if: "sal:desculpa", line: "The apology happened with no audience. What the table heard later was the smaller version. Clara knows which one was real." },
      { if: "sal:armou", line: "You said she built the night. She didn’t deny it. The double pay, later, is how she closes a plot she admits." },
    ],
    morning: {
      title: "Sunday",
      body: "Sunday, at four, Nanda shows up with no candle. She doesn’t end it. She starts the harder conversation, with bread, as promised. Clara doesn’t write. The refund landed. The service kitchen, by day, is only a kitchen. You don’t go in.",
    },
    morningIf: [
      {
        if: "sala:corrigir",
        title: "The ugly sentence",
        body: "Clara sends, early: “The table ate. So did I. Don’t repeat the correction anywhere. I heard it the first time.” Nanda, at four, laughs crooked and doesn’t ask for a speech. She asks for the bread. You bring it. The ugly sentence stayed in the dining room, which was its place.",
      },
      {
        if: "sal:armou",
        title: "The plot",
        body: "Clara writes one line with no charm: “I hired you knowing. You said it out loud. We’re even on the plot. Not on the money, which already landed.” Nanda arrives at four and doesn’t ask about the pantry. She asks if Sunday is still Sunday. It is.",
      },
    ],
  },
  {
    slug: "sobremesa",
    scene: "fim-prato",
    after: [
      { if: "gelo:muda", line: "You went back to the risotto without a voice. The receipt under the plate is the first sentence of the night. Nanda reads it because you wouldn’t say it." },
      { if: "sala:cozinha", line: "You hid in service. Clara understood an hour late and exactly. The note never passed through the dining room. That’s why her plate left clean." },
      { if: "sal:servir", line: "You served dessert and left quiet. The receipt spoke under Nanda’s plate. The burnt sugar stayed for the guests. They will call it technique." },
    ],
    morning: {
      title: "Come down",
      body: "Nanda’s message is still on the screen: come down. You came down last night in the apron. In the morning the apron is on the chair and she sends the address of a café with no fish. “If you come, come out of uniform. I read your face better than the receipt.”",
    },
    morningIf: [
      {
        if: "sala:cozinha",
        title: "The apron",
        body: "You hid in service and she read it anyway. In the morning Clara doesn’t say goodbye again. The double money has already landed. Nanda writes: “I saw you go back to the kitchen. I came down anyway. If you’re meeting me, leave the apron. I don’t want the staff version.”",
      },
    ],
  },
  {
    slug: "sobremesa",
    scene: "fim-cozinha",
    morning: {
      title: "The empty space",
      body: "In the morning the phone still has no Sunday. Clara sends the payment and nothing else. The sink still has the mark of the bucket. You wash it again, with no audience. The joke ended before dawn. What stayed was a mouth that chose the wrong side in front of the right woman.",
    },
  },
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
