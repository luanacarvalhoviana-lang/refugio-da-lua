import { useEffect, useRef, useState } from "react";
import type { Life } from "@/lib/refugio/house-cast";

export type StagePerson = { name: string; life: string; portrait?: string; motion?: string };

export function LivingStage({
  src,
  caption,
  morning,
  life,
  motion,
  people,
}: {
  src: string;
  caption: string;
  morning: boolean;
  life: Life;
  motion?: string;
  people: StagePerson[];
}) {
  const [current, setCurrent] = useState(src);
  const [clip, setClip] = useState(motion || "");
  const [previous, setPrevious] = useState<string | null>(null);
  const seen = useRef(src);
  const weather = useRef<HTMLCanvasElement>(null);
  const [quietMotion, setQuietMotion] = useState(false);

  useEffect(() => {
    setQuietMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (seen.current === src && (motion || "") === clip) return;
    setPrevious(seen.current);
    seen.current = src;
    setCurrent(src);
    setClip(motion || "");
    const id = window.setTimeout(() => setPrevious(null), 700);
    return () => window.clearTimeout(id);
  }, [src, motion, clip]);

  useEffect(() => {
    const canvas = weather.current;
    if (!canvas || quietMotion || motion) return;
    if (life !== "rain" && life !== "paper") return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const specks = Array.from({ length: life === "rain" ? 64 : 28 }, () => ({
      x: Math.random(),
      y: Math.random(),
      v: life === "rain" ? 0.008 + Math.random() * 0.014 : 0.001 + Math.random() * 0.002,
      w: life === "rain" ? 8 + Math.random() * 14 : 1.2,
    }));
    let frame = 0;
    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      for (const speck of specks) {
        speck.y += speck.v;
        if (speck.y > 1.1) speck.y = -0.1;
        if (life === "rain") {
          context.strokeStyle = "rgba(248,245,238,.38)";
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(speck.x * width, speck.y * height);
          context.lineTo(speck.x * width + 1.2, speck.y * height + speck.w);
          context.stroke();
        } else {
          context.fillStyle = "rgba(246,215,122,.45)";
          context.fillRect(speck.x * width, (1 - speck.y) * height, 1.4, 1.4);
        }
      }
      frame = window.requestAnimationFrame(draw);
    };
    frame = window.requestAnimationFrame(draw);
    return () => window.cancelAnimationFrame(frame);
  }, [life, motion, src, quietMotion]);

  const quiet = Boolean(motion) && quietMotion;
  return (
    <figure className={morning ? "stage is-morning" : "stage"}>
      <div className={`stage-gate is-${life}`}>
        {previous ? <img className="stage-old" src={previous} alt="" /> : null}
        {motion && !quiet ? (
          <video key={clip} className="stage-clip" poster={current} muted loop autoPlay playsInline>
            <source src={clip} type="video/mp4" />
          </video>
        ) : (
          <img key={current} className="stage-still" src={current} alt={caption} />
        )}
        <canvas ref={weather} className="stage-weather" aria-hidden="true" />
        {life === "candle" ? <span className="stage-candle" aria-hidden="true" /> : null}
        {life === "lamp" ? <span className="stage-lamp" aria-hidden="true" /> : null}
        {life === "room" ? <span className="stage-rec" aria-hidden="true" /> : null}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
      {people.length ? (
        <div className="cast-row">
          {people.map((person) => (
            <article key={person.name} className="cast-card">
              {person.portrait ? (
                person.motion && !quietMotion ? (
                  <video className="cast-face" poster={person.portrait} muted loop autoPlay playsInline>
                    <source src={person.motion} type="video/mp4" />
                  </video>
                ) : (
                  <img className="cast-face" src={person.portrait} alt="" />
                )
              ) : (
                <span className="cast-mark" aria-hidden="true">{person.name.slice(0, 1)}</span>
              )}
              <div>
                <p className="cast-name">{person.name}</p>
                {person.life ? <p className="cast-life">{person.life}</p> : null}
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </figure>
  );
}
