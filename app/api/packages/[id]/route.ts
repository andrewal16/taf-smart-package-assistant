import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logAudit } from "@/lib/audit/log";

export async function GET(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const pkg = await db.package.findUnique({ where: { id } });
  if (!pkg) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const history = await db.auditLog.findMany({ where: { entityType: "Package", entityId: id }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ pkg, history });
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json();
  const before = await db.package.findUnique({ where: { id } });
  if (!before) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (body.effectiveFrom && body.effectiveTo && new Date(body.effectiveFrom) > new Date(body.effectiveTo)) {
    return NextResponse.json({ error: "effectiveFrom must be before or equal to effectiveTo" }, { status: 400 });
  }

  const updated = await db.package.update({ where: { id }, data: { ...body, version: before.version + 1 } });
  await db.auditLog.create({ data: { actorId: body.actorId, action: "PACKAGE_UPDATE", entityType: "Package", entityId: id, beforeJson: before as never, afterJson: updated as never } });
  await logAudit("PACKAGE_VERSION", "Package", { version: updated.version }, body.actorId, id);
  return NextResponse.json(updated);
}
