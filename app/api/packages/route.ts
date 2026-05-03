import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logAudit } from "@/lib/audit/log";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const brand = searchParams.get("brand") || undefined;
  const model = searchParams.get("model") || undefined;

  const packages = await db.package.findMany({
    where: {
      ...(status ? { status: status as never } : {}),
      ...(brand ? { brand: { contains: brand, mode: "insensitive" } } : {}),
      ...(model ? { model: { contains: model, mode: "insensitive" } } : {}),
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(packages);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = await db.package.create({ data: body });
  await logAudit("PACKAGE_CREATE", "Package", created, body.createdById, created.id);
  return NextResponse.json(created, { status: 201 });
}
