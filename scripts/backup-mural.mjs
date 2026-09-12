#!/usr/bin/env node
/**
 * Exporta cartas, jardins e assinaturas para um JSON.
 * Uso: DATABASE_URL="postgres://..." node scripts/backup-mural.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import pg from "pg";

const url = (process.env.DATABASE_URL || process.env.POSTGRES_URL || "").trim();
if (!url) {
  console.error("Defina DATABASE_URL para gerar o backup.");
  process.exit(1);
}

const tables = ["mural_letters", "user_gardens", "vip_subscriptions"];

const client = new pg.Client({ connectionString: url, ssl: url.includes("localhost") ? false : { rejectUnauthorized: false } });
await client.connect();
const dump = { at: new Date().toISOString(), tables: {} };
for (const table of tables) {
  try {
    const { rows } = await client.query(`select * from ${table}`);
    dump.tables[table] = rows;
    console.error(`${table}: ${rows.length} linhas`);
  } catch (error) {
    console.error(`${table}: ${error instanceof Error ? error.message : error}`);
    dump.tables[table] = [];
  }
}
await client.end();

const out = process.argv[2] || resolve(`artifacts/backup-refugio-${dump.at.slice(0, 10)}.json`);
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(dump, null, 2));
console.log(out);
