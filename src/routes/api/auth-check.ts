import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth-check")({
  server: {
    handlers: {
      GET: () =>
        Response.json({
          hasGoogleId: Boolean(process.env.GOOGLE_CLIENT_ID?.trim()),
          hasGoogleSecret: Boolean(process.env.GOOGLE_CLIENT_SECRET?.trim()),
          hasAuthUrl: Boolean(process.env.BETTER_AUTH_URL?.trim()),
          authHost: process.env.BETTER_AUTH_URL?.trim()
            ? new URL(process.env.BETTER_AUTH_URL).host
            : null,
          hasDb: Boolean(process.env.DATABASE_URL?.trim()),
        }),
    },
  },
});
