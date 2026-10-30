import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { COBERTURA_EP1, type WebtoonPanel } from "@/data/webtoon-cobertura-ep1";

const BASE = "/webtoon/cobertura/ep1/";

export const Route = createFileRoute("/webtoon/cobertura/1")({
  head: () => ({
    meta: [
      { title: "O Que Eu Vi na Cobertura · Episódio 1 — Refúgio da Lua" },
    ],
  }),
  component: WebtoonEp1,
});

function AnimPanel({ p }: { p: WebtoonPanel }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad(true);
          el.play().catch(() => {});
        } else el.pause();
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (load) ref.current?.load();
  }, [load]);
  return (
    <div style={{ position: "relative", aspectRatio: `${p.w} / ${p.h}` }}>
      <video
        ref={ref}
        muted
        loop
        playsInline
        autoPlay
        preload="none"
        poster={BASE + p.src}
        aria-hidden
        style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }}
      >
        {load && <source src={`${BASE}${p.anim}.webm`} type="video/webm" />}
        {load && <source src={`${BASE}${p.anim}.mp4`} type="video/mp4" />}
      </video>
      {p.overlay && (
        <img
          src={BASE + p.overlay}
          alt=""
          loading="lazy"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        />
      )}
    </div>
  );
}

function SoundToggle() {
  const rain = useRef<HTMLAudioElement | null>(null);
  const music = useRef<HTMLAudioElement | null>(null);
  const [on, setOn] = useState(false);
  useEffect(() => () => { rain.current?.pause(); music.current?.pause(); }, []);
  const toggle = () => {
    if (!rain.current) {
      rain.current = new Audio("/sounds/rain.mp3");
      rain.current.loop = true;
      rain.current.volume = 0.35;
      music.current = new Audio("/music/despedida.mp3");
      music.current.loop = true;
      music.current.volume = 0.18;
    }
    if (on) {
      rain.current.pause();
      music.current?.pause();
    } else {
      rain.current.play().catch(() => {});
      music.current?.play().catch(() => {});
    }
    setOn(!on);
  };
  return (
    <button
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Desligar som" : "Ligar som"}
      style={{
        position: "fixed", right: 16, bottom: 16, zIndex: 50,
        padding: "10px 16px", borderRadius: 999, border: "1px solid rgba(255,255,255,.2)",
        background: "rgba(12,14,20,.85)", color: "#f3e9d8", fontFamily: "'DM Sans', sans-serif",
        fontSize: 14, backdropFilter: "blur(6px)", cursor: "pointer",
      }}
    >
      {on ? "🔊 Som ligado" : "🔈 Tocar chuva e música"}
    </button>
  );
}

function WebtoonEp1() {
  return (
    <main style={{ background: "#0c0e14", minHeight: "100vh", color: "#f3e9d8" }}>
      <header style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px 28px", textAlign: "center" }}>
        <p style={{ fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", opacity: 0.6 }}>
          Webtoon · 16+ · Episódio 1
        </p>
        <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "clamp(28px,7vw,44px)", margin: "8px 0" }}>
          O Que Eu Vi na Cobertura
        </h1>
        <p style={{ opacity: 0.7, fontSize: 15 }}>Role devagar. Toque no botão para ouvir a chuva.</p>
      </header>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {COBERTURA_EP1.map((p, i) => (
          <div key={p.src} style={{ marginBottom: p.gap }}>
            {p.anim ? (
              <AnimPanel p={p} />
            ) : (
              <img
                src={BASE + p.src}
                width={p.w}
                height={p.h}
                alt={`Painel ${i + 1}`}
                loading={i < 2 ? "eager" : "lazy"}
                decoding="async"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            )}
          </div>
        ))}
      </div>
      <footer style={{ textAlign: "center", padding: "40px 20px 96px", opacity: 0.6, fontSize: 14 }}>
        Fim do episódio 1 · Refúgio da Lua
      </footer>
      <SoundToggle />
    </main>
  );
}
