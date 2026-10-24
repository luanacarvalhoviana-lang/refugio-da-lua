import { createFileRoute } from "@tanstack/react-router";
import { LibraryPage } from "@/components/refugio/library-page";
import { PactGuard } from "@/components/refugio/pact-guard";

export const Route = createFileRoute("/biblioteca")({
  component: () => (
    <PactGuard>
      <LibraryPage />
    </PactGuard>
  ),
});
