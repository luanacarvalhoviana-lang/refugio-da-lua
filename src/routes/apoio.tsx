import { createFileRoute } from "@tanstack/react-router";
import { HelpPage } from "@/components/refugio/house-pages";

export const Route = createFileRoute("/apoio")({
  component: HelpPage,
});
