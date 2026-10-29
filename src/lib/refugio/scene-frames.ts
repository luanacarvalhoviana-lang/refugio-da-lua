import type { Lang, Story } from "@/lib/refugio/stories";
import { HOUSE, MOTION, namesIn } from "@/lib/refugio/house-cast";

const frames: Record<string, Record<string, {
  art: string;
  where: Record<Lang, string>;
  artIf?: Array<{ if: string; art: string; where: Record<Lang, string> }>;
}>> = {
  passageira: {
    banco: { art: "/scenes/passageira-banco.jpg?v=pintura", where: { pt: "Dentro do carro — Renata", es: "Dentro del coche — Renata", en: "Inside the car — Renata" } },
    tras: { art: "/scenes/passageira-tras.jpg?v=vida4", where: { pt: "O banco de trás", es: "El asiento de atrás", en: "The back seat" } },
    marginal: { art: "/scenes/passageira-marginal.jpg?v=vida4", where: { pt: "Na marginal — Renata", es: "En la avenida — Renata", en: "On the overpass — Renata" } },
    posto: { art: "/scenes/passageira-posto.jpg?v=vida4", where: { pt: "Posto fechado — Renata", es: "Estación cerrada — Renata", en: "Closed station — Renata" } },
    farol: {
      art: "/scenes/passageira-farol.jpg?v=vida4",
      where: { pt: "Debaixo do farol — Marina", es: "Bajo el farol — Marina", en: "Under the light — Marina" },
      artIf: [
        { if: "posto:atender", art: "/scenes/passageira-farol-atender.jpg?v=vida4", where: { pt: "Debaixo do farol — Marina", es: "Bajo el farol — Marina", en: "Under the light — Marina" } },
        { if: "posto:viva", art: "/scenes/passageira-farol-viva.jpg?v=vida5", where: { pt: "O viva-voz — Renata e Marina", es: "El altavoz — Renata y Marina", en: "On speaker — Renata and Marina" } },
      ],
    },
    "fim-curva": { art: "/scenes/passageira-curva.jpg?v=pintura", where: { pt: "A curva — Renata e Marina", es: "La curva — Renata y Marina", en: "The curve — Renata and Marina" } },
    "fim-casaco": { art: "/scenes/passageira-casaco.jpg?v=vida4", where: { pt: "O que ficou no banco", es: "Lo que quedó en el asiento", en: "What stayed on the seat" } },
    "fim-porta": { art: "/scenes/passageira-porta.jpg?v=vida4", where: { pt: "A porta fechada — Renata e Marina", es: "La puerta cerrada — Renata y Marina", en: "The closed door — Renata and Marina" } },
  },
  correspondencia: {
    caixa: { art: "/scenes/correspondencia-caixa.jpg?v=vida4", where: { pt: "A caixa de correio", es: "El buzón", en: "The mailbox" } },
    leitura: { art: "/scenes/correspondencia-leitura.jpg?v=vida4", where: { pt: "A carta", es: "La carta", en: "The letter" } },
    escada: { art: "/scenes/correspondencia-escada.jpg?v=vida4", where: { pt: "O último lance — Helena", es: "El último tramo — Helena", en: "The last flight — Helena" } },
    portaria: { art: "/scenes/correspondencia-portaria.jpg?v=vida4", where: { pt: "A portaria", es: "La portería", en: "The lobby desk" } },
    mesa: { art: "/scenes/correspondencia-mesa.jpg?v=pintura", where: { pt: "Na janela — Helena", es: "En la ventana — Helena", en: "At the window — Helena" } },
    "fim-resposta": { art: "/scenes/correspondencia-resposta.jpg?v=pintura", where: { pt: "Debaixo da marquise — Helena", es: "Bajo la marquesina — Helena", en: "Under the awning — Helena" } },
    "fim-escada": { art: "/scenes/correspondencia-escada-fim.jpg?v=vida4", where: { pt: "O copo", es: "El vaso", en: "The glass" } },
    "fim-nome": { art: "/scenes/correspondencia-nome.jpg?v=vida4", where: { pt: "A carta que amarela", es: "La carta que amarillea", en: "The letter that yellows" } },
  },
  sobremesa: {
    forno: { art: "/scenes/sobremesa-forno.jpg?v=pintura", where: { pt: "A cozinha — Clara e Nanda", es: "La cocina — Clara y Nanda", en: "The kitchen — Clara and Nanda" } },
    gelo: { art: "/scenes/sobremesa-gelo.jpg?v=vida4", where: { pt: "A despensa — Nanda", es: "La despensa — Nanda", en: "The pantry — Nanda" } },
    sala: { art: "/scenes/sobremesa-sala.jpg?v=vida4", where: { pt: "A sala — Clara e Nanda", es: "El comedor — Clara y Nanda", en: "The dining room — Clara and Nanda" } },
    sal: { art: "/scenes/sobremesa-sal.jpg?v=vida4", where: { pt: "A porta da despensa", es: "La puerta de la despensa", en: "The pantry door" } },
    "fim-conta": { art: "/scenes/sobremesa-conta.jpg?v=vida4", where: { pt: "O beco — Nanda", es: "El callejón — Nanda", en: "The alley — Nanda" } },
    "fim-prato": { art: "/scenes/sobremesa-prato.jpg?v=vida4", where: { pt: "Debaixo do prato", es: "Debajo del plato", en: "Under the plate" } },
    "fim-cozinha": { art: "/scenes/sobremesa-cozinha.jpg?v=vida5", where: { pt: "Depois da sobremesa — Clara", es: "Después del postre — Clara", en: "After dessert — Clara" } },
  },
  corredor: {
    porta714: { art: "/scenes/corredor-porta.jpg?v=pintura", where: { pt: "A porta — Iara", es: "La puerta — Iara", en: "The door — Iara" } },
    corredor: { art: "/scenes/corredor-corredor.jpg?v=vida4", where: { pt: "O corredor — Iara", es: "El pasillo — Iara", en: "The corridor — Iara" } },
    elevador: { art: "/scenes/corredor-elevador.jpg?v=vida4", where: { pt: "O elevador — Iara", es: "El ascensor — Iara", en: "The elevator — Iara" } },
    "fim-saguao": { art: "/scenes/corredor-saguao.jpg?v=vida4", where: { pt: "O saguão — Iara", es: "El vestíbulo — Iara", en: "The lobby — Iara" } },
    "fim-virar": { art: "/scenes/corredor-virar.jpg?v=vida4", where: { pt: "O quarto", es: "La habitación", en: "The room" } },
    "fim-batida": { art: "/scenes/corredor-batida.jpg?v=vida4", where: { pt: "Debaixo da porta", es: "Debajo de la puerta", en: "Under the door" } },
  },
  depoimento: {
    sala: { art: "/scenes/depoimento-sala.jpg?v=pintura", where: { pt: "A sala — Elisa", es: "La sala — Elisa", en: "The room — Elisa" } },
    frase: {
      art: "/scenes/depoimento-frase.jpg?v=vida4",
      where: { pt: "O gravador — Elisa", es: "La grabadora — Elisa", en: "The recorder — Elisa" },
      artIf: [
        { if: "sala:pulo", art: "/scenes/depoimento-frase-pulo.jpg?v=vida4", where: { pt: "O gravador — Elisa", es: "La grabadora — Elisa", en: "The recorder — Elisa" } },
      ],
    },
    del: { art: "/scenes/depoimento-del.jpg?v=pintura", where: { pt: "O corredor — Duda", es: "El pasillo — Duda", en: "The corridor — Duda" } },
    hospital: { art: "/scenes/depoimento-hospital.jpg?v=vida4", where: { pt: "O hospital — Soraia", es: "El hospital — Soraia", en: "The hospital — Soraia" } },
    "fim-versao": { art: "/scenes/depoimento-versao.jpg?v=vida4", where: { pt: "O arquivo", es: "El archivo", en: "The file" } },
    "fim-nome": { art: "/scenes/depoimento-nome.jpg?v=vida4", where: { pt: "A cadeira", es: "La silla", en: "The chair" } },
    "fim-silencio": { art: "/scenes/depoimento-silencio.jpg?v=vida4", where: { pt: "A porta de casa — Soraia", es: "La puerta de casa — Soraia", en: "The door at home — Soraia" } },
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
        scene.people = namesIn(frame.where[lang]);
        scene.motion = MOTION[story.slug]?.[scene.id];
        scene.artIf = frame.artIf?.map((item) => ({ if: item.if, art: item.art, where: item.where[lang] }));
      }
      const house = HOUSE[story.slug];
      if (house) {
        story.life = house.life;
        story.cast = house.people.map((person) => ({
          name: person.name,
          life: person.life[lang],
          portrait: person.portrait,
          motion: person.motion,
        }));
      }
      const opening = pack[story.start];
      if (opening) story.art = opening.art;
    }
  }
}
