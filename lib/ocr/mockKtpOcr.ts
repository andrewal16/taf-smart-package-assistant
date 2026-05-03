export type KtpExtracted = {
  nik: string | null;
  nikMasked: string | null;
  fullName: string | null;
  birthPlace: string | null;
  birthDate: string | null;
  gender: string | null;
  address: string | null;
  province: string | null;
  city: string | null;
  confidence: Record<string, number>;
};

export async function mockKtpOcr(): Promise<KtpExtracted> {
  const nik = "3173123401990001";
  return {
    nik,
    nikMasked: "************0001",
    fullName: "Budi Santoso",
    birthPlace: "Jakarta",
    birthDate: "1999-01-01",
    gender: "LAKI-LAKI",
    address: "Jl. Mawar No. 1",
    province: "DKI Jakarta",
    city: "Jakarta Utara",
    confidence: { nik: 0.97, fullName: 0.95, birthDate: 0.9 },
  };
}
