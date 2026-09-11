import { createFileRoute } from "@tanstack/react-router";
import { RefugioApp } from "@/components/refugio/app";

export const Route = createFileRoute("/perfil")({
  component: RefugioApp,
});
