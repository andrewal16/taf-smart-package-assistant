import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { DEMO_CREDENTIALS, setSessionCookie } from "@/lib/auth/session";

const USERNAME_MAP: Record<string, string> = {
  admin: "admin@example.com",
  dealer: "dealer@example.com",
};

export async function POST(req: NextRequest) {
  const { usernameOrEmail, password } = await req.json();
  const email = USERNAME_MAP[String(usernameOrEmail).toLowerCase()] || String(usernameOrEmail).toLowerCase();

  const cred = DEMO_CREDENTIALS[email as keyof typeof DEMO_CREDENTIALS];
  if (!cred) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const crypto = await import("crypto");
  const secret = process.env.AUTH_SECRET || "dev-auth-secret-change-me";
  const passwordHash = crypto.createHash("sha256").update(`${secret}:${password}`).digest("hex");
  if (passwordHash !== cred.passwordHash) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const user = await db.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "User not seeded" }, { status: 401 });

  const res = NextResponse.json({ ok: true, role: user.role });
  setSessionCookie(res, { userId: user.id, email: user.email, role: user.role as never, name: user.name });
  return res;
}
