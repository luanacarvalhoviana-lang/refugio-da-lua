import { moonDateLabel, moonStatus } from "@/lib/refugio/full-moon";
import { useHouse } from "@/components/refugio/story-shell";

export function MoonNightNote() {
  const { lang, t } = useHouse();
  const moon = moonStatus();
  const when = moonDateLabel(moon.next, lang);
  return <p className="house-note">{moon.open ? t.moonOpen : t.moonNext.replace("{date}", when)}</p>;
}
