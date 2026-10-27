import { createFileRoute } from "@tanstack/react-router";
import { HomeStories } from "@/components/refugio/home-stories";

export const Route = createFileRoute("/en/")({
  head: () => ({
    meta: [{ title: "Refúgio da Lua — romance and mystery" }],
  }),
  component: () => <HomeStories initialLang="en" />,
});
