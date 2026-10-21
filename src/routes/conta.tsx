import { createFileRoute } from "@tanstack/react-router";
import { AccountPage } from "@/components/refugio/account-pages";

export const Route = createFileRoute("/conta")({
  component: AccountPage,
});
