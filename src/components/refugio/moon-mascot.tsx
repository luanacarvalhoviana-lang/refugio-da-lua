import { lunaSceneLines, type LunaScene } from "@/lib/refugio/luna";

export type LunaMood = "hug" | "hi" | "listen" | "write";

const src: Record<LunaMood, string> = {
  hug: "/mascot/luna.jpg",
  hi: "/mascot/luna-hi.jpg",
  listen: "/mascot/luna-listen.jpg",
  write: "/mascot/luna-write.jpg",
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
  const mood: LunaMood =
    scene === "write" ? "write" : scene === "mural" || scene === "letter" ? "listen" : scene === "landing" ? "hi" : "hug";
  return (
    <aside className={`luna-companion scene-${scene}`}>
      <MoonMascot mood={mood} size={size} />
      <p>{line || lunaSceneLines[scene]}</p>
    </aside>
  );
}
