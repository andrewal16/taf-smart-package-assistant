import type { ReasonCode } from "./reason-codes";

export type RuleInput = {
  dpPct?: number;
  tenorMonths?: number;
  packageMinDpPct?: number;
  packageMaxTenor?: number;
  packageActive?: boolean;
  requiredFieldsComplete?: boolean;
  riskManualReview?: boolean;
};

export type RecommendationStatus = "GREEN" | "YELLOW" | "MANUAL_REVIEW" | "NOT_RECOMMENDED";

export type RuleResult = { status: RecommendationStatus; reasonCodes: ReasonCode[]; riskPenalty: number };

export function evaluateRules(input: RuleInput): RuleResult {
  const reasonCodes: ReasonCode[] = [];
  let status: RecommendationStatus = "GREEN";

  if (input.packageActive === false) {
    return { status: "NOT_RECOMMENDED", reasonCodes: ["RC09"], riskPenalty: 1000 };
  }
  if (input.requiredFieldsComplete === false) {
    return { status: "MANUAL_REVIEW", reasonCodes: ["RC04"], riskPenalty: 500 };
  }
  if (input.riskManualReview) {
    return { status: "MANUAL_REVIEW", reasonCodes: ["RC05"], riskPenalty: 500 };
  }
  if (input.dpPct !== undefined && input.packageMinDpPct !== undefined && input.dpPct < input.packageMinDpPct) {
    reasonCodes.push("RC02");
    status = "YELLOW";
  }
  if (input.tenorMonths !== undefined && input.packageMaxTenor !== undefined && input.tenorMonths > input.packageMaxTenor) {
    reasonCodes.push("RC03");
    status = "YELLOW";
  }

  return { status, reasonCodes, riskPenalty: status === "GREEN" ? 0 : 100 };
}
