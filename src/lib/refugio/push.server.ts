import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

type Sql = { query: Function };

async function ensurePushTables(sql: Sql) {
  await sql.query(`create table if not exists push_keys (
    id text primary key,
    public_key text not null,
    private_key text not null
  )`);
  await sql.query(`create table if not exists push_subscriptions (
    endpoint text primary key,
    user_id text not null,
    p256dh text not null,
    auth text not null,
    created_at timestamptz not null default now()
  )`);
}

async function vapidKeys(sql: Sql) {
  await ensurePushTables(sql);
  const found = await sql.query<{ public_key: string; private_key: string }>(
    `select public_key, private_key from push_keys where id = 'vapid'`,
  );
  const row = Array.isArray(found) ? found[0] : null;
  if (row?.public_key && row.private_key) return row;
  const webpush = (await import("web-push")).default;
  const made = webpush.generateVAPIDKeys();
  await sql.query(
    `insert into push_keys (id, public_key, private_key) values ('vapid', $1, $2)
     on conflict (id) do nothing`,
    [made.publicKey, made.privateKey],
  );
  const again = await sql.query<{ public_key: string; private_key: string }>(
    `select public_key, private_key from push_keys where id = 'vapid'`,
  );
  return (Array.isArray(again) ? again[0] : null) || { public_key: made.publicKey, private_key: made.privateKey };
}

async function readyPush() {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const keys = await vapidKeys(sql);
  const webpush = (await import("web-push")).default;
  webpush.setVapidDetails("mailto:contato.refugiodalua@gmail.com", keys.public_key, keys.private_key);
  return { sql, webpush };
}

export const pushPublicKey = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const keys = await vapidKeys(sql);
    return { publicKey: keys.public_key };
  } catch {
    return { publicKey: "" };
  }
});

export const savePushSubscription = createServerFn({ method: "POST" })
  .validator(
    z.object({
      endpoint: z.string().min(12).max(2000),
      p256dh: z.string().min(8).max(300),
      auth: z.string().min(4).max(300),
    }),
  )
  .handler(async ({ data }) => {
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const user = await getSessionUser();
    if (!user) return { ok: false as const, message: "Entre na conta para o aviso saber qual carta é sua." };
    try {
      const { sql } = await readyPush();
      await sql.query(
        `insert into push_subscriptions (endpoint, user_id, p256dh, auth)
         values ($1, $2, $3, $4)
         on conflict (endpoint) do update set user_id = excluded.user_id, p256dh = excluded.p256dh, auth = excluded.auth`,
        [data.endpoint, user.id, data.p256dh, data.auth],
      );
      return { ok: true as const, message: "Avisos ligados." };
    } catch {
      return { ok: false as const, message: "Não consegui guardar o aviso neste aparelho." };
    }
  });

export const dropPushSubscription = createServerFn({ method: "POST" })
  .validator(z.object({ endpoint: z.string().min(12).max(2000) }))
  .handler(async ({ data }) => {
    try {
      const { getSql } = await import("@/lib/db");
      const sql = await getSql();
      await sql.query(`delete from push_subscriptions where endpoint = $1`, [data.endpoint]);
    } catch {
      /* leaving the row does not keep the phone buzzing */
    }
    return { ok: true as const };
  });

export async function sendPushToUser(userId: string, payload: { title: string; body: string; url: string }) {
  if (!userId || userId === "seed") return;
  const { sql, webpush } = await readyPush();
  const rows = await sql.query<{ endpoint: string; p256dh: string; auth: string }>(
    `select endpoint, p256dh, auth from push_subscriptions where user_id = $1`,
    [userId],
  );
  const list = Array.isArray(rows) ? rows : [];
  await Promise.all(
    list.map(async (row) => {
      try {
        await webpush.sendNotification(
          { endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } },
          JSON.stringify(payload),
        );
      } catch (error) {
        const status = (error as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) {
          await sql.query(`delete from push_subscriptions where endpoint = $1`, [row.endpoint]);
        }
      }
    }),
  );
}
