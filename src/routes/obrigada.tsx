import { createFileRoute } from "@tanstack/react-router";
import { ThanksPage } from "@/components/refugio/thanks-page";

export const Route = createFileRoute("/obrigada")({
  component: () => <ThanksPage pageLang="pt" />,
});
