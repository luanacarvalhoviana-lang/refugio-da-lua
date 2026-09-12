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
  sprout: "/trees/sprout-plantado.png",
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
  picked = false,
  onPick,
}: {
  kind: LivingKind;
  stage?: GrowthStage;
  extraFlowers?: boolean;
  goldenFruit?: boolean;
  compact?: boolean;
  picked?: boolean;
  onPick?: () => void;
}) {
  const src =
    stage === "young" || stage === "mature" ? painted[kind] : stageArt[stage];
  const showFruit = (goldenFruit || Boolean(onPick)) && (stage === "young" || stage === "mature") && !picked;

  return (
    <div className={`living-tree painted stage-${stage} ${compact ? "is-compact" : ""} ${goldenFruit ? "is-gold" : ""} ${extraFlowers ? "is-bloom" : ""} ${picked ? "is-picked" : ""}`} aria-hidden={onPick ? undefined : "true"}>
      {stage === "sapling" ? <span className="lt-ground" /> : null}
      <img className="lt-paint" src={src} alt="" />
      {extraFlowers && (stage === "young" || stage === "mature") ? <span className="lt-bloom" /> : null}
      {showFruit ? (
        <span className={`lt-fruits ${onPick ? "is-pickable" : ""}`}>
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
      ) : null}
      {onPick && !picked && (stage === "mature") ? (
        <button type="button" className="lt-pick" onClick={onPick}>
          Colher os frutos
        </button>
      ) : null}
      <span className="lt-mist" />
      <span className="plant-dust" />
    </div>
  );
}
