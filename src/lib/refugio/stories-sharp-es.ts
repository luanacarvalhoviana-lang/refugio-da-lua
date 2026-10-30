import type { Story } from "@/lib/refugio/stories";

const passageiraEs: Story = {
  slug: "passageira",
  title: "Pasajera",
  author: "Luana Viana",
  rating: "16",
  genres: ["thriller", "crimen", "romance"],
  minutes: 14,
  synopsis: "Entra en tu coche después de medianoche con la llave que nunca pediste de vuelta. El abrigo del asiento de atrás todavía está tibio. Te pide que conduzcas y que no mires.",
  place: "Avenida",
  art: "/scenes/varanda.jpg",
  start: "banco",
  sound: "/sounds/rain.mp3",
  scenes: [
    {
      id: "banco",
      music: "suspense",
      body: "La lluvia cose la avenida. El farol de arriba parpadea y se rinde. Alguien golpea el vidrio del acompañante con la familiaridad de quien no pide permiso. Es Renata. Once meses sin una frase. Muestra la llave de repuesto, la que le diste un martes y olvidaste en medio de la ruptura. El asiento de atrás carga un abrigo oscuro, demasiado doblado para estar vacío de calor. “Conduce. No mires atrás. Si miras, perdemos el único minuto en que el coche de atrás todavía no sabe que entré en el tuyo.”",
      choices: [
        { id: "dirigir", label: "Conducir sin mirar", to: "marginal", affinity: 1, clue: "Renata todavía tiene la llave de repuesto de tu coche.", thought: "Si miro, me vuelvo testigo. Si conduzco, me vuelvo cómplice. Los dos duelen menos que dejarla en la lluvia." },
        { id: "olhar", label: "Mirar el asiento de atrás antes", to: "tras", affinity: 1, clue: "El abrigo todavía está tibio.", thought: "Necesito saber el tamaño de la noche antes de prestarle mi coche." },
        { id: "descer", label: "Decirle que baje", to: "fim-porta", affinity: -1, thought: "Once meses le enseñaron a mi mano a cerrar. La mano obedece. El resto de mí no aplaude." },
      ],
    },
    {
      id: "tras",
      speaker: "Renata",
      music: "suspense",
      body: "El abrigo huele a lluvia y a un perfume que solo encontraste una vez, en una fiesta en la que Renata pasó la noche mirando a otra mujer. En el bolsillo, una tarjeta de hotel con el número 4 escrito a lápiz, y un lápiz labial oscuro que no es el de ella. Renata no intenta esconderlo. “Marina bajó viva. Lo juro por lo más idiota que tengo, que eres tú. El coche que viene detrás no es el mío. Es el de Celina. Marina se fue de ella hoy. Yo solo abrí una puerta. Después la puerta se volvió peligrosa, y la única llave que Celina no conoce es la de tu coche.”",
      choices: [
        { id: "guardar", label: "Guardar la tarjeta de la habitación 4", to: "marginal", affinity: 2, clue: "La tarjeta del hotel es de la habitación 4, escrita a lápiz.", thought: "Guardar esto es decidir que la noche va a tener prueba. Lo guardo igual." },
        { id: "ferida", label: "Preguntar si Marina está herida", to: "marginal", affinity: 1, thought: "La pregunta justa llega tarde. La hago igual, porque llegar tarde todavía es llegar." },
        { id: "devolver", label: "Devolver el abrigo y parar", to: "fim-casaco", affinity: 0, thought: "Si devuelvo el abrigo, devuelvo la noche entera. Una parte de mí quiere las manos limpias." },
      ],
    },
    {
      id: "marginal",
      speaker: "Renata",
      music: "suspense",
      body: "La ciudad abre un corredor mojado. Renata mira el retrovisor como se mira a una persona. Un coche mantiene la misma distancia, sin prisa, que es la forma más vieja de amenazar. “Celina cree que Marina se fue conmigo. No. Marina se fue de ella. Yo aparecí porque Marina me llamó desde una estación cerrada y la voz le salía chica. Cuando llegué, ya había bajado de mi coche y me había pedido que no la siguiera. Vi el otro farol. Entré en el tuyo porque el tuyo ella no lo marca.” La mano de Renata queda en la rodilla, sin pedir regazo. Solo para no temblar sola.",
      choices: [
        { id: "quem", label: "Preguntar quién es Celina para Marina", to: "posto", affinity: 1, clue: "Celina es la mujer de Marina.", thought: "El nombre le cambia el lugar al miedo. Quiero el nombre." },
        { id: "silencio", label: "No hablar. Solo conducir", to: "posto", affinity: 2, thought: "Cuenta más cuando yo no le arranco la frase. Lo sé desde antes." },
        { id: "encostar", label: "Orillar el coche ahora", to: "fim-casaco", affinity: -1, thought: "Parar es un tipo de coraje que parece abandono. Paro." },
      ],
    },
    {
      id: "posto",
      music: "revelacao",
      body: "La estación está cerrada, la luz del negocio cortada a la mitad. El teléfono de Renata se enciende en el posavasos: Marina. Suena como si el ruido pudiera delatarlas a la calle entera. En el retrovisor, el otro coche pasó de largo y desapareció en la curva, y eso no es alivio. Es alguien eligiendo otro ángulo. Renata no toma el teléfono. Te mira como quien ya entregó el volante y ahora entrega el resto. “Si atiendes tú, ella va a pedir una cosa. Si atiendo yo, voy a prometer. Las dos opciones nos dejan adentro.”",
      choices: [
        { id: "atender", label: "Atender a Marina", to: "farol", affinity: 2, clue: "Marina pidió que no dejaran que Celina las encontrara.", thought: "Su voz me vuelve responsable. Ya estoy conduciendo. Responsable es solo el nombre nuevo." },
        { id: "tocar", label: "Dejar que suene hasta que pare", to: "farol", affinity: 0, thought: "El silencio también elige. Finjo que es neutro." },
        { id: "viva", label: "Poner el altavoz", to: "farol", affinity: 1, clue: "Marina está a dos cuadras, a pie, sin abrigo.", thought: "Quiero la frase sin ser la dueña. Cobardía educada." },
      ],
    },
    {
      id: "farol",
      speaker: "Marina",
      music: "suspense",
      body: "Marina está bajo el semáforo, sin abrigo, el pelo pegado a la boca. No corre. Quien corre parece culpa. El coche de Celina baja la calle de abajo, despacio, buscando una cara. Marina ve tu coche y no lo reconoce. Reconoce a Renata en el asiento. La boca le forma una frase sin sonido: no pares, o para; no lo distingues. Renata abre la mano en la consola, entre el freno y tú. “Si paramos, ella entra y Celina pasa sin verle la cara. Si seguimos, yo bajo en la próxima esquina y me llevo el abrigo. Tú te quedas solo con la noche. No te voy a odiar. Te voy a recordar.”",
      choices: [
        { id: "parar", label: "Parar y abrirle la puerta a Marina", to: "fim-curva", affinity: 2, thought: "Abrir la puerta es lo más alto que hago en meses. La manija está fría." },
        { id: "reto", label: "Seguir de largo", to: "fim-casaco", affinity: -1, thought: "El semáforo queda atrás como una persona que yo podía haber sido." },
        { id: "buzina", label: "Tocar la bocina para que sepa cuál es el coche", to: "fim-curva", affinity: 1, clue: "La bocina también avisa a Celina.", thought: "El sonido me entrega. También le entrega a Marina una salida. Acepto las dos." },
      ],
    },
    {
      id: "fim-curva",
      music: "romance",
      ending: {
        key: "curva",
        title: "La curva",
        flower: "Jazmín",
        body: "Paras. Marina entra sin teatro, mojada, viva, y se tiende en el asiento bajo el abrigo como quien apaga el propio contorno. Celina pasa a medio metro. No ve la cara. Ve un coche cualquiera en la lluvia, y los coches cualesquiera son la única bondad de la ciudad. En el semáforo siguiente, demasiado largo, Renata apoya la frente en tu hombro. No besa. Dice mañana con la voz de quien pretende pagar lo que debe. Marina, atrás, dice tu nombre. No debería saberlo. Renata se lo contó. Nadie explica el año en silencio. La luz cambia. Llevas a las tres hasta la luz fea de un hospital y no bajas. Quedarte al volante, esta noche, también es quedarte.",
        letter: { from: "Renata", text: "Marina está en la habitación, durmiendo de verdad. Celina no entró. No voy a convertirte en coartada ni en heroína. Mañana, si quieres la llave de vuelta, la llevo. Si quieres que me la quede un día más, dilo. Sé la diferencia." },
      },
    },
    {
      id: "fim-casaco",
      music: "despedida",
      ending: {
        key: "casaco",
        title: "Lo que quedó en el bolsillo",
        flower: "Clavel blanco",
        body: "Marina se queda bajo el semáforo. Renata abre la puerta en el movimiento siguiente y corre con el abrigo abierto, dos personas intentando caber en una tela. Tú sigues porque parar ahora sería elegir un lado con público. Dos calles después, el asiento huele a ellas y no a ti. En el bolsillo que quedó, una tira de papel mojado: “Si es ella la que conduce, dile que vi el coche.” No sabes cuál ella. Por la mañana el papel se seca torcido y sigue siendo verdadero. La llave de repuesto no vuelve. Algunas noches no se cierran. Solo cambian de dueña.",
        letter: { from: "Marina", text: "Vi pasar tu coche. No te culpo. Renata llegó hasta mí a pie, que es más de lo que les pedí a cualquiera de las dos. Si la frase del bolsillo era para ti, ahora lo sabes: vi. No hace falta responder. Solo no le entregues el papel a Celina." },
      },
    },
    {
      id: "fim-porta",
      music: "despedida",
      ending: {
        key: "porta",
        title: "La puerta que cerraste",
        flower: "Hoja mojada",
        body: "Renata baja antes de que el semáforo abra. No azota la puerta. Eso es peor: todavía está cuidando una cosa tuya. En el retrovisor, dos mujeres comparten un abrigo bajo la lluvia y ninguna mira tu coche. Eras la única puerta que Celina no conocía. La cerraste. La avenida sigue lisa, inocente, llena de gente que no le debe nada a esta noche. La llave de repuesto sigue fuera de tu llavero. Vas a recordarla cada vez que cierres algo.",
        letter: { from: "Renata", text: "No voy a pedir otra vez. Marina llegó a casa. No a la mía. Te devolvería la llave si supiera cómo verte sin parecer un pedido. Quédate con el silencio. Ya elegiste el tamaño." },
      },
    },
  ],
};

const correspondenciaEs: Story = {
  slug: "correspondencia",
  title: "Correspondencia",
  author: "Luana Viana",
  rating: "16",
  genres: ["drama", "drama psicológico", "amor no correspondido"],
  minutes: 13,
  synopsis: "Llegan cartas para un nombre que enterraste. Quien escribe es la mujer que nunca oyó la respuesta. El portero dice que estuvo aquí ayer y que vuelve hoy.",
  place: "Departamento nuevo",
  art: "/scenes/biblioteca.jpg",
  start: "caixa",
  sound: "/sounds/rain.mp3",
  scenes: [
    {
      id: "caixa",
      music: "calma",
      body: "Tres semanas en esta dirección y el buzón todavía huele a pintura. Entre la cuenta de la luz y un folleto, un sobre sin sello, con la letra que reconocerías a oscuras: A. Varela. Ese nombre duró un año, en una ciudad que dejaste, y solo una persona lo usó sin ironía. Helena. El portero dejó un recado en el portero eléctrico, voz de quien no quiere drama en su turno. “La señorita de ayer preguntó por ese nombre. Le dije que no vive aquí. Dijo que vuelve hoy. No subió.” La carta pesa como si ya la hubiera leído alguien más valiente.",
      choices: [
        { id: "abrir", label: "Abrir la carta", to: "leitura", affinity: 1, clue: "La carta te llama A. Varela.", thought: "Abrir es dejarla entrar sin la llave. Abro." },
        { id: "nao", label: "Subir con la carta cerrada", to: "escada", affinity: 0, thought: "Si no leo, todavía puedo fingir que el nombre murió de causas naturales." },
        { id: "descer", label: "Bajar ahora, antes de que vuelva", to: "portaria", affinity: 2, thought: "Quiero ver la cara antes que la frase. Siempre quise, y siempre hice lo contrario." },
      ],
    },
    {
      id: "leitura",
      music: "luar",
      body: "Helena escribe como quien habla bajo para no despertar la casa. Describe la cocina de aquella noche: la cuenta sin pagar, la tetera, la pregunta quédate. Tú dijiste que tenías tren. No tenías. Tenías miedo, y una vida ya demasiado ordenada para caber una verdad. “No necesitaba que te quedaras. Necesitaba que dijeras que también querías. Pasé un año creyendo que inventé lo que sentí en tu boca cuando no me besaste.” No es una carta de acusación. Es peor. Es una carta justa. Al final: “Si A. Varela ya no vive ahí, rómpela. Si vive, no hace falta responder bonito. Hace falta responder.”",
      choices: [
        { id: "escrever", label: "Responder, sin adorno", to: "mesa", affinity: 2, clue: "Tú también querías quedarte en aquella cocina.", thought: "La frase verdadera cabe en tres líneas. Tardé un año en merecer el papel." },
        { id: "jogar", label: "Romper la carta", to: "fim-nome", affinity: -1, thought: "Romper es repetir la partida. Soy buena en eso. No es un elogio." },
        { id: "guardar", label: "Guardarla sin responder", to: "escada", affinity: 0, thought: "Guardar es un término medio que solo me protege a mí." },
      ],
    },
    {
      id: "escada",
      speaker: "Helena",
      music: "calma",
      body: "Helena está en el rellano de abajo. No sube el último tramo. El abrigo es el mismo, la boca no. Sostiene la correa del bolso como quien sostiene una disculpa. “Si no eres tú, le pido perdón al edificio y me voy. Si eres, no voy a subir sin que digas un nombre. Cualquiera de los dos. Solo no quiero hablar sola en el pasillo, otra vez.” La luz del piso parpadea. Ningún vecino abre. La ciudad entera, por un minuto, es un escalón.",
      choices: [
        { id: "sou", label: "Decir: soy yo", to: "fim-escada", affinity: 2, thought: "El nombre de ahora sale primero. El antiguo se queda en la garganta, vivo." },
        { id: "morto", label: "Decir que ese nombre no vive aquí", to: "fim-nome", affinity: -1, thought: "La mentira cabe en la boca con una facilidad que me avergüenza." },
        { id: "carta", label: "Mostrar la carta sin hablar", to: "fim-resposta", affinity: 1, thought: "El papel dice lo que mi voz todavía negocia." },
      ],
    },
    {
      id: "portaria",
      music: "revelacao",
      body: "El portero empuja un segundo sobre, este con tu nombre de ahora, escrito despacio, como quien tuvo que confirmar cada letra. “Esperó cuarenta minutos. Dejó esto y un número. Dijo que no es para llamar si duele. Es para llamar si ya no duele más que la otra vez.” No pide explicación. Una portería buena es la que ya vio cosas peores. Afuera, la lluvia borra la vereda. No borra el hecho: Helena sabe los dos nombres. El antiguo no era una fantasía que solo tú cargabas.",
      choices: [
        { id: "ler", label: "Leer la segunda carta", to: "mesa", affinity: 2, clue: "Ya sabe tu nombre de ahora.", thought: "Me encontró sin el nombre antiguo. Entonces no era el nombre lo que quería. Era yo." },
        { id: "devolver", label: "Devolverla sin leer", to: "fim-nome", affinity: -1, thought: "Devolver es elegante. También es cobarde. Me quedan las dos igual." },
        { id: "endereco", label: "Pedir el número que dejó", to: "mesa", affinity: 1, thought: "Tener el número no es usarlo. Pero quiero la posibilidad en la mano." },
      ],
    },
    {
      id: "mesa",
      music: "romance",
      body: "Te sientas en el suelo porque la mesa nueva todavía no merece esta frase. Tres líneas caben en el reverso de la cuenta de la luz. No es para siempre. Es: yo también quería quedarme. Mentí lo del tren. El nombre A. Varela fui yo, y me lo llevé porque no supe quedarme junto con él. El portero eléctrico suena una vez, sin insistir. Helena, abajo, dándote la última elección con demasiada educación. El portero no anuncia. Ya entendió que anunciar estropea.",
      choices: [
        { id: "descer", label: "Bajar con la respuesta en la mano", to: "fim-resposta", affinity: 2, thought: "El papel tiembla menos que yo. Menos mal que la verdad está en él." },
        { id: "subir", label: "Pedirle que suba", to: "fim-escada", affinity: 2, thought: "Si cruza la puerta, el departamento deja de ser escondite. Quiero eso y le tengo miedo del mismo tamaño." },
        { id: "nao", label: "No atender el portero", to: "fim-nome", affinity: -1, thought: "El timbre para. El año empieza de nuevo, idéntico." },
      ],
    },
    {
      id: "fim-resposta",
      music: "romance",
      ending: {
        key: "resposta",
        title: "La respuesta",
        flower: "Camelia",
        body: "Le entregas el papel. Helena lo lee de pie, en la portería, sin teatro. Cuando llega a la frase del tren, la boca le hace una cosa pequeña, casi una sonrisa que no se autoriza. No te besa. Dobla la hoja y la guarda en el bolsillo interno, donde se guarda lo que se va a releer en el autobús. “Entonces no fui solo yo.” La lluvia acierta la vereda y las falla a las dos, por un segundo, bajo la marquesina. Ella no pide subir. Tú no pides que se quede. Por primera vez la falta de pedido no es huida. Es medida. Te toca la muñeca, dos dedos, y suelta. “Puedes escribir a este nombre. Yo respondo.”",
        letter: { from: "Helena", text: "La leí de nuevo en el autobús. La frase del tren dolió menos en el papel que un año en mi cabeza. No voy a aparecer mañana. Voy a escribir. Si respondes una línea, no convierto esto en una vida entera sin tu permiso. Solo necesitaba saber que la cocina fue real." },
      },
    },
    {
      id: "fim-escada",
      music: "luar",
      ending: {
        key: "escada",
        title: "El último escalón",
        flower: "Violeta",
        body: "Una de las dos cruza el escalón. No importa cuál. Helena pide primero el nombre de ahora, para que no te sientas cazada por el antiguo. Lo dices. Ella lo repite bajito, probándolo, y después dice A. Varela como quien devuelve un abrigo sin exigir que te lo pongas. Nada está resuelto. La ciudad de ella sigue siendo la ciudad que dejaste. El departamento nuevo sigue sin una mesa digna. Pregunta si puede escribir a esta dirección. Dices que sí. Es más de lo que dijiste en la cocina, y menos de lo que prometería una película. Se queda veinte minutos. Bebe agua. No duerme aquí. Cuando baja, el pasillo vuelve a su tamaño. Subes sabiendo el peso exacto de un sí pequeño.",
        letter: { from: "Helena", text: "Llegué a casa. No voy a romantizar la escalera. Me diste un nombre nuevo y veinte minutos de agua. Guardé los dos. Escribo el jueves, si el jueves no es demasiado pronto. Si lo es, rómpela y entiendo el tiempo." },
      },
    },
    {
      id: "fim-nome",
      music: "despedida",
      ending: {
        key: "nome",
        title: "El nombre muerto",
        flower: "Papel quemado",
        body: "A. Varela muere una segunda vez, y esta vez miras. Helena acepta el edificio vacío con la educación de quien ya ensayó la derrota. No discute. Discutir sería una intimidad que no ofreciste. Las cartas paran después de una más, que llega el viernes y se queda cerrada hasta que el papel amarillea. Hay amores justos e inacabados. El tuyo fue las dos cosas. El departamento nuevo cumple su función: nadie aquí sabe el nombre que no supiste sostener. De noche, el buzón hace un ruido de metal. Casi siempre es el viento.",
        letter: { from: "Helena", text: "Esta es la última. No voy a convertir tu negativa en misterio, porque no es misterio. Es respuesta. Inventé menos de lo que pensé y más de lo que pudiste cargar. Cuídate. Yo también me voy a cuidar, solo que sin escribirle a un nombre que enterraste dos veces." },
      },
    },
  ],
};


const corredorEs: Story = {
  slug: "corredor",
  title: "El pasillo",
  author: "Luana Viana",
  rating: "16",
  genres: ["terror", "drama psicológico"],
  minutes: 11,
  synopsis: "El pasillo del hotel es más largo a la vuelta. La mujer de la 714 te pide que la lleves hasta el ascensor. Si oyes su voz detrás, no te des vuelta. La de atrás pide entrar. Ella, no.",
  place: "Hotel",
  art: "/scenes/templo.jpg",
  start: "porta714",
  sound: "/sounds/wind.mp3",
  scenes: [
    {
      id: "porta714",
      speaker: "Iara",
      music: "templo",
      body: "El hotel finge silencio con un zumbido de aire. Son las tres de la mañana menos veinte, la hora en que el pasillo pertenece a quien no duerme. Iara está en la puerta de la 714, descalza, el pelo prendido de cualquier modo, los ojos de quien ya explicó esto y no le creyeron. La viste en el desayuno tres veces. No come. Mira tu mesa como quien comprueba una salida. “Llévame hasta el ascensor. Si oyes mi voz detrás, no te des vuelta. La de atrás pide entrar. Yo no pido. Yo solo quiero bajar hasta donde la luz es fea y ella no cruza.” El número de la puerta, detrás de ella, parece haber retrocedido medio palmo.",
      choices: [
        { id: "braco", label: "Ofrecerle el brazo", to: "corredor", affinity: 2, clue: "Iara no pide entrar. La otra pide.", thought: "El brazo es una cosa concreta. Ofrezco concreto." },
        { id: "perguntar", label: "Preguntar qué queda atrás", to: "corredor", affinity: 1, thought: "Quiero la regla entera antes de caminar dentro de ella." },
        { id: "fechar", label: "Cerrar tu puerta", to: "fim-batida", affinity: -1, thought: "Echar la llave es un instinto viejo. Esta noche puede estar en lo cierto o llegar tarde." },
      ],
    },
    {
      id: "corredor",
      music: "suspense",
      body: "Tu habitación estaba a cuatro puertas a la izquierda. Cuentas ocho. La alfombra se traga el paso y lo devuelve, atrás, un paso que no es el tuyo. La mano de Iara está fría y muy humana, lo que asusta más que si no lo fuera. Entonces la voz. La voz de ella, más dulce, en el punto exacto de tu nuca. Dice tu nombre entero, incluso el que no usas en el hotel. Iara, al lado, te aprieta el brazo hasta que duele de un modo útil. La boca le forma: no. La otra insiste, blanda: déjame entrar, estás cansada, conozco la cama. Ninguna puerta del pasillo tiene número ahora. Solo la distancia hasta el ascensor, que aumentó.",
      choices: [
        { id: "nao", label: "No darte vuelta", to: "elevador", affinity: 2, thought: "La nuca quiere obedecer a la dulzura. El brazo de Iara es la frase más clara del pasillo." },
        { id: "responder", label: "Responder sin darte vuelta", to: "elevador", affinity: 1, clue: "La voz de atrás sabe tu nombre entero.", thought: "Si hablo, confirmo que oí. Hablo igual, bajo: no." },
        { id: "virar", label: "Darte vuelta", to: "fim-virar", affinity: -1, thought: "Necesito ver. Esa necesidad es exactamente lo que ella usa." },
      ],
    },
    {
      id: "elevador",
      speaker: "Iara",
      music: "templo",
      body: "La puerta del ascensor se abre con un suspiro de metal viejo. En el espejo, por un segundo, dos Iaras. Después una. La que está en tu brazo entra de espaldas, sin darle la columna al pasillo. “Baja conmigo hasta el vestíbulo. Allí ella no entra. No me preguntes cuál de nosotras está aquí dentro. La pregunta es una forma de darse vuelta.” El espejo insiste en mostrar el pasillo más largo que el edificio. Una de las lámparas parpadea al ritmo de quien respira. Iara mira el botón de la planta baja como si pudiera convencerse.",
      choices: [
        { id: "descer", label: "Bajar con ella", to: "fim-saguao", affinity: 2, thought: "La planta baja es fea. Feo, esta noche, es santuario." },
        { id: "segurar", label: "Sostener la puerta hasta que entre entera", to: "fim-saguao", affinity: 1, thought: "No dejo que el ascensor decida solo quién se queda afuera." },
        { id: "qual", label: "Preguntar cuál de las dos está en el ascensor", to: "fim-virar", affinity: -1, thought: "La pregunta sale y ya sé que me di vuelta sin el cuello." },
      ],
    },
    {
      id: "fim-saguao",
      music: "luar",
      ending: {
        key: "saguao",
        title: "El vestíbulo",
        flower: "Lirio",
        body: "El vestíbulo es amarillo, ruidoso de heladera y seguro de un modo sin poesía. Iara bebe el café malo como quien vuelve a tener hambre. Agradece sin tocarte. “Mañana, en el desayuno, voy de azul. Si no como, no soy yo. Si como y no miro tu mesa, tampoco. Puedes sentarte enfrente. Yo voy a saber.” El horror no termina. Gana una regla, y la regla es una forma de cuidar. Subes sola cuando el sol ya miente en la vereda. El pasillo, de mañana, tiene el tamaño del pasillo. La 714 está cerrada. En el desayuno, ella está de azul. Come. Mira. Te sientas enfrente.",
        letter: { from: "Iara", text: "Comí. Era yo. No subas al pasillo sola después de la una, por un tiempo. Si golpeo, son tres golpes y digo el color de la ropa antes de que abras. Si la voz no dice el color, no es visita. Gracias por no darte vuelta. Casi nadie puede." },
      },
    },
    {
      id: "fim-virar",
      music: "suspense",
      ending: {
        key: "virar",
        title: "La que pide",
        flower: "Vidrio",
        body: "Te das vuelta, o haces la pregunta que es una manera de darse vuelta. La mujer de atrás tiene la boca de Iara y ninguna de sus cautelas. Sonríe como quien ya fue invitada. “Solo quiero entrar. Estás cansada.” La Iara de tu brazo ya no está en tu brazo. El ascensor se cierra con una sola persona, y no eres tú quien elige cuál. Por la mañana la silla de Iara en el desayuno está vacía. Tu tarjeta abre la 714. La cama está tibia. No recuerdas haberte acostado. En el espejo del baño, por un instante, alguien detrás de ti parpadea con tu cara y la paciencia equivocada.",
        letter: { from: "Iara", text: "Si esta carta está en tu letra, no la escribí yo. Yo dejo notas con el color de la ropa y tres golpes. Cualquier otra frase dulce, en el pasillo, no la abras. Si ya abriste, deja la puerta entornada y baja. El vestíbulo todavía funciona. Espero de azul, si todavía soy yo." },
      },
    },
    {
      id: "fim-batida",
      music: "despedida",
      ending: {
        key: "batida",
        title: "Tres golpes",
        flower: "Llave fría",
        body: "Cierras. La cerradura es alta y pequeña. A las tres y doce, tres golpes, pacientes, en el ritmo en que Iara habría apretado el botón del ascensor. No abres. Por la mañana el recepcionista dice que la 714 hizo el check-out a medianoche, lo cual es imposible y está en el sistema. Debajo de tu puerta, un papel en tu letra: “Me di vuelta.” No te diste vuelta. Todavía. La llave de la habitación, en tu mano, está fría de los dos lados. En el desayuno, nadie de azul. La silla frente a tu mesa fue retirada, como si el hotel prefiriera no contar lugares.",
        letter: { from: "Iara", text: "Golpeé tres veces. No abriste, y eso puede haber sido lo correcto. El papel debajo de la puerta no es mío si está en tu letra. No subas a buscarme. Si todavía estoy en algún lugar de este edificio, es en el vestíbulo, de azul, comiendo. Si no estoy comiendo, pasa de largo." },
      },
    },
  ],
};

const depoimentoEs: Story = {
  slug: "depoimento",
  title: "Declaración",
  author: "Luana Viana",
  rating: "16",
  genres: ["crimen", "thriller", "traición"],
  minutes: 14,
  synopsis: "Viste lo que pasó en la azotea. Quien toma tu declaración es tu ex. Ya sabe qué versión vas a contar. Quiere la otra.",
  place: "Comisaría",
  art: "/scenes/biblioteca.jpg",
  start: "sala",
  sound: "/sounds/rain.mp3",
  scenes: [
    {
      id: "sala",
      speaker: "Elisa",
      music: "suspense",
      body: "La sala huele a café recalentado y a papel que ya oyó demasiada mentira. Del otro lado de la mesa, Elisa. Tu ex. Placa, pelo prendido, la misma boca que un día te pidió que te quedaras y oyó que no sabías. Entre ustedes, la foto de la azotea: el murete, la ciudad, un vaso roto. “Soraia está viva. Duda dice que saltó. Necesito tu frase, no la de ella.” Elisa no levanta la voz. Nunca lo necesitó. “Estabas ahí porque mi hermana te lo pidió. No pongas esa cara. Sé que tú y Duda no eran solo conversación. Soy su hermana y también la persona que todavía reconoce cuándo eliges la frase fácil.”",
      choices: [
        { id: "tarde", label: "Decir que la mano de Duda llegó tarde", to: "frase", affinity: 1, clue: "Viste la mano de Duda llegar después.", thought: "Demasiado tarde todavía no es el nombre de lo que vi. Es el nombre que cabe en esta sala." },
        { id: "pulo", label: "Decir que Soraia no saltó", to: "frase", affinity: 2, clue: "No fue un salto.", thought: "La frase verdadera me deja la boca seca. La digo igual." },
        { id: "advogada", label: "No hablar sin alguien de tu lado", to: "fim-silencio", affinity: 0, thought: "Callar no es neutro. Elijo el silencio sabiendo el precio." },
      ],
    },
    {
      id: "frase",
      speaker: "Elisa",
      music: "revelacao",
      body: "Elisa espera. La grabadora es una luz pequeña, indecente. “No uses contra mí el hecho de que soy su hermana. Úsalo bien. Duda va a decir que la sostuvo. Soraia, cuando despertó, te pidió a ti, no a la policía. Eso me interesa y me duele, y no voy a mezclar las dos cosas delante de ti.” Empuja un vaso de agua que no bebes. “Si proteges a Duda, cierro el archivo con tu frase y duermo mal. Si dices lo que vio el murete, mi hermana atraviesa esta noche esposada a una verdad. Firmo igual. Solo no quiero que mientas para ahorrarme.”",
      choices: [
        { id: "proteger", label: "Proteger a Duda", to: "del", affinity: -1, thought: "La lealtad es un bicho que muerde a la persona equivocada. Siento el diente." },
        { id: "nome", label: "Decir el nombre de Soraia en la grabadora", to: "fim-nome", affinity: 2, thought: "Su nombre en la grabadora no deshace el murete. Impide que el murete mienta solo." },
        { id: "ver", label: "Pedir ver a Soraia antes de firmar", to: "hospital", affinity: 1, thought: "No voy a firmar a una mujer que todavía no oí." },
      ],
    },
    {
      id: "del",
      speaker: "Duda",
      music: "suspense",
      body: "El pasillo de la comisaría entrega a Duda por un segundo: la chaqueta tuya, que nunca devolvió, el ojo hinchado de llanto y no de golpe. Mueve la boca. Por favor. No es un sonido. Elisa mira tu boca, no la de su hermana. Hay una lapicera y dos frases ya impresas, una en la que Soraia sube al murete sola, otra en blanco. Duda desaparece en la curva del pasillo. Queda el olor a lluvia en la chaqueta que un día durmió en tu silla. Elisa dice, bajo: “Es mi hermana. Tú eres la única que no está obligada a elegirla. Por eso tu frase vale más que la mía.”",
      choices: [
        { id: "repetir", label: "Firmar la versión de Duda", to: "fim-versao", affinity: -1, thought: "La lapicera pesa como si Soraia estuviera del otro lado de la tinta." },
        { id: "rasgar", label: "Romper y empezar de nuevo por Soraia", to: "fim-nome", affinity: 2, thought: "El papel se rompe fácil. El resto, no. Lo rompo igual." },
        { id: "sair", label: "Salir sin firmar", to: "fim-silencio", affinity: 0, thought: "Sin firma, la noche sigue abierta. Abierta también corta." },
      ],
    },
    {
      id: "hospital",
      speaker: "Soraia",
      music: "luar",
      body: "Soraia está despierta. El labio abierto, la voz ronca, la mano con el suero no tiembla. “Yo no solté. Nos íbamos juntas. Duda me pidió que no contara, porque Elisa no sabe de nosotras, y Duda tuvo más miedo de la hermana que del murete. La mano de ella llegó a mí y se abrió. No fue un salto. Fue un miedo.” Te mira sin romance y sin odio, que es más difícil de sostener. “Si repites la versión de ella, sobrevivo y quedo mentirosa en el papel. Si dices mi nombre bien, Duda se quiebra y tal vez merezca quebrarse. No voy a pedirte heroína. Voy a pedirte que no me dejes sola en la frase.”",
      choices: [
        { id: "gravar", label: "Volver y grabar lo que ella dijo", to: "fim-nome", affinity: 2, clue: "Se iban juntas. Elisa no lo sabía.", thought: "Me llevo su frase entera. Sin adorno, sin hermana en el medio." },
        { id: "segredo", label: "Prometer secreto", to: "fim-versao", affinity: -1, thought: "Secreto, esta noche, es solo la versión de Duda con otro nombre." },
        { id: "ficar", label: "Quedarte con Soraia y no volver a la sala", to: "fim-silencio", affinity: 1, thought: "La silla del hospital es la única declaración que puedo sostener ahora." },
      ],
    },
    {
      id: "fim-versao",
      music: "despedida",
      ending: {
        key: "versao",
        title: "La versión",
        flower: "Hierro",
        body: "Firmas la frase que salva a Duda. Elisa cierra el archivo como quien cierra una deuda de familia y no agradece con la boca. En el pasillo dice apenas: “Siempre supiste ser leal a la persona que está delante. El problema es quién queda atrás.” Soraia no te responde los días siguientes. Duda manda un audio que no reproduces. La chaqueta sigue en la comisaría, o en la silla de alguien, o en el pasado. Fuiste leal al silencio equivocado. La grabadora guarda tu voz con una calma ofensiva. De noche, la ciudad vista desde abajo no tiene murete. Sabes que eso es mentira.",
        letter: { from: "Soraia", text: "Leí el papel. Tu letra no está en él, pero tu omisión sí. Me voy a poner bien. No necesito que aparezcas para completar la versión. Si un día quieres decir la frase que no dijiste, díselo a la grabadora, no a mí. Ya oí suficiente de aquella azotea." },
      },
    },
    {
      id: "fim-nome",
      music: "revelacao",
      ending: {
        key: "nome",
        title: "El nombre de ella",
        flower: "Hilo rojo",
        body: "Lo dices en la grabadora, con la voz que Elisa conoce de otra vida: Soraia no saltó. La mano de Duda se abrió. Se iban, y el miedo llegó antes que el amor. La cara de Elisa hace lo que hacía cuando te fuiste de ella, una ruptura limpia, sin súplica. Escribe igual. Duda pasa a tu lado sin la chaqueta, sin el por favor. Soraia, ronca, pregunta por qué la verdad necesitó una placa para salir. No tienes una respuesta bonita. Te quedas en la silla. A veces quedarse es la única disculpa que no miente.",
        letter: { from: "Elisa", text: "Lo registré. No vengas a explicarme a mi hermana ni a Soraia. Hiciste la parte que pedí y la parte que temía. Las dos pueden ser la misma. No me busques para que te consuele. Si Soraia te quiere en el hospital, eso es de ella. El archivo ya no es una conversación nuestra." },
      },
    },
    {
      id: "fim-silencio",
      music: "despedida",
      ending: {
        key: "silencio",
        title: "Sin firmar",
        flower: "Puerta entreabierta",
        body: "No le das a Elisa una frase. Ella apaga la grabadora sin rogar. “Entonces la noche sigue siendo tuya. Cuidado: una noche sin frase es la que otras personas escriben.” Sales a la lluvia con las manos vacías y el oído lleno. En casa, dos golpes, con horas de distancia. Conoces los dos ritmos. La mano se queda en la cerradura un tiempo que no cabe en una declaración. El silencio también eligió un lado. Abres para Soraia. El golpe de Duda se queda sin respuesta, y la falta de respuesta es una frase, por fin, dicha en la madera.",
        letter: { from: "Soraia", text: "Gracias por abrir. No vine a buscar la versión. Vine a buscar una silla que no sea la del hospital ni la de la hermana de ella. No hace falta hablar de la azotea hoy. Si hablas, habla bien. Ya sobreviví a la frase fácil. No necesito otra." },
      },
    },
  ],
};

export const sharpEs: Story[] = [passageiraEs, correspondenciaEs, corredorEs, depoimentoEs];
