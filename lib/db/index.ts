import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const DB_PATH = path.join(process.cwd(), "data", "vocab.db");

declare global {
  var __vocabDb: DatabaseSync | undefined;
}

function createDb() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const database = new DatabaseSync(DB_PATH);

  database.exec(`
    CREATE TABLE IF NOT EXISTS nouns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      german TEXT NOT NULL,
      english TEXT NOT NULL,
      artikel TEXT NOT NULL CHECK (artikel IN ('der', 'die', 'das')),
      set_number INTEGER NOT NULL DEFAULT 0
    )
  `);

  return database;
}

// Reuse the connection across Next.js dev-server hot reloads so we don't
// reopen the same SQLite file (and re-run schema setup) on every edit.
const db = globalThis.__vocabDb ?? createDb();
if (process.env.NODE_ENV !== "production") {
  globalThis.__vocabDb = db;
}

export default db;
