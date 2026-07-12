// Admin-only account creation. There is no public signup page — run this
// locally (with POSTGRES_URL set, e.g. via .env.local) to add a user:
//
//   npm run create-user -- someone@example.com "a strong password"

import { Pool } from "pg";
import bcrypt from "bcryptjs";

const [, , email, password] = process.argv;

if (!email || !password) {
  console.error('Usage: npm run create-user -- <email> "<password>"');
  process.exit(1);
}

if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const connectionString = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Missing POSTGRES_URL (or DATABASE_URL) in your environment.");
  process.exit(1);
}

const pool = new Pool({ connectionString });

try {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);

  const passwordHash = await bcrypt.hash(password, 10);
  const normalizedEmail = email.trim().toLowerCase();

  const { rows } = await pool.query(
    `INSERT INTO users (email, password_hash) VALUES ($1, $2)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
     RETURNING id, email`,
    [normalizedEmail, passwordHash]
  );

  console.log(`User ready: ${rows[0].email} (id ${rows[0].id})`);
} finally {
  await pool.end();
}
