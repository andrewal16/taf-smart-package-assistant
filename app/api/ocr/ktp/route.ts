import { NextRequest, NextResponse } from "next/server";
import { extractKtp } from "@/lib/ocr";
import { logAudit } from "@/lib/audit/log";

const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const consent = form.get("consentAttestation") === "true";
  const file = form.get("ktpImage") as File | null;

  if (!consent) return NextResponse.json({ success: false, error: "Consent required" }, { status: 400 });
  if (!file) return NextResponse.json({ success: false, error: "File required" }, { status: 400 });
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ success: false, error: "Invalid file type" }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ success: false, error: "File too large" }, { status: 400 });

  const result = await extractKtp(file);
  await logAudit("KTP_UPLOAD", "VerifiedCheck", { mode: result.mode, consent }, undefined);
  await logAudit("OCR_EXTRACTION", "VerifiedCheck", { nikMasked: result.data.nikMasked, confidence: result.data.confidence }, undefined);

  return NextResponse.json({ success: true, mode: result.mode, data: result.data, warnings: result.warnings });
}
