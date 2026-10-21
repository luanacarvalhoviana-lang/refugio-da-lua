import { createFileRoute } from "@tanstack/react-router";
import { HomeStories } from "@/components/refugio/home-stories";

export const Route = createFileRoute("/es")({
  component: () => <HomeStories initialLang="es" />,
});
