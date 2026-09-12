import { getSql } from "@/lib/db";

const TABLES = ["mural_letters", "user_gardens", "vip_subscriptions"] as const;

export async function exportRefugioBackup() {
  const sql = await getSql();
  const tables: Record<string, unknown[]> = {};
  for (const table of TABLES) {
    try {
      tables[table] = await sql.query(`select * from ${table}`);
    } catch {
      tables[table] = [];
    }
  }
  return { at: new Date().toISOString(), tables };
}

export function backupSecretOk(request: Request) {
  const expected = process.env.BACKUP_SECRET?.trim();
  const cron = process.env.CRON_SECRET?.trim();
  const header = request.headers.get("x-backup-secret") || "";
  const auth = request.headers.get("authorization") || "";
  const query = new URL(request.url).searchParams.get("secret") || "";
  if (expected && (header === expected || query === expected)) return true;
  if (cron && auth === `Bearer ${cron}`) return true;
  return false;
}
