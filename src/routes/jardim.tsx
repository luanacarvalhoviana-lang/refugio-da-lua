import { createFileRoute } from "@tanstack/react-router";
import { GardenPage } from "@/components/refugio/house-pages";
import { PactGuard } from "@/components/refugio/pact-guard";

export const Route = createFileRoute("/jardim")({
  component: () => (
    <PactGuard>
      <GardenPage />
    </PactGuard>
  ),
});
