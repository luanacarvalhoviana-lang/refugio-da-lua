import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "@/components/refugio/shop-page";

export const Route = createFileRoute("/en/loja")({
  component: () => <ShopPage initialLang="en" />,
});
