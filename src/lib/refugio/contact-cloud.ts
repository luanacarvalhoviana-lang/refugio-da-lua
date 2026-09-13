import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const sendContactNote = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().max(80).optional(),
      email: z.string().trim().email("Informe um e-mail válido para resposta.").max(120),
      topic: z.enum(["relato", "tecnico", "outro"]),
      body: z.string().min(8).max(4000),
    }),
  )
  .handler(async ({ data }) => {
    const { sendContactEmail } = await import("@/lib/auth/mail.server");
    await sendContactEmail({
      name: data.name?.trim() || "",
      email: data.email?.trim() || "",
      topic: data.topic,
      body: data.body.trim(),
    });
    return { ok: true as const };
  });
