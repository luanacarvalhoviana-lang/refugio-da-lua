export type ShopLang = "pt" | "es" | "en";

const EN: Record<string, { title: string; desc: string }> = {
  "pack-biblioteca": {
    title: "Night in the library",
    desc: "The setting and the music of this story. The choices stay the same.",
  },
  "pack-cafe": {
    title: "Rain at the café",
    desc: "The wet café and the music of this night. The plot does not change.",
  },
  "pack-praia": {
    title: "Beach with no moon",
    desc: "The sand and the sound of this story. Nothing on the main path is for sale.",
  },
  chuva: {
    title: "Rain",
    desc: "A rain mood for any story you can already read.",
  },
  templo: {
    title: "Temple",
    desc: "A quiet mood, for any open story.",
  },
  "a-lampada": {
    title: "The lamp that should not be on",
    desc: "The whole story, bought once. No monthly fee.",
  },
  "bonus-bilhete": {
    title: "The last shelf still lit",
    desc: "A short path after the ending. It does not change what you already chose.",
  },
  "pack-passageira": {
    title: "Riverside road in the rain",
    desc: "The setting and music of \"The Woman in the Back Seat\". The choices stay the same.",
  },
  "pack-cartas": {
    title: "Paper on the last step",
    desc: "The setting and music of \"Letters to Who I Was\". The plot does not change.",
  },
  "pack-corredor": {
    title: "Seventh floor",
    desc: "The setting and music of \"Don't Look Back in Room 714\". Nothing on the main path is for sale.",
  },
  "pack-jantar": {
    title: "Table set",
    desc: "The setting and music of \"Dinner with My Ex\". The choices stay the same.",
  },
  "bonus-passageira": {
    title: "One more day",
    desc: "A short chapter after the ending \"The Curve\". It does not change what you already chose.",
  },
  "bonus-cartas": {
    title: "Monday's letter",
    desc: "A short chapter after the ending. It does not change what you already chose.",
  },
  "bonus-corredor": {
    title: "Coffee in blue",
    desc: "A short chapter after the ending \"The Lobby\". It does not change what you already chose.",
  },
};

export function shopText(
  lang: ShopLang,
  item: { slug?: string; title_pt: string; title_es: string; desc_pt?: string; desc_es?: string },
) {
  if (lang === "en") {
    const extra = item.slug ? EN[item.slug] : undefined;
    if (extra) return extra;
  }
  if (lang === "es") return { title: item.title_es, desc: item.desc_es || "" };
  return { title: item.title_pt, desc: item.desc_pt || "" };
}

export function tipText(lang: ShopLang) {
  if (lang === "en") return { name: "A moon for the author", description: "A tip. It opens nothing in the story." };
  if (lang === "es") return { name: "Una luna para la autora", description: "Una propina. No abre nada de la historia." };
  return { name: "Uma lua para a autora", description: "Uma gorjeta. Não abre nada da história." };
}
