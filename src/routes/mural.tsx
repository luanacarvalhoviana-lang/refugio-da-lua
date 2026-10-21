import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/mural")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
