import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { VipPlanKey } from "@/lib/refugio/vip";

export const stripeIsReady = createServerFn({ method: "POST" }).handler(async () => {
  const { isStripeConfigured } = await import("./stripe.server");
  return isStripeConfigured();
});

export const startStripeCheckout = createServerFn({ method: "POST" })
  .validator(
    z.object({
      plan: z.enum(["monthly", "annual"]),
      email: z.email(),
      name: z.string().optional(),
      origin: z.string().url(),
    }),
  )
  .handler(async ({ data }) => {
    const { createCheckoutSession } = await import("./stripe.server");
    return createCheckoutSession({
      plan: data.plan as VipPlanKey,
      email: data.email,
      name: data.name,
      origin: data.origin,
    });
  });

export const confirmStripeCheckout = createServerFn({ method: "POST" })
  .validator(z.object({ sessionId: z.string().min(4) }))
  .handler(async ({ data }) => {
    const { confirmCheckoutSession } = await import("./stripe.server");
    return confirmCheckoutSession(data.sessionId);
  });

export const storyCheckoutReady = createServerFn({ method: "GET" }).handler(async () => {
  const { isStripeConfigured } = await import("./stripe.server");
  const { storyBillingLocks } = await import("./studio-limits");
  return { ready: isStripeConfigured(), locks: storyBillingLocks() };
});

export const startStoryCheckout = createServerFn({ method: "POST" })
  .validator(
    z.object({
      plan: z.enum(["lua_cheia", "constelacao"]),
      interval: z.enum(["month", "year"]),
      origin: z.string().url(),
    }),
  )
  .handler(async ({ data }) => {
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const user = await getSessionUser();
    const email = user?.email?.trim().toLowerCase() || "";
    if (!user?.id || !email) return { ok: false as const, reason: "conta" as const };
    const { isStripeConfigured, createStoryCheckout } = await import("./stripe.server");
    if (!isStripeConfigured()) return { ok: false as const, reason: "stripe" as const };
    const session = await createStoryCheckout({
      plan: data.plan,
      interval: data.interval,
      email,
      userId: user.id,
      origin: data.origin,
    });
    return { ok: true as const, url: session.url };
  });

export const confirmStoryCheckout = createServerFn({ method: "POST" })
  .validator(z.object({ sessionId: z.string().min(4) }))
  .handler(async ({ data }) => {
    const { confirmStoryCheckout: confirm } = await import("./stripe.server");
    return confirm(data.sessionId);
  });

export const readStoryPass = createServerFn({ method: "GET" }).handler(async () => {
  const { getSessionUser } = await import("@/lib/auth/verify.server");
  const user = await getSessionUser();
  if (!user?.id) return { signedIn: false as const, pass: null };
  const { readStoryPassRow } = await import("./stripe.server");
  return { signedIn: true as const, pass: await readStoryPassRow(user.id) };
});

export const cancelStoryPlan = createServerFn({ method: "POST" })
  .validator(z.object({}))
  .handler(async () => {
  const { getSessionUser } = await import("@/lib/auth/verify.server");
  const user = await getSessionUser();
  if (!user?.id) return { ok: false as const, reason: "conta" as const };
  const { cancelStoryRenewal } = await import("./stripe.server");
  return cancelStoryRenewal(user.id);
});

export const refundStoryPlan = createServerFn({ method: "POST" })
  .validator(z.object({}))
  .handler(async () => {
  const { getSessionUser } = await import("@/lib/auth/verify.server");
  const user = await getSessionUser();
  if (!user?.id) return { ok: false as const, reason: "conta" as const };
  const { refundStoryPass } = await import("./stripe.server");
  return refundStoryPass(user.id);
});

export const startOnceCheckout = createServerFn({ method: "POST" })
  .validator(
    z.object({
      item: z.enum(["pack-noite", "a-lampada", "antes-da-lua", "gorjeta"]),
      origin: z.string().url(),
      lang: z.enum(["pt", "es"]),
    }),
  )
  .handler(async ({ data }) => {
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const user = await getSessionUser();
    const email = user?.email?.trim().toLowerCase() || "";
    if (!user?.id || !email) return { ok: false as const, reason: "conta" as const };
    const { isStripeConfigured, createOnceCheckout } = await import("./stripe.server");
    if (!isStripeConfigured()) return { ok: false as const, reason: "stripe" as const };
    return createOnceCheckout({ item: data.item, email, userId: user.id, origin: data.origin, lang: data.lang });
  });

export const readOncePurchases = createServerFn({ method: "GET" }).handler(async () => {
  const { getSessionUser } = await import("@/lib/auth/verify.server");
  const user = await getSessionUser();
  if (!user?.id) return { signedIn: false as const, items: [] as { id: string; item: string; amount: number; criado_em: string | Date }[] };
  const { listOncePurchases } = await import("./stripe.server");
  return { signedIn: true as const, items: await listOncePurchases(user.id) };
});

export const refundOnceBuy = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().min(8) }))
  .handler(async ({ data }) => {
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const user = await getSessionUser();
    if (!user?.id) return { ok: false as const, reason: "conta" as const };
    const { refundOncePurchase } = await import("./stripe.server");
    return refundOncePurchase(user.id, data.id);
  });

export const readVipSubscription = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.email() }))
  .handler(async ({ data }) => {
    const { findSubscription } = await import("./stripe.server");
    return findSubscription(data.email);
  });
