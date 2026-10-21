import { createFileRoute } from "@tanstack/react-router";
import { ThanksPage } from "@/components/refugio/thanks-page";

export const Route = createFileRoute("/es/obrigada")({
  component: () => <ThanksPage pageLang="es" />,
});
