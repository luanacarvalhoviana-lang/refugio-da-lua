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
        const full = new URL(request.url).searchParams.get("full") === "1";
        return Response.json(full ? { ok: true, at: dump.at, counts, emailed, tables: dump.tables } : { ok: true, at: dump.at, counts, emailed });
      },
    },
  },
});
