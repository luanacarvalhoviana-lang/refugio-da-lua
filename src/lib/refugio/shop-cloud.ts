import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { BONUS_SCENES } from "@/lib/refugio/shop-bonus";

const OWNERS = new Set(["contato.refugiodalua@gmail.com", "contato@refugiodalua.com.br"]);
const TIP_PRESETS = new Set([300, 500, 1000]);

function shopOpen() {
  if (process.env.SHOP_ENABLED === "false") return false;
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

async function sessionUser() {
  const { getSessionUser } = await import("@/lib/auth/verify.server");
  return getSessionUser();
}

async function sqlOf() {
  const { getSql } = await import("@/lib/db");
  return getSql();
}

function priceFor(cents: number, subscriber: boolean) {
  if (!subscriber) return cents;
  return Math.max(100, Math.round(cents * 0.8));
}

async function isSubscriber(userId: string) {
  const { getUserPlan } = await import("@/lib/refugio/plan-cloud");
  const { hasBenefit } = await import("@/lib/refugio/plan-benefits");
  return hasBenefit(await getUserPlan(userId), "shop_discount");
}

type ProductRow = {
  id: string;
  slug: string;
  type: string;
  story_slug: string | null;
  title_pt: string;
  title_es: string;
  desc_pt: string;
  desc_es: string;
  price_cents: number;
  stripe_price_id: string | null;
  preview_image: string | null;
  preview_audio: string | null;
  active: boolean;
};

export const shopShelf = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await sqlOf();
  const products = await sql.query<ProductRow>(
    `select id, slug, type, story_slug, title_pt, title_es, desc_pt, desc_es, price_cents, preview_image, preview_audio, active
     from products where active = true order by price_cents, title_pt`,
  );
  const user = await sessionUser();
  if (!user?.id) return { open: shopOpen(), subscriber: false, redeemed: false, products, mine: [] as string[] };
  const mine = await sql.query<{ slug: string }>(
    `select p.slug from purchases u join products p on p.id = u.product_id
     where u.user_id = $1 and u.status = 'paid'`,
    [user.id],
  );
  const month = await sql.query<{ n: number }>(
    `select count(*)::int as n from (
       select user_id from monthly_pack_claims where user_id = $1 and month = to_char(now(), 'YYYY-MM')
       union
       select user_id from purchases where user_id = $1 and amount_cents = 0 and status = 'paid' and created_at >= date_trunc('month', now())
     ) claimed`,
    [user.id],
  );
  return {
    open: shopOpen(),
    subscriber: await isSubscriber(user.id),
    redeemed: (Number(month[0]?.n) || 0) > 0,
    products,
    mine: mine.map((row) => row.slug),
  };
});

export const buyProduct = createServerFn({ method: "POST" })
  .validator(z.object({ slug: z.string().trim().min(2).max(48), origin: z.string().url(), lang: z.enum(["pt", "es"]) }))
  .handler(async ({ data }) => {
    if (!shopOpen()) return { ok: false as const, reason: "breve" as const };
    const user = await sessionUser();
    const email = user?.email?.trim().toLowerCase() || "";
    if (!user?.id || !email) return { ok: false as const, reason: "conta" as const };
    const sql = await sqlOf();
    const rows = await sql.query<ProductRow>(`select * from products where slug = $1 and active = true limit 1`, [data.slug]);
    const product = rows[0];
    if (!product) return { ok: false as const, reason: "sumiu" as const };
    const owned = await sql.query<{ id: string }>(
      `select id from purchases where user_id = $1 and product_id = $2 and status = 'paid' limit 1`,
      [user.id, product.id],
    );
    if (owned[0]) return { ok: false as const, reason: "tem" as const };
    const subscriber = await isSubscriber(user.id);
    const coupon = subscriber ? process.env.STRIPE_COUPON_SUBSCRIBER || "" : "";
    const amount = coupon ? product.price_cents : priceFor(product.price_cents, subscriber);
    const { createShopPayment } = await import("./stripe.server");
    const session = await createShopPayment({
      name: data.lang === "es" ? product.title_es : product.title_pt,
      description: data.lang === "es" ? product.desc_es : product.desc_pt,
      amount,
      priceId: product.stripe_price_id,
      email,
      origin: data.origin,
      successPath: "/loja/obrigada?session_id={CHECKOUT_SESSION_ID}",
      cancelPath: "/loja/cancelado",
      lang: data.lang,
      metadata: {
        kind: "product",
        user_id: user.id,
        product_id: product.id,
        email,
        amount_cents: String(amount),
        discounted: !coupon && subscriber ? "1" : "0",
        coupon,
      },
    });
    return { ok: true as const, url: session.url };
  });

export const claimMonthPack = createServerFn({ method: "POST" })
  .validator(z.object({ slug: z.string().trim().min(2).max(48) }))
  .handler(async ({ data }) => {
    if (!shopOpen()) return { ok: false as const, reason: "breve" as const };
    const user = await sessionUser();
    if (!user?.id) return { ok: false as const, reason: "conta" as const };
    if (!(await isSubscriber(user.id))) return { ok: false as const, reason: "plano" as const };
    const sql = await sqlOf();
    const month = await sql.query<{ n: number }>(
      `select count(*)::int as n from (
         select user_id from monthly_pack_claims where user_id = $1 and month = to_char(now(), 'YYYY-MM')
         union
         select user_id from purchases where user_id = $1 and amount_cents = 0 and status = 'paid' and created_at >= date_trunc('month', now())
       ) claimed`,
      [user.id],
    );
    if ((Number(month[0]?.n) || 0) > 0) return { ok: false as const, reason: "mes" as const };
    const rows = await sql.query<{ id: string; type: string }>(
      `select id, type from products where slug = $1 and active = true limit 1`,
      [data.slug],
    );
    const product = rows[0];
    if (!product || (product.type !== "story_pack" && product.type !== "global_pack")) return { ok: false as const, reason: "sumiu" as const };
    const owned = await sql.query<{ id: string }>(
      `select id from purchases where user_id = $1 and product_id = $2 and status = 'paid' limit 1`,
      [user.id, product.id],
    );
    if (owned[0]) return { ok: false as const, reason: "tem" as const };
    await sql.query(
      `insert into purchases (id, user_id, product_id, amount_cents, status, enabled) values ($1, $2, $3, 0, 'paid', true)`,
      [crypto.randomUUID(), user.id, product.id],
    );
    await sql.query(
      `insert into monthly_pack_claims (user_id, month, product_id) values ($1, to_char(now(), 'YYYY-MM'), $2)
       on conflict (user_id, month) do nothing`,
      [user.id, product.id],
    );
    return { ok: true as const };
  });

export const setPackEnabled = createServerFn({ method: "POST" })
  .validator(z.object({ slug: z.string().trim().min(2).max(48), enabled: z.boolean() }))
  .handler(async ({ data }) => {
    const user = await sessionUser();
    if (!user?.id) return { ok: false as const };
    const sql = await sqlOf();
    await sql.query(
      `update purchases u set enabled = $3 from products p
       where u.product_id = p.id and u.user_id = $1 and p.slug = $2 and u.status = 'paid'
       and p.type in ('story_pack', 'global_pack')`,
      [user.id, data.slug, data.enabled],
    );
    return { ok: true as const };
  });

export const myBox = createServerFn({ method: "GET" }).handler(async () => {
  const user = await sessionUser();
  if (!user?.id) return { signedIn: false as const, items: [] as Array<{ slug: string; type: string; title_pt: string; title_es: string; enabled: boolean }> };
  const sql = await sqlOf();
  const items = await sql.query<{ slug: string; type: string; title_pt: string; title_es: string; enabled: boolean }>(
    `select p.slug, p.type, p.title_pt, p.title_es, u.enabled
     from purchases u join products p on p.id = u.product_id
     where u.user_id = $1 and u.status = 'paid' order by u.created_at desc`,
    [user.id],
  );
  return { signedIn: true as const, items };
});

export const storyLook = createServerFn({ method: "POST" })
  .validator(z.object({ slug: z.string().trim().min(2).max(48) }))
  .handler(async ({ data }) => {
    const empty = { image: "", audio: "", bonus: false, bonusOwned: false, bonusSlug: "" };
    const sql = await sqlOf();
    const bonus = await sql.query<{ slug: string }>(
      `select slug from products where type = 'bonus_chapter' and story_slug = $1 and active = true limit 1`,
      [data.slug],
    );
    const user = await sessionUser();
    if (!user?.id) return { ...empty, bonus: Boolean(bonus[0]), bonusSlug: bonus[0]?.slug || "" };
    const rows = await sql.query<{ type: string; story_slug: string | null; preview_image: string | null; preview_audio: string | null; slug: string }>(
      `select p.type, p.story_slug, p.preview_image, p.preview_audio, p.slug
       from purchases u join products p on p.id = u.product_id
       where u.user_id = $1 and u.status = 'paid' and u.enabled = true
       and p.type in ('story_pack', 'global_pack', 'bonus_chapter')
       order by u.created_at desc`,
      [user.id],
    );
    const storyPack = rows.find((row) => row.type === "story_pack" && row.story_slug === data.slug);
    const globalPack = rows.find((row) => row.type === "global_pack");
    const dress = storyPack || globalPack;
    const ownedBonus = rows.some((row) => row.type === "bonus_chapter" && row.slug === bonus[0]?.slug);
    return {
      image: dress?.preview_image || "",
      audio: dress?.preview_audio || "",
      bonus: Boolean(bonus[0]),
      bonusOwned: ownedBonus,
      bonusSlug: bonus[0]?.slug || "",
    };
  });

export const bonusText = createServerFn({ method: "POST" })
  .validator(z.object({ slug: z.string().trim().min(2).max(48), lang: z.enum(["pt", "es"]) }))
  .handler(async ({ data }) => {
    const user = await sessionUser();
    if (!user?.id) return { ok: false as const, reason: "conta" as const };
    const sql = await sqlOf();
    const rows = await sql.query<{ slug: string }>(
      `select p.slug from purchases u join products p on p.id = u.product_id
       where u.user_id = $1 and u.status = 'paid' and p.slug = $2 and p.type = 'bonus_chapter' limit 1`,
      [user.id, data.slug],
    );
    const scene = BONUS_SCENES[data.slug];
    if (!rows[0] || !scene) return { ok: false as const, reason: "plano" as const };
    return { ok: true as const, text: scene[data.lang] };
  });

export const leaveTip = createServerFn({ method: "POST" })
  .validator(z.object({
    authorSlug: z.string().trim().min(2).max(60),
    storySlug: z.string().trim().max(48).optional(),
    amountCents: z.number().int().min(200).max(20000),
    message: z.string().trim().max(200).optional(),
    origin: z.string().url(),
    lang: z.enum(["pt", "es"]),
  }))
  .handler(async ({ data }) => {
    if (!shopOpen()) return { ok: false as const, reason: "breve" as const };
    if (!TIP_PRESETS.has(data.amountCents) && (data.amountCents < 200 || data.amountCents > 20000)) {
      return { ok: false as const, reason: "valor" as const };
    }
    const user = await sessionUser();
    const email = user?.email?.trim().toLowerCase() || "";
    if (!user?.id || !email) return { ok: false as const, reason: "conta" as const };
    const { createShopPayment } = await import("./stripe.server");
    const session = await createShopPayment({
      name: data.lang === "es" ? "Una luna para la autora" : "Uma lua para a autora",
      description: data.lang === "es" ? "Una propina. No abre nada de la historia." : "Uma gorjeta. Não abre nada da história.",
      amount: data.amountCents,
      email,
      origin: data.origin,
      successPath: "/loja/obrigada?tipo=lua&session_id={CHECKOUT_SESSION_ID}",
      cancelPath: "/loja/cancelado",
      lang: data.lang,
      metadata: {
        kind: "tip",
        user_id: user.id,
        author_slug: data.authorSlug,
        story_slug: data.storySlug || "",
        email,
        amount_cents: String(data.amountCents),
        message: data.message || "",
      },
    });
    return { ok: true as const, url: session.url };
  });

export const confirmShopReturn = createServerFn({ method: "POST" })
  .validator(z.object({ sessionId: z.string().min(4) }))
  .handler(async ({ data }) => {
    const { confirmShopSession } = await import("./stripe.server");
    return confirmShopSession(data.sessionId);
  });

export const moonCount = createServerFn({ method: "POST" })
  .validator(z.object({ authorSlug: z.string().trim().min(2).max(60) }))
  .handler(async ({ data }) => {
    const sql = await sqlOf();
    const rows = await sql.query<{ n: number }>(
      `select count(*)::int as n from tips where author_slug = $1 and status = 'paid'`,
      [data.authorSlug],
    );
    return { moons: Number(rows[0]?.n) || 0 };
  });

async function owner() {
  const user = await sessionUser();
  const email = user?.email?.trim().toLowerCase() || "";
  return Boolean(user?.id && OWNERS.has(email));
}

export const adminShop = createServerFn({ method: "GET" }).handler(async () => {
  if (!(await owner())) return { allowed: false as const };
  const sql = await sqlOf();
  const products = await sql.query(`select * from products order by created_at desc`);
  const sales = await sql.query(
    `select p.title_pt, u.amount_cents, u.created_at from purchases u join products p on p.id = u.product_id
     where u.status = 'paid' and u.created_at >= date_trunc('month', now()) order by u.created_at desc limit 40`,
  );
  const tips = await sql.query(
    `select id, author_slug, amount_cents, message, message_status, created_at from tips
     where status = 'paid' order by created_at desc limit 40`,
  );
  const total = await sql.query<{ cents: number }>(
    `select coalesce(sum(amount_cents), 0)::int as cents from (
       select amount_cents from purchases where status = 'paid' and created_at >= date_trunc('month', now())
       union all
       select amount_cents from tips where status = 'paid' and created_at >= date_trunc('month', now())
     ) money`,
  );
  return { allowed: true as const, products, sales, tips, cents: Number(total[0]?.cents) || 0 };
});

export const saveProduct = createServerFn({ method: "POST" })
  .validator(z.object({
    id: z.string().trim().max(40).optional(),
    slug: z.string().trim().min(2).max(48),
    type: z.enum(["story_pack", "global_pack", "special_story", "bonus_chapter"]),
    storySlug: z.string().trim().max(48).optional(),
    titlePt: z.string().trim().min(2).max(80),
    titleEs: z.string().trim().min(2).max(80),
    descPt: z.string().trim().min(2).max(240),
    descEs: z.string().trim().min(2).max(240),
    priceCents: z.number().int().min(100).max(20000),
    stripePriceId: z.string().trim().max(80).optional(),
    image: z.string().trim().max(160).optional(),
    audio: z.string().trim().max(160).optional(),
    active: z.boolean(),
  }))
  .handler(async ({ data }) => {
    if (!(await owner())) return { ok: false as const };
    const sql = await sqlOf();
    const id = data.id || crypto.randomUUID();
    await sql.query(
      `insert into products (id, slug, type, story_slug, title_pt, title_es, desc_pt, desc_es, price_cents, stripe_price_id, preview_image, preview_audio, active)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       on conflict (id) do update set
         slug = excluded.slug, type = excluded.type, story_slug = excluded.story_slug,
         title_pt = excluded.title_pt, title_es = excluded.title_es, desc_pt = excluded.desc_pt, desc_es = excluded.desc_es,
         price_cents = excluded.price_cents, stripe_price_id = excluded.stripe_price_id,
         preview_image = excluded.preview_image, preview_audio = excluded.preview_audio, active = excluded.active`,
      [id, data.slug, data.type, data.storySlug || null, data.titlePt, data.titleEs, data.descPt, data.descEs, data.priceCents, data.stripePriceId || null, data.image || null, data.audio || null, data.active],
    );
    return { ok: true as const };
  });

export const moderateTip = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().min(8), status: z.enum(["visivel", "removida"]) }))
  .handler(async ({ data }) => {
    if (!(await owner())) return { ok: false as const };
    const sql = await sqlOf();
    await sql.query(`update tips set message_status = $2 where id = $1`, [data.id, data.status]);
    return { ok: true as const };
  });
