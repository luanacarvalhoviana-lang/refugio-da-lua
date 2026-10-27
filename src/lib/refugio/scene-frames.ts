import type { Lang, Story } from "@/lib/refugio/stories";

const frames: Record<string, Record<string, { art: string; where: Record<Lang, string> }>> = {
  passageira: {
    banco: { art: "/scenes/passageira-banco.jpg", where: { pt: "Dentro do carro", es: "Dentro del coche", en: "Inside the car" } },
    tras: { art: "/scenes/passageira-tras.jpg", where: { pt: "O banco de trás", es: "El asiento de atrás", en: "The back seat" } },
    marginal: { art: "/scenes/passageira-marginal.jpg", where: { pt: "Na marginal", es: "En la avenida", en: "On the overpass" } },
    posto: { art: "/scenes/passageira-posto.jpg", where: { pt: "Posto fechado", es: "Estación cerrada", en: "Closed station" } },
    farol: { art: "/scenes/passageira-farol.jpg", where: { pt: "Debaixo do farol", es: "Bajo el farol", en: "Under the light" } },
    "fim-curva": { art: "/scenes/passageira-curva.jpg", where: { pt: "A curva", es: "La curva", en: "The curve" } },
    "fim-casaco": { art: "/scenes/passageira-casaco.jpg", where: { pt: "O que ficou no banco", es: "Lo que quedó en el asiento", en: "What stayed on the seat" } },
    "fim-porta": { art: "/scenes/passageira-porta.jpg", where: { pt: "A porta fechada", es: "La puerta cerrada", en: "The closed door" } },
  },
  correspondencia: {
    caixa: { art: "/scenes/correspondencia-caixa.jpg", where: { pt: "A caixa de correio", es: "El buzón", en: "The mailbox" } },
    leitura: { art: "/scenes/correspondencia-leitura.jpg", where: { pt: "A carta", es: "La carta", en: "The letter" } },
    escada: { art: "/scenes/correspondencia-escada.jpg", where: { pt: "O último lance", es: "El último tramo", en: "The last flight" } },
    portaria: { art: "/scenes/correspondencia-portaria.jpg", where: { pt: "A portaria", es: "La portería", en: "The lobby desk" } },
    mesa: { art: "/scenes/correspondencia-mesa.jpg", where: { pt: "No chão", es: "En el suelo", en: "On the floor" } },
    "fim-resposta": { art: "/scenes/correspondencia-resposta.jpg", where: { pt: "Debaixo da marquise", es: "Bajo la marquesina", en: "Under the awning" } },
    "fim-escada": { art: "/scenes/correspondencia-escada-fim.jpg", where: { pt: "O copo", es: "El vaso", en: "The glass" } },
    "fim-nome": { art: "/scenes/correspondencia-nome.jpg", where: { pt: "A carta que amarela", es: "La carta que amarillea", en: "The letter that yellows" } },
  },
  sobremesa: {
    forno: { art: "/scenes/sobremesa-forno.jpg", where: { pt: "A cozinha de serviço", es: "La cocina de servicio", en: "The service kitchen" } },
    gelo: { art: "/scenes/sobremesa-gelo.jpg", where: { pt: "A despensa", es: "La despensa", en: "The pantry" } },
    sala: { art: "/scenes/sobremesa-sala.jpg", where: { pt: "A sala", es: "El comedor", en: "The dining room" } },
    sal: { art: "/scenes/sobremesa-sal.jpg", where: { pt: "A porta da despensa", es: "La puerta de la despensa", en: "The pantry door" } },
    "fim-conta": { art: "/scenes/sobremesa-conta.jpg", where: { pt: "O beco", es: "El callejón", en: "The alley" } },
    "fim-prato": { art: "/scenes/sobremesa-prato.jpg", where: { pt: "Debaixo do prato", es: "Debajo del plato", en: "Under the plate" } },
    "fim-cozinha": { art: "/scenes/sobremesa-cozinha.jpg", where: { pt: "Depois da sobremesa", es: "Después del postre", en: "After dessert" } },
  },
  corredor: {
    porta714: { art: "/scenes/corredor-porta.jpg", where: { pt: "A porta", es: "La puerta", en: "The door" } },
    corredor: { art: "/scenes/corredor-corredor.jpg", where: { pt: "O corredor", es: "El pasillo", en: "The corridor" } },
    elevador: { art: "/scenes/corredor-elevador.jpg", where: { pt: "O elevador", es: "El ascensor", en: "The elevator" } },
    "fim-saguao": { art: "/scenes/corredor-saguao.jpg", where: { pt: "O saguão", es: "El vestíbulo", en: "The lobby" } },
    "fim-virar": { art: "/scenes/corredor-virar.jpg", where: { pt: "O quarto", es: "La habitación", en: "The room" } },
    "fim-batida": { art: "/scenes/corredor-batida.jpg", where: { pt: "Debaixo da porta", es: "Debajo de la puerta", en: "Under the door" } },
  },
  depoimento: {
    sala: { art: "/scenes/depoimento-sala.jpg", where: { pt: "A sala", es: "La sala", en: "The room" } },
    frase: { art: "/scenes/depoimento-frase.jpg", where: { pt: "O gravador", es: "La grabadora", en: "The recorder" } },
    del: { art: "/scenes/depoimento-del.jpg", where: { pt: "O corredor", es: "El pasillo", en: "The corridor" } },
    hospital: { art: "/scenes/depoimento-hospital.jpg", where: { pt: "O hospital", es: "El hospital", en: "The hospital" } },
    "fim-versao": { art: "/scenes/depoimento-versao.jpg", where: { pt: "O arquivo", es: "El archivo", en: "The file" } },
    "fim-nome": { art: "/scenes/depoimento-nome.jpg", where: { pt: "A cadeira", es: "La silla", en: "The chair" } },
    "fim-silencio": { art: "/scenes/depoimento-silencio.jpg", where: { pt: "A porta de casa", es: "La puerta de casa", en: "The door at home" } },
  },
};

export function applyFrames(book: Record<Lang, Story[]>) {
  for (const lang of ["pt", "es", "en"] as const) {
    for (const story of book[lang]) {
      const pack = frames[story.slug];
      if (!pack) continue;
      for (const scene of story.scenes) {
        const frame = pack[scene.id];
        if (!frame) continue;
        scene.art = frame.art;
        scene.where = frame.where[lang];
      }
      const opening = pack[story.start];
      if (opening) story.art = opening.art;
    }
  }
}
