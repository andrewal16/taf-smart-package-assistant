export const REASON_CODES = {
  RC01: "Angsuran perlu disesuaikan.",
  RC02: "Rekomendasi DP dinaikkan.",
  RC03: "Rekomendasi ubah tenor.",
  RC04: "Lengkapi data customer.",
  RC05: "Perlu review TAF Officer.",
  RC06: "Lanjutkan verifikasi customer.",
  RC07: "Perlu approval lanjutan.",
  RC08: "Eligible untuk prioritas proses.",
  RC09: "Paket tidak tersedia untuk periode ini.",
  RC10: "Paket tidak tersedia untuk dealer/cabang ini.",
} as const;

export type ReasonCode = keyof typeof REASON_CODES;
