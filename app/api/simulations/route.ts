import { NextRequest, NextResponse } from "next/server";
import { calculateSimulation } from "@/lib/simulation/calculator";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = calculateSimulation({
    otr: Number(body.otr),
    dpPct: Number(body.dpPct),
    annualRatePct: Number(body.annualRatePct),
    tenorMonths: Number(body.tenorMonths),
    financedInsurance: Number(body.financedInsurance ?? 0),
    cashInsurance: Number(body.cashInsurance ?? 0),
    adminFee: Number(body.adminFee ?? 0),
    paymentType: body.paymentType,
  });

  return NextResponse.json(result);
}
