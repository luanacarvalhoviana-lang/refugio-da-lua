import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/memorias")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
