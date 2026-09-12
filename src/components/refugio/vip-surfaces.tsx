import { useEffect, useState } from "react";
import { Crown, LockKeyhole, Sparkles, Sprout } from "lucide-react";
import { ageOptions, emotionOptions, genderOptions, hourBuckets, type VipEntitlements } from "@/lib/refugio/vip";
import { avatars, canUseItem, envelopes, frames, letterFonts, papers, seals, type CollectionItem } from "@/lib/refugio/collection";
import {
  amazonTrees,
  canPlantNextAmazon,
  energyForSeed,
  growingAmazonSeed,
  stageMeta,
  treeByKey,
  type AmazonSeed,
  type AmazonTreeKey,
  type GrowthStage,
} from "@/lib/refugio/amazonTrees";
import {
  islandCareSince,
  islandChoicesFor,
  islandStage,
  islandTreeByKey,
  type IslandTreeKey,
} from "@/lib/refugio/islandTrees";
import { GardenDecor } from "@/components/refugio/garden-decor";
import type { SessionPlan } from "@/lib/refugio/store";
import { useRefugioStore } from "@/lib/refugio/store";

export function EmpathyTree({ extraFlowers, goldenFruit }: { extraFlowers: boolean; goldenFruit: boolean }) {
  return (
    <div className={`empathy-tree ${goldenFruit ? "tree-gold" : extraFlowers ? "tree-bloom" : "tree-plain"}`}>
      <LivingTree kind="empathy" stage="mature" extraFlowers={extraFlowers} goldenFruit={goldenFruit} />
      <small>{goldenFruit ? "Aura iluminada e frutos dourados" : extraFlowers ? "Flores extras na Árvore" : "Árvore da Empatia"}</small>
    </div>
  );
}

export function IslandTree({
  plan,
  speciesKey,
  grownKeys,
  bornCare,
  dewDropsReceived,
  energiesReceived,
  adviceSent,
  onChoose,
}: {
  plan: SessionPlan;
  speciesKey: IslandTreeKey | null;
  grownKeys: IslandTreeKey[];
  bornCare: number;
  dewDropsReceived: number;
  energiesReceived: number;
  adviceSent: number;
  onChoose: (key: IslandTreeKey) => void;
}) {
  const choices = islandChoicesFor(plan === "annual" ? "free" : plan);
  const rawSpecies = islandTreeByKey(speciesKey);
  const species = rawSpecies && choices.some((tree) => tree.key === rawSpecies.key) ? rawSpecies : null;
  const care = islandCareSince({ dewDropsReceived, energiesReceived, adviceSent }, bornCare);
  const meta = islandStage(care);
  const canPickNext = !species || meta.stage === "mature";
  const remaining = choices.filter((tree) => tree.key !== speciesKey && !grownKeys.includes(tree.key));
  const grown = grownKeys.map((key) => islandTreeByKey(key)).filter(Boolean);

  const harvestTree = useRefugioStore((s) => s.harvestTree);
  const harvestedKeys = useRefugioStore((s) => s.harvestedKeys);
  const ownedPacks = useRefugioStore((s) => s.ownedPacks);
  const picked = Boolean(species && harvestedKeys.includes(species.key));
  const picker = canPickNext && remaining.length > 0 && (
    <div className="island-choice-grid">
      {remaining.map((tree) => (
        <button key={tree.key} type="button" className="island-choice" onClick={() => onChoose(tree.key)}>
          <LivingTree kind={tree.key} stage="mature" compact />
          <strong>{tree.name}</strong>
          <small>{tree.meaning}</small>
        </button>
      ))}
    </div>
  );

  if (!species) {
    return (
      <section className="island-picker">
        <div className="garden-plant-art sprout-well">
          <LivingTree kind="ipe" stage="sprout" />
          <GardenDecor stage="sprout" />
        </div>
        <div className="grove-intro">
          <span className="eyebrow"><Sprout size={14} /> sua árvore</span>
          <div>
            <h2>Qual planta vai crescer com você?</h2>
            <p>Uma de cada vez. Ela precisa ficar frondosa antes de você escolher a próxima.</p>
          </div>
        </div>
        {picker}
      </section>
    );
  }

  const stage = meta.stage === "seed" ? "sprout" : meta.stage;
  const lush = stage === "mature";
  return (
    <section className="island-garden">
      {grown.length > 0 && (
        <div className="grown-strip">
          {grown.map((tree) => (
            <figure key={tree!.key} className="grown-chip">
              <LivingTree kind={tree!.key} stage="mature" compact />
              <figcaption>{tree!.name}</figcaption>
            </figure>
          ))}
        </div>
      )}
      <section className={`garden-plant-card stage-${stage} ${lush ? "tree-lush" : ""}`}>
        <div className={`garden-plant-art ${ownedPacks?.includes("noite") ? "is-night-well" : ""}`}>
          <LivingTree kind={species.key} stage={stage} extraFlowers={plan === "monthly"} goldenFruit={(plan === "annual" || lush) && !picked} picked={picked} onPick={lush && !picked ? () => harvestTree(species.key) : undefined} />
          <GardenDecor stage={stage} />
          {lush && <span className="fireflies" aria-hidden="true" />}
        </div>
        <div className="garden-plant-meta">
          <span className="eyebrow">{meta.label}</span>
          <h2>{species.name}</h2>
          <p>{species.meaning}</p>
          <div className="grove-bar" aria-hidden="true"><span style={{ width: `${Math.round(meta.progress * 100)}%` }} /></div>
          <small>
            {meta.remaining > 0
              ? `${meta.remaining} de cuidado até ${meta.nextLabel.toLowerCase()}. Depois, outra semente.`
              : remaining.length > 0
                ? "Copa plena. Pode escolher a próxima."
                : "Copa plena. O jardim está completo neste plano."}
          </small>
        </div>
      </section>
      {canPickNext && remaining.length > 0 && (
        <div className="island-picker next-seed">
          <p>A próxima só entra agora porque esta já cresceu.</p>
          {picker}
        </div>
      )}
    </section>
  );
}

export function AmazonTreeArt({ species, stage, golden = false }: { species: AmazonTreeKey; stage: GrowthStage; golden?: boolean }) {
  return (
    <div className={`amazon-art stage-${stage} species-${species}`} aria-hidden="true">
      <LivingTree kind={species as LivingKind} stage={stage} compact goldenFruit={golden && stage === "mature"} />
    </div>
  );
}

export function AmazonGrove({
  unlocked,
  seeds,
  energiesReceived,
  onSeePlans,
  onChoose,
}: {
  unlocked: boolean;
  seeds: AmazonSeed[];
  energiesReceived: number;
  onSeePlans: () => void;
  onChoose?: (key: AmazonTreeKey) => void;
}) {
  const harvestTree = useRefugioStore((s) => s.harvestTree);
  const harvestedKeys = useRefugioStore((s) => s.harvestedKeys);
  const chooseAmazon = useRefugioStore((s) => s.chooseAmazonTree);
  const growing = growingAmazonSeed(seeds, energiesReceived);
  const canPick = unlocked && canPlantNextAmazon(seeds, energiesReceived);
  const remaining = amazonTrees.filter((tree) => !seeds.some((seed) => seed.speciesKey === tree.key));
  const planted = amazonTrees
    .map((tree) => ({ tree, seed: seeds.find((item) => item.speciesKey === tree.key) ?? null }))
    .filter((item) => item.seed);
  const plant = onChoose ?? chooseAmazon;

  if (!unlocked) return null;

  return (
    <section className="amazon-grove grove-open">
      <div className="grove-intro">
        <span className="eyebrow"><Sprout size={14} /> seu bosque</span>
        <div>
          <h2>{planted.length ? "O bosque cresce uma árvore por vez." : "Qual nativa vai nascer primeiro?"}</h2>
          <p>
            {growing
              ? "Cuide desta até a copa ficar plena. Só então o bosque abre a próxima semente."
              : remaining.length
                ? "Escolha uma. Conselhos e energias nas suas cartas fazem ela crescer."
                : "Todas as nativas deste bosque já estão plenadas."}
          </p>
        </div>
      </div>
      {growing ? (
        <div className="garden-plant-art sprout-well">
          <LivingTree kind={growing.speciesKey as LivingKind} stage={stageMeta(energyForSeed(growing, energiesReceived)).stage} />
          <GardenDecor stage={stageMeta(energyForSeed(growing, energiesReceived)).stage} />
        </div>
      ) : !planted.length ? (
        <div className="garden-plant-art sprout-well">
          <LivingTree kind="samauma" stage="sprout" />
          <GardenDecor stage="sprout" />
        </div>
      ) : null}
      {canPick && remaining.length > 0 && (
        <div className="island-choice-grid amazon-pick">
          {remaining.map((tree) => (
            <button key={tree.key} type="button" className="island-choice" onClick={() => plant(tree.key)}>
              <LivingTree kind={tree.key} stage="mature" compact />
              <strong>{tree.name}</strong>
              <small>{tree.meaning}</small>
              <em>Plantar esta</em>
            </button>
          ))}
        </div>
      )}
      {planted.length > 0 && (
        <div className="grove-grid">
          {planted.map(({ tree, seed }) => {
            const energy = seed ? energyForSeed(seed, energiesReceived) : 0;
            const meta = stageMeta(energy);
            const active = growing?.speciesKey === tree.key;
            const picked = harvestedKeys.includes(tree.key);
            const ripe = meta.stage === "mature" && !picked;
            return (
              <article key={tree.key} className={`grove-card owned ${active ? "growing" : "ready"} ${picked ? "picked" : ""}`}>
                <AmazonTreeArt species={tree.key} stage={meta.stage} golden={meta.stage === "mature" && !picked} />
                <div className="grove-copy">
                  <strong>{tree.name}</strong>
                  <small>{picked ? "Frutos no cesto" : `${meta.label} · ${energy} energias`}</small>
                  <div className="grove-bar" aria-hidden="true"><span style={{ width: `${Math.round(meta.progress * 100)}%` }} /></div>
                  {ripe ? (
                    <button type="button" className="button button-secondary" onClick={() => harvestTree(tree.key)}>Colher os frutos</button>
                  ) : (
                    <span className="grove-next">
                      {picked
                        ? "Colheita feita. A árvore segue no bosque."
                        : meta.remaining > 0
                          ? `${meta.remaining} energias até ${meta.nextLabel.toLowerCase()}`
                          : "Copa plena · a floresta agradece"}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export function AmazonGrovePreview() {
  return (
    <div className="grove-preview">
      {amazonTrees.map((tree) => (
        <div key={tree.key} className="grove-preview-item">
          <AmazonTreeArt species={tree.key} stage="mature" />
          <strong>{tree.name}</strong>
          <small>{tree.meaning}</small>
        </div>
      ))}
    </div>
  );
}

export function seedToastLabel(seed: AmazonSeed | null | undefined) {
  if (!seed) return null;
  return treeByKey(seed.speciesKey).name;
}

export function CollectionPicker({
  plan,
  value,
  onChange,
  kind,
}: {
  plan: "free" | "monthly" | "annual";
  value: string;
  onChange: (key: string) => void;
  kind: "avatar" | "frame" | "paper" | "seal";
}) {
  const items: CollectionItem[] =
    kind === "avatar" ? avatars : kind === "frame" ? frames : kind === "paper" ? papers : seals;
  return (
    <div className="collection-picker">
      {items.map((item) => {
        const allowed = canUseItem(item.tier, plan);
        return (
          <button
            type="button"
            key={item.key}
            className={`${value === item.key ? "active" : ""} ${allowed ? "" : "locked"}`}
            disabled={!allowed}
            onClick={() => allowed && onChange(item.key)}
            title={allowed ? item.label : `${item.label} · ${item.tier === "annual" ? "VIP Anual" : "VIP"}`}
          >
            <span>{item.glyph}</span>
            <small>{item.label}</small>
            {!allowed && <LockKeyhole size={11} />}
          </button>
        );
      })}
    </div>
  );
}

export function MuralVipFilters({
  entitlements,
  gender,
  age,
  emotion,
  hour,
  onGender,
  onAge,
  onEmotion,
  onHour,
}: {
  entitlements: VipEntitlements;
  gender: string;
  age: string;
  emotion: string;
  hour: string;
  onGender: (value: string) => void;
  onAge: (value: string) => void;
  onEmotion: (value: string) => void;
  onHour: (value: string) => void;
}) {
  const plan = useRefugioStore((s) => s.plan);
  const monthly = plan === "monthly";
  const annual = plan === "annual";
  if (!monthly && !annual) {
    return <p className="filter-hint">No VIP Mensal: gênero ou idade, e emoção. No Anual: os dois + horário de envio.</p>;
  }
  const bothBlocked = monthly && !annual && Boolean(gender) && Boolean(age);
  return (
    <div className="vip-filters">
      <p className="filter-plan-label">{annual ? "Filtros do VIP Anual" : "Filtros do VIP Mensal"}</p>
      <label>
        Gênero
        <select value={gender} onChange={(e) => onGender(e.target.value)}>
          <option value="">Todos</option>
          {genderOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </label>
      <label>
        Idade
        <select value={age} onChange={(e) => onAge(e.target.value)}>
          <option value="">Todas</option>
          {ageOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </label>
      <label>
        Emoção
        <select value={emotion} onChange={(e) => onEmotion(e.target.value)}>
          <option value="">Todas</option>
          {emotionOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </label>
      {annual ? (
        <label>
          Horário de envio
          <select value={hour} onChange={(e) => onHour(e.target.value)}>
            <option value="">Qualquer hora</option>
            {hourBuckets.map((bucket) => <option key={bucket.key} value={bucket.key}>{bucket.label}</option>)}
          </select>
        </label>
      ) : null}
      {bothBlocked && <span className="filter-hint">No Mensal escolha gênero ou idade. Os dois juntos são do Anual.</span>}
    </div>
  );
}

export function WeeklyChart({ counts }: { counts: number[] }) {
  const max = Math.max(1, ...counts);
  const labels = ["Há 6d", "5d", "4d", "3d", "2d", "Ontem", "Hoje"];
  return (
    <div className="week-chart">
      <strong>Análise da semana</strong>
      <div className="week-bars">
        {counts.map((count, index) => (
          <div key={labels[index]} className="week-bar">
            <i style={{ height: `${Math.round((count / max) * 72)}px` }} />
            <small>{labels[index]}</small>
            <em>{count}</em>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ScreenshotGuard({
  enabled,
  children,
  label = "Refúgio da Lua",
}: {
  enabled: boolean;
  children: React.ReactNode;
  label?: string;
}) {
  const [hidden, setHidden] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (!enabled) return;
    const warn = (message: string) => {
      setNotice(message);
      window.setTimeout(() => setNotice(""), 2200);
    };
    const onVisibility = () => setHidden(document.visibilityState !== "visible");
    const block = (event: Event) => {
      event.preventDefault();
      warn("Este conteúdo não pode ser copiado por aqui.");
    };
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const combo = event.ctrlKey || event.metaKey;
      if (key === "printscreen" || (combo && ["c", "x", "s", "p", "u"].includes(key))) {
        event.preventDefault();
        warn("Atalho de cópia ou impressão bloqueado neste espaço.");
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("contextmenu", block);
    document.addEventListener("copy", block);
    document.addEventListener("cut", block);
    document.addEventListener("dragstart", block);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("copy", block);
      document.removeEventListener("cut", block);
      document.removeEventListener("dragstart", block);
      document.removeEventListener("keydown", onKey);
    };
  }, [enabled]);
  return (
    <div className={enabled ? "shot-guard" : undefined}>
      {enabled && <span className="content-watermark" aria-hidden="true">{label}</span>}
      {hidden && enabled && (
        <div className="shot-veil">
          <Sparkles size={18} />
          <span>Conteúdo protegido enquanto a tela não está em primeiro plano.</span>
        </div>
      )}
      {notice && <div className="protect-toast" role="status">{notice}</div>}
      {children}
    </div>
  );
}

export function StylePicker({
  items,
  plan,
  value,
  onChange,
}: {
  items: CollectionItem[];
  plan: SessionPlan;
  value: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="style-picker">
      {items.map((item) => {
        const allowed = canUseItem(item.tier, plan);
        return (
          <button
            key={item.key}
            type="button"
            className={`style-chip ${value === item.key ? "selected" : ""} ${allowed ? "" : "locked"}`}
            onClick={() => allowed && onChange(item.key)}
            disabled={!allowed}
          >
            <span>{item.glyph}</span>
            {item.label}
            {!allowed && <LockKeyhole size={12} />}
          </button>
        );
      })}
    </div>
  );
}

export function EnvelopeAdvice({
  author,
  body,
  envelopeKey = "kraft",
  fontKey = "lora",
  opened = false,
  thanked,
  thanking,
  onOpen,
  onThank,
}: {
  author: string;
  body: string;
  envelopeKey?: string;
  fontKey?: string;
  opened?: boolean;
  thanked: boolean;
  thanking?: boolean;
  onOpen: () => void;
  onThank: () => void;
}) {
  if (!opened) {
    return (
      <button type="button" className={`sealed-envelope env-${envelopeKey}`} onClick={onOpen}>
        <span className="envelope-flap" />
        <span className="envelope-seal" aria-hidden="true">✦</span>
        <strong>Um envelope chegou</strong>
        <small>de {author} · toque para abrir</small>
      </button>
    );
  }
  return (
    <div className={`dew-card opened-letter font-${fontKey} env-${envelopeKey}`}>
      <strong>{author}</strong>
      <p>{body}</p>
      <button className="button button-secondary" disabled={thanked || thanking} onClick={onThank} type="button">
        {thanked ? "Orvalho enviado" : "Este conselho me fez bem"}
      </button>
    </div>
  );
}
