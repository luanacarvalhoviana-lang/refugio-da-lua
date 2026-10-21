import { createFileRoute } from "@tanstack/react-router";
import { backupSecretOk, exportRefugioBackup } from "@/lib/refugio/backup.server";

export const Route = createFileRoute("/api/backup")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!backupSecretOk(request)) {
          return Response.json({ error: "Não autorizado." }, { status: 401 });
        }
        const dump = await exportRefugioBackup();
        const wantEmail = new URL(request.url).searchParams.get("email") !== "0";
        let emailed = false;
        if (wantEmail) {
          try {
            const { sendBackupEmail } = await import("@/lib/auth/mail.server");
            await sendBackupEmail(dump);
            emailed = true;
          } catch {
            emailed = false;
          }
        }
        const counts = Object.fromEntries(
          Object.entries(dump.tables).map(([name, rows]) => [name, rows.length]),
        );
        return Response.json({ ok: true, at: dump.at, counts, emailed });
      },
    },
  },
});
