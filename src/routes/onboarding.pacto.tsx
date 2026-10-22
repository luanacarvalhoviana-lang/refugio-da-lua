import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding/pacto")({
  beforeLoad: () => {
    throw redirect({ to: "/pacto" });
  },
});
