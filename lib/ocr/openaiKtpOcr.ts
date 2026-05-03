import type { KtpExtracted } from "./mockKtpOcr";

const PROMPT = `You are an OCR extraction engine for Indonesian KTP images. Extract only fields visible on the card. Return strict JSON. Do not guess. If a field is unclear, return null. Required fields: nik, fullName, birthPlace, birthDate, gender, address, rtRw, kelurahan, kecamatan, religion, maritalStatus, occupation, citizenship, validUntil. Include confidence per field.`;

export async function openaiKtpOcr(file: File): Promise<KtpExtracted> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY missing");

  const buffer = Buffer.from(await file.arrayBuffer());
  const b64 = buffer.toString("base64");

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      input: [{ role: "system", content: PROMPT }, { role: "user", content: [{ type: "input_text", text: "Extract KTP fields" }, { type: "input_image", image_url: `data:${file.type};base64,${b64}` }] }],
      text: { format: { type: "json_object" } },
    }),
  });
  if (!res.ok) throw new Error("OCR live request failed");
  const json = await res.json();
  return JSON.parse(json.output_text);
}
