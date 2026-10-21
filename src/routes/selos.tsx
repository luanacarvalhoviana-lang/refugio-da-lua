import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/selos")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
