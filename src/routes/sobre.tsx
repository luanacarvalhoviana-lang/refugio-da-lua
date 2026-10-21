import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "@/components/refugio/house-pages";

export const Route = createFileRoute("/sobre")({
  component: AboutPage,
});
