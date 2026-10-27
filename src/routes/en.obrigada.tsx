import { createFileRoute } from "@tanstack/react-router";
import { ThanksPage } from "@/components/refugio/thanks-page";

export const Route = createFileRoute("/en/obrigada")({
  component: () => <ThanksPage pageLang="en" />,
});
