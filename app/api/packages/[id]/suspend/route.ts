import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json();
  const pkg = await db.package.findUnique({ where: { id } });
  if (!pkg) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await db.package.update({ where: { id }, data: { status: "SUSPENDED" } });
  await db.auditLog.create({ data: { actorId: body.actorId, action: "PACKAGE_SUSPEND", entityType: "Package", entityId: id, beforeJson: pkg as never, afterJson: updated as never } });
  return NextResponse.json(updated);
}
