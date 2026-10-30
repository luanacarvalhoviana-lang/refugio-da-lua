import { createFileRoute } from "@tanstack/react-router";
import { HomeStories } from "@/components/refugio/home-stories";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Refúgio da Lua — romance e mistério" },
      {
        name: "description",
        content: "Cinco histórias entre mulheres: Passageira, Correspondência, Jantar com a Minha Ex, Corredor e Depoimento. Romance e mistério. A escolha é de graça.",
      },
    ],
  }),
  component: () => <HomeStories />,
});
