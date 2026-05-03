import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const FLOW = ["SUBMITTED", "CREDIT_APPROVED", "RISK_APPROVED", "COMPLIANCE_APPROVED", "APPROVED"] as const;

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json();
  const pkg = await db.package.findUnique({ where: { id } });
  if (!pkg) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const idx = FLOW.indexOf(pkg.approvalStatus as (typeof FLOW)[number]);
  if (idx < 0 || idx === FLOW.length - 1) return NextResponse.json({ error: "Cannot approve from current state" }, { status: 400 });

  const nextApproval = FLOW[idx + 1];
  const updated = await db.package.update({ where: { id }, data: { approvalStatus: nextApproval, status: nextApproval === "APPROVED" ? "ACTIVE" : pkg.status } });
  await db.auditLog.create({ data: { actorId: body.actorId, action: "PACKAGE_APPROVE", entityType: "Package", entityId: id, beforeJson: pkg as never, afterJson: updated as never } });
  return NextResponse.json(updated);
}
