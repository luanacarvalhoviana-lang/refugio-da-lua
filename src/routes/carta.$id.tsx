import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/carta/$id")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
