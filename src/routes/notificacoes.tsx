import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/notificacoes")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
