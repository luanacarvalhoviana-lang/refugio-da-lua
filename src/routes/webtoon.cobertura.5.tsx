import { createFileRoute } from "@tanstack/react-router";
import { WebtoonReader } from "@/components/refugio/webtoon-reader";
import { COBERTURA_EP5 } from "@/data/webtoon-cobertura-ep5";

export const Route = createFileRoute("/webtoon/cobertura/5")({
  head: () => ({
    meta: [{ title: "O Que Eu Vi na Cobertura · Episódio 5 — Refúgio da Lua" }],
  }),
  component: () => (
    <WebtoonReader panels={COBERTURA_EP5} base="/webtoon/cobertura/ep5/" episode={5} subtitle="A Mureta" prev={{ href: "/webtoon/cobertura/4", label: "Episódio 4: O Hospital" }} next={{ href: "/webtoon/cobertura/6", label: "Episódio 6: A Frase" }} />
  ),
});
