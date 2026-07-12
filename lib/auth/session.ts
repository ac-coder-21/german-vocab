import "server-only";
import { cookies } from "next/headers";
import { getIronSession, type IronSession } from "iron-session";

import { sessionOptions, type SessionData } from "@/lib/auth/session-options";

export type { SessionData };

export async function getSession(): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}
