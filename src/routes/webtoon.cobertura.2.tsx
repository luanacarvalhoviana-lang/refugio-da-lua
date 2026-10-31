import { createFileRoute } from "@tanstack/react-router";
import { WebtoonReader } from "@/components/refugio/webtoon-reader";
import { COBERTURA_EP2 } from "@/data/webtoon-cobertura-ep2";

export const Route = createFileRoute("/webtoon/cobertura/2")({
  head: () => ({
    meta: [{ title: "O Que Eu Vi na Cobertura · Episódio 2 — Refúgio da Lua" }],
  }),
  component: () => (
    <WebtoonReader panels={COBERTURA_EP2} base="/webtoon/cobertura/ep2/" episode={2} subtitle="A Sala" prev={{ href: "/webtoon/cobertura/1", label: "Episódio 1: A Festa" }} next={{ href: "/webtoon/cobertura/3", label: "Episódio 3: O Corredor" }} />
  ),
});
