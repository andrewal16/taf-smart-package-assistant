export function mapRisk(signal: "LOW" | "MEDIUM" | "HIGH", consent: boolean) {
  if (!consent) return { status: "NOT_RECOMMENDED", reasonCodes: ["RC10_CONSENT_MISSING"], message: "Lengkapi persetujuan customer terlebih dahulu." };
  if (signal === "LOW") return { status: "GREEN", reasonCodes: ["RC08_INTERNAL_HISTORY_POSITIVE"], message: "Eligible for fast track recommendation, subject to TAF approval process." };
  if (signal === "MEDIUM") return { status: "YELLOW", reasonCodes: ["RC05_BUREAU_REVIEW_REQUIRED"], message: "Skema awal perlu penyesuaian. Perlu review TAF Officer." };
  return { status: "MANUAL_REVIEW", reasonCodes: ["RC09_HIGH_RISK_FLAG"], message: "Perlu review TAF Officer." };
}
