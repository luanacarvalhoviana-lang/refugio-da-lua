import type { Lang } from "@/lib/refugio/stories";

export type Life = "rain" | "paper" | "candle" | "lamp" | "room";

export type HousePerson = {
  name: string;
  portrait: string;
  motion?: string;
  life: Record<Lang, string>;
};

const line = (pt: string, es: string, en: string): Record<Lang, string> => ({ pt, es, en });

export const HOUSE: Record<string, { life: Life; people: HousePerson[] }> = {

  correspondencia: {
    life: "paper",
    people: [
      {
        name: "Angelina",
        portrait: "/cast/helena.jpg?v=pintura2",
        life: line(
          "Parou no último lance. O nome antigo ficou lá embaixo.",
          "Se detuvo en el último tramo. El nombre viejo se quedó abajo.",
          "She stopped on the last flight. The old name stayed downstairs.",
        ),
      },
    ],
  },
  depoimento: {
    life: "room",
    people: [
      {
        name: "Elisa",
        portrait: "/cast/elisa.jpg?v=pintura2",
        life: line(
          "Não precisa levantar a voz.",
          "No necesita alzar la voz.",
          "She never needs to raise her voice.",
        ),
      },
      {
        name: "Duda",
        portrait: "/cast/duda.jpg?v=pintura2",
        life: line(
          "O por favor não tem som.",
          "El por favor no tiene sonido.",
          "The please has no sound.",
        ),
      },
      {
        name: "Soraia",
        portrait: "/cast/soraia.jpg?v=pintura2",
        life: line(
          "Acordada. Sem romance e sem ódio.",
          "Despierta. Sin romance y sin odio.",
          "Awake. No romance and no hatred.",
        ),
      },
    ],
  },
};

export const MOTION: Record<string, Record<string, string>> = {

  correspondencia: {
    mesa: "/motion/correspondencia-mesa.mp4?v=pintura2",
    "fim-resposta": "/motion/correspondencia-resposta.mp4?v=pintura2",
  },
  depoimento: {
    del: "/motion/depoimento-del.mp4?v=pintura2",
  },
};

export function namesIn(where: string) {
  const part = where.split(" — ")[1]?.trim();
  if (!part) return [];
  return part.split(/\s+(?:e|y|and)\s+/i).map((name) => name.trim()).filter(Boolean);
}

export function lifeFromPlace(place: string): Life {
  const text = place.toLowerCase();
  if (/chuva|rain|lluvia|carro|marginal|noite|noche|night/.test(text)) return "rain";
  if (/cozinha|jantar|vela|cena|mesa|forno/.test(text)) return "candle";
  if (/hotel|corredor|pasillo|quarto/.test(text)) return "lamp";
  if (/delegacia|hospital|sala|depoimento/.test(text)) return "room";
  return "paper";
}
