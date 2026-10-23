import { createFileRoute } from "@tanstack/react-router";
import { ShopPage } from "@/components/refugio/shop-page";

export const Route = createFileRoute("/loja")({
  component: ShopPage,
});
