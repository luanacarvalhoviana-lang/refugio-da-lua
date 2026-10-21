import { createFileRoute } from "@tanstack/react-router";
import { SoonPage } from "@/components/refugio/soon-page";

export const Route = createFileRoute("/es")({
  head: () => ({
    meta: [
      { title: "Refúgio da Lua — historias que ocurren de noche" },
      {
        name: "description",
        content: "Historias interactivas sáficas de romance y misterio, en portugués y español. La elección siempre es gratis.",
      },
    ],
  }),
  component: () => <SoonPage pageLang="es" />,
});
