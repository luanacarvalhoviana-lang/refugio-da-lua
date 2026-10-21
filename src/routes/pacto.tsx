import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/pacto")({
  beforeLoad: () => {
    throw redirect({ to: "/regras" });
  },
});
