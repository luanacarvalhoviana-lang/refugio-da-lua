import { useEffect, useState } from "react";
import { StoryShell, useHouse } from "@/components/refugio/story-shell";
import { dateLocale } from "@/lib/refugio/lang";
import { confirmPasswordReset, requestPasswordReset, signInEmail, signInGoogle, signUpEmail, authEnabled } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AuthorEditor } from "@/components/refugio/author-page";
import { MemoryBox } from "@/components/refugio/shop-page";
import { cancelStoryPlan, openPlanPortal, readHousePlan, readOncePurchases, readStoryPass, refundOnceBuy, refundStoryPlan } from "@/lib/refugio/billing";

function PassPanel() {
  const { lang, t } = useHouse();
  const { user } = useCurrentUserState();
  const [pass, setPass] = useState<{ plan: string; cancelAt: string | Date | null; refundable: boolean } | null>(null);
  const [house, setHouse] = useState<{ plan: string; periodEnd: string | Date | null; redeemed: boolean } | null>(null);
  const [buys, setBuys] = useState<{ id: string; item: string; criado_em: string | Date }[]>([]);
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);
  useEffect(() => {
    if (!user || user.isDevFallback) return;
    void readStoryPass()
      .then((result) => setPass(result.pass))
      .catch(() => setPass(null));
    void readHousePlan()
      .then((result) => setHouse({ plan: result.plan, periodEnd: result.periodEnd, redeemed: result.redeemed }))
      .catch(() => setHouse(null));
    void readOncePurchases()
      .then((result) => setBuys(result.items))
      .catch(() => setBuys([]));
  }, [user]);
  if (!user || user.isDevFallback) return null;
  const name = pass?.plan === "constelacao" ? t.passStar : pass?.plan === "lua_cheia" ? t.passCheia : "";
  return (
    <section className="house-block pass-panel">
      <h2>{t.passTitle}</h2>
      {name ? <p className="access-pill">{name}</p> : <p>{t.passNone}</p>}
      {house?.periodEnd ? <p className="house-note">{t.planNext}: {new Date(house.periodEnd).toLocaleDateString(dateLocale(lang))}</p> : null}
      {house && house.plan !== "lua_nova" ? <p className="house-note">{house.redeemed ? t.shopClaimed : t.shopClaim}</p> : null}
      {house && house.plan !== "lua_nova" ? (
        <button type="button" onClick={() => {
          void openPlanPortal({ data: { origin: window.location.origin } }).then((result) => {
            if (result.ok && result.url) window.location.assign(result.url);
            else setNote(t.planFail);
          });
        }}>{t.planManage}</button>
      ) : null}
      {pass?.cancelAt ? <p className="house-note">{t.passCanceled}</p> : null}
      {note ? <p className="house-note">{note}</p> : null}
      {pass && !pass.cancelAt ? (
        <div className="plan-actions">
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              setPending(true);
              void cancelStoryPlan({ data: {} })
                .then((result) => setNote(result.ok ? t.passCanceled : t.planFail))
                .catch(() => setNote(t.planFail))
                .finally(() => setPending(false));
            }}
          >
            {pending ? t.passWorking : t.passCancel}
          </button>
          {pass.refundable ? (
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                setPending(true);
                void refundStoryPlan({ data: {} })
                  .then((result) => {
                    if (result.ok) {
                      setPass(null);
                      setNote(t.passRefunded);
                    } else setNote(result.reason === "prazo" ? t.passLate : t.planFail);
                  })
                  .catch(() => setNote(t.planFail))
                  .finally(() => setPending(false));
              }}
            >
              {t.passRefund}
            </button>
          ) : null}
        </div>
      ) : null}
      {buys.length > 0 ? (
        <ul className="once-owned">
          {buys.map((buy) => (
            <li key={buy.id}>
              <span>{buy.item === "pack-noite" ? t.oncePack : buy.item === "a-lampada" ? t.onceLamp : buy.item === "antes-da-lua" ? t.onceMoon : t.onceTip}</span>
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  setPending(true);
                  void refundOnceBuy({ data: { id: buy.id } })
                    .then((result) => {
                      if (result.ok) {
                        setBuys((list) => list.filter((item) => item.id !== buy.id));
                        setNote(t.passRefunded);
                      } else setNote(result.reason === "prazo" ? t.passLate : t.planFail);
                    })
                    .catch(() => setNote(t.planFail))
                    .finally(() => setPending(false));
                }}
              >
                {t.onceRefund}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <h2>{t.shopBox}</h2>
      <MemoryBox />
    </section>
  );
}

export function Door({ heading = false }: { heading?: boolean }) {
  const { t } = useHouse();
  const { user } = useCurrentUserState();
  const [mode, setMode] = useState<"enter" | "create">("enter");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  if (user && !user.isDevFallback) {
    return (
      <div className="door" id="entrar">
        {heading ? <h2>{t.accountTitle}</h2> : null}
        <p>{t.accountIn}</p>
        <a className="house-primary" href="/historias">{t.accountGo}</a>
      </div>
    );
  }
  return (
    <div className="door" id="entrar">
      {heading ? <h2>{t.accountTitle}</h2> : null}
      <p className="house-note">{t.accountLead}</p>
      {authEnabled ? (
        <button type="button" className="google-button" onClick={() => void signInGoogle({ callbackURL: "/historias", errorCallbackURL: "/#entrar" })}>
          <span>G</span> {t.googleContinue}
        </button>
      ) : (
        <p className="house-note">O entrar com Google liga quando o site publica o acesso.</p>
      )}
      <p className="door-or">{t.accountOr}</p>
      <form
        className="soon-form"
        onSubmit={(event) => {
          event.preventDefault();
          setError("");
          setPending(true);
          const run = mode === "create" ? signUpEmail({ name, email, password }) : signInEmail(email, password);
          void run
            .then(() => {
              window.location.assign("/historias");
            })
            .catch((err) => setError(err instanceof Error ? err.message : "…"))
            .finally(() => setPending(false));
        }}
      >
        {mode === "create" ? (
          <label>
            {t.name}
            <input required value={name} onChange={(event) => setName(event.target.value)} />
          </label>
        ) : null}
        <label>
          {t.email}
          <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
        </label>
        <label>
          {t.accountPassword}
          <input type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "create" ? "new-password" : "current-password"} />
        </label>
        {error ? <p className="soon-error">{error}</p> : null}
        <button type="submit" disabled={pending}>
          {mode === "create" ? t.accountCreate : t.accountEnter}
        </button>
      </form>
      <p className="house-note door-links">
        <button type="button" className="house-quiet" onClick={() => setMode(mode === "create" ? "enter" : "create")}>
          {mode === "create" ? t.accountHave : t.accountCreate}
        </button>
        <a href="/conta/recuperar-senha">{t.accountForgot}</a>
      </p>
    </div>
  );
}

export function AccountPage() {
  const { t } = useHouse();
  return (
    <StoryShell>
      <section className="house-block">
        <h1>{t.accountTitle}</h1>
        <Door />
        <p><a href="/biblioteca">{t.accountLibrary}</a></p>
        <PassPanel />
        <AuthorEditor />
      </section>
    </StoryShell>
  );
}

export function ForgotPage() {
  const { t } = useHouse();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  return (
    <StoryShell>
      <section className="house-block">
        <h1>{t.accountForgot}</h1>
        <form
          className="soon-form"
          onSubmit={(event) => {
            event.preventDefault();
            setPending(true);
            setError("");
            void requestPasswordReset(email)
              .then(() => setSent(true))
              .catch((err) => setError(err instanceof Error ? err.message : "…"))
              .finally(() => setPending(false));
          }}
        >
          <label>
            {t.email}
            <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          {error ? <p className="soon-error">{error}</p> : null}
          {sent ? <p>{t.accountSent}</p> : null}
          <button type="submit" disabled={pending}>
            {t.send}
          </button>
        </form>
        <a className="soon-back" href="/conta">
          {t.accountEnter}
        </a>
      </section>
    </StoryShell>
  );
}

export function ResetPage() {
  const { t } = useHouse();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);
  const token = typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("token") || "";
  return (
    <StoryShell>
      <section className="house-block">
        <h1>{done ? t.accountDone : t.accountNew}</h1>
        {done ? (
          <a className="house-primary" href="/conta">
            {t.accountEnter}
          </a>
        ) : (
          <form
            className="soon-form"
            onSubmit={(event) => {
              event.preventDefault();
              setError("");
              if (!token) {
                setError(t.accountNoToken);
                return;
              }
              if (password.length < 8) {
                setError(t.accountPassword);
                return;
              }
              if (password !== confirm) {
                setError(t.accountRepeat);
                return;
              }
              setPending(true);
              void confirmPasswordReset(password, token)
                .then(() => setDone(true))
                .catch((err) => setError(err instanceof Error ? err.message : "…"))
                .finally(() => setPending(false));
            }}
          >
            <label>
              {t.accountNew}
              <input type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" />
            </label>
            <label>
              {t.accountRepeat}
              <input type="password" required minLength={8} value={confirm} onChange={(event) => setConfirm(event.target.value)} autoComplete="new-password" />
            </label>
            {error ? <p className="soon-error">{error}</p> : null}
            <button type="submit" disabled={pending}>
              {t.send}
            </button>
          </form>
        )}
      </section>
    </StoryShell>
  );
}
