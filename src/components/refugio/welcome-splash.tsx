import { useEffect, useState } from "react";

const KEY = "refugio-welcome-v4";

function alreadyCovered() {
  try {
    if (sessionStorage.getItem(KEY) === "1") return true;
  } catch {
    /* ignore */
  }
  if (typeof window === "undefined") return true;
  return window.matchMedia("(display-mode: standalone)").matches || window.matchMedia("(display-mode: fullscreen)").matches;
}

export function WelcomeSplash() {
  const [visible, setVisible] = useState(() => (typeof window === "undefined" ? false : !alreadyCovered()));

  useEffect(() => {
    if (!visible) return;
    const hide = () => {
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* ignore */
      }
      setVisible(false);
    };
    const timer = window.setTimeout(hide, 2400);
    return () => window.clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="welcome-splash"
      onClick={() => {
        try {
          sessionStorage.setItem(KEY, "1");
        } catch {
          /* ignore */
        }
        setVisible(false);
      }}
    >
      <img
          src="/icons/brand-v3-512.png"
          alt=""
          width={196}
          height={196}
          decoding="async"
          fetchPriority="high"
          className="welcome-splash-logo"
        />
      <p className="welcome-splash-hello">Bem-vindo</p>
      <span className="welcome-splash-name">Refúgio da Lua</span>
    </div>
  );
}
