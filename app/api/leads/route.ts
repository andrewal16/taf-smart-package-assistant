import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const lead = await db.lead.create({
    data: {
      dealerId: body.dealerId,
      branchId: body.branchId,
      createdById: body.createdById,
      customerAlias: body.customerAlias,
      productType: body.productType,
      desiredInstallment: body.desiredInstallment,
      desiredTdp: body.desiredTdp,
      selectedModel: body.selectedModel,
    },
  });

  return NextResponse.json(lead, { status: 201 });
}
