import { useEffect, useState } from "react";

type PromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export function registerRefugioPwa() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  const run = () => navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  if (document.readyState === "complete") run();
  else window.addEventListener("load", run, { once: true });
}

export function useInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<PromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone;
    if (standalone) setInstalled(true);
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as PromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!promptEvent) return false;
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    setPromptEvent(null);
    return choice.outcome === "accepted";
  };

  return { canInstall: Boolean(promptEvent) && !installed, installed, install };
}
