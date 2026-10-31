import { cartasEs } from "@/lib/refugio/stories-cartas";
import { passageiraEs } from "@/lib/refugio/stories-passageira";
import { corredorEs } from "@/lib/refugio/stories-corredor";
import type { Story } from "@/lib/refugio/stories";

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

export const sharpEs: Story[] = [passageiraEs, cartasEs, corredorEs, depoimentoEs];
