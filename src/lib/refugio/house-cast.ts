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
  passageira: {
    life: "rain",
    people: [
      {
        name: "Renata",
        portrait: "/cast/renata.jpg?v=pintura",
        life: line(
          "Onze meses sem uma frase, e a chave ainda abre.",
          "Once meses sin una frase, y la llave todavía abre.",
          "Eleven months without a sentence, and the key still turns.",
        ),
      },
      {
        name: "Marina",
        portrait: "/cast/marina.jpg?v=pintura",
        life: line(
          "Sem casaco, debaixo do farol, e mesmo assim não corre.",
          "Sin abrigo, bajo el farol, y aun así no corre.",
          "No coat, under the light, and still she does not run.",
        ),
      },
    ],
  },
  correspondencia: {
    life: "paper",
    people: [
      {
        name: "Helena",
        portrait: "/cast/helena.jpg?v=pintura",
        life: line(
          "Parou no último lance. O nome antigo ficou lá embaixo.",
          "Se detuvo en el último tramo. El nombre viejo se quedó abajo.",
          "She stopped on the last flight. The old name stayed downstairs.",
        ),
      },
    ],
  },
  sobremesa: {
    life: "candle",
    people: [
      {
        name: "Clara",
        portrait: "/cast/clara.jpg?v=pintura",
        life: line(
          "O brinde chega antes da comida.",
          "El brindis llega antes de la comida.",
          "The toast arrives before the food.",
        ),
      },
      {
        name: "Nanda",
        portrait: "/cast/nanda.jpg?v=pintura",
        life: line(
          "O balde de gelo parou no peito.",
          "El cubo de hielo se detuvo en el pecho.",
          "The ice bucket stopped at her chest.",
        ),
      },
    ],
  },
  corredor: {
    life: "lamp",
    people: [
      {
        name: "Iara",
        portrait: "/cast/iara.jpg?v=pintura",
        life: line(
          "Já explicou. Não acreditaram.",
          "Ya lo explicó. No le creyeron.",
          "She already explained. They did not believe her.",
        ),
      },
    ],
  },
  depoimento: {
    life: "room",
    people: [
      {
        name: "Elisa",
        portrait: "/cast/elisa.jpg?v=pintura",
        life: line(
          "Não precisa levantar a voz.",
          "No necesita alzar la voz.",
          "She never needs to raise her voice.",
        ),
      },
      {
        name: "Duda",
        portrait: "/cast/duda.jpg?v=pintura",
        life: line(
          "O por favor não tem som.",
          "El por favor no tiene sonido.",
          "The please has no sound.",
        ),
      },
      {
        name: "Soraia",
        portrait: "/cast/soraia.jpg?v=pintura",
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
  passageira: {
    "fim-curva": "/motion/passageira-curva.mp4?v=pintura",
  },
  correspondencia: {
    mesa: "/motion/correspondencia-mesa.mp4?v=pintura",
    "fim-resposta": "/motion/correspondencia-resposta.mp4?v=pintura",
  },
  sobremesa: {
    forno: "/motion/sobremesa-forno.mp4?v=pintura",
  },
  depoimento: {
    del: "/motion/depoimento-del.mp4?v=pintura",
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
