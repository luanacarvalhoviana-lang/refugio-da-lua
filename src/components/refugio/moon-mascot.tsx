import { lunaSceneLines, type LunaScene } from "@/lib/refugio/luna";

export type LunaMood = "hug" | "hi" | "listen" | "write" | "rest" | "care" | "pause";

const src: Record<LunaMood, string> = {
  hug: "/mascot/luna-happy.png",
  hi: "/mascot/luna-waving.png",
  listen: "/mascot/luna-mural.png",
  write: "/mascot/luna-read.png",
  rest: "/mascot/luna-sleeping.png",
  care: "/mascot/luna-care.png",
  pause: "/mascot/luna-yawn.png",
};

const sceneMood: Record<LunaScene, LunaMood> = {
  landing: "hi",
  pacto: "hug",
  mural: "listen",
  letter: "listen",
  write: "write",
  garden: "rest",
  care: "care",
  rest: "pause",
};

export function MoonMascot({
  mood = "hug",
  size = 112,
}: {
  mood?: LunaMood;
  size?: number;
}) {
  return (
    <figure className={`moon-mascot mood-${mood}`} style={{ width: size }}>
      <img src={src[mood]} alt="Luna, a lua que acompanha você no Refúgio" width={size} height={size} />
    </figure>
  );
}

export function LunaCompanion({
  scene,
  size = 72,
  line,
}: {
  scene: LunaScene;
  size?: number;
  line?: string;
}) {
  return (
    <aside className={`luna-companion scene-${scene}`}>
      <MoonMascot mood={sceneMood[scene]} size={size} />
      <p>{line || lunaSceneLines[scene]}</p>
    </aside>
  );
}
