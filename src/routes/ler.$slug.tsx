import { createFileRoute } from "@tanstack/react-router";
import { StoryReader } from "@/components/refugio/story-reader";

export const Route = createFileRoute("/ler/$slug")({
  component: function Ler() {
    const { slug } = Route.useParams();
    return <StoryReader slug={slug} />;
  },
});
