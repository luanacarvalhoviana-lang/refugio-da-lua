const KEY = "refugio-accounts";

export type LocalAccount = {
  name: string;
  email: string;
  password: string;
  createdAt: string;
};

function load(): Record<string, LocalAccount> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "{}") as Record<string, LocalAccount>;
  } catch {
    return {};
  }
}

function save(all: Record<string, LocalAccount>) {
  window.localStorage.setItem(KEY, JSON.stringify(all));
}

export function upsertAccount(input: { name: string; email: string; password: string }) {
  const email = input.email.trim().toLowerCase();
  const all = load();
  all[email] = {
    name: input.name.trim() || "Girassol sereno",
    email,
    password: input.password,
    createdAt: all[email]?.createdAt || new Date().toISOString(),
  };
  save(all);
  return all[email];
}

export function findAccount(email: string) {
  return load()[email.trim().toLowerCase()] ?? null;
}

export function verifyAccount(email: string, password: string) {
  const account = findAccount(email);
  if (!account) return { ok: false as const, error: "Não achei uma conta com este e-mail." };
  if (account.password !== password) return { ok: false as const, error: "Senha incorreta." };
  return { ok: true as const, account };
}

export function removeAccount(email: string) {
  const all = load();
  delete all[email.trim().toLowerCase()];
  save(all);
}

export function resetPassword(email: string, next: string) {
  const account = findAccount(email);
  if (!account) return false;
  upsertAccount({ ...account, password: next });
  return true;
}
