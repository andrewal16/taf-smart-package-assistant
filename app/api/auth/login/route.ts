import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getDemoCredentials,
  hashPassword,
  setSessionCookie,
} from "@/lib/auth/session";

const USERNAME_MAP: Record<string, string> = {
  admin: "admin@example.com",
  dealer: "dealer@example.com",
};

export async function POST(req: NextRequest) {
  const { usernameOrEmail, password } = await req.json();
  const email =
    USERNAME_MAP[String(usernameOrEmail).toLowerCase()] ||
    String(usernameOrEmail).toLowerCase();

  const creds = await getDemoCredentials();
  const cred = creds[email as keyof typeof creds];
  if (!cred)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const passwordHash = await hashPassword(password);
  const credHash = await cred.passwordHash;
  if (passwordHash !== credHash)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const user = await db.user.findUnique({ where: { email } });
  if (!user)
    return NextResponse.json({ error: "User not seeded" }, { status: 401 });

  const res = NextResponse.json({ ok: true, role: user.role });
  await setSessionCookie(res, {
    userId: user.id,
    email: user.email,
    role: user.role as never,
    name: user.name,
  });
  return res;
}
