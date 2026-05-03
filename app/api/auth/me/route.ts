import { NextRequest, NextResponse } from "next/server";
import { getSessionUserFromRequest } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  const user = getSessionUserFromRequest(req);
  if (!user || !user.userId || !user.email || !user.role) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ user });
}
