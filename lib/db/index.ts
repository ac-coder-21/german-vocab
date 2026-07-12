import { Pool, type QueryResultRow } from "pg";

declare global {
  var __vocabPool: Pool | undefined;
}

function createPool() {
  const connectionString = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "Missing POSTGRES_URL (or DATABASE_URL). Add a Postgres database in the " +
        "Vercel dashboard (Storage tab) and pull its env vars with `vercel env " +
        "pull .env.local`, or set POSTGRES_URL yourself for local dev."
    );
  }
  return new Pool({ connectionString });
}

// Reuse the pool across Next.js dev-server hot reloads so we don't open a
// fresh batch of connections on every edit.
const pool = globalThis.__vocabPool ?? createPool();
if (process.env.NODE_ENV !== "production") {
  globalThis.__vocabPool = pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const result = await pool.query<T>(text, params);
  return result.rows;
}

function ensureColumn(table: string, column: string, definition: string) {
  return query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${column} ${definition}`);
}

async function initSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS nouns (
      id SERIAL PRIMARY KEY,
      german TEXT NOT NULL,
      english TEXT NOT NULL,
      artikel TEXT NOT NULL CHECK (artikel IN ('der', 'die', 'das')),
      set_number INTEGER NOT NULL DEFAULT 0
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS adjectives (
      id SERIAL PRIMARY KEY,
      german TEXT NOT NULL,
      english TEXT NOT NULL,
      set_number INTEGER NOT NULL DEFAULT 0
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS opposites (
      id SERIAL PRIMARY KEY,
      word TEXT NOT NULL,
      opposite TEXT NOT NULL,
      set_number INTEGER NOT NULL DEFAULT 0
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS other_words (
      id SERIAL PRIMARY KEY,
      german TEXT NOT NULL,
      english TEXT NOT NULL,
      set_number INTEGER NOT NULL DEFAULT 0
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS verbs (
      id SERIAL PRIMARY KEY,
      german TEXT NOT NULL,
      english TEXT NOT NULL,
      set_number INTEGER NOT NULL DEFAULT 0
    )
  `);

  for (const pronoun of ["ich", "du", "er_sie_es", "wir", "ihr", "sie_formal"]) {
    await ensureColumn("verbs", pronoun, "TEXT");
  }
}

let schemaReady: Promise<void> | undefined;

// Every lib/db/*.ts module awaits this before its first query so the schema
// exists no matter which module happens to load (and run its seed) first.
export function ready(): Promise<void> {
  if (!schemaReady) schemaReady = initSchema();
  return schemaReady;
}
