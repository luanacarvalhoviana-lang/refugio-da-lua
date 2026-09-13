import { useState } from "react";
import {
  ArrowRight,
  Crown,
  Heart,
  Mail,
  MapPin,
  Moon,
  Phone,
  ShieldCheck,
  Wind,
} from "lucide-react";
import { Button } from "@/components/refugio/button";
import { LunaCompanion } from "@/components/refugio/moon-mascot";
import { lunaPhilosophy } from "@/lib/refugio/luna";
import { PeacePlayer } from "@/components/refugio/peace-player";

export function CarePage({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <div className="content-page care-page">
      <div className="page-intro">
        <LunaCompanion scene="care" size={92} />
        <span className="eyebrow">um lugar para pousar</span>
        <h1>Se o peito apertar, comece aqui.</h1>
        <p>
          O Refúgio escuta. Ele não substitui um profissional, um pronto-socorro ou alguém que possa
          estar com você agora. Abaixo há caminhos reais de ajuda — e também um pouco de ar para o
          corpo enquanto você decide o próximo passo.
        </p>
      </div>

      <section className="care-vip">
        <span className="eyebrow"><Crown size={14} /> refúgio vip</span>
        <h2>Mais espaço para o seu jardim.</h2>
        <p>
          Mensal e anual aprofundam o jardim: mais árvores, mais conselhos, bosque amazônico, sons de paz
          e a caixa da memória. O cuidado de crise continua gratuito — o VIP é só mais espaço para ficar.
        </p>
        <Button className="button button-primary" onClick={() => onNavigate("/planos")}>
          Ver planos VIP <ArrowRight size={16} />
        </Button>
      </section>

      <section className="care-cvv">
        <span className="eyebrow"><Phone size={14} /> agora</span>
        <p className="care-cvv-kicker">Centro de Valorização da Vida</p>
        <a className="care-cvv-number" href="tel:188">188</a>
        <p>
          Ligação gratuita, sigilosa, 24 horas, todos os dias. Alguém do CVV atende do outro lado.
          Você não precisa ensaiar o que vai dizer.
        </p>
        <div className="care-cvv-actions">
          <a className="button button-primary" href="tel:188">Ligar 188 <Phone size={16} /></a>
          <a className="button button-secondary" href="https://www.cvv.org.br/" target="_blank" rel="noreferrer">
            cvv.org.br <ArrowRight size={16} />
          </a>
        </div>
      </section>

      <section className="care-cvv care-samu">
        <span className="eyebrow"><Phone size={14} /> risco à vida agora</span>
        <p className="care-cvv-kicker">SAMU</p>
        <a className="care-cvv-number" href="tel:192">192</a>
        <p>
          Se a vida estiver em risco neste momento — desmaio, tentativa, ferimento, alguém que não
          consegue ficar em segurança — ligue 192. O SAMU é emergência médica, não conversa.
        </p>
        <div className="care-cvv-actions">
          <a className="button button-primary" href="tel:192">Ligar 192 <Phone size={16} /></a>
        </div>
      </section>

      <div className="care-grid">
        <article>
          <strong>Risco imediato</strong>
          <p>Se há perigo agora, vá a um pronto-socorro ou ligue:</p>
          <ul>
            <li><a href="tel:192">192 · SAMU</a></li>
            <li><a href="tel:190">190 · Polícia</a></li>
            <li><a href="tel:193">193 · Bombeiros</a></li>
          </ul>
        </article>
        <article>
          <strong>CAPS e UBS</strong>
          <p>
            O CAPS (Centro de Atenção Psicossocial) e a UBS do seu bairro atendem de graça pelo SUS.
            No mapa do celular, busque “CAPS” ou “Unidade Básica de Saúde”.
          </p>
        </article>
        <article>
          <strong>Alguém perto</strong>
          <p>
            Se existir uma pessoa de confiança, um recado curto basta: “não estou bem, pode ficar
            comigo um pouco?”. Você não precisa explicar a noite inteira.
          </p>
        </article>
      </div>

      <section className="care-block luna-philosophy">
        <span className="eyebrow"><Moon size={14} /> a lua da casa</span>
        <h2>Quem é a Luna.</h2>
        <p>
          Ela não é terapeuta, coach, nem um arquivo do que doeu. É a lua deste lugar: fica perto,
          não cobra, não lê a carta.
        </p>
        <ul className="luna-vows">
          {lunaPhilosophy.is.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="luna-not">O que ela não faz</p>
        <ul className="luna-vows dim">
          {lunaPhilosophy.isNot.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="care-block">
        <span className="eyebrow"><Heart size={14} /> convívio</span>
        <h2>O Pacto de empatia.</h2>
        <p>
          Antes do mural, cada pessoa aceita escutar com respeito, não diagnosticar e guardar a
          privacidade do outro. Você pode reler esse acordo quando quiser.
        </p>
        <Button className="button button-secondary" onClick={() => onNavigate("/onboarding/pacto")}>
          Ler o Pacto <ArrowRight size={16} />
        </Button>
      </section>

      <BreathCard />
      <PeacePlayer onNeedPlan={() => onNavigate("/planos")} />

      <section className="care-block">
        <span className="eyebrow"><Heart size={14} /> no mural</span>
        <h2>Quando uma carta pesar demais.</h2>
        <p>
          Você pode fechar a carta. Pode não responder hoje. Pode mandar só uma energia, ou nenhuma.
          Cuidar de outra pessoa nunca é obrigação neste espaço — e o teto de conselhos existe para
          o seu jardim também descansar.
        </p>
        <Button className="button button-secondary" onClick={() => onNavigate("/mural")}>
          Voltar ao Mural <ArrowRight size={16} />
        </Button>
      </section>

      <section className="care-block">
        <span className="eyebrow"><MapPin size={14} /> profissional</span>
        <h2>Ajuda que dura mais que uma noite.</h2>
        <ul className="care-list">
          <li>Psicologia pelo SUS: comece na UBS. Lá encaminham para o CAPS quando faz sentido.</li>
          <li>CRP do seu estado lista profissionais. Busque “CRP” + a sigla do estado.</li>
          <li>Se você já tem terapeuta, uma mensagem marcada para o próximo horário também é cuidado.</li>
        </ul>
      </section>

      <section className="care-block care-limits">
        <ShieldCheck size={20} />
        <div>
          <h2>O que este espaço não é.</h2>
          <p>
            O Refúgio da Lua não é consultório, emergência, diagnóstico nem tratamento. Cartas e
            conselhos são presença entre pares. Se a dor pedir mais do que uma escuta, os números
            acima existem para isso.
          </p>
        </div>
      </section>

      <section className="care-block">
        <span className="eyebrow"><Mail size={14} /> fale com a casa</span>
        <h2>Relatar algo ou escrever para nós.</h2>
        <p>
          Carta inadequada, erro no site ou uma dúvida: a gente lê. Não é o 188 — se a vida estiver
          em risco, ligue agora.
        </p>
        <p>
          E-mail:{" "}
          <a href="mailto:contato@refugiodalua.com.br">contato@refugiodalua.com.br</a>
        </p>
        <Button className="button button-primary" onClick={() => onNavigate("/contato")}>
          Abrir contato <ArrowRight size={16} />
        </Button>
      </section>
    </div>
  );
}

function BreathCard() {
  const [on, setOn] = useState(false);
  return (
    <section className={`care-breath ${on ? "is-on" : ""}`}>
      <span className="eyebrow"><Wind size={14} /> um ciclo</span>
      <h2>Quatro tempos para o corpo.</h2>
      <p>Inspire pelo nariz. Segure. Solte pela boca. De novo. Ninguém está cronometrando você.</p>
      <div className="breath-orb" aria-hidden="true" />
      <Button className="button button-secondary" onClick={() => setOn((v) => !v)}>
        {on ? "Pausar" : "Começar a respirar"}
      </Button>
      {on && <small>4 segundos entra · 7 segura · 8 sai. Pode parar quando quiser.</small>}
    </section>
  );
}

