import { useEffect, useState } from "react";

const KEY = "refugio-welcome-v3";

function seen() {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function WelcomeSplash() {
  const [visible, setVisible] = useState(() => (typeof window === "undefined" ? false : !seen()));

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
    const timer = window.setTimeout(hide, 4200);
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
      <img src="/icons/logo.png" alt="" className="welcome-splash-logo" />
      <p className="welcome-splash-hello">Bem-vindo</p>
      <span className="welcome-splash-name">Refúgio da Lua</span>
    </div>
  );
}
