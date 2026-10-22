import { useEffect, useState, type ReactNode } from "react";
import { useHouse } from "@/components/refugio/story-shell";
import { readPact, rememberPactNext } from "@/lib/refugio/pacto";

export function PactGuard({ children }: { children: ReactNode }) {
  const { lang } = useHouse();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (readPact()) {
      setOpen(true);
      return;
    }
    rememberPactNext(`${window.location.pathname}${window.location.search}`);
    window.location.replace(lang === "es" ? "/es/pacto" : "/pacto");
  }, [lang]);
  if (!open) return null;
  return children;
}
