import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

export function ScreenProtect({ vipGuard }: { vipGuard: boolean }) {
  const enabled = vipGuard;
  const [notice, setNotice] = useState("");
  const [veiled, setVeiled] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("protect-on", enabled);
    document.documentElement.dataset.protect = enabled ? "on" : "off";
    return () => {
      document.documentElement.classList.remove("protect-on");
      delete document.documentElement.dataset.protect;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const warn = (message: string) => {
      setNotice(message);
      window.setTimeout(() => setNotice(""), 2600);
    };
    const block = (event: Event) => {
      event.preventDefault();
      warn("Este espaço está protegido. Cópia e captura ficam marcadas.");
    };
    const onKey = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const combo = event.ctrlKey || event.metaKey;
      if (key === "printscreen" || key === "f12" || (combo && ["c", "x", "s", "p", "u", "a"].includes(key))) {
        event.preventDefault();
        warn("Atalho bloqueado. A captura, se ocorrer, leva a marca d’água.");
      }
    };
    const onLeave = () => setVeiled(true);
    const onBack = () => setVeiled(false);
    document.addEventListener("contextmenu", block);
    document.addEventListener("copy", block);
    document.addEventListener("cut", block);
    document.addEventListener("dragstart", block);
    document.addEventListener("keydown", onKey);
    window.addEventListener("blur", onLeave);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState !== "visible") onLeave();
      else onBack();
    });
    window.addEventListener("focus", onBack);
    warn("Proteção de tela ligada. Marca d’água visível em qualquer captura.");
    return () => {
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("copy", block);
      document.removeEventListener("cut", block);
      document.removeEventListener("dragstart", block);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("focus", onBack);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      {veiled && (
        <div className="shot-veil protect-veil">
          <ShieldCheck size={22} />
          <span>Conteúdo protegido fora do primeiro plano.</span>
        </div>
      )}
      {notice && (
        <div className="protect-toast" role="status">
          <ShieldCheck size={16} /> {notice}
        </div>
      )}
    </>
  );
}
