import { createFileRoute } from "@tanstack/react-router";
import { GardenPage } from "@/components/refugio/house-pages";

export const Route = createFileRoute("/jardim")({
  component: GardenPage,
});
