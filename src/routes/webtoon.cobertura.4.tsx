import { createFileRoute } from "@tanstack/react-router";
import { WebtoonReader } from "@/components/refugio/webtoon-reader";
import { COBERTURA_EP4 } from "@/data/webtoon-cobertura-ep4";

export const Route = createFileRoute("/webtoon/cobertura/4")({
  head: () => ({
    meta: [{ title: "O Que Eu Vi na Cobertura · Episódio 4 — Refúgio da Lua" }],
  }),
  component: () => (
    <WebtoonReader panels={COBERTURA_EP4} base="/webtoon/cobertura/ep4/" episode={4} subtitle="O Hospital" prev={{ href: "/webtoon/cobertura/3", label: "Episódio 3: O Corredor" }} />
  ),
});
