import { useEffect } from "react";
import { StoryShell, useHouse } from "@/components/refugio/story-shell";
import type { Lang } from "@/lib/refugio/stories";

const TXT = {
  pt: { kicker: "Webtoons", title: "Histórias em quadrinhos verticais", intro: "Para ler rolando a tela, quadro a quadro, no celular ou no computador.", status: "Série completa · 6 episódios · 16+", rating: "Classificação 16+ · sem cenas explícitas · personagens adultas", start: "Começar pelo episódio 1", ep: "Episódio", synopsis: "Uma festa na cobertura, uma queda que ninguém viu direito e uma depoente que sabe mais do que diz. Quem toma o depoimento é a ex dela, a Elisa — e a Elisa quer a frase verdadeira, não a fácil.", eps: ["A Festa", "A Sala", "O Corredor", "O Hospital", "A Mureta", "A Frase"], soon: "Em breve", soonText: "Novos webtoons vão morar aqui. Esta estante tem espaço para eles." },
  es: { kicker: "Webtoons", title: "Historietas verticales", intro: "Para leer deslizando la pantalla, viñeta a viñeta, en el móvil o en la computadora.", status: "Serie completa · 6 episodios · 16+", rating: "Clasificación 16+ · sin escenas explícitas · personajes adultas", start: "Empezar por el episodio 1", ep: "Episodio", synopsis: "Una fiesta en la azotea, una caída que nadie vio bien y una testigo que sabe más de lo que dice. Quien toma su declaración es su ex, Elisa, y Elisa quiere la frase verdadera, no la fácil.", eps: ["La Fiesta", "La Sala", "El Pasillo", "El Hospital", "El Muro", "La Frase"], soon: "Próximamente", soonText: "Aquí vivirán nuevos webtoons. Este estante tiene lugar para ellos." },
  en: { kicker: "Webtoons", title: "Vertical comics", intro: "Made for scrolling, panel by panel, on your phone or computer.", status: "Complete series · 6 episodes · 16+", rating: "Rated 16+ · nothing explicit · adult characters", start: "Start with episode 1", ep: "Episode", synopsis: "A rooftop party, a fall nobody saw clearly, and a witness who knows more than she says. The officer taking her statement is her ex, Elisa — and Elisa wants the true sentence, not the easy one.", eps: ["The Party", "The Room", "The Hallway", "The Hospital", "The Ledge", "The Sentence"], soon: "Coming soon", soonText: "New webtoons will live here. This shelf has room for them." },
} as const;

export function WebtoonsPage({ initialLang }: { initialLang?: Lang }) {
  const { lang, setLang } = useHouse();
  useEffect(() => {
    if (initialLang && initialLang !== lang) setLang(initialLang);
  }, [initialLang, lang, setLang]);
  const x = TXT[lang] ?? TXT.pt;
  return (
    <StoryShell>
      <section className="house-block webtoons">
        <p className="soon-kicker">{x.kicker}</p>
        <h1>{x.title}</h1>
        <p className="house-note">{x.intro}</p>
        <article className="wt-series">
          <a className="wt-cover" href="/webtoon/cobertura/1">
            <img src="/webtoon/cobertura/ep1/capa.webp" alt="O Que Eu Vi na Cobertura" loading="eager" />
          </a>
          <div className="wt-info">
            <span className="wt-status">{x.status}</span>
            <h2>O Que Eu Vi na Cobertura</h2>
            <p>{x.synopsis}</p>
            <p className="wt-rating"><span>16+</span> {x.rating}</p>
            <a className="house-primary" href="/webtoon/cobertura/1">{x.start} →</a>
          </div>
          <ol className="wt-eps">
            {x.eps.map((name, i) => (
              <li key={i}>
                <a href={`/webtoon/cobertura/${i + 1}`}>
                  <img src={`/webtoon/cobertura/ep${i + 1}/capa.webp`} alt="" loading="lazy" />
                  <span><small>{x.ep} {i + 1}</small>{name}</span>
                </a>
              </li>
            ))}
          </ol>
        </article>
        <article className="wt-soon">
          <strong>{x.soon} ✦</strong>
          <p>{x.soonText}</p>
        </article>
      </section>
    </StoryShell>
  );
}
