import { createFileRoute } from "@tanstack/react-router";
import { HomeStories } from "@/components/refugio/home-stories";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Refúgio da Lua — histórias que acontecem à noite" },
      {
        name: "description",
        content: "Histórias interativas entre mulheres, de romance e mistério. A escolha é sempre de graça.",
      },
    ],
  }),
  component: () => <HomeStories />,
});
