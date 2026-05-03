import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { findPackageOptions } from "@/lib/package/search";
import { logAudit } from "@/lib/audit/log";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const packages = await db.package.findMany();
  const options = findPackageOptions(body, packages);
  await logAudit("PACKAGE_SIMULATION", "Simulation", { input: body, count: options.length }, undefined);
  return NextResponse.json({ success: true, disclaimer: "Estimasi awal, bukan approval kredit.", options });
}
