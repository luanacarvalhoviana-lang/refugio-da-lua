import { createFileRoute } from "@tanstack/react-router";
import { EditorPage } from "@/components/refugio/editor-page";
import { PactGuard } from "@/components/refugio/pact-guard";

export const Route = createFileRoute("/criar")({
  component: () => (
    <PactGuard>
      <EditorPage />
    </PactGuard>
  ),
});
