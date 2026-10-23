import { createHmac, timingSafeEqual } from "node:crypto";
import { getSql } from "@/lib/db";
import { vipPlanCatalog, type VipPlanKey, type VipSubscriptionStatus } from "@/lib/refugio/vip";
import { STORY_PLANS, onceKey, type OnceKey, type StoryInterval, type StoryPlanKey, withinRefundWindow, ONCE_ITEMS } from "@/lib/refugio/story-plans";

const STRIPE_API = "https://api.stripe.com/v1";

type StripeSession = {
  id?: string;
  url?: string;
  error?: { message?: string };
  payment_status?: string;
  status?: string;
  metadata?: Record<string, string>;
  customer_email?: string | null;
  customer_details?: { email?: string | null };
  customer?: string | { id?: string };
  subscription?: string | { id?: string };
};

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function isStripeWebhookConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
}

function secret() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe ainda não está configurado neste host.");
  return key;
}

async function stripeSend(method: "GET" | "POST" | "DELETE", path: string, body?: Record<string, string>) {
  const response = await fetch(`${STRIPE_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${secret()}`,
      ...(body ? { "Content-Type": "application/x-www-form-urlencoded" } : {}),
    },
    body: body ? new URLSearchParams(body) : undefined,
  });
  const data = (await response.json()) as Record<string, any>;
  if (!response.ok) throw new Error(data.error?.message || "O Stripe não concluiu o pedido.");
  return data;
}

async function stripeForm(path: string, body: Record<string, string>) {
  return stripeSend("POST", path, body);
}

async function stripeGet(path: string) {
  return stripeSend("GET", path);
}

function idOf(value: string | { id?: string } | null | undefined) {
  if (!value) return "";
  return typeof value === "string" ? value : value.id || "";
}

function mapStatus(raw: string | undefined): VipSubscriptionStatus {
  if (raw === "trialing") return "trialing";
  if (raw === "past_due") return "past_due";
  if (raw === "canceled" || raw === "cancelled") return "canceled";
  if (raw === "unpaid") return "unpaid";
  if (raw === "paused") return "paused";
  if (raw === "incomplete") return "incomplete";
  if (raw === "incomplete_expired") return "incomplete_expired";
  return "active";
}

export async function upsertSubscription(row: {
  email: string;
  plan: VipPlanKey;
  status: VipSubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}) {
  const email = row.email.trim().toLowerCase();
  if (!email) return;
  const sql = await getSql();
  await sql.query(
    `insert into vip_subscriptions (email, plan, status, stripe_customer_id, stripe_subscription_id, updated_at)
     values ($1, $2, $3, $4, $5, now())
     on conflict (email) do update set
       plan = excluded.plan,
       status = excluded.status,
       stripe_customer_id = coalesce(excluded.stripe_customer_id, vip_subscriptions.stripe_customer_id),
       stripe_subscription_id = coalesce(excluded.stripe_subscription_id, vip_subscriptions.stripe_subscription_id),
       updated_at = now()`,
    [email, row.plan, row.status, row.stripeCustomerId || null, row.stripeSubscriptionId || null],
  );
}

export async function findSubscription(email: string) {
  const sql = await getSql();
  const rows = await sql.query<{
    email: string;
    plan: string;
    status: string;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
  }>("select email, plan, status, stripe_customer_id, stripe_subscription_id from vip_subscriptions where email = $1", [
    email.trim().toLowerCase(),
  ]);
  return rows[0] ?? null;
}

export async function createCheckoutSession(input: {
  plan: VipPlanKey;
  email: string;
  name?: string;
  origin: string;
}) {
  return openCheckout(input);
}

async function openCheckout(input: {
  plan: VipPlanKey;
  email: string;
  name?: string;
  origin: string;
}) {
  const details = vipPlanCatalog[input.plan];
  const priceId =
    input.plan === "annual" ? process.env.STRIPE_PRICE_ANNUAL : process.env.STRIPE_PRICE_MONTHLY;
  const success = `${input.origin}/planos?checkout=success&session_id={CHECKOUT_SESSION_ID}`;
  const cancel = `${input.origin}/planos?checkout=cancelled`;
  const body: Record<string, string> = {
    mode: "subscription",
    success_url: success,
    cancel_url: cancel,
    customer_email: input.email,
    "metadata[plan]": input.plan,
    "metadata[email]": input.email,
    locale: "pt-BR",
    "line_items[0][quantity]": "1",
    "payment_method_types[0]": "card",
    "subscription_data[metadata][plan]": input.plan,
    "subscription_data[metadata][email]": input.email,
  };
  if (input.name) body["metadata[name]"] = input.name;
  if (priceId) {
    body["line_items[0][price]"] = priceId;
  } else {
    body["line_items[0][price_data][currency]"] = "brl";
    body["line_items[0][price_data][unit_amount]"] = String(details.unitAmount);
    body["line_items[0][price_data][product_data][name]"] = details.stripeName;
    body["line_items[0][price_data][product_data][description]"] = details.description;
    body["line_items[0][price_data][recurring][interval]"] = details.interval;
  }
  const session = await stripeForm("/checkout/sessions", body);
  if (!session.url) throw new Error("O Stripe não devolveu a página de pagamento.");
  return { url: session.url, id: session.id };
}

export async function confirmCheckoutSession(sessionId: string) {
  const session = await stripeGet(`/checkout/sessions/${encodeURIComponent(sessionId)}`);
  const paid = session.payment_status === "paid" || session.status === "complete";
  const plan = session.metadata?.plan === "annual" ? "annual" : session.metadata?.plan === "monthly" ? "monthly" : null;
  const email = (session.customer_details?.email || session.customer_email || session.metadata?.email || "").toLowerCase();
  if (paid && plan && email) {
    await upsertSubscription({
      email,
      plan,
      status: "active",
      stripeCustomerId: idOf(session.customer),
      stripeSubscriptionId: idOf(session.subscription),
    });
  }
  return { paid, plan, email };
}

function storyPlanOf(value: string | undefined): StoryPlanKey | null {
  return value === "lua_cheia" || value === "constelacao" ? value : null;
}

function storyIntervalOf(value: string | undefined): StoryInterval {
  return value === "year" ? "year" : "month";
}

export async function grantStoryPass(row: {
  userId: string;
  email: string;
  plan: StoryPlanKey;
  intervalo: StoryInterval;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}) {
  if (!row.userId) return;
  const sql = await getSql();
  await sql.query(
    `insert into story_passes
       (user_id, plan, status, intervalo, email, stripe_customer_id, stripe_subscription_id, started_at, cancel_at)
     values ($1, $2, 'active', $3, $4, $5, $6, now(), null)
     on conflict (user_id) do update set
       plan = excluded.plan,
       status = 'active',
       intervalo = excluded.intervalo,
       email = excluded.email,
       stripe_customer_id = coalesce(excluded.stripe_customer_id, story_passes.stripe_customer_id),
       stripe_subscription_id = coalesce(excluded.stripe_subscription_id, story_passes.stripe_subscription_id),
       started_at = case when story_passes.status = 'active' then story_passes.started_at else now() end,
       cancel_at = null`,
    [
      row.userId,
      row.plan,
      row.intervalo,
      row.email || null,
      row.stripeCustomerId || null,
      row.stripeSubscriptionId || null,
    ],
  );
}

export async function createStoryCheckout(input: {
  plan: StoryPlanKey;
  interval: StoryInterval;
  email: string;
  userId: string;
  origin: string;
}) {
  const details = STORY_PLANS[input.plan];
  const amount = input.interval === "year" ? details.year : details.month;
  const envKey = input.plan === "lua_cheia"
    ? input.interval === "year" ? "STRIPE_PRICE_CHEIA_YEAR" : "STRIPE_PRICE_CHEIA_MONTH"
    : input.interval === "year" ? "STRIPE_PRICE_STAR_YEAR" : "STRIPE_PRICE_STAR_MONTH";
  const priceId = process.env[envKey];
  const body: Record<string, string> = {
    mode: "subscription",
    success_url: `${input.origin}/planos?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${input.origin}/planos?checkout=cancelled`,
    customer_email: input.email,
    locale: "pt-BR",
    "line_items[0][quantity]": "1",
    "payment_method_types[0]": "card",
    "metadata[kind]": "story",
    "metadata[plan]": input.plan,
    "metadata[interval]": input.interval,
    "metadata[user_id]": input.userId,
    "metadata[email]": input.email,
    "subscription_data[metadata][kind]": "story",
    "subscription_data[metadata][plan]": input.plan,
    "subscription_data[metadata][interval]": input.interval,
    "subscription_data[metadata][user_id]": input.userId,
    "subscription_data[metadata][email]": input.email,
  };
  if (priceId) {
    body["line_items[0][price]"] = priceId;
  } else {
    body["line_items[0][price_data][currency]"] = "brl";
    body["line_items[0][price_data][unit_amount]"] = String(amount);
    body["line_items[0][price_data][product_data][name]"] = `Refúgio da Lua — ${details.name}`;
    body["line_items[0][price_data][product_data][description]"] = "Assinatura em real. Cancela quando quiser. 7 dias para o dinheiro voltar.";
    body["line_items[0][price_data][recurring][interval]"] = input.interval;
  }
  const session = await stripeForm("/checkout/sessions", body);
  if (!session.url) throw new Error("O Stripe não devolveu a página de pagamento.");
  return { url: session.url, id: session.id };
}

export async function confirmStoryCheckout(sessionId: string) {
  const session = await stripeGet(`/checkout/sessions/${encodeURIComponent(sessionId)}`);
  const metadata = session.metadata ?? {};
  const paid = session.payment_status === "paid" || session.status === "complete";
  const plan = storyPlanOf(metadata.plan);
  const userId = metadata.user_id || "";
  if (metadata.kind === "once") {
    const item = onceKey(metadata.item);
    if (session.payment_status === "paid" && item && userId) {
      await grantOncePurchase({
        userId,
        email: (session.customer_details?.email || session.customer_email || metadata.email || "").toLowerCase(),
        item,
        sessionId,
      });
      return { paid: true, plan: null, item };
    }
    return { paid: false, plan: null, item };
  }
  if (metadata.kind === "story" && paid && plan && userId) {
    await grantStoryPass({
      userId,
      email: (session.customer_details?.email || session.customer_email || metadata.email || "").toLowerCase(),
      plan,
      intervalo: storyIntervalOf(metadata.interval),
      stripeCustomerId: idOf(session.customer),
      stripeSubscriptionId: idOf(session.subscription),
    });
  }
  return { paid: Boolean(paid && plan), plan, item: null as string | null };
}

export async function grantOncePurchase(row: { userId: string; email: string; item: OnceKey; sessionId: string }) {
  if (!row.userId || !row.sessionId) return;
  const sql = await getSql();
  await sql.query(
    `insert into story_purchases (id, user_id, item, amount, status, stripe_session_id, email)
     values ($1, $2, $3, $4, 'paid', $5, $6)
     on conflict (stripe_session_id) do nothing`,
    [crypto.randomUUID(), row.userId, row.item, ONCE_ITEMS[row.item].amount, row.sessionId, row.email || null],
  );
}

export async function createOnceCheckout(input: {
  item: OnceKey;
  email: string;
  userId: string;
  origin: string;
  lang: "pt" | "es";
}) {
  const details = ONCE_ITEMS[input.item];
  const sql = await getSql();
  if (input.item !== "gorjeta") {
    const owned = await sql.query<{ id: string }>(
      `select id from story_purchases where user_id = $1 and item = $2 and status = 'paid' limit 1`,
      [input.userId, input.item],
    );
    if (owned[0]) return { ok: false as const, reason: "tem" as const };
  }
  const body: Record<string, string> = {
    mode: "payment",
    success_url: `${input.origin}/planos?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${input.origin}/planos?checkout=cancelled`,
    customer_email: input.email,
    locale: input.lang === "es" ? "es" : "pt-BR",
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "brl",
    "line_items[0][price_data][unit_amount]": String(details.amount),
    "line_items[0][price_data][product_data][name]": `Refúgio da Lua — ${details.name}`,
    "line_items[0][price_data][product_data][description]": "Compra única em real. Cartão ou Pix. 7 dias para o dinheiro voltar.",
    "metadata[kind]": "once",
    "metadata[item]": input.item,
    "metadata[user_id]": input.userId,
    "metadata[email]": input.email,
    "payment_intent_data[metadata][kind]": "once",
    "payment_intent_data[metadata][item]": input.item,
    "payment_intent_data[metadata][user_id]": input.userId,
  };
  let session: { url?: string };
  try {
    session = await stripeForm("/checkout/sessions", { ...body, "payment_method_types[0]": "card", "payment_method_types[1]": "pix" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (!/pix/i.test(message)) throw error;
    session = await stripeForm("/checkout/sessions", { ...body, "payment_method_types[0]": "card" });
  }
  if (!session.url) throw new Error("O Stripe não devolveu a página de pagamento.");
  return { ok: true as const, url: session.url };
}

export async function listOncePurchases(userId: string) {
  const sql = await getSql();
  return sql.query<{ id: string; item: string; amount: number; criado_em: string | Date }>(
    `select id, item, amount, criado_em from story_purchases
     where user_id = $1 and status = 'paid' order by criado_em desc limit 20`,
    [userId],
  );
}

export async function refundOncePurchase(userId: string, purchaseId: string) {
  const sql = await getSql();
  const rows = await sql.query<{ id: string; criado_em: string | Date; stripe_session_id: string | null }>(
    `select id, criado_em, stripe_session_id from story_purchases
     where id = $1 and user_id = $2 and status = 'paid' limit 1`,
    [purchaseId, userId],
  );
  const row = rows[0];
  if (!row?.stripe_session_id) return { ok: false as const, reason: "sem" as const };
  if (!withinRefundWindow(row.criado_em)) return { ok: false as const, reason: "prazo" as const };
  const session = await stripeGet(`/checkout/sessions/${encodeURIComponent(row.stripe_session_id)}`);
  const payment = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || "";
  if (!payment) return { ok: false as const, reason: "stripe" as const };
  await stripeForm("/refunds", { payment_intent: payment });
  await sql.query(`update story_purchases set status = 'refunded' where id = $1`, [row.id]);
  return { ok: true as const };
}

type PassRow = {
  plan: string;
  status: string;
  intervalo: string | null;
  started_at: string | Date;
  cancel_at: string | Date | null;
  stripe_subscription_id: string | null;
};

async function passOf(userId: string) {
  const sql = await getSql();
  const rows = await sql.query<PassRow>(
    `select plan, status, intervalo, started_at, cancel_at, stripe_subscription_id
     from story_passes where user_id = $1 limit 1`,
    [userId],
  );
  return rows[0] ?? null;
}

export async function readStoryPassRow(userId: string) {
  const row = await passOf(userId);
  if (!row || row.status !== "active") return null;
  if (row.cancel_at && new Date(row.cancel_at).getTime() <= Date.now()) return null;
  return {
    plan: row.plan,
    intervalo: row.intervalo,
    cancelAt: row.cancel_at,
    refundable: withinRefundWindow(row.started_at) && Boolean(row.stripe_subscription_id) && !row.cancel_at,
  };
}

export async function cancelStoryRenewal(userId: string) {
  const row = await passOf(userId);
  if (!row || row.status !== "active" || !row.stripe_subscription_id) return { ok: false as const, reason: "sem" as const };
  const sub = await stripeSend("POST", `/subscriptions/${encodeURIComponent(row.stripe_subscription_id)}`, {
    cancel_at_period_end: "true",
  });
  const end = typeof sub.current_period_end === "number" ? new Date(sub.current_period_end * 1000) : null;
  const sql = await getSql();
  await sql.query(`update story_passes set cancel_at = $2 where user_id = $1`, [userId, end]);
  return { ok: true as const, cancelAt: end?.toISOString() ?? null };
}

export async function refundStoryPass(userId: string) {
  const row = await passOf(userId);
  if (!row || row.status !== "active" || !row.stripe_subscription_id) return { ok: false as const, reason: "sem" as const };
  if (!withinRefundWindow(row.started_at)) return { ok: false as const, reason: "prazo" as const };
  const sub = await stripeGet(`/subscriptions/${encodeURIComponent(row.stripe_subscription_id)}`);
  const invoiceId = typeof sub.latest_invoice === "string" ? sub.latest_invoice : idOf(sub.latest_invoice as { id?: string });
  const invoice = invoiceId ? await stripeGet(`/invoices/${encodeURIComponent(invoiceId)}?expand[]=payments`) : null;
  const paymentField = invoice?.payment_intent;
  const nested = invoice?.payments?.data?.[0]?.payment?.payment_intent;
  const payment = typeof paymentField === "string" ? paymentField : paymentField?.id || (typeof nested === "string" ? nested : nested?.id) || "";
  const chargeField = invoice?.charge;
  const charge = typeof chargeField === "string" ? chargeField : chargeField?.id || "";
  if (payment) await stripeForm("/refunds", { payment_intent: payment });
  else if (charge) await stripeForm("/refunds", { charge });
  else return { ok: false as const, reason: "stripe" as const };
  await stripeSend("DELETE", `/subscriptions/${encodeURIComponent(row.stripe_subscription_id)}`);
  const sql = await getSql();
  await sql.query(`update story_passes set status = 'refunded', cancel_at = now() where user_id = $1`, [userId]);
  return { ok: true as const };
}

function verifyStripeSignature(payload: string, header: string, secretValue: string) {
  const stamp = header
    .split(",")
    .map((part) => part.trim().split("="))
    .reduce<Record<string, string[]>>((acc, [key, value]) => {
      if (!key || !value) return acc;
      acc[key] = [...(acc[key] || []), value];
      return acc;
    }, {});
  const timestamp = stamp.t?.[0];
  const signatures = stamp.v1 || [];
  if (!timestamp || signatures.length === 0) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const expected = createHmac("sha256", secretValue).update(`${timestamp}.${payload}`).digest("hex");
  const expectedBuf = Buffer.from(expected, "utf8");
  return signatures.some((signature) => {
    const got = Buffer.from(signature, "utf8");
    return got.length === expectedBuf.length && timingSafeEqual(got, expectedBuf);
  });
}

export async function handleStripeWebhook(rawBody: string, signature: string | null) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET ausente.");
  if (!signature || !verifyStripeSignature(rawBody, signature, webhookSecret)) {
    throw new Error("Assinatura do webhook inválida.");
  }
  const event = JSON.parse(rawBody) as {
    type?: string;
    data?: { object?: Record<string, unknown> };
  };
  const object = event.data?.object ?? {};
  const type = event.type || "";
  if (type === "checkout.session.completed" || type === "checkout.session.async_payment_succeeded") {
    const metadata = (object.metadata as Record<string, string> | undefined) ?? {};
    const item = onceKey(metadata.item);
    if (metadata.kind === "once") {
      if (object.payment_status === "paid" && item && metadata.user_id && typeof object.id === "string") {
        await grantOncePurchase({
          userId: metadata.user_id,
          email: String(
            (object.customer_details as { email?: string } | undefined)?.email || object.customer_email || metadata.email || "",
          ).toLowerCase(),
          item,
          sessionId: object.id,
        });
      }
      if (type === "checkout.session.async_payment_succeeded" || metadata.kind === "once") return { ok: true, type };
    }
  }

  if (type === "checkout.session.completed") {
    const metadata = (object.metadata as Record<string, string> | undefined) ?? {};
    if (metadata.kind === "story") {
      const plan = storyPlanOf(metadata.plan);
      if (plan && metadata.user_id) {
        await grantStoryPass({
          userId: metadata.user_id,
          email: String(
            (object.customer_details as { email?: string } | undefined)?.email || object.customer_email || metadata.email || "",
          ).toLowerCase(),
          plan,
          intervalo: storyIntervalOf(metadata.interval),
          stripeCustomerId: idOf(object.customer as string | { id?: string }),
          stripeSubscriptionId: idOf(object.subscription as string | { id?: string }),
        });
      }
      return { ok: true, type };
    }
    const plan = metadata.plan === "annual" ? "annual" : metadata.plan === "monthly" ? "monthly" : null;
    const email = String(
      (object.customer_details as { email?: string } | undefined)?.email ||
        object.customer_email ||
        metadata.email ||
        "",
    ).toLowerCase();
    if (plan && email) {
      await upsertSubscription({
        email,
        plan,
        status: "active",
        stripeCustomerId: idOf(object.customer as string | { id?: string }),
        stripeSubscriptionId: idOf(object.subscription as string | { id?: string }),
      });
    }
    return { ok: true, type };
  }

  if (type === "customer.subscription.updated" || type === "customer.subscription.deleted" || type === "invoice.paid") {
    const metadata = (object.metadata as Record<string, string> | undefined) ?? {};
    const nested = (object.subscription as Record<string, unknown> | undefined)?.metadata as Record<string, string> | undefined;
    if (metadata.kind === "story" || nested?.kind === "story") {
      const userId = metadata.user_id || nested?.user_id || "";
      const ending = type === "customer.subscription.deleted" || object.status === "canceled" || object.status === "unpaid";
      if (userId) {
        const sql = await getSql();
        if (ending) {
          await sql.query(`update story_passes set status = 'canceled', cancel_at = coalesce(cancel_at, now()) where user_id = $1 and status = 'active'`, [userId]);
        } else if (object.cancel_at_period_end && typeof object.current_period_end === "number") {
          await sql.query(`update story_passes set cancel_at = $2 where user_id = $1 and status = 'active'`, [
            userId,
            new Date(object.current_period_end * 1000),
          ]);
        }
      }
      return { ok: true, type };
    }
    const planRaw = metadata.plan || nested?.plan;
    const plan = planRaw === "annual" ? "annual" : planRaw === "monthly" ? "monthly" : null;
    const email = String(metadata.email || nested?.email || "").toLowerCase();
    const status = mapStatus(String(object.status || (type === "customer.subscription.deleted" ? "canceled" : "active")));
    if (email && (plan || type === "customer.subscription.deleted")) {
      const existing = await findSubscription(email);
      await upsertSubscription({
        email,
        plan: (plan || existing?.plan || "monthly") as VipPlanKey,
        status: type === "customer.subscription.deleted" ? "canceled" : status,
        stripeCustomerId: idOf(object.customer as string | { id?: string }),
        stripeSubscriptionId: idOf(object.id as string | { id?: string }) || idOf(object.subscription as string | { id?: string }),
      });
    }
    return { ok: true, type };
  }

  return { ok: true, type: type || "ignored" };
}
