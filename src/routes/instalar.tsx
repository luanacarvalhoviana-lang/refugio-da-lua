import { createFileRoute } from "@tanstack/react-router";
import { StoryShell, useHouse } from "@/components/refugio/story-shell";

export const Route = createFileRoute("/instalar")({
  component: InstallPage,
});

function InstallPage() {
  const { lang } = useHouse();
  const copy = lang === "en"
    ? {
        kicker: "on your phone",
        title: "Keep the Refúgio on your home screen.",
        lead: "In the phone browser, open the menu and tap “Add to Home Screen”. The icon stays round, with the name Refúgio.",
      }
    : lang === "es"
      ? {
          kicker: "en el celular",
          title: "Deja el Refúgio en la pantalla de inicio.",
          lead: "En el navegador del celular, abre el menú y toca “Agregar a la pantalla de inicio”. El icono queda redondo, con el nombre Refúgio.",
        }
      : {
          kicker: "no celular",
          title: "Deixe o Refúgio na tela inicial.",
          lead: "No navegador do celular, abra o menu e toque em “Adicionar à tela inicial”. O ícone fica redondo, com o nome Refúgio.",
        };
  return (
    <StoryShell>
      <section className="house-hero">
        <p className="soon-kicker">{copy.kicker}</p>
        <h1>{copy.title}</h1>
        <p className="soon-lead">{copy.lead}</p>
      </section>
    </StoryShell>
  );
}
