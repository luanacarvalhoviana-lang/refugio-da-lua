import { LivingTree, type LivingKind } from "@/components/refugio/living-tree";
import { flowerColors, shopPacks, bundlePriceLabel, type FlowerId } from "@/lib/refugio/shop-packs";
import { useRefugioStore } from "@/lib/refugio/store";
import { growingAmazonSeed } from "@/lib/refugio/amazonTrees";
import { islandTreeByKey } from "@/lib/refugio/islandTrees";
import { Droplets, Moon, Sparkles, Store } from "lucide-react";

function has(pack: string, owned: string[]) {
  return owned.includes(pack);
}
function shown(id: string, hidden: string[]) {
  return !hidden.includes(id);
}
function tone(colors: Record<string, string>, id: FlowerId) {
  const key = colors[id] || (id === "sunflower" ? "amarelo" : id === "lotus" ? "rosa" : "cha");
  return flowerColors.find((item) => item.key === key)?.hex || "#e7b7b0";
}

export function GardenStage() {
  const owned = useRefugioStore((s) => s.ownedPacks) || [];
  const hidden = useRefugioStore((s) => s.hiddenDecor) || [];
  const colors = useRefugioStore((s) => s.flowerColors) || {};
  const moonShape = useRefugioStore((s) => s.moonShape);
  const rainOn = useRefugioStore((s) => s.rainOn);
  const islandKey = useRefugioStore((s) => s.islandTreeKey);
  const amazonSeeds = useRefugioStore((s) => s.amazonSeeds);
  const energiesReceived = useRefugioStore((s) => s.energiesReceived);
  const plan = useRefugioStore((s) => s.plan);
  const growing = growingAmazonSeed(amazonSeeds, energiesReceived);
  const island = islandTreeByKey(islandKey);
  const plantKind: LivingKind | null =
    plan === "annual" && growing ? (growing.speciesKey as LivingKind) : island ? (island.key as LivingKind) : "ipe";
  const night = has("noite", owned);
  const rain = has("chuva", owned) && rainOn && shown("rain", hidden);
  const mare = has("mare", owned);
  const flores = has("flores", owned);

  return (
    <div className={`garden-stage ${night ? "is-night" : ""} ${rain ? "is-rain" : ""}`}>
      <div className="gs-sky">
        {night && shown("stars", hidden) ? <div className="gs-stars" /> : null}
        {night && shown("moon", hidden) ? <div className={`gs-moon ${moonShape}`} /> : null}
        {night && shown("fireflies-sky", hidden) ? (
          <div className="gs-flies high">
            <i /><i /><i /><i /><i /><i />
          </div>
        ) : null}
      </div>
      {rain ? <div className="gs-rain" /> : null}
      <div className="gs-ground">
        {flores && shown("path", hidden) ? <div className="gs-path" /> : null}
        {has("chuva", owned) && shown("puddle", hidden) ? <div className="gs-puddle" /> : null}
        {mare && shown("pond", hidden) ? (
          <div className="gs-pond">
            {night && shown("moon", hidden) ? <span className="gs-reflect" /> : null}
            {shown("fish", hidden) ? <span className="gs-fish" /> : null}
            {shown("lotus", hidden) ? <span className="gs-lotus" style={{ color: tone(colors, "lotus") }} /> : null}
            {shown("shells", hidden) ? <span className="gs-shells" /> : null}
            {shown("stones", hidden) ? <span className="gs-stones" /> : null}
            {shown("shore", hidden) ? <span className="gs-shore" /> : null}
          </div>
        ) : null}
        {flores ? (
          <div className="gs-bed">
            {shown("sunflower", hidden) ? <span className="gs-flower sunflower" style={{ color: tone(colors, "sunflower") }} /> : null}
            {shown("roses", hidden) ? <span className="gs-flower roses" style={{ color: tone(colors, "roses") }} /> : null}
            {shown("daisies", hidden) ? <span className="gs-flower daisies" style={{ color: tone(colors, "daisies") }} /> : null}
            {shown("tulips", hidden) ? <span className="gs-flower tulips" style={{ color: tone(colors, "tulips") }} /> : null}
            {shown("bees", hidden) ? <span className="gs-bees" /> : null}
            {shown("butterflies", hidden) ? <span className="gs-butterflies" /> : null}
            {shown("fireflies-low", hidden) ? (
              <div className="gs-flies low">
                <i /><i /><i /><i />
              </div>
            ) : null}
          </div>
        ) : null}
        {has("chuva", owned) && shown("mushrooms", hidden) ? <div className="gs-mushrooms"><i /><i /><i /></div> : null}
        {has("chuva", owned) && shown("rain-plant", hidden) ? <div className="gs-rainplant" /> : null}
        {flores && shown("birdhouse", hidden) ? <div className="gs-birdhouse" /> : null}
        {night && shown("night-flower", hidden) ? <div className="gs-nightflower" /> : null}
        <div className="gs-tree">
          {plantKind ? <LivingTree kind={plantKind} stage="young" compact extraFlowers={plan === "monthly"} /> : null}
        </div>
        {night && shown("owl", hidden) ? <div className="gs-owl" /> : null}
        {night && shown("lantern", hidden) ? <div className="gs-lantern" /> : null}
        {night && shown("bench", hidden) ? <div className="gs-bench dry" /> : null}
        {has("chuva", owned) && shown("wet-bench", hidden) ? <div className="gs-bench wet" /> : null}
        {has("chuva", owned) && shown("umbrella", hidden) ? <div className="gs-umbrella" /> : null}
        {has("chuva", owned) && shown("frog", hidden) ? <div className="gs-frog" /> : null}
      </div>
    </div>
  );
}

export function HouseShop() {
  const owned = useRefugioStore((s) => s.ownedPacks) || [];
  const togglePack = useRefugioStore((s) => s.togglePack);
  const flowerColorsMap = useRefugioStore((s) => s.flowerColors);
  const setFlowerColor = useRefugioStore((s) => s.setFlowerColor);
  const moonShape = useRefugioStore((s) => s.moonShape);
  const setMoonShape = useRefugioStore((s) => s.setMoonShape);
  const rainOn = useRefugioStore((s) => s.rainOn);
  const setRainOn = useRefugioStore((s) => s.setRainOn);
  const hidden = useRefugioStore((s) => s.hiddenDecor) || [];
  const toggleDecor = useRefugioStore((s) => s.toggleDecor);
  const allOn = shopPacks.every((pack) => owned.includes(pack.id));

  return (
    <section className="house-shop">
      <div className="grove-intro">
        <span className="eyebrow"><Store size={14} /> loja da casa</span>
        <div>
          <h2>Enfeite o cantinho. O mural continua de graça.</h2>
          <p>Toque em um pacote para ver no jardim. Se não gostar, toca de novo e some. Ainda é rascunho: a cobrança de verdade a gente liga depois, se você quiser ficar.</p>
        </div>
      </div>
      <div className="shop-pack-grid">
        {shopPacks.map((pack) => {
          const on = owned.includes(pack.id);
          return (
            <article key={pack.id} className={`shop-pack ${on ? "is-on" : ""}`}>
              <strong>{pack.name}</strong>
              <small>{pack.blurb}</small>
              <ul>
                {pack.items.map((item) => (
                  <li key={item.id}>{item.label}</li>
                ))}
              </ul>
              <em>{pack.priceLabel}</em>
              <button type="button" className={on ? "button button-secondary" : "button button-primary"} onClick={() => togglePack(pack.id)}>
                {on ? "Tirar do jardim" : "Ver no jardim"}
              </button>
            </article>
          );
        })}
      </div>
      <p className="shop-bundle">Coleção da casa (os quatro) · {bundlePriceLabel}</p>
      <button
        type="button"
        className="button button-quiet"
        onClick={() => {
          if (allOn) shopPacks.forEach((pack) => owned.includes(pack.id) && togglePack(pack.id));
          else shopPacks.forEach((pack) => !owned.includes(pack.id) && togglePack(pack.id));
        }}
      >
        {allOn ? "Limpar todos os enfeites" : "Ver os quatro juntos"}
      </button>
      {owned.length > 0 && (
        <div className="shop-tunes">
          {has("noite", owned) && (
            <label>
              Lua
              <select value={moonShape} onChange={(e) => setMoonShape(e.target.value === "full" ? "full" : "crescent")}>
                <option value="crescent">Crescente</option>
                <option value="full">Cheia</option>
              </select>
            </label>
          )}
          {has("chuva", owned) && (
            <button type="button" className="button-quiet" onClick={() => setRainOn(!rainOn)}>
              <Droplets size={14} /> {rainOn ? "Pausar chuva" : "Chover de novo"}
            </button>
          )}
          {(["roses", "daisies", "tulips", "sunflower", "lotus"] as FlowerId[]).map((id) => {
            const pack = id === "lotus" ? "mare" : "flores";
            if (!has(pack, owned)) return null;
            return (
              <label key={id}>
                {id === "lotus" ? "Lótus" : id === "roses" ? "Rosas" : id === "daisies" ? "Margaridas" : id === "tulips" ? "Tulipas" : "Girassol"}
                <select value={flowerColorsMap[id] || ""} onChange={(e) => setFlowerColor(id, e.target.value)}>
                  {flowerColors.map((c) => (
                    <option key={c.key} value={c.key}>{c.label}</option>
                  ))}
                </select>
              </label>
            );
          })}
        </div>
      )}
      {owned.length > 0 && (
        <div className="shop-toggles">
          <span className="eyebrow"><Sparkles size={12} /> peças neste jardim</span>
          {shopPacks.filter((p) => owned.includes(p.id)).flatMap((pack) => pack.items).map((item) => (
            <button key={item.id} type="button" className={shown(item.id, hidden) ? "on" : ""} onClick={() => toggleDecor(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
      )}
      {has("noite", owned) && has("mare", owned) && shown("moon", hidden) && shown("pond", hidden) ? (
        <p className="filter-hint"><Moon size={12} /> O reflexo no lago acendeu porque a lua e a maré estão juntas.</p>
      ) : null}
    </section>
  );
}
