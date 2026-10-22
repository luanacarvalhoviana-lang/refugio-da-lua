import { createFileRoute } from "@tanstack/react-router";
import { AuthorPage } from "@/components/refugio/author-page";

export const Route = createFileRoute("/es/autora/$slug")({
  component: function AutoraEs() {
    const { slug } = Route.useParams();
    return <AuthorPage slug={slug} initialLang="es" />;
  },
});
