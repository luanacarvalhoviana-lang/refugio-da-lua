import { createFileRoute } from "@tanstack/react-router";
import { AccountPage } from "@/components/refugio/account-pages";
import { PactGuard } from "@/components/refugio/pact-guard";

export const Route = createFileRoute("/conta")({
  component: () => (
    <PactGuard>
      <AccountPage />
    </PactGuard>
  ),
});
