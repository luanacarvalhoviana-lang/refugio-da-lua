import { createFileRoute } from "@tanstack/react-router";
import { WebtoonReader } from "@/components/refugio/webtoon-reader";
import { COBERTURA_EP3 } from "@/data/webtoon-cobertura-ep3";

export const Route = createFileRoute("/webtoon/cobertura/3")({
  head: () => ({
    meta: [{ title: "O Que Eu Vi na Cobertura · Episódio 3 — Refúgio da Lua" }],
  }),
  component: () => (
    <WebtoonReader panels={COBERTURA_EP3} base="/webtoon/cobertura/ep3/" episode={3} subtitle="O Corredor" prev={{ href: "/webtoon/cobertura/2", label: "Episódio 2: A Sala" }} next={{ href: "/webtoon/cobertura/4", label: "Episódio 4: O Hospital" }} />
  ),
});
