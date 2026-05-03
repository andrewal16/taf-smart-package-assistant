import crypto from "crypto";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";
import type { AppRole } from "./rbac";

const COOKIE_NAME = "taf_demo_session";
const secret = process.env.AUTH_SECRET || "dev-auth-secret-change-me";

export type SessionUser = { userId: string; email: string; role: AppRole; name: string };

type SessionPayload = SessionUser & { exp: number };

function base64url(input: string): string {
  return Buffer.from(input).toString("base64url");
}

function sign(data: string): string {
  return crypto.createHmac("sha256", secret).update(data).digest("base64url");
}

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(`${secret}:${password}`).digest("hex");
}

export const DEMO_CREDENTIALS = {
  "admin@example.com": { passwordHash: hashPassword("admin123") },
  "dealer@example.com": { passwordHash: hashPassword("dealer123") },
};

export function createSessionToken(user: SessionUser): string {
  const payload: SessionPayload = { ...user, exp: Date.now() + 1000 * 60 * 60 * 8 };
  const body = base64url(JSON.stringify(payload));
  const signature = sign(body);
  return `${body}.${signature}`;
}

export function verifySessionToken(token?: string | null): SessionUser | null {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  if (sign(body) !== signature) return null;
  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf-8")) as SessionPayload;
    if (parsed.exp < Date.now()) return null;
    return { userId: parsed.userId, email: parsed.email, role: parsed.role, name: parsed.name };
  } catch {
    return null;
  }
}

export function getSessionUserFromServerCookies(): SessionUser | null {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export function getSessionUserFromRequest(req: NextRequest): SessionUser | null {
  return verifySessionToken(req.cookies.get(COOKIE_NAME)?.value);
}

export function setSessionCookie(res: NextResponse, user: SessionUser): void {
  res.cookies.set(COOKIE_NAME, createSessionToken(user), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 });
}

export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(COOKIE_NAME, "", { httpOnly: true, expires: new Date(0), path: "/" });
}
