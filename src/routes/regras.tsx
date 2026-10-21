import { createFileRoute } from "@tanstack/react-router";
import { RulesPage } from "@/components/refugio/house-pages";

export const Route = createFileRoute("/regras")({
  component: RulesPage,
});
