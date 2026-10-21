import { createFileRoute } from "@tanstack/react-router";
import { SoonPage } from "@/components/refugio/soon-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Refúgio da Lua — histórias que acontecem à noite" },
      {
        name: "description",
        content: "Histórias interativas sáficas de romance e mistério, em português e espanhol. A escolha é sempre de graça.",
      },
    ],
  }),
  component: () => <SoonPage pageLang="pt" />,
});
