import { createFileRoute } from "@tanstack/react-router";
import { RefugioApp } from "@/components/refugio/app";

export const Route = createFileRoute("/conta/recuperar-senha")({
  component: RefugioApp,
});
