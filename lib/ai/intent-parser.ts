import { callOpenAIJson } from "./client";
import { INTENT_PARSER_SYSTEM_PROMPT } from "./prompts";

export type ParsedIntent = {
  intent: "find_package_by_installment";
  desiredInstallment: number | null;
  desiredTdp: number | null;
  model: string | null;
  dp: number | null;
  tenor: number | null;
  paymentType: "ADDM" | "ADDB" | null;
};

const MODEL_LIST = ["Avanza", "Raize", "Innova", "bZ4X"];

function parseRupiahPhrase(text: string, regex: RegExp): number | null {
  const m = text.match(regex);
  if (!m) return null;
  const raw = m[1].toLowerCase().replace(/rp|\.|,/g, "").trim();
  const juta = raw.match(/(\d+(?:\.\d+)?)\s*juta/);
  if (juta) return Math.round(Number(juta[1]) * 1_000_000);
  const jt = raw.match(/(\d+(?:\.\d+)?)\s*jt/);
  if (jt) return Math.round(Number(jt[1]) * 1_000_000);
  const angka = raw.match(/\d+/);
  return angka ? Number(angka[0]) : null;
}

function deterministicParse(message: string): ParsedIntent {
  const text = message.toLowerCase();
  const model = MODEL_LIST.find((m) => text.includes(m.toLowerCase())) ?? null;

  const desiredInstallment = parseRupiahPhrase(text, /(cicilan|angsuran)(?:\s\w+){0,5}\s(\d+[\d\s\.,]*(?:juta|jt)?)/i) ??
    parseRupiahPhrase(text, /(maksimal|max)(?:\s\w+){0,3}\s(\d+[\d\s\.,]*(?:juta|jt)?)/i);

  const dp = parseRupiahPhrase(text, /(dp|uang muka)(?:\s\w+){0,4}\s(\d+[\d\s\.,]*(?:juta|jt)?)/i);
  const desiredTdp = parseRupiahPhrase(text, /(tdp)(?:\s\w+){0,3}\s(\d+[\d\s\.,]*(?:juta|jt)?)/i);

  const tenorMatch = text.match(/(tenor|bulan)\s*(\d{1,3})/i);
  const tenor = tenorMatch ? Number(tenorMatch[2]) : null;

  const paymentType = text.includes("addb") ? "ADDB" : text.includes("addm") ? "ADDM" : null;

  return { intent: "find_package_by_installment", desiredInstallment, desiredTdp, model, dp, tenor, paymentType };
}

export async function parseIntent(message: string): Promise<ParsedIntent> {
  const aiParsed = await callOpenAIJson(INTENT_PARSER_SYSTEM_PROMPT, message);
  if (aiParsed) {
    return {
      intent: "find_package_by_installment",
      desiredInstallment: typeof aiParsed.desiredInstallment === "number" ? aiParsed.desiredInstallment : null,
      desiredTdp: typeof aiParsed.desiredTdp === "number" ? aiParsed.desiredTdp : null,
      model: typeof aiParsed.model === "string" ? aiParsed.model : null,
      dp: typeof aiParsed.dp === "number" ? aiParsed.dp : null,
      tenor: typeof aiParsed.tenor === "number" ? aiParsed.tenor : null,
      paymentType: aiParsed.paymentType === "ADDM" || aiParsed.paymentType === "ADDB" ? aiParsed.paymentType : null,
    };
  }

  return deterministicParse(message);
}
