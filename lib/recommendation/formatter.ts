import { REASON_CODES } from "../rules/reason-codes";

export function formatDealerVisibleReasons(reasonCodes: string[]): string[] {
  return reasonCodes.map((code) => REASON_CODES[code as keyof typeof REASON_CODES]).filter(Boolean);
}
