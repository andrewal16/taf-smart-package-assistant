export type MockScenario = "GREEN" | "YELLOW" | "MANUAL_REVIEW" | "NOT_RECOMMENDED";
export type MockReason = "CUSTOMER_PROFILE_CLEAN" | "INSTALLMENT_TOO_HIGH" | "DP_TOO_LOW" | "DATA_INCOMPLETE" | "BUREAU_REVIEW_REQUIRED" | "POLICY_DEVIATION" | "HIGH_RISK_FLAG";

export const mockScenarioMap = {
  GREEN: {
    status: "GREEN",
    title: "Green — Lanjut Fast Track",
    message: "Customer dapat dilanjutkan ke proses berikutnya berdasarkan simulasi prototype.",
    recommendedActions: ["Kirim e-KYC", "Lengkapi dokumen customer", "Lanjutkan proses pengajuan"],
    riskSignal: "LOW",
    reasonCodes: ["RC08_INTERNAL_HISTORY_POSITIVE"],
  },
  YELLOW: {
    status: "YELLOW",
    title: "Yellow — Perlu Counteroffer",
    message: "Skema awal belum optimal. Sistem merekomendasikan penyesuaian paket.",
    recommendedActions: ["Naikkan DP", "Ubah tenor", "Tawarkan paket alternatif", "Konfirmasi ulang kemampuan angsuran customer"],
    riskSignal: "MEDIUM",
    reasonCodes: ["RC01_INSTALLMENT_TOO_HIGH", "RC02_DP_TOO_LOW"],
  },
  MANUAL_REVIEW: {
    status: "MANUAL_REVIEW",
    title: "Manual Review — Perlu Review TAF Officer",
    message: "Data awal membutuhkan pengecekan lebih lanjut oleh pihak TAF.",
    recommendedActions: ["Hubungi SO TAF", "Lengkapi dokumen pendukung", "Jangan menjanjikan approval kepada customer"],
    riskSignal: "MEDIUM",
    reasonCodes: ["RC05_BUREAU_REVIEW_REQUIRED", "RC04_DATA_INCOMPLETE"],
  },
  NOT_RECOMMENDED: {
    status: "NOT_RECOMMENDED",
    title: "Not Recommended — Tidak Direkomendasikan untuk Jalur Cepat",
    message: "Customer belum direkomendasikan untuk fast track berdasarkan simulasi awal.",
    recommendedActions: ["Lanjutkan hanya jika ada informasi pendukung tambahan", "Arahkan ke review manual bila diperlukan", "Jangan menampilkan detail risk kepada dealer/customer"],
    riskSignal: "HIGH",
    reasonCodes: ["RC09_HIGH_RISK_FLAG"],
  },
} as const;

export function isPrototypeMode() {
  return process.env.BUREAU_MODE === "mock";
}
