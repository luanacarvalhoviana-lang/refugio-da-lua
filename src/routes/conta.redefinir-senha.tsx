import { createFileRoute } from "@tanstack/react-router";
import { ResetPage } from "@/components/refugio/account-pages";

export const Route = createFileRoute("/conta/redefinir-senha")({
  component: ResetPage,
});
