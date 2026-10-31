import { createFileRoute } from "@tanstack/react-router";
import { WebtoonsPage } from "@/components/refugio/webtoons-page";

export const Route = createFileRoute("/webtoons")({
  head: () => ({ meta: [{ title: "Webtoons — Refúgio da Lua" }] }),
  component: () => <WebtoonsPage />,
});
