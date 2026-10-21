import { createFileRoute } from "@tanstack/react-router";
import { StoryList } from "@/components/refugio/story-reader";

export const Route = createFileRoute("/historias")({
  component: StoryList,
});
