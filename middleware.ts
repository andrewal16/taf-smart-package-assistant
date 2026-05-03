import { NextRequest, NextResponse } from "next/server";
import { canAccessAdmin, canApprovePackage, canManageRules } from "@/lib/auth/rbac";
import { getSessionUserFromRequest } from "@/lib/auth/session";

function isPublic(path: string): boolean {
  return path === "/login" || path.startsWith("/api/auth/login") || path.startsWith("/api/auth/logout") || path.startsWith("/api/auth/me") || path.startsWith("/_next") || path.startsWith("/favicon") || path.includes(".");
}

// ✅ Tambah async karena getSessionUserFromRequest sekarang async
export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (isPublic(path)) return NextResponse.next();

  // ✅ Tambah await
  const user = await getSessionUserFromRequest(req);
  const isApi = path.startsWith("/api/");

  if (!user) {
    if (isApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (path.startsWith("/admin") || path.startsWith("/dashboard") || path.startsWith("/chat") || path.startsWith("/leads") || path.startsWith("/settings")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  const role = user.role;

  if (path.startsWith("/admin") && !canAccessAdmin(role)) {
    return NextResponse.redirect(new URL("/chat", req.url));
  }

  if (path.startsWith("/api/packages") || path.startsWith("/api/rules") || path.startsWith("/api/dashboard")) {
    if (!canAccessAdmin(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (path.includes("/approve") && !canApprovePackage(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (path.startsWith("/api/rules") && !canManageRules(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*", "/dashboard", "/chat", "/leads", "/settings"],
};