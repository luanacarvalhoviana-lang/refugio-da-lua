import { createFileRoute } from "@tanstack/react-router";
import { AuthorPage } from "@/components/refugio/author-page";

export const Route = createFileRoute("/autora/$slug")({
  component: function Autora() {
    const { slug } = Route.useParams();
    return <AuthorPage slug={slug} />;
  },
});
