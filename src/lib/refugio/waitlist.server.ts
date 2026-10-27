import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const joinInput = z.object({
  email: z.string().trim().email().max(160),
  name: z.string().trim().max(80).optional(),
  lang: z.enum(["pt", "es", "en"]),
  role: z.enum(["leitora", "autora", "ambas"]),
  country: z.string().trim().max(12).optional(),
  ref: z.string().trim().max(16).optional(),
  consent: z.literal(true),
});

function codeOf() {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  let code = "";
  for (let i = 0; i < 8; i += 1) code += alphabet[Math.floor(Math.random() * alphabet.length)];
  return code;
}

export const joinWaitlist = createServerFn({ method: "POST" })
  .validator(joinInput)
  .handler(async ({ data }) => {
    const { createHash, randomUUID } = await import("node:crypto");
    const { getRequest } = await import("@tanstack/react-start/server");
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const email = data.email.trim().toLowerCase();
    const existing = await sql<{ referral_code: string }>`
      select referral_code from waitlist where email = ${email} limit 1
    `;
    if (existing[0]?.referral_code) {
      return { ok: true as const, code: existing[0].referral_code, already: true };
    }

    let ip = "unknown";
    try {
      const request = getRequest();
      ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
    } catch {
      ip = "unknown";
    }
    const ipHash = createHash("sha256").update(`refugio-waitlist-v1:${ip}`).digest("hex");
    const recent = await sql<{ n: number }>`
      select count(*) as n from waitlist
      where ip_hash = ${ipHash} and created_at > now() - interval '1 hour'
    `;
    if (Number(recent[0]?.n ?? 0) >= 5) {
      throw new Error(data.lang === "en" ? "Wait a moment and try again." : data.lang === "es" ? "Espera un poco e inténtalo de nuevo." : "Espera um pouco e tenta de novo.");
    }

    const ref = data.ref?.trim().toLowerCase() || "";
    let referredBy: string | null = null;
    if (ref) {
      const match = await sql<{ referral_code: string }>`
        select referral_code from waitlist where referral_code = ${ref} limit 1
      `;
      referredBy = match[0]?.referral_code ?? null;
    }

    let code = codeOf();
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        await sql`
          insert into waitlist (id, email, name, lang, role_interest, country, referral_code, referred_by, consent, ip_hash)
          values (
            ${randomUUID()},
            ${email},
            ${data.name?.trim() || null},
            ${data.lang},
            ${data.role},
            ${data.country || null},
            ${code},
            ${referredBy},
            ${true},
            ${ipHash}
          )
        `;
        break;
      } catch (error) {
        const message = error instanceof Error ? error.message : "";
        if (message.includes("waitlist_email") || message.includes("email")) {
          const again = await sql<{ referral_code: string }>`
            select referral_code from waitlist where email = ${email} limit 1
          `;
          if (again[0]?.referral_code) return { ok: true as const, code: again[0].referral_code, already: true };
        }
        code = codeOf();
        if (attempt === 4) throw new Error(data.lang === "en" ? "I could not save your email now." : data.lang === "es" ? "No pude guardar tu correo ahora." : "Não consegui guardar seu e-mail agora.");
      }
    }

    try {
      const { sendWaitlistWelcome } = await import("@/lib/auth/mail.server");
      await sendWaitlistWelcome({ to: email, lang: data.lang, code });
    } catch {
      /* a lista vale mesmo se o e-mail não sair */
    }
    return { ok: true as const, code, already: false };
  });

export const waitlistCount = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<{ n: number }>`select count(*) as n from waitlist`;
    return { total: Number(rows[0]?.n ?? 0) };
  } catch {
    return { total: 0 };
  }
});
