import { createFileRoute } from "@tanstack/react-router";
import { StoryPage } from "@/components/refugio/story-reader";

export const Route = createFileRoute("/historia/$slug")({
  component: function Historia() {
    const { slug } = Route.useParams();
    return <StoryPage slug={slug} />;
  },
});
