import { query, ready } from "@/lib/db";

export type User = {
  id: number;
  email: string;
  password_hash: string;
  created_at: string;
};

export async function getUserByEmail(email: string): Promise<User | undefined> {
  await ready();
  const rows = await query<User>("SELECT * FROM users WHERE email = $1", [
    email.trim().toLowerCase(),
  ]);
  return rows[0];
}

export async function createUser(email: string, passwordHash: string): Promise<User> {
  await ready();
  const rows = await query<User>(
    "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *",
    [email.trim().toLowerCase(), passwordHash]
  );
  return rows[0];
}
