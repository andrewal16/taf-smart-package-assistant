import { NextRequest, NextResponse } from "next/server";
import { canAccessAdmin, canApprovePackage, canManageRules, type AppRole } from "@/lib/auth/rbac";

function getRole(req: NextRequest): AppRole {
  return (req.headers.get("x-user-role") as AppRole) || "DEALER_SALESMAN";
}

export function middleware(req: NextRequest) {
  const role = getRole(req);
  const path = req.nextUrl.pathname;

  if (path.startsWith("/api/packages") || path.startsWith("/api/rules")) {
    if (!canAccessAdmin(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (path.includes("/approve") && !canApprovePackage(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (path.startsWith("/api/rules") && !canManageRules(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (path.startsWith("/admin") && !canAccessAdmin(role)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*"],
};
