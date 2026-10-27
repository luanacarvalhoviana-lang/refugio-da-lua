import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const saveStoryAlert = createServerFn({ method: "POST" })
  .validator(z.object({
    email: z.string().trim().email().max(160),
    lang: z.enum(["pt", "es", "en"]),
  }))
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql.query(
      `insert into story_alerts (email, lang) values ($1, $2)
       on conflict (email) do update set lang = excluded.lang`,
      [data.email.trim().toLowerCase(), data.lang],
    );
    return { ok: true as const };
  });
