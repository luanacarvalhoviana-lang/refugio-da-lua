import { createFileRoute } from "@tanstack/react-router";
import { PlansPage } from "@/components/refugio/house-pages";

export const Route = createFileRoute("/planos")({
  component: PlansPage,
});
