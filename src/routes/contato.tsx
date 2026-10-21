import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/refugio/house-pages";

export const Route = createFileRoute("/contato")({
  component: ContactPage,
});
