import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { WebtoonPanel } from "@/data/webtoon-cobertura-ep1";

const navBtn: CSSProperties = { padding: "10px 16px", borderRadius: 999, border: "1px solid rgba(255,255,255,.2)", color: "#f3e9d8", textDecoration: "none", fontSize: 15 };

function AnimPanel({ p, base }: { p: WebtoonPanel; base: string }) {
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
        poster={base + p.src}
        aria-hidden
        style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }}
      >
        {load && <source src={`${base}${p.anim}.webm`} type="video/webm" />}
        {load && <source src={`${base}${p.anim}.mp4`} type="video/mp4" />}
      </video>
      {p.overlay && (
        <img
          src={base + p.overlay}
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

export function WebtoonReader({ panels, base, episode, subtitle, prev, next }: { panels: WebtoonPanel[]; base: string; episode: number; subtitle: string; prev?: { href: string; label: string }; next?: { href: string; label: string } }) {
  return (
    <main style={{ background: "#0c0e14", minHeight: "100vh", color: "#f3e9d8" }}>
      <header style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px 28px", textAlign: "center" }}>
        <p style={{ fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase", opacity: 0.6 }}>
          Webtoon · 16+ · Episódio {episode}
        </p>
        <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "clamp(28px,7vw,44px)", margin: "8px 0" }}>
          O Que Eu Vi na Cobertura
        </h1>
        <p style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: 18, opacity: 0.85, margin: "0 0 6px" }}>{subtitle}</p>
        <p style={{ opacity: 0.7, fontSize: 15 }}>Role devagar. Toque no botão para ouvir a chuva.</p>
      </header>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {panels.map((p, i) => (
          <div key={p.src} style={{ marginBottom: p.gap }}>
            {p.anim ? (
              <AnimPanel p={p} base={base} />
            ) : (
              <img
                src={base + p.src}
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
      <nav aria-label="Episódios" style={{ maxWidth: 800, margin: "0 auto", display: "flex", justifyContent: "space-between", gap: 12, padding: "32px 20px 0" }}>
        {prev ? <a href={prev.href} style={navBtn}>← {prev.label}</a> : <span />}
        {next ? <a href={next.href} style={navBtn}>{next.label} →</a> : <span />}
      </nav>
      <footer style={{ textAlign: "center", padding: "40px 20px 96px", opacity: 0.6, fontSize: 14 }}>
        Fim do episódio {episode} · Refúgio da Lua
      </footer>
      <SoundToggle />
    </main>
  );
}
