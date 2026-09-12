export type ShopPackId = "noite" | "chuva" | "mare" | "flores";

export type FlowerId = "roses" | "daisies" | "tulips" | "sunflower" | "lotus";

export const flowerColors = [
  { key: "cha", label: "Rosa-chá", hex: "#e7b7b0" },
  { key: "branco", label: "Branco", hex: "#f6f1e6" },
  { key: "amarelo", label: "Amarelo", hex: "#e8c96a" },
  { key: "lilas", label: "Lilás", hex: "#c5b3d9" },
  { key: "rosa", label: "Rosa", hex: "#d9899c" },
] as const;

export const shopPacks: {
  id: ShopPackId;
  name: string;
  priceLabel: string;
  unitAmount: number;
  blurb: string;
  items: { id: string; label: string }[];
}[] = [
  {
    id: "noite",
    name: "Noite tranquila",
    priceLabel: "R$ 9,90",
    unitAmount: 990,
    blurb: "Lua, céu e vaga-lumes altos. O clima da casa.",
    items: [
      { id: "moon", label: "Lua suspensa" },
      { id: "stars", label: "Céu estrelado" },
      { id: "fireflies-sky", label: "Vaga-lumes no céu" },
      { id: "owl", label: "Corujinha" },
      { id: "lantern", label: "Lanterninha" },
      { id: "night-flower", label: "Flor da noite" },
      { id: "bench", label: "Banco quieto" },
    ],
  },
  {
    id: "chuva",
    name: "Chuva no jardim",
    priceLabel: "R$ 9,90",
    unitAmount: 990,
    blurb: "Dia mole, sapo e poça. A chuva liga e desliga.",
    items: [
      { id: "rain", label: "Chuva suave" },
      { id: "umbrella", label: "Guarda-chuva" },
      { id: "frog", label: "Sapinho" },
      { id: "mushrooms", label: "Cogumelos" },
      { id: "puddle", label: "Poça" },
      { id: "wet-bench", label: "Banco molhado" },
      { id: "rain-plant", label: "Plantinha de chuva" },
    ],
  },
  {
    id: "mare",
    name: "Maré",
    priceLabel: "R$ 9,90",
    unitAmount: 990,
    blurb: "Lago, lótus e o reflexo — se a lua também estiver no céu.",
    items: [
      { id: "pond", label: "Lago" },
      { id: "lotus", label: "Lótus" },
      { id: "fish", label: "Peixinho" },
      { id: "shells", label: "Conchas" },
      { id: "stones", label: "Pedras lisas" },
      { id: "shore", label: "Planta de beira" },
    ],
  },
  {
    id: "flores",
    name: "Pequeno jardim",
    priceLabel: "R$ 9,90",
    unitAmount: 990,
    blurb: "Canteiro de espécies. A cor se escolhe na terra. Vaga-lumes baixos.",
    items: [
      { id: "sunflower", label: "Girassol" },
      { id: "roses", label: "Rosas" },
      { id: "daisies", label: "Margaridas" },
      { id: "tulips", label: "Tulipas" },
      { id: "bees", label: "Abelhinhas" },
      { id: "butterflies", label: "Borboletas" },
      { id: "birdhouse", label: "Casinha de passarinho" },
      { id: "path", label: "Caminho de pedra" },
      { id: "fireflies-low", label: "Vaga-lumes entre as flores" },
    ],
  },
];

export const bundlePriceLabel = "R$ 29,90";
export const bundleAmount = 2990;

export function packById(id: string) {
  return shopPacks.find((pack) => pack.id === id) ?? null;
}
