import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/escrever/confirmacao")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
