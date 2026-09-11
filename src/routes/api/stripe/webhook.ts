import { createFileRoute } from "@tanstack/react-router";
import { handleStripeWebhook } from "@/lib/refugio/stripe.server";

export const Route = createFileRoute("/api/stripe/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawBody = await request.text();
        const signature = request.headers.get("stripe-signature");
        try {
          const result = await handleStripeWebhook(rawBody, signature);
          return Response.json(result);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Webhook recusado.";
          const status = message.includes("inválida") ? 400 : 500;
          return Response.json({ error: message }, { status });
        }
      },
    },
  },
});
