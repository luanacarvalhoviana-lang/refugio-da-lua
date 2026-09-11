import { useEffect, useState } from "react";

export function WelcomeSplash() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("refugio-welcome") === "1") return;
    setVisible(true);
    const hide = () => {
      sessionStorage.setItem("refugio-welcome", "1");
      setVisible(false);
    };
    const timer = window.setTimeout(hide, 2400);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="welcome-splash"
      onClick={() => {
        sessionStorage.setItem("refugio-welcome", "1");
        setVisible(false);
      }}
    >
      <img src="/icons/logo.png" alt="" className="welcome-splash-logo" />
      <p className="welcome-splash-hello">Bem-vindo</p>
      <span className="welcome-splash-name">Refúgio da Lua</span>
    </div>
  );
}
