import { useState } from "react";
import { StoryShell, useHouse } from "@/components/refugio/story-shell";
import { confirmPasswordReset, requestPasswordReset, signInEmail, signUpEmail } from "@/lib/auth/client";

export function AccountPage() {
  const { t } = useHouse();
  const [mode, setMode] = useState<"enter" | "create">("enter");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  return (
    <StoryShell>
      <section className="house-block">
        <h1>{t.accountTitle}</h1>
        <p>{t.accountLead}</p>
        <form
          className="soon-form"
          onSubmit={(event) => {
            event.preventDefault();
            setError("");
            setPending(true);
            const run =
              mode === "create"
                ? signUpEmail({ name, email, password })
                : signInEmail(email, password);
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
        <p className="house-note">
          <button type="button" className="house-quiet" onClick={() => setMode(mode === "create" ? "enter" : "create")}>
            {mode === "create" ? t.accountHave : t.accountCreate}
          </button>
        </p>
        <p>
          <a href="/conta/recuperar-senha">{t.accountForgot}</a>
        </p>
        <p>
          <a href="/login">Google</a>
        </p>
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
