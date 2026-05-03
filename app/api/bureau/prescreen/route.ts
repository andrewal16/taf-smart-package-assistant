import { NextRequest, NextResponse } from "next/server";
import { runBureauPrescreen } from "@/lib/bureau/bureauClient";
import { mapRisk } from "@/lib/bureau/riskMapper";
import { logAudit } from "@/lib/audit/log";
import { isPrototypeMode, mockScenarioMap, type MockReason, type MockScenario } from "@/lib/bureau/mockScenario";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.consentAttestation) return NextResponse.json({ success: false, error: "Consent required" }, { status: 400 });

  if (isPrototypeMode()) {
    const scenario: MockScenario = body.mockScenario || "GREEN";
    const reason: MockReason | undefined = body.mockReason;
    const mapped = mockScenarioMap[scenario];

    const response = {
      success: true,
      mode: "mock",
      dealerVisibleResult: {
        status: mapped.status,
        title: mapped.title,
        message: mapped.message,
        recommendedActions: mapped.recommendedActions,
        disclaimer: "Prototype simulation only. This is not final credit approval.",
      },
      internal: {
        reasonCodes: mapped.reasonCodes,
        riskSignal: mapped.riskSignal,
        mockScenario: true,
        rawBureauStored: false,
      },
    };

    await logAudit("MOCK_BUREAU_PRESCREEN", "VerifiedCheck", { mockScenario: scenario, mockReason: reason, dealerVisibleStatus: mapped.status, reasonCodes: mapped.reasonCodes }, body.userId);
    return NextResponse.json(response);
  }

  const bureau = await runBureauPrescreen();
  const mapped = mapRisk(bureau.signal, true);
  return NextResponse.json({
    success: true,
    mode: "live",
    dealerVisibleResult: {
      status: mapped.status,
      title: "Hasil Prescreening Awal",
      message: mapped.message,
      recommendedActions: ["Lanjutkan e-KYC", "Lengkapi dokumen income", "Naikkan DP", "Manual review by TAF Officer"],
      disclaimer: "Prototype simulation only. This is not final credit approval.",
    },
    internal: { reasonCodes: mapped.reasonCodes, bureauRequestId: bureau.requestId, riskSignal: bureau.signal, rawBureauStored: false },
  });
}
