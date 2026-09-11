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

export const readVipSubscription = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.email() }))
  .handler(async ({ data }) => {
    const { findSubscription } = await import("./stripe.server");
    return findSubscription(data.email);
  });
