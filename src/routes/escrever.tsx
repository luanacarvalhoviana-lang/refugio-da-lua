import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/escrever")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
