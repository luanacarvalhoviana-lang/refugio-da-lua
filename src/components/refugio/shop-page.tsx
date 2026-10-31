import { useEffect, useRef, useState } from "react";
import { StoryShell, useHouse } from "@/components/refugio/story-shell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { bonusText, buyProduct, claimMonthPack, confirmShopReturn, leaveTip, moonCount, myBox, setPackEnabled, shopShelf, storyLook } from "@/lib/refugio/shop-cloud";
import { shopText } from "@/lib/refugio/shop-text";

type Product = {
  id: string;
  slug: string;
  type: string;
  story_slug: string | null;
  title_pt: string;
  title_es: string;
  desc_pt: string;
  desc_es: string;
  price_cents: number;
  preview_image: string | null;
  preview_audio: string | null;
};

function reais(cents: number, off: boolean) {
  const value = off ? Math.max(100, Math.round(cents * 0.8)) : cents;
  return `R$ ${(value / 100).toFixed(2).replace(".", ",")}`;
}

function Preview({ image, audio }: { image: string | null; audio: string | null }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  return (
    <div className="shop-preview">
      {image ? <img src={image} alt="" /> : null}
      {audio ? (
        <audio
          ref={audioRef}
          src={audio}
          controls
          onTimeUpdate={() => {
            const node = audioRef.current;
            if (node && node.currentTime > 10) {
              node.pause();
              node.currentTime = 0;
            }
          }}
        />
      ) : null}
    </div>
  );
}

export function ShopPage({ initialLang }: { initialLang?: "pt" | "es" | "en" } = {}) {
  const { lang, setLang, t } = useHouse();
  useEffect(() => {
    if (initialLang && initialLang !== lang) setLang(initialLang);
  }, [initialLang, lang, setLang]);
  const { user } = useCurrentUserState();
  const [tab, setTab] = useState<"story" | "all" | "special" | "box">("story");
  const [open, setOpen] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [mine, setMine] = useState<string[]>([]);
  const [subscriber, setSubscriber] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const [note, setNote] = useState("");
  const [pending, setPending] = useState("");
  const signedIn = Boolean(user && !user.isDevFallback);
  function load() {
    void shopShelf().then((result) => {
      setOpen(result.open);
      setProducts(result.products as Product[]);
      setMine(result.mine);
      setSubscriber(result.subscriber);
      setRedeemed(result.redeemed);
    }).catch(() => setOpen(false));
  }
  useEffect(() => { load(); }, []);
  const has = (kind: "story" | "all" | "special") => products.some((product) =>
    kind === "all" ? product.type === "global_pack"
      : kind === "special" ? product.type === "special_story"
      : product.type === "story_pack" || product.type === "bonus_chapter");
  useEffect(() => {
    if (tab !== "box" && products.length > 0 && !has(tab)) setTab(has("story") ? "story" : has("all") ? "all" : "box");
  }, [products, tab]);
  const shown = products.filter((product) => {
    if (tab === "all") return product.type === "global_pack";
    if (tab === "special") return product.type === "special_story";
    return product.type === "story_pack" || product.type === "bonus_chapter";
  });
  function buy(slug: string) {
    if (!open) return;
    setPending(slug);
    setNote("");
    void buyProduct({ data: { slug, origin: window.location.origin, lang } })
      .then((result) => {
        if (result.ok && result.url) window.location.assign(result.url);
        else setNote(result.reason === "tem" ? t.shopOwned : result.reason === "conta" ? t.shopEnter : t.shopSoon);
      })
      .catch(() => setNote(t.planFail))
      .finally(() => setPending(""));
  }
  return (
    <StoryShell>
      <section className="house-hero">
        <p className="soon-kicker">{t.navShop}</p>
        <h1>{t.shopTitle}</h1>
        <p className="soon-lead">{open ? t.shopLead : t.shopSoon}</p>
        {subscriber ? <p className="house-note">{t.shopDiscount}</p> : null}
      </section>
      <section className="house-block">
        <p className="house-cta">
          {has("story") ? <button type="button" className={tab === "story" ? "is-on" : ""} onClick={() => setTab("story")}>{t.shopStory}</button> : null}
          {has("all") ? <button type="button" className={tab === "all" ? "is-on" : ""} onClick={() => setTab("all")}>{t.shopAll}</button> : null}
          {has("special") ? <button type="button" className={tab === "special" ? "is-on" : ""} onClick={() => setTab("special")}>{t.shopSpecial}</button> : null}
          <button type="button" className={tab === "box" ? "is-on" : ""} onClick={() => setTab("box")}>{t.shopBox}</button>
        </p>
        {note ? <p className="house-note">{note}</p> : null}
        {tab === "box" ? <MemoryBox /> : (
          <div className="plan-grid once-grid">
            {shown.map((product) => {
              const owned = mine.includes(product.slug);
              const title = shopText(lang, product).title;
              const desc = shopText(lang, product).desc;
              const pack = product.type === "story_pack" || product.type === "global_pack";
              return (
                <article key={product.slug}>
                  <h2>{title}</h2>
                  <p className="plan-price">{reais(product.price_cents, subscriber)}</p>
                  <p>{desc}</p>
                  {preview === product.slug ? <Preview image={product.preview_image} audio={product.preview_audio} /> : null}
                  <div className="plan-actions">
                    <button type="button" onClick={() => setPreview(preview === product.slug ? "" : product.slug)}>{t.shopPreview}</button>
                    {owned ? <p className="access-pill">{t.shopOwned}</p> : signedIn ? (
                      <button type="button" disabled={!open || pending !== ""} onClick={() => buy(product.slug)}>
                        {pending === product.slug ? t.passWorking : t.shopBuy}
                      </button>
                    ) : <a className="house-primary" href="/conta">{t.shopEnter}</a>}
                    {owned || !pack || !subscriber ? null : (
                      <button type="button" disabled={!open || redeemed || pending !== ""} onClick={() => {
                        setPending(product.slug);
                        void claimMonthPack({ data: { slug: product.slug } })
                          .then((result) => setNote(result.ok ? t.shopOwned : result.reason === "mes" ? t.shopClaimed : t.planFail))
                          .finally(() => { setPending(""); load(); });
                      }}>{redeemed ? t.shopClaimed : t.shopClaim}</button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </StoryShell>
  );
}

export function MemoryBox() {
  const { lang, t } = useHouse();
  const [items, setItems] = useState<Array<{ slug: string; type: string; title_pt: string; title_es: string; enabled: boolean }>>([]);
  useEffect(() => {
    void myBox().then((result) => setItems(result.items)).catch(() => setItems([]));
  }, []);
  if (items.length === 0) return <p>{t.shopLead}</p>;
  return (
    <ul className="once-owned">
      {items.map((item) => (
        <li key={item.slug}>
          <span>{shopText(lang, item).title}</span>
          {item.type === "story_pack" || item.type === "global_pack" ? (
            <button type="button" onClick={() => {
              void setPackEnabled({ data: { slug: item.slug, enabled: !item.enabled } }).then(() => {
                setItems((list) => list.map((row) => row.slug === item.slug ? { ...row, enabled: !row.enabled } : row));
              });
            }}>{item.enabled ? t.shopOn : t.shopOff}</button>
          ) : <span className="access-pill">{t.shopOwned}</span>}
        </li>
      ))}
    </ul>
  );
}

export function StoryExtras({ slug }: { slug: string }) {
  const { lang, t } = useHouse();
  const [products, setProducts] = useState<Product[]>([]);
  const [mine, setMine] = useState<string[]>([]);
  useEffect(() => {
    void shopShelf().then((result) => {
      setProducts((result.products as Product[]).filter((product) => product.story_slug === slug));
      setMine(result.mine);
    }).catch(() => undefined);
  }, [slug]);
  if (products.length === 0) return null;
  return (
    <section className="house-block">
      <h2>{t.shopTitle}</h2>
      <p>{t.shopLead}</p>
      <div className="story-list">
        {products.map((product) => (
          <a key={product.slug} className="story-card" href="/loja">
            <strong>{shopText(lang, product).title}</strong>
            <p>{mine.includes(product.slug) ? t.shopOwned : reais(product.price_cents, false)}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

export function TipBox({ authorSlug, storySlug }: { authorSlug: string; storySlug?: string }) {
  const { lang, t } = useHouse();
  const [amount, setAmount] = useState(500);
  const [custom, setCustom] = useState("");
  const [message, setMessage] = useState("");
  const [note, setNote] = useState("");
  const cents = custom ? Math.round(Number(custom.replace(",", ".")) * 100) : amount;
  return (
    <form className="soon-form" onSubmit={(event) => {
      event.preventDefault();
      if (!Number.isFinite(cents) || cents < 200 || cents > 20000) {
        setNote(t.shopCustom);
        return;
      }
      void leaveTip({ data: { authorSlug, storySlug, amountCents: cents, message, origin: window.location.origin, lang } })
        .then((result) => {
          if (result.ok && result.url) window.location.assign(result.url);
          else setNote(result.reason === "conta" ? t.shopEnter : t.shopSoon);
        })
        .catch(() => setNote(t.planFail));
    }}>
      <p className="soon-kicker">{t.shopTip}</p>
      <p className="house-note">{t.shopTipLead}</p>
      <div className="plan-actions">
        {[300, 500, 1000].map((value) => (
          <button key={value} type="button" onClick={() => { setAmount(value); setCustom(""); }}>{reais(value, false)}</button>
        ))}
      </div>
      <label>
        {t.shopCustom}
        <input inputMode="decimal" value={custom} placeholder="2,00" onChange={(event) => setCustom(event.target.value)} />
      </label>
      <label>
        {t.shopMessage}
        <input maxLength={200} value={message} onChange={(event) => setMessage(event.target.value)} />
      </label>
      {note ? <p className="house-note">{note}</p> : null}
      <button type="submit">{t.shopTip}</button>
    </form>
  );
}

export function MoonCount({ authorSlug }: { authorSlug: string }) {
  const { t } = useHouse();
  const [moons, setMoons] = useState(0);
  useEffect(() => {
    void moonCount({ data: { authorSlug } }).then((result) => setMoons(result.moons)).catch(() => setMoons(0));
  }, [authorSlug]);
  return <p className="house-note">✦ {moons} {t.shopMoons}</p>;
}

export function HiddenPath({ slug }: { slug: string }) {
  const { lang, t } = useHouse();
  const [look, setLook] = useState<{ bonus: boolean; bonusOwned: boolean; bonusSlug: string } | null>(null);
  const [text, setText] = useState("");
  useEffect(() => {
    void storyLook({ data: { slug } }).then(setLook).catch(() => setLook(null));
  }, [slug]);
  if (!look?.bonus) return null;
  return (
    <div className="reader-end">
      <p>{t.shopHidden}</p>
      {look.bonusOwned ? (
        <button type="button" onClick={() => {
          void bonusText({ data: { slug: look.bonusSlug, lang } }).then((result) => {
            if (result.ok) setText(result.text);
          });
        }}>{t.shopUnlock}</button>
      ) : <a href="/loja">{t.shopBuy}</a>}
      {text ? <p>{text}</p> : null}
    </div>
  );
}

export function ShopThanks() {
  const { t } = useHouse();
  const [kind, setKind] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setKind(params.get("tipo") || "");
    const sessionId = params.get("session_id");
    if (sessionId) void confirmShopReturn({ data: { sessionId } }).catch(() => undefined);
  }, []);
  return (
    <StoryShell>
      <section className="house-hero">
        {kind === "lua" ? <p className="moon-rise" aria-hidden="true">🌕</p> : null}
        <h1>{kind === "lua" ? t.shopTipThanks : t.onceDone}</h1>
        <a className="house-primary" href="/loja">{t.navShop}</a>
      </section>
    </StoryShell>
  );
}

export function ShopCancel() {
  const { t } = useHouse();
  return (
    <StoryShell>
      <section className="house-hero">
        <h1>{t.shopCancel}</h1>
        <a href="/loja">{t.navShop}</a>
      </section>
    </StoryShell>
  );
}
