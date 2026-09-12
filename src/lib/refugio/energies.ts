export const energyKinds = [
  { key: "hug", label: "Abraço" },
  { key: "listen", label: "Escuta" },
  { key: "strength", label: "Força" },
  { key: "hope", label: "Esperança" },
  { key: "peace", label: "Paz" },
  { key: "here", label: "Estou aqui" },
] as const;

export type EnergyKey = (typeof energyKinds)[number]["key"];

export function energyLabel(key: string) {
  return energyKinds.find((item) => item.key === key)?.label || key;
}
