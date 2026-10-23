import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { StoryShell, useHouse } from "@/components/refugio/story-shell";
import { adminShop, moderateTip, saveProduct } from "@/lib/refugio/shop-cloud";

export const Route = createFileRoute("/admin/loja")({
  component: AdminShop,
});

function AdminShop() {
  const { t } = useHouse();
  const [data, setData] = useState<Awaited<ReturnType<typeof adminShop>> | null>(null);
  const [slug, setSlug] = useState("");
  const [titlePt, setTitlePt] = useState("");
  const [titleEs, setTitleEs] = useState("");
  const [price, setPrice] = useState("690");
  function load() {
    void adminShop().then(setData).catch(() => setData({ allowed: false }));
  }
  useEffect(() => { load(); }, []);
  if (!data) return <StoryShell><section className="house-hero"><p className="soon-kicker">{t.brand}</p></section></StoryShell>;
  if (!data.allowed) {
    return <StoryShell><section className="house-block"><h1>{t.adminClosed}</h1></section></StoryShell>;
  }
  return (
    <StoryShell>
      <section className="house-block">
        <h1>{t.navShop}</h1>
        <p className="plan-price">R$ {(data.cents / 100).toFixed(2).replace(".", ",")}</p>
        <form className="soon-form" onSubmit={(event) => {
          event.preventDefault();
          void saveProduct({ data: {
            slug, type: "story_pack", titlePt, titleEs, descPt: titlePt, descEs: titleEs,
            priceCents: Math.round(Number(price) ) || 690, active: true,
          } }).then(load);
        }}>
          <input required placeholder="slug" value={slug} onChange={(event) => setSlug(event.target.value)} />
          <input required placeholder="PT" value={titlePt} onChange={(event) => setTitlePt(event.target.value)} />
          <input required placeholder="ES" value={titleEs} onChange={(event) => setTitleEs(event.target.value)} />
          <input required value={price} onChange={(event) => setPrice(event.target.value)} />
          <button type="submit">{t.shopBuy}</button>
        </form>
        <ul className="comment-list">
          {data.products.map((product) => (
            <li key={String(product.id)}>{String(product.title_pt)} · {String(product.price_cents)}</li>
          ))}
        </ul>
        <h2>{t.shopTip}</h2>
        <ul className="comment-list">
          {data.tips.map((tip) => (
            <li key={String(tip.id)}>
              <p>{String(tip.author_slug)} · {String(tip.message_status)}</p>
              <p>{String(tip.message || "")}</p>
              <button type="button" onClick={() => void moderateTip({ data: { id: String(tip.id), status: "visivel" } }).then(load)}>{t.adminApprove}</button>
              <button type="button" onClick={() => void moderateTip({ data: { id: String(tip.id), status: "removida" } }).then(load)}>{t.adminRemove}</button>
            </li>
          ))}
        </ul>
      </section>
    </StoryShell>
  );
}
