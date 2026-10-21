import { createFileRoute } from "@tanstack/react-router";
import { StoryShell, useHouse } from "@/components/refugio/story-shell";

export const Route = createFileRoute("/instalar")({
  component: InstallPage,
});

function InstallPage() {
  const { lang } = useHouse();
  const es = lang === "es";
  return (
    <StoryShell>
      <section className="house-hero">
        <p className="soon-kicker">{es ? "en el celular" : "no celular"}</p>
        <h1>{es ? "Deja el Refúgio en la pantalla de inicio." : "Deixe o Refúgio na tela inicial."}</h1>
        <p className="soon-lead">
          {es
            ? "En el navegador del celular, abre el menú y toca “Agregar a la pantalla de inicio”. El icono queda redondo, con el nombre Refúgio."
            : "No navegador do celular, abra o menu e toque em “Adicionar à tela inicial”. O ícone fica redondo, com o nome Refúgio."}
        </p>
      </section>
    </StoryShell>
  );
}
