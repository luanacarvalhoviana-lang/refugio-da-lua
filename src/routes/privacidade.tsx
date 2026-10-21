import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "@/components/refugio/house-pages";

export const Route = createFileRoute("/privacidade")({
  component: PrivacyPage,
});
