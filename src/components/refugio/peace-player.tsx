import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2 } from "lucide-react";
import { peaceSounds } from "@/lib/refugio/sounds";
import { useRefugioStore } from "@/lib/refugio/store";
import { Button } from "@/components/refugio/button";

export function PeacePlayer({ compact = false, onNeedPlan }: { compact?: boolean; onNeedPlan?: () => void }) {
  const plan = useRefugioStore((s) => s.plan);
  const allowed = plan === "annual";
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState<string>(peaceSounds[0].name);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sound = peaceSounds.find((item) => item.name === current) ?? peaceSounds[0];

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const ensure = () => {
    if (!audioRef.current) {
      const el = new Audio(sound.src);
      el.loop = true;
      el.preload = "auto";
      audioRef.current = el;
    }
    return audioRef.current;
  };

  const playName = (name: string) => {
    if (!allowed) {
      onNeedPlan?.();
      return;
    }
    const next = peaceSounds.find((item) => item.name === name) ?? peaceSounds[0];
    setCurrent(name);
    const el = ensure();
    el.src = next.src;
    el.loop = true;
    el.volume = 0.5;
    el.play().catch(() => undefined);
    setPlaying(true);
  };

  const toggle = () => {
    if (!allowed) {
      onNeedPlan?.();
      return;
    }
    const el = ensure();
    if (playing) {
      el.pause();
      setPlaying(false);
      return;
    }
    el.src = sound.src;
    el.loop = true;
    el.volume = 0.5;
    el.play().catch(() => undefined);
    setPlaying(true);
  };

  if (compact) {
    if (!allowed) return null;
    return (
      <button type="button" className={`sound-chip ${playing ? "is-on" : ""}`} onClick={toggle} aria-label={playing ? "Pausar sons" : "Tocar sons de paz"}>
        {playing ? <Pause size={14} /> : <Play size={14} />}
        <span>{playing ? sound.name : "Sons"}</span>
      </button>
    );
  }

  return (
    <section className="care-block care-sounds">
      <span className="eyebrow"><Volume2 size={14} /> sons de paz</span>
      <h2>Um fundo para a noite.</h2>
      {allowed ? (
        <p>Chuva, floresta, lareira ou oceano. Fica no fundo enquanto você lê.</p>
      ) : (
        <p>O player completo entra no VIP Anual. No Mensal o mural já ganha mais espaço; aqui a paisagem sonora é do bosque.</p>
      )}
      <div className="sound-options care-sound-grid">
        {peaceSounds.map((item) => (
          <button
            key={item.name}
            type="button"
            className={current === item.name ? "active" : ""}
            onClick={() => playName(item.name)}
          >
            <span>{item.icon}</span>
            <strong>{item.name}</strong>
            <small>{item.detail}</small>
          </button>
        ))}
      </div>
      <div className="care-sound-bar">
        <button type="button" className="sound-toggle" onClick={toggle} aria-label={playing ? "Pausar" : "Tocar"}>
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <span>
          <strong>{allowed ? (playing ? "Reproduzindo" : "Toque para ouvir") : "Incluso no VIP Anual"}</strong>
          <small>{sound.name} · {sound.detail}</small>
        </span>
        {!allowed && onNeedPlan ? (
          <Button className="button button-secondary" onClick={onNeedPlan}>Ver plano</Button>
        ) : <Volume2 size={16} />}
      </div>
    </section>
  );
}
