import { createFileRoute } from "@tanstack/react-router";
import { HomeStories } from "@/components/refugio/home-stories";

export const Route = createFileRoute("/es/")({
  head: () => ({
    meta: [{ title: "Refugio de la Luna — romance y misterio" }],
  }),
  component: () => <HomeStories initialLang="es" />,
});
