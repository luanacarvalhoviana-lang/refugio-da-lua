import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const savePacto = createServerFn({ method: "POST" })
  .validator(z.object({ version: z.number().int().min(1).max(20) }))
  .handler(async ({ data }) => {
    const { getSessionUser } = await import("@/lib/auth/verify.server");
    const user = await getSessionUser();
    if (!user?.id) return { ok: false as const, signedIn: false };
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql.query(
      `insert into pacto_acceptances (user_id, versao) values ($1, $2)
       on conflict (user_id, versao) do nothing`,
      [user.id, data.version],
    );
    return { ok: true as const, signedIn: true };
  });
