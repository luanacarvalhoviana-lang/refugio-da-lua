import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/cuidar")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
