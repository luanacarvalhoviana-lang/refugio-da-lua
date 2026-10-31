import { createFileRoute } from "@tanstack/react-router";
import { WebtoonReader } from "@/components/refugio/webtoon-reader";
import { COBERTURA_EP1 } from "@/data/webtoon-cobertura-ep1";

export const Route = createFileRoute("/webtoon/cobertura/1")({
  head: () => ({
    meta: [{ title: "O Que Eu Vi na Cobertura · Episódio 1 — Refúgio da Lua" }],
  }),
  component: () => (
    <WebtoonReader panels={COBERTURA_EP1} base="/webtoon/cobertura/ep1/" episode={1} subtitle="A Festa"  next={{ href: "/webtoon/cobertura/2", label: "Episódio 2: A Sala" }} />
  ),
});
