export async function sendPasswordResetEmail(input: { to: string; url: string }) {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    throw new Error("O envio de e-mail ainda não está ligado neste host.");
  }
  const from = process.env.RESEND_FROM?.trim() || "Refúgio da Lua <beth.t@example.com>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: "Redefinir senha — Refúgio da Lua",
      html: `<p>Olá.</p>
<p>Alguém pediu para redefinir a senha no Refúgio da Lua.</p>
<p><a href="${input.url}">Toque aqui para escolher uma senha nova</a>.</p>
<p>O link vale por pouco tempo. Se não foi você, ignore este e-mail.</p>
<p>Luna e o Refúgio</p>`,
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body.slice(0, 180) || "Não foi possível enviar o e-mail.");
  }
}
