import { createFileRoute } from "@tanstack/react-router";
import { WebtoonReader } from "@/components/refugio/webtoon-reader";
import { COBERTURA_EP6 } from "@/data/webtoon-cobertura-ep6";

export const Route = createFileRoute("/webtoon/cobertura/6")({
  head: () => ({
    meta: [{ title: "O Que Eu Vi na Cobertura · Episódio 6 — Refúgio da Lua" }],
  }),
  component: () => (
    <WebtoonReader panels={COBERTURA_EP6} base="/webtoon/cobertura/ep6/" episode={6} subtitle="A Frase" prev={{ href: "/webtoon/cobertura/5", label: "Episódio 5: A Mureta" }} />
  ),
});
