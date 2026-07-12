import type { SessionOptions } from "iron-session";

export type SessionData = {
  userId?: number;
  email?: string;
};

const password = process.env.SESSION_SECRET;
if (!password) {
  throw new Error(
    "Missing SESSION_SECRET. Generate one with `openssl rand -base64 32` and " +
      "add it to your environment variables."
  );
}

// Framework-agnostic session config shared between the Server Component/
// Action helper (lib/auth/session.ts) and proxy.ts, which needs the
// Request/Response overload of getIronSession rather than next/headers.
export const sessionOptions: SessionOptions = {
  cookieName: "vocab_session",
  password,
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  },
};
