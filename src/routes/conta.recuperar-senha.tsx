import { createFileRoute } from "@tanstack/react-router";
import { ForgotPage } from "@/components/refugio/account-pages";

export const Route = createFileRoute("/conta/recuperar-senha")({
  component: ForgotPage,
});
