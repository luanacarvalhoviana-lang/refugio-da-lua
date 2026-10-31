import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "@/components/refugio/shop-page";

export const Route = createFileRoute("/es/loja")({
  component: () => <ShopPage initialLang="es" />,
});
