import { createFileRoute } from "@tanstack/react-router";
import { PactGuard } from "@/components/refugio/pact-guard";
import { StudioPage } from "@/components/refugio/studio-page";

export const Route = createFileRoute("/escrever")({
  component: () => (
    <PactGuard>
      <StudioPage />
    </PactGuard>
  ),
});
