import { Moon, SunMedium } from "lucide-react";
import { useRefugioStore } from "@/lib/refugio/store";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const theme = useRefugioStore((s) => s.theme);
  const setTheme = useRefugioStore((s) => s.setTheme);
  const night = theme === "night";
  return (
    <button
      type="button"
      className={`theme-toggle ${compact ? "is-compact" : ""}`}
      aria-label={night ? "Ativar modo claro" : "Ativar modo noturno"}
      onClick={() => setTheme(night ? "day" : "night")}
    >
      {night ? <SunMedium size={16} /> : <Moon size={16} />}
      {!compact && <span>{night ? "Dia" : "Noite"}</span>}
    </button>
  );
}
