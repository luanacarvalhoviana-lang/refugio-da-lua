import { createFileRoute } from "@tanstack/react-router";
import { EditorPage } from "@/components/refugio/editor-page";

export const Route = createFileRoute("/criar")({
  component: EditorPage,
});
