import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/diario")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
