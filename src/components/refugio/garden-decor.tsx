import { useRefugioStore } from "@/lib/refugio/store";
import type { GrowthStage } from "@/lib/refugio/amazonTrees";

function on(pack: string, owned: string[]) {
  return owned.includes(pack);
}

export function GardenDecor({ stage }: { stage?: GrowthStage }) {
  const owned = useRefugioStore((s) => s.ownedPacks) || [];
  const rainOn = useRefugioStore((s) => s.rainOn);
  const moonShape = useRefugioStore((s) => s.moonShape);
  if (!owned.length) return null;
  const ready = !stage || stage === "sprout" || stage === "sapling" || stage === "young" || stage === "mature" || stage === "seed";
  if (!ready) return null;
  const night = on("noite", owned);
  const rain = on("chuva", owned) && rainOn;
  const mare = on("mare", owned);
  const flores = on("flores", owned);

  return (
    <div className={`garden-decor ${night ? "night" : ""}`} aria-hidden="true">
      {night ? <div className="gd-stars" /> : null}
      {night ? <img className={`gd-moon ${moonShape}`} src="/garden/items/moon.png" alt="" /> : null}
      {night ? (
        <div className="gd-flies high">
          <i /><i /><i /><i /><i /><i />
        </div>
      ) : null}
      {rain ? (
        <div className="gd-rain">
          {Array.from({ length: 18 }).map((_, i) => <span key={i} style={{ left: `${6 + (i * 5.2) % 90}%`, animationDelay: `${(i % 7) * 0.18}s` }} />)}
        </div>
      ) : null}
      {night ? <img className="gd-owl gd-act" src="/garden/items/owl.png" alt="" /> : null}
      {night ? <img className="gd-lantern gd-act" src="/garden/items/lantern.png" alt="" /> : null}
      {night ? <img className="gd-bench gd-act" src="/garden/items/bench.png" alt="" /> : null}
      {on("chuva", owned) ? <img className="gd-umbrella gd-act" src="/garden/items/umbrella.png" alt="" /> : null}
      {on("chuva", owned) ? <img className="gd-frog gd-act" src="/garden/items/frog.png" alt="" /> : null}
      {on("chuva", owned) ? <img className="gd-mushrooms gd-act" src="/garden/items/mushrooms.png" alt="" /> : null}
      {mare ? <div className="gd-pond">{night ? <span className="gd-reflect" /> : null}<span className="gd-fish" /></div> : null}
      {mare ? <img className="gd-lotus gd-act" src="/garden/items/lotus.png" alt="" /> : null}
      {flores ? <img className="gd-flowers gd-act" src="/garden/items/flowers.png" alt="" /> : null}
      {flores ? <img className="gd-birdhouse gd-act" src="/garden/items/birdhouse.png" alt="" /> : null}
      {flores ? (
        <div className="gd-flies low">
          <i /><i /><i /><i />
        </div>
      ) : null}
      {flores ? <span className="gd-bee" /> : null}
      {flores ? <span className="gd-butterfly" /> : null}
    </div>
  );
}
