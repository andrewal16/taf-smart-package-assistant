import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseIntent } from "@/lib/ai/intent-parser";
import { findPackageOptions } from "@/lib/package/search";
import { formatDealerVisibleReasons } from "@/lib/recommendation/formatter";
import { logAudit } from "@/lib/audit/log";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = await parseIntent(body.message ?? "");

  const packages = await db.package.findMany();
  const options = findPackageOptions(
    {
      productType: "New Car",
      model: parsed.model ?? undefined,
      otr: 260_000_000,
      desiredInstallment: parsed.desiredInstallment ?? undefined,
      desiredTdp: parsed.desiredTdp ?? undefined,
      paymentType: parsed.paymentType ?? "ADDM",
      tenor: parsed.tenor ?? undefined,
      dealerId: body.context?.dealerId,
      branchId: body.context?.branchId,
    },
    packages,
  );

  const status = options[0]?.status ?? "MANUAL_REVIEW";
  const reasonCodes = options[0]?.reasonCodes ?? ["RC04"];

  const response = {
    intent: parsed.intent,
    entities: {
      desiredInstallment: parsed.desiredInstallment,
      model: parsed.model,
      dpAmount: parsed.dp,
    },
    status,
    summary: status === "GREEN" ? "Skema sesuai preferensi budget customer." : "Skema awal perlu penyesuaian agar mendekati target customer.",
    options: options.map((o) => ({
      packageId: o.packageId,
      packageName: o.packageName,
      dpAmount: Math.round(260_000_000 * o.dpPct),
      tenorMonths: o.tenorMonths,
      paymentType: o.paymentType,
      estimatedInstallment: o.estimatedInstallment,
      estimatedTdp: o.estimatedTdp,
      reasonCodes: o.reasonCodes,
    })),
    dealerVisibleReasons: formatDealerVisibleReasons(reasonCodes),
    disclaimer: "Rekomendasi awal, bukan keputusan approval final.",
  };

  await logAudit("CHAT_RECOMMENDATION", "Recommendation", response, body.context?.userId);
  return NextResponse.json(response);
}
