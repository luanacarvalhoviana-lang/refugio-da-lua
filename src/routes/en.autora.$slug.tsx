import { createFileRoute } from "@tanstack/react-router";
import { AuthorPage } from "@/components/refugio/author-page";

export const Route = createFileRoute("/en/autora/$slug")({
  component: function AutoraEn() {
    const { slug } = Route.useParams();
    return <AuthorPage slug={slug} initialLang="en" />;
  },
});
