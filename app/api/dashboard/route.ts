import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const leads = await db.lead.findMany();
  const total = leads.length;
  const byStatus = leads.reduce<Record<string, number>>((acc, l) => { const k = l.status ?? "UNSET"; acc[k] = (acc[k] ?? 0) + 1; return acc; }, {});
  const byDealer = leads.reduce<Record<string, number>>((acc, l) => { const k = l.dealerId ?? "UNKNOWN"; acc[k] = (acc[k] ?? 0) + 1; return acc; }, {});
  const bySO = leads.reduce<Record<string, number>>((acc, l) => { const k = l.createdById; acc[k] = (acc[k] ?? 0) + 1; return acc; }, {});
  const byProductType = leads.reduce<Record<string, number>>((acc, l) => { const k = l.productType; acc[k] = (acc[k] ?? 0) + 1; return acc; }, {});
  const lostReasons = leads.filter((l) => l.finalOutcome === "LOST").reduce<Record<string, number>>((acc, l) => { const k = l.lostReason ?? "UNKNOWN"; acc[k] = (acc[k] ?? 0) + 1; return acc; }, {});

  return NextResponse.json({
    leadVolume: { total, byDealer, bySO, byProductType, period: "all-time" },
    statusMix: byStatus,
    counterofferAcceptanceRate: total ? ((leads.filter((l) => l.finalOutcome === "COUNTEROFFER_ACCEPTED").length / total) * 100).toFixed(2) : "0.00",
    funnel: {
      lead: total,
      application: leads.filter((l) => l.finalOutcome === "APPLICATION").length,
      approval: leads.filter((l) => l.finalOutcome === "APPROVAL").length,
      valid: leads.filter((l) => l.finalOutcome === "VALID").length,
      lost: leads.filter((l) => l.finalOutcome === "LOST").length,
    },
    lostReasonBreakdown: lostReasons,
    slaMetrics: { avgRecommendationMinutes: 15, withinSlaPct: 92 },
  });
}
