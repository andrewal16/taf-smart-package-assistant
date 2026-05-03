import { NextRequest, NextResponse } from "next/server";
import { runBureauPrescreen } from "@/lib/bureau/bureauClient";
import { mapRisk } from "@/lib/bureau/riskMapper";
import { logAudit } from "@/lib/audit/log";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.consentAttestation) return NextResponse.json({ success: false, error: "Consent required" }, { status: 400 });

  const bureau = await runBureauPrescreen();
  const mapped = mapRisk(bureau.signal, true);

  const response = {
    success: true,
    dealerVisibleResult: {
      status: mapped.status,
      title: "Hasil Prescreening Awal",
      message: mapped.message,
      recommendedActions: ["Lanjutkan e-KYC", "Lengkapi dokumen income", "Naikkan DP", "Manual review by TAF Officer"],
      packageCounteroffer: {
        dpRecommendation: Number(body.packageInput?.dp ?? 0) + 5_000_000,
        tenorRecommendation: Number(body.packageInput?.tenor ?? 0),
        estimatedInstallment: Number(body.packageInput?.estimatedInstallment ?? 0),
      },
    },
    internal: {
      reasonCodes: mapped.reasonCodes,
      bureauRequestId: bureau.requestId,
      riskSignal: bureau.signal,
      rawBureauStored: false,
    },
  };

  await logAudit("BUREAU_PRESCREEN", "VerifiedCheck", { bureauRequestId: bureau.requestId, mode: bureau.mode }, undefined);
  await logAudit("RECOMMENDATION_OUTPUT", "Recommendation", { status: mapped.status, reasonCodes: mapped.reasonCodes }, undefined);
  return NextResponse.json(response);
}
