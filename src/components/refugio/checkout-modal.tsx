import { useEffect, useState } from "react";
import { ArrowRight, Check, Loader2, X } from "lucide-react";
import { vipPlanCatalog, type VipPlanKey } from "@/lib/refugio/vip";
import { useRefugioStore } from "@/lib/refugio/store";
import { startStripeCheckout, stripeIsReady } from "@/lib/refugio/billing";

export default function CheckoutModal({
  plan,
  defaultEmail = "",
  defaultName = "",
  onClose,
  onStarted,
}: {
  plan: VipPlanKey;
  defaultEmail?: string;
  defaultName?: string;
  onClose: () => void;
  onStarted: () => void;
}) {
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const details = vipPlanCatalog[plan];
  const [livePay, setLivePay] = useState(false);
  const login = useRefugioStore((s) => s.login);
  const setPlan = useRefugioStore((s) => s.setPlan);

  useEffect(() => {
    stripeIsReady()
      .then(setLivePay)
      .catch(() => setLivePay(false));
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Informe um e-mail para o recibo.");
      return;
    }
    setLoading(true);
    try {
      if (livePay) {
        const origin = window.location.origin;
        const session = await startStripeCheckout({
          data: { plan, email: email.trim(), name: name.trim() || undefined, origin },
        });
        window.location.assign(session.url);
        return;
      }
      login({ name, email });
      setPlan(plan);
      onStarted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível abrir o pagamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="preview-overlay checkout-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      onClick={onClose}
    >
      <div className="checkout-modal" onClick={(event) => event.stopPropagation()}>
        <button className="preview-close" aria-label="Fechar checkout" onClick={onClose} type="button">
          <X size={19} />
        </button>
        <span className="eyebrow">
          <Check size={14} /> {livePay ? "pagamento Stripe" : "ativar neste aparelho"}
        </span>
        <h2 id="checkout-title">{livePay ? `Assinar ${details.name}.` : `Ative o ${details.name}.`}</h2>
        <p className="checkout-lead">
          {livePay
            ? "Você vai para a página segura do Stripe. O pagamento é no cartão. O Refúgio não vê o número."
            : "Ainda estamos em prévia: a assinatura fica neste aparelho, sem cobrança. No site publicado, com a chave do Stripe, este botão passa a cobrar de verdade."}
        </p>
        <div className="checkout-summary">
          <strong>{details.priceLabel}</strong>
          <span>
            {details.cadenceLabel.replace("/ ", "")} · cobrança recorrente
          </span>
        </div>
        <form onSubmit={handleSubmit} className="checkout-form">
          <label htmlFor="checkout-name">
            Como podemos chamar você? <span>opcional</span>
          </label>
          <input
            id="checkout-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Seu nome ou pseudônimo"
            autoComplete="name"
          />
          <label htmlFor="checkout-email">
            E-mail para recibo e gerenciamento <span>obrigatório</span>
          </label>
          <input
            id="checkout-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="voce@exemplo.com"
            autoComplete="email"
            required
          />
          {error && (
            <p className="checkout-error" role="alert">
              {error}
            </p>
          )}
          <button className="button button-primary checkout-submit" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={16} className="spin" /> {livePay ? "Abrindo o Stripe..." : "Ativando prévia..."}
                  </>
                ) : (
                  <>
                    {livePay ? "Pagar com Stripe" : "Ativar neste preview"} <ArrowRight size={16} />
                  </>
                )}
          </button>
        </form>
        <small className="checkout-footnote">
          No host: STRIPE_SECRET_KEY e STRIPE_WEBHOOK_SECRET. No Stripe: Developers → Webhooks → URL <code>/api/stripe/webhook</code>, eventos checkout.session.completed, customer.subscription.updated, customer.subscription.deleted.
        </small>
      </div>
    </div>
  );
}
