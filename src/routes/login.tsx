import { createFileRoute } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const google = GROK_PROVIDERS.find((item) => item.idp === "google");
  return (
    <main className="center-page public-page">
      <div className="simple-card" style={{ maxWidth: 420 }}>
        <span className="eyebrow">entrar</span>
        <h1>Entre com o Google.</h1>
        <p>A pessoa toca o botão, escolhe a conta Google e volta para o Refúgio. Sem senha nova.</p>
        {authEnabled && google ? (
          <button
            type="button"
            className="google-button"
            onClick={() => {
              void signIn(google.providerId, { callbackURL: "/mural", errorCallbackURL: "/conta" });
            }}
          >
            <span>G</span> Continuar com Google
          </button>
        ) : (
          <p className="filter-hint">O entrar com Google liga quando o site publica o acesso.</p>
        )}
        <p>
          <a href="/conta" className="text-link">
            Prefere e-mail e senha?
          </a>
        </p>
      </div>
    </main>
  );
}
