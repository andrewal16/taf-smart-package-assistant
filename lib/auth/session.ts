// lib/auth/session.ts
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";
import type { AppRole } from "./rbac";

const COOKIE_NAME = "taf_demo_session";
const secret = process.env.AUTH_SECRET || "dev-auth-secret-change-me";
const encoder = new TextEncoder();

export type SessionUser = { userId: string; email: string; role: AppRole; name: string };
type SessionPayload = SessionUser & { exp: number };

// ✅ Ganti Buffer dengan btoa (Web API)
function base64url(input: string): string {
  return btoa(unescape(encodeURIComponent(input)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function base64urlDecode(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4;
  const padStr = pad ? "=".repeat(4 - pad) : "";
  return decodeURIComponent(escape(atob(padded + padStr)));
}

// ✅ Ganti crypto.createHmac dengan Web Crypto API
async function getHmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function sign(data: string): Promise<string> {
  const key = await getHmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

async function verifySignature(data: string, sig: string): Promise<boolean> {
  const expected = await sign(data);
  return expected === sig;
}

// ✅ hashPassword sudah pakai Web Crypto, tapi hapus import crypto Node.js
export async function hashPassword(password: string): Promise<string> {
  const data = encoder.encode(`${secret}:${password}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function getDemoCredentials() {
  return {
    "admin@example.com": { passwordHash: await hashPassword("admin123") },
    "dealer@example.com": { passwordHash: await hashPassword("dealer123") },
  };
}

// ✅ createSessionToken jadi async
export async function createSessionToken(user: SessionUser): Promise<string> {
  const payload: SessionPayload = { ...user, exp: Date.now() + 1000 * 60 * 60 * 8 };
  const body = base64url(JSON.stringify(payload));
  const signature = await sign(body);
  return `${body}.${signature}`;
}

// ✅ verifySessionToken jadi async
export async function verifySessionToken(token?: string | null): Promise<SessionUser | null> {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  if (!(await verifySignature(body, signature))) return null;
  try {
    const parsed = JSON.parse(base64urlDecode(body)) as SessionPayload;
    if (parsed.exp < Date.now()) return null;
    return { userId: parsed.userId, email: parsed.email, role: parsed.role, name: parsed.name };
  } catch {
    return null;
  }
}

export async function getSessionUserFromServerCookies(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

// ✅ getSessionUserFromRequest jadi async
export async function getSessionUserFromRequest(req: NextRequest): Promise<SessionUser | null> {
  return verifySessionToken(req.cookies.get(COOKIE_NAME)?.value);
}

export async function setSessionCookie(res: NextResponse, user: SessionUser): Promise<void> {
  const token = await createSessionToken(user);
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(COOKIE_NAME, "", { httpOnly: true, expires: new Date(0), path: "/" });
}