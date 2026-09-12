import { shopPacks, bundlePriceLabel, type ShopPackId } from "@/lib/refugio/shop-packs";
import { useRefugioStore } from "@/lib/refugio/store";
import { Store } from "lucide-react";

function sceneSrc(owned: string[]) {
  const packs = shopPacks.map((p) => p.id).filter((id) => owned.includes(id));
  if (packs.length >= 3) return "/garden/todos.jpg";
  if (packs.length === 2) return "/garden/todos.jpg";
  if (packs[0] === "noite") return "/garden/noite.jpg";
  if (packs[0] === "chuva") return "/garden/chuva.jpg";
  if (packs[0] === "mare") return "/garden/mare.jpg";
  if (packs[0] === "flores") return "/garden/flores.jpg";
  return "/garden/base.jpg";
}

const thumbs: Record<ShopPackId, string> = {
  noite: "/garden/noite.jpg",
  chuva: "/garden/chuva.jpg",
  mare: "/garden/mare.jpg",
  flores: "/garden/flores.jpg",
};

export function GardenStage() {
  const owned = useRefugioStore((s) => s.ownedPacks) || [];
  const src = sceneSrc(owned);
  return (
    <figure className="garden-stage garden-stage-3d">
      <img src={src} alt="Seu cantinho no jardim" />
    </figure>
  );
}

export function HouseShop() {
  const owned = useRefugioStore((s) => s.ownedPacks) || [];
  const togglePack = useRefugioStore((s) => s.togglePack);
  const allOn = shopPacks.every((pack) => owned.includes(pack.id));

  return (
    <section className="house-shop">
      <div className="grove-intro">
        <span className="eyebrow"><Store size={14} /> loja da casa</span>
        <div>
          <h2>Enfeite o cantinho. O mural continua de graça.</h2>
          <p>Toque em um pacote para ver a cena. Ainda é rascunho: se não gostar, a gente tira. Cobrança só se você quiser ficar.</p>
        </div>
      </div>
      <div className="shop-pack-grid">
        {shopPacks.map((pack) => {
          const on = owned.includes(pack.id);
          return (
            <article key={pack.id} className={`shop-pack ${on ? "is-on" : ""}`}>
              <img className="shop-pack-art" src={thumbs[pack.id]} alt="" />
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
        {allOn ? "Voltar ao jardim simples" : "Ver os quatro juntos"}
      </button>
    </section>
  );
}
