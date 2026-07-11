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

export default db;
