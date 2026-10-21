import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding/perfil")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
