"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

import { getUserByEmail } from "@/lib/db/users";
import { getSession } from "@/lib/auth/session";

export type LoginState = {
  status: "idle" | "error";
  message: string;
};

// A bcrypt hash of an unguessable, never-used password. Comparing against
// this when no user is found keeps the response time close to the "valid
// user, wrong password" path, so the login form doesn't leak via timing
// whether a given email is registered.
const DUMMY_HASH = "$2b$10$AuQ1jPecG0Oiijg6EWr06O9m/ONlHIgg.h3Ag5IQ0XIAIkUjdBsrW";

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  if (!email || !password) {
    return { status: "error", message: "Enter your email and password." };
  }

  const user = await getUserByEmail(email);
  const valid = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH);

  if (!user || !valid) {
    return { status: "error", message: "Invalid email or password." };
  }

  const session = await getSession();
  session.userId = user.id;
  session.email = user.email;
  await session.save();

  redirect(next.startsWith("/") ? next : "/");
}
