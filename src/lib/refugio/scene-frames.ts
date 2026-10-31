import type { Lang, Story } from "@/lib/refugio/stories";
import { HOUSE, MOTION, namesIn } from "@/lib/refugio/house-cast";

const frames: Record<string, Record<string, {
  art: string;
  where: Record<Lang, string>;
  artIf?: Array<{ if: string; art: string; where: Record<Lang, string> }>;
}>> = {
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
