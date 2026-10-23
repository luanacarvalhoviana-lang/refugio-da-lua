import { createFileRoute } from "@tanstack/react-router";
import { ShopCancel } from "@/components/refugio/shop-page";

export const Route = createFileRoute("/loja/cancelado")({
  component: ShopCancel,
});
