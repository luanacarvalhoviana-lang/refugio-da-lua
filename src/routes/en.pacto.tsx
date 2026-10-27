import { createFileRoute } from "@tanstack/react-router";
import { PactPage } from "@/components/refugio/pacto-page";

export const Route = createFileRoute("/en/pacto")({
  component: () => <PactPage initialLang="en" />,
});
