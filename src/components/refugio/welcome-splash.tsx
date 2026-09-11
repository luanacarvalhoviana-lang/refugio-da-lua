import { useEffect, useState } from "react";

export function WelcomeSplash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("refugio-welcome-v2") === "1") {
      setVisible(false);
      return;
    }
    const hide = () => {
      sessionStorage.setItem("refugio-welcome-v2", "1");
      setVisible(false);
    };
    const timer = window.setTimeout(hide, 3200);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="welcome-splash"
      onClick={() => {
        sessionStorage.setItem("refugio-welcome-v2", "1");
        setVisible(false);
      }}
    >
      <img src="/icons/icon-512.png" alt="Refúgio da Lua" className="welcome-splash-logo" />
      <p className="welcome-splash-hello">Bem-vindo</p>
      <span className="welcome-splash-name">Refúgio da Lua</span>
    </div>
  );
}
