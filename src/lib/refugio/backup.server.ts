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
  if (!expected) return false;
  const header = request.headers.get("x-backup-secret") || "";
  const query = new URL(request.url).searchParams.get("secret") || "";
  return header === expected || query === expected;
}
