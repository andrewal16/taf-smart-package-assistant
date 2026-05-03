import { mockKtpOcr } from "./mockKtpOcr";
import { openaiKtpOcr } from "./openaiKtpOcr";

export async function extractKtp(file: File) {
  const mode = process.env.OCR_MODE === "live" ? "live" : "mock";
  if (mode === "live") {
    try {
      return { mode, data: await openaiKtpOcr(file), warnings: [] as string[] };
    } catch {
      return { mode: "mock" as const, data: await mockKtpOcr(), warnings: ["Live OCR failed, fallback to mock"] };
    }
  }
  return { mode, data: await mockKtpOcr(), warnings: [] as string[] };
}
