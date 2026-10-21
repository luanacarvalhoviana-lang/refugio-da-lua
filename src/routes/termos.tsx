import { createFileRoute } from "@tanstack/react-router";
import { TermsPage } from "@/components/refugio/house-pages";

export const Route = createFileRoute("/termos")({
  component: TermsPage,
});
