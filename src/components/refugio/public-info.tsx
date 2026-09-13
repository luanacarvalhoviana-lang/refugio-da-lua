import { ArrowLeft, ArrowRight, Check, Heart, LockKeyhole, Moon, ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/refugio/button";

const lastUpdated = "12 de setembro de 2026";

function InfoShell({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: React.ReactNode }) {
  return <div className="public-page info-page">
    <header className="info-header page-wrap"><Link to="/inicio" className="back-link"><ArrowLeft size={16} /> Voltar ao início</Link><Link to="/inicio" className="info-mark"><Moon size={17} /> Refúgio da Lua</Link></header>
    <main className="info-layout page-wrap">
      <div className="info-hero"><span className="eyebrow"><span className="eyebrow-dot" /> {eyebrow}</span><h1>{title}</h1><p>{intro}</p><small>Última atualização: {lastUpdated}</small></div>
      <article className="info-card">{children}</article>
    </main>
    <footer className="info-footer page-wrap"><span>© 2026 Refúgio da Lua</span><nav><Link to="/sobre">Sobre</Link><Link to="/privacidade">Privacidade</Link><Link to="/termos">Termos</Link><Link to="/apoio">Apoio</Link></nav></footer>
  </div>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="info-section"><h2>{title}</h2>{children}</section>;
}

export function AboutPage() {
  return <InfoShell eyebrow="um lugar para pousar" title="Cuidado sem pressa, presença sem julgamento." intro="O Refúgio da Lua é um espaço digital de acolhimento, escrita e autocuidado para quem precisa de um lugar seguro para chegar como está.">
    <div className="info-callout"><Heart size={19} /><p>Você não precisa atravessar tudo sozinho. Aqui, cada pessoa escolhe o que quer escrever, guardar e compartilhar.</p></div>
    <Section title="O que é o Refúgio"><p>O Refúgio reúne um mural de cartas, um espaço de escrita, um Jardim pessoal e recursos de cuidado. A proposta é oferecer pequenas formas de presença em dias difíceis, sem exigir exposição, produtividade ou respostas perfeitas.</p></Section>
    <Section title="Como funciona"><div className="info-points"><div><span>01</span><strong>Coloque para fora</strong><p>Escreva cartas no seu ritmo. No mural elas não ficam para sempre: evaporam como orvalho se ninguém cuidar, ou depois de uma semana se cuidaram.</p></div><div><span>02</span><strong>Encontre presença</strong><p>O encontro é a carta — a Carta da Noite, o mural. Sem ranking.</p></div><div><span>03</span><strong>Seu Jardim é fechado</strong><p>Ninguém visita a árvore de outra pessoa. A Luna olha o que cresceu, nunca o texto que você escreveu.</p></div></div></Section>
    <Section title="Nossos limites"><p>O Refúgio é uma plataforma de apoio e bem-estar. Não é serviço médico, psicológico, psiquiátrico, de emergência ou de diagnóstico. Em risco imediato à vida, ligue 192 (SAMU) ou vá a um pronto-socorro. No Brasil, o CVV atende pelo 188, 24h, gratuito.</p><Button asChild className="button button-secondary"><Link to="/apoio">Ver orientações de apoio <ArrowRight size={16} /></Link></Button></Section>
    <Section title="Planos VIP"><p>Os planos pagos ampliam recursos de personalização e cuidado, como cartas ilimitadas, filtros, diário, avatares, papéis, selos e Sons de Paz. Os benefícios disponíveis devem ser consultados na página de planos antes da assinatura.</p><Button asChild className="button button-primary"><Link to="/planos">Conhecer os planos <ArrowRight size={16} /></Link></Button></Section>
  </InfoShell>;
}

export function PrivacyPage() {
  return <InfoShell eyebrow="seus dados são seus" title="Política de Privacidade" intro="Esta página explica, em linguagem direta, quais dados podem ser usados para o Refúgio funcionar e quais escolhas você tem sobre eles.">
    <div className="info-callout"><LockKeyhole size={19} /><p>Privacidade não é um detalhe do produto. É uma condição para que você possa escolher o que fica só seu.</p></div>
    <Section title="1. Quem somos"><p>O Refúgio da Lua é uma plataforma digital de acolhimento, escrita emocional e autocuidado, operada sob esse nome. Controladora dos dados: Refúgio da Lua, contato <a href="mailto:contato@refugiodalua.com.br">contato@refugiodalua.com.br</a>. No perfil público e nas cartas aparece apenas o pseudônimo que você escolher — não o nome civil de ninguém.</p></Section>
    <Section title="2. Lei Geral de Proteção de Dados (LGPD)"><p>Tratamos dados pessoais nos termos da Lei nº 13.709/2018. As bases legais, conforme o caso, são: <strong>execução de contrato</strong> (criar e manter sua conta), <strong>consentimento</strong> (publicar uma carta no mural) e <strong>legítimo interesse</strong> (segurança, prevenção de abuso e funcionamento técnico do site).</p><p>Você pode, a qualquer momento: confirmar se tratamos seus dados, acessá-los, corrigi-los, pedir a portabilidade, pedir a exclusão, revogar o consentimento e obter informação sobre compartilhamentos. Para exercer esses direitos — inclusive <strong>apagar a conta e as cartas</strong> — escreva para <a href="mailto:contato@refugiodalua.com.br">contato@refugiodalua.com.br</a> ou use Configurações no app. Responderemos em até 15 dias. A Autoridade Nacional de Proteção de Dados (ANPD) é o órgão de fiscalização.</p></Section>
    <Section title="3. Dados que podemos tratar"><p>Podemos tratar dados de conta, como nome ou pseudônimo, e-mail e identificadores técnicos necessários para autenticação e segurança. Também podemos tratar conteúdos que você decide criar, como cartas, rascunhos, favoritos e configurações do Jardim.</p><p>Dados de pagamento são processados pelo Stripe. O Refúgio não armazena número completo de cartão, código de segurança ou data de validade.</p></Section>
    <Section title="4. Para que usamos os dados"><p>Usamos os dados para autenticar sua conta, salvar suas escolhas, exibir os recursos solicitados, proteger a plataforma contra abuso, responder ao suporte e processar assinaturas quando você escolher um plano VIP.</p><p>Não vendemos seus dados pessoais. Não usamos seus textos para publicidade personalizada.</p></Section>
    <Section title="5. Conteúdo e visibilidade"><p>Você escolhe se uma carta vai ao Mural. Cartas no mural evaporam: sem cuidado, em dois dias; com energia ou conselho, em uma semana. Depois viram húmus no seu jardim ou vão ao diário — só você vê isso. O jardim não é visitável. A Luna não cita o texto das suas cartas.</p></Section>
    <Section title="6. Serviços de terceiros"><p>Podemos usar provedores especializados para autenticação, hospedagem, armazenamento, análise técnica e pagamentos. Esses provedores recebem apenas os dados necessários para executar suas funções e devem aplicar suas próprias políticas de privacidade.</p></Section>
    <Section title="7. Retenção e segurança"><p>Adotamos controles técnicos e organizacionais compatíveis com o porte e a finalidade do serviço. Mantemos dados enquanto a conta estiver ativa ou enquanto forem necessários para cumprir obrigações legais, resolver disputas e prevenir abusos. Nenhum sistema conectado à internet é completamente invulnerável.</p></Section>
    <Section title="8. Seus direitos"><p>Você pode solicitar acesso, correção, exclusão, informação sobre o uso e portabilidade dos seus dados, observadas as limitações legais e técnicas. Para exercer esses direitos, escreva para <a href="mailto:contato@refugiodalua.com.br">contato@refugiodalua.com.br</a> ou use a página de contato no site.</p></Section>
    <Section title="9. Atualizações"><p>Podemos atualizar esta política quando o produto mudar. A data no topo indicará a versão vigente. Mudanças relevantes serão comunicadas por meios razoáveis dentro da plataforma.</p></Section>
    <div className="info-ack"><ShieldCheck size={17} /><span>Leia também os <Link to="/termos">Termos de Uso</Link> para entender as regras de convivência.</span></div>
  </InfoShell>;
}

export function TermsPage() {
  return <InfoShell eyebrow="convivência com cuidado" title="Termos de Uso" intro="Estes termos definem as regras básicas para usar o Refúgio com segurança, respeito e expectativas claras.">
    <Section title="1. Aceitação"><p>Ao acessar ou usar o Refúgio, você concorda com estes Termos de Uso e com a Política de Privacidade. Se não concordar, não utilize os recursos da plataforma.</p></Section>
    <Section title="2. Elegibilidade e conta"><p>O Refúgio é destinado apenas a pessoas com 18 anos ou mais. Ao criar conta ou usar o serviço, você declara ter essa idade. No mural aparece só o pseudônimo. A conta é pessoal e não deve ser compartilhada.</p></Section>
    <Section title="3. Responsabilidade de quem usa"><p>Quem escreve responde pelo próprio texto. O Refúgio não é consultório, não garante a veracidade de cada carta e não se responsabiliza por conselhos trocados entre pessoas. Não publique história inventada por inteligência artificial como se fosse o seu desabafo. Não peça nem ofereça diagnóstico. Se um relato não for o seu, não publique.</p></Section>
    <Section title="4. Responsabilidade de quem acolhe"><p>Quem envia energia ou conselho age como visitante cuidadoso, não como terapeuta. Não diagnostique, não mande a pessoa parar um tratamento, não use texto gerado por inteligência artificial e não exponha a história de ninguém fora dali. Um conselho é um gesto. Não substitui profissional de saúde.</p></Section>
    <Section title="5. Regras de convivência"><p>Não publique ameaças, assédio, discurso de ódio, exploração sexual, conteúdo que incentive automutilação, fraude, exposição de dados pessoais ou qualquer material ilegal. Não tente identificar ou expor pessoas que escolheram publicar anonimamente.</p></Section>
    <Section title="4. Moderação"><p>Podemos ocultar, limitar ou remover conteúdo que viole estes termos, coloque pessoas em risco ou prejudique a segurança da comunidade. A moderação não garante que todo conteúdo inadequado será identificado imediatamente.</p></Section>
    <Section title="5. Limites de cuidado"><p>O Refúgio oferece apoio digital e não substitui profissionais de saúde, terapia, atendimento médico ou serviços de emergência. Não use o site como único recurso em uma crise. Se a vida estiver em risco agora, ligue 192 (SAMU) ou procure um pronto-socorro. Para conversa em crise, o CVV atende pelo 188, 24h, gratuito.</p></Section>
    <Section title="6. Planos e pagamentos"><p>Os planos VIP, preços, periodicidade e benefícios aparecem na página de planos antes da compra. As cobranças recorrentes são processadas pelo Stripe. Cancelamentos, falhas de pagamento e reembolsos seguem as condições exibidas no checkout e as regras aplicáveis.</p></Section>
    <Section title="7. Propriedade e disponibilidade"><p>O nome, a identidade visual, o código e os materiais originais do Refúgio pertencem aos seus respectivos titulares. O serviço pode passar por manutenção, mudanças ou interrupções. Não prometemos disponibilidade contínua nem que todos os recursos permanecerão iguais para sempre.</p></Section>
    <Section title="8. Encerramento"><p>Você pode apagar a conta em Configurações. Isso remove seus dados guardados no Refúgio (cartas, diário, memórias e preferências). Podemos suspender contas que violem estes termos ou apresentem risco relevante para a comunidade.</p></Section>
    <Section title="9. Atualizações e contato"><p>Estes termos podem ser atualizados quando o produto ou as exigências legais mudarem. A versão vigente será indicada pela data no topo da página. Em caso de dúvida, escreva para <a href="mailto:contato@refugiodalua.com.br">contato@refugiodalua.com.br</a>.</p></Section>
    <div className="info-ack"><Check size={17} /><span>Ao continuar usando o Refúgio, você confirma que leu estes termos e a <Link to="/privacidade">Política de Privacidade</Link>.</span></div>
  </InfoShell>;
}
