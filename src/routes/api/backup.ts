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
        return Response.json(dump);
      },
    },
  },
});
