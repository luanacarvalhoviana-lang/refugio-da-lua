import { useState } from "react";
import { ArrowRight, Map, Moon, X } from "lucide-react";
import { useLocation } from "@/components/refugio/router";
import { useRefugioStore } from "@/lib/refugio/store";

const groups = [
  {
    label: "Entrada — nesta ordem",
    items: [
      { path: "/inicio", title: "1. Institucional", text: "Quem somos, privacidade e convivência" },
      { path: "/conta", title: "2. Login", text: "Entrar, criar conta ou seguir anônimo" },
      { path: "/onboarding/pacto", title: "3. Pacto + 18+", text: "Empatia e aviso: não é para menores" },
      { path: "/mural", title: "4. Mural", text: "Depois do pacto, o espaço da comunidade" },
    ],
  },
  {
    label: "App",
    items: [
      { path: "/carta/carta-1", title: "Carta aberta", text: "Leitura + energia + conselho" },
      { path: "/escrever", title: "Desabafar", text: "Editor, papel, privacidade" },
      { path: "/escrever/confirmacao", title: "Confirmação", text: "Carta publicada" },
      { path: "/notificacoes", title: "Notificações", text: "Sinais de presença" },
      { path: "/perfil", title: "Perfil", text: "Avatares e plano" },
      { path: "/configuracoes", title: "Configurações", text: "Privacidade e apagar conta" },
    ],
  },
  {
    label: "Jardim & cuidado",
    items: [
      { path: "/jardim", title: "Jardim", text: "Bosque Amazônico, árvore e atalhos" },
      { path: "/diario", title: "Diário emocional", text: "Anotações privadas" },
      { path: "/selos", title: "Selos de presença", text: "Pequenas conquistas" },
      { path: "/memorias", title: "Caixa da memória", text: "O que merece ficar" },
      { path: "/cuidar", title: "Cuidar", text: "CVV 188, respirar, sons e caminhos de ajuda" },
      { path: "/planos", title: "Planos", text: "Gratuito, Mensal e Anual, lado a lado" },
      { path: "/apoio", title: "Apoio imediato", text: "A mesma página de cuidado, pelo atalho" },
    ],
  },
  {
    label: "Páginas institucionais",
    items: [
      { path: "/sobre", title: "Sobre", text: "O que é o Refúgio" },
      { path: "/privacidade", title: "Privacidade", text: "Política de dados" },
      { path: "/termos", title: "Termos", text: "Regras de convivência" },
      { path: "/conta/recuperar-senha", title: "Recuperar senha", text: "Pedido de e-mail" },
      { path: "/onboarding/perfil", title: "Perfil inicial", text: "Opcional, depois do mural" },
      { path: "/instalar", title: "Instalar app", text: "PWA na tela inicial" },
    ],
  },
];

export function LayoutMap() {
  const [path, go] = useLocation();
  const [open, setOpen] = useState(path === "/mapa");
  const plan = useRefugioStore((s) => s.plan);
  const setPlan = useRefugioStore((s) => s.setPlan);
  const login = useRefugioStore((s) => s.login);
  const confirmAge = useRefugioStore((s) => s.confirmAge);
  const acceptPact = useRefugioStore((s) => s.acceptPact);

  const entryPaths = new Set(["/", "/inicio", "/conta", "/onboarding/pacto", "/sobre", "/privacidade", "/termos", "/apoio", "/instalar", "/conta/recuperar-senha"]);

  const openScreen = (next: string) => {
    if (!entryPaths.has(next)) {
      confirmAge();
      acceptPact();
      if (typeof window !== "undefined") {
        window.localStorage.setItem("refugio-age-ok", "18");
        window.localStorage.setItem("refugio-pact-ok", "1");
      }
      login({ name: "Girassol sereno", email: "preview@refugio.da.luna" });
    }
    go(next);
    setOpen(false);
  };

  const hideFab = entryPaths.has(path) || path === "/mapa";

  return (
    <>
      {!hideFab && (
      <button className="layout-map-fab" onClick={() => setOpen(true)} aria-label="Abrir mapa de telas">
        <Map size={18} />
        <span>Mapa das telas</span>
      </button>
      )}
      {open && (
        <div className="layout-map-overlay" role="dialog" aria-modal="true" aria-labelledby="layout-map-title">
          <div className="layout-map-panel">
            <header className="layout-map-head">
              <div>
                <span className="eyebrow">
                  <Moon size={14} /> tour do layout
                </span>
                <h2 id="layout-map-title">Todas as telas do Refúgio</h2>
                <p>Abra qualquer página para ver o layout completo. Troque o plano para ver o visual VIP.</p>
              </div>
              <button className="preview-close" aria-label="Fechar mapa" onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </header>
            <div className="layout-map-plans" role="tablist" aria-label="Plano de prévia">
              {(["free", "monthly", "annual"] as const).map((key) => (
                <button
                  key={key}
                  className={plan === key ? "active" : ""}
                  onClick={() => {
                    login();
                    setPlan(key);
                  }}
                >
                  {key === "free" ? "Gratuito" : key === "monthly" ? "VIP Mensal" : "VIP Anual"}
                </button>
              ))}
            </div>
            <div className="layout-map-groups">
              {groups.map((group) => (
                <section key={group.label}>
                  <span className="section-label">{group.label}</span>
                  <div className="layout-map-grid">
                    {group.items.map((item) => (
                      <button key={item.path} onClick={() => openScreen(item.path)}>
                        <strong>{item.title}</strong>
                        <small>{item.text}</small>
                        <span>
                          Abrir <ArrowRight size={14} />
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
