import { createFileRoute } from "@tanstack/react-router";
import { PactGuard } from "@/components/refugio/pact-guard";
import { StoryReader } from "@/components/refugio/story-reader";

export const Route = createFileRoute("/ler/$slug")({
  component: function Ler() {
    const { slug } = Route.useParams();
    return (
      <PactGuard>
        <StoryReader slug={slug} />
      </PactGuard>
    );
  },
});
