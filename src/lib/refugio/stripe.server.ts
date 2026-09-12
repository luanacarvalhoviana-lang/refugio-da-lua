import { createHmac, timingSafeEqual } from "node:crypto";
import { getSql } from "@/lib/db";
import { vipPlanCatalog, type VipPlanKey, type VipSubscriptionStatus } from "@/lib/refugio/vip";

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

async function stripeForm(path: string, body: Record<string, string>) {
  const response = await fetch(`${STRIPE_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body),
  });
  const data = (await response.json()) as StripeSession;
  if (!response.ok) throw new Error(data.error?.message || "O Stripe não conseguiu abrir o pagamento.");
  return data;
}

async function stripeGet(path: string) {
  const response = await fetch(`${STRIPE_API}${path}`, {
    headers: { Authorization: `Bearer ${secret()}` },
  });
  const data = (await response.json()) as StripeSession;
  if (!response.ok) throw new Error(data.error?.message || "Não foi possível confirmar o pagamento.");
  return data;
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

  if (type === "checkout.session.completed") {
    const metadata = (object.metadata as Record<string, string> | undefined) ?? {};
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
