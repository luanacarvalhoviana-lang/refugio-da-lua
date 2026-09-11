import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSessionUser, UnauthorizedError } from "@/lib/auth/verify.server";
import { getSql } from "@/lib/db";

export const loadUserGarden = createServerFn({ method: "POST" }).handler(async () => {
  const user = await getSessionUser();
  if (!user) return null;
  const sql = await getSql();
  const rows = await sql.query<{ payload: unknown; stamp: string | number }>(
    `select payload, (extract(epoch from updated_at) * 1000)::bigint as stamp
     from user_gardens where user_id = $1`,
    [user.id],
  );
  const row = rows[0];
  if (!row) return null;
  return {
    payloadJson: typeof row.payload === "string" ? row.payload : JSON.stringify(row.payload ?? {}),
    stamp: Number(row.stamp),
  };
});

export const saveUserGarden = createServerFn({ method: "POST" })
  .validator(
    z.object({
      payloadJson: z.string().max(1_500_000),
      stamp: z.number(),
    }),
  )
  .handler(async ({ data }) => {
    const user = await getSessionUser();
    if (!user) throw new UnauthorizedError();
    JSON.parse(data.payloadJson);
    const sql = await getSql();
    await sql.query(
      `insert into user_gardens (user_id, email, payload, updated_at)
       values ($1, $2, $3::jsonb, to_timestamp($4 / 1000.0))
       on conflict (user_id) do update set
         email = excluded.email,
         payload = excluded.payload,
         updated_at = excluded.updated_at
       where user_gardens.updated_at <= excluded.updated_at`,
      [user.id, user.email, data.payloadJson, data.stamp],
    );
    return { ok: true as const };
  });
