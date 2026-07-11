import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const DB_PATH = path.join(process.cwd(), "data", "vocab.db");

declare global {
  var __vocabDb: DatabaseSync | undefined;
}

function openDb() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  return new DatabaseSync(DB_PATH);
}

// Reuse the connection across Next.js dev-server hot reloads so we don't
// reopen the same SQLite file on every edit.
const db = globalThis.__vocabDb ?? openDb();
if (process.env.NODE_ENV !== "production") {
  globalThis.__vocabDb = db;
}

// Run schema setup against whichever connection we ended up with (new or
// cached) so newly added tables show up without a full server restart.
db.exec(`
  CREATE TABLE IF NOT EXISTS nouns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    german TEXT NOT NULL,
    english TEXT NOT NULL,
    artikel TEXT NOT NULL CHECK (artikel IN ('der', 'die', 'das')),
    set_number INTEGER NOT NULL DEFAULT 0
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS adjectives (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    german TEXT NOT NULL,
    english TEXT NOT NULL,
    set_number INTEGER NOT NULL DEFAULT 0
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS opposites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word TEXT NOT NULL,
    opposite TEXT NOT NULL,
    set_number INTEGER NOT NULL DEFAULT 0
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS other_words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    german TEXT NOT NULL,
    english TEXT NOT NULL,
    set_number INTEGER NOT NULL DEFAULT 0
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS verbs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    german TEXT NOT NULL,
    english TEXT NOT NULL,
    set_number INTEGER NOT NULL DEFAULT 0
  )
`);

// Adds a column to an existing table if it isn't there yet. Needed because
// `CREATE TABLE IF NOT EXISTS` above is a no-op once the table already
// exists, so new columns added later (like verb conjugations) wouldn't
// otherwise show up for anyone who already has data.
function ensureColumn(table: string, column: string, definition: string) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all() as {
    name: string;
  }[];
  if (!columns.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

for (const pronoun of ["ich", "du", "er_sie_es", "wir", "ihr", "sie_formal"]) {
  ensureColumn("verbs", pronoun, "TEXT");
}

export default db;
