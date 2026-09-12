const FROM = () => process.env.RESEND_FROM?.trim() || "Refúgio da Lua <beth.t@example.com>";
const CONTACT_INBOX = () =>
  process.env.CONTACT_EMAIL?.trim() || "contato.refugiodalua@gmail.com";

async function resendEmail(input: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: { filename: string; content: string }[];
}) {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) throw new Error("O envio de e-mail ainda não está ligado neste host.");
  const body: Record<string, unknown> = {
    from: FROM(),
    to: [input.to],
    subject: input.subject,
    html: input.html,
  };
  if (input.replyTo) body.reply_to = input.replyTo;
  if (input.attachments?.length) body.attachments = input.attachments;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text.slice(0, 180) || "Não foi possível enviar o e-mail.");
  }
}

export async function sendPasswordResetEmail(input: { to: string; url: string }) {
  await resendEmail({
    to: input.to,
    subject: "Redefinir senha — Refúgio da Lua",
    html: `<p>Olá.</p>
<p>Alguém pediu para redefinir a senha no Refúgio da Lua.</p>
<p><a href="${input.url}">Toque aqui para escolher uma senha nova</a>.</p>
<p>O link vale por pouco tempo. Se não foi você, ignore este e-mail.</p>
<p>Luna e o Refúgio</p>`,
  });
}

function esc(value: string) {
  return value.replace(/[&<>"]/g, (ch) => {
    if (ch === "&") return "&#" + "38;";
    if (ch === "<") return "&#" + "60;";
    if (ch === ">") return "&#" + "62;";
    return "&#" + "34;";
  });
}

const topicLabel: Record<string, string> = {
  relato: "Relato de conteúdo",
  tecnico: "Problema no site",
  outro: "Outro assunto",
};

export async function sendContactEmail(input: {
  name: string;
  email: string;
  topic: string;
  body: string;
}) {
  const who = input.name.trim() || "Alguém no Refúgio";
  const reply = input.email.trim();
  await resendEmail({
    to: CONTACT_INBOX(),
    replyTo: reply.includes("@") ? reply : undefined,
    subject: `[Refúgio] ${topicLabel[input.topic] || "Contato"} — ${who}`,
    html: `<p><strong>Assunto:</strong> ${esc(topicLabel[input.topic] || input.topic)}</p>
<p><strong>Nome:</strong> ${esc(who)}</p>
<p><strong>E-mail para resposta:</strong> ${esc(reply || "(não informou)")}</p>
<p><strong>Mensagem:</strong></p>
<p>${esc(input.body).replaceAll("\n", "<br>")}</p>`,
  });
}

export async function sendBackupEmail(dump: { at: string; tables: Record<string, unknown[]> }) {
  const counts = Object.entries(dump.tables)
    .map(([name, rows]) => `${name}: ${rows.length}`)
    .join(" · ");
  const json = JSON.stringify(dump);
  await resendEmail({
    to: CONTACT_INBOX(),
    subject: `Backup do Refúgio — ${dump.at.slice(0, 10)}`,
    html: `<p>Backup automático do Refúgio da Lua.</p><p>${counts}</p><p>O JSON vai em anexo. Guarde esse e-mail; não compartilhe.</p>`,
    attachments: [
      {
        filename: `refugio-backup-${dump.at.slice(0, 10)}.json`,
        content: Buffer.from(json).toString("base64"),
      },
    ],
  });
}
