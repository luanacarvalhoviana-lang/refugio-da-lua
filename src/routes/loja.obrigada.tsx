import { createFileRoute } from "@tanstack/react-router";
import { ShopThanks } from "@/components/refugio/shop-page";

export const Route = createFileRoute("/loja/obrigada")({
  component: ShopThanks,
});
