import type { GrowthStage } from "@/lib/refugio/amazonTrees";

export type LivingKind =
  | "ipe"
  | "manaca"
  | "quaresmeira"
  | "jacaranda"
  | "pau-brasil"
  | "samauma"
  | "castanheira"
  | "acai"
  | "seringueira"
  | "andiroba"
  | "copaiba"
  | "buriti"
  | "cacau"
  | "empathy";

const painted: Record<LivingKind, string> = {
  ipe: "/trees/ipe.jpg",
  manaca: "/trees/manaca.jpg",
  quaresmeira: "/trees/quaresmeira.jpg",
  jacaranda: "/trees/jacaranda.jpg",
  "pau-brasil": "/trees/pau-brasil.jpg",
  samauma: "/trees/samauma.jpg",
  castanheira: "/trees/castanheira.jpg",
  acai: "/trees/acai.jpg",
  seringueira: "/trees/seringueira.jpg",
  andiroba: "/trees/andiroba.jpg",
  copaiba: "/trees/copaiba.jpg",
  buriti: "/trees/buriti.jpg",
  cacau: "/trees/cacau.jpg",
  empathy: "/trees/empathy.jpg",
};

const stageArt: Record<GrowthStage, string> = {
  seed: "/trees/seed.jpg",
  sprout: "/trees/sprout.jpg",
  sapling: "/trees/sapling.jpg",
  young: "",
  mature: "",
};

export function LivingTree({
  kind,
  stage = "mature",
  extraFlowers = false,
  goldenFruit = false,
  compact = false,
}: {
  kind: LivingKind;
  stage?: GrowthStage;
  extraFlowers?: boolean;
  goldenFruit?: boolean;
  compact?: boolean;
}) {
  const src =
    stage === "young" || stage === "mature" ? painted[kind] : stageArt[stage];

  return (
    <div className={`living-tree painted stage-${stage} ${compact ? "is-compact" : ""} ${goldenFruit ? "is-gold" : ""} ${extraFlowers ? "is-bloom" : ""}`} aria-hidden="true">
      <img className="lt-paint" src={src} alt="" />
      {extraFlowers && (stage === "young" || stage === "mature") ? <span className="lt-bloom" /> : null}
      {goldenFruit && (stage === "young" || stage === "mature") ? (
        <span className="lt-fruits">
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
      ) : null}
      <span className="lt-mist" />
      <span className="plant-dust" />
    </div>
  );
}
