import { describe, it, expect } from "vitest";
import { evaluateRules } from "../lib/rules/engine";

describe("rules engine", () => {
  it("dp below min => YELLOW RC02", () => {
    const result = evaluateRules({ dpPct: 20, packageMinDpPct: 30, packageActive: true, requiredFieldsComplete: true });
    expect(result.status).toBe("YELLOW");
    expect(result.reasonCodes).toContain("RC02");
  });

  it("data incomplete => MANUAL_REVIEW RC04", () => {
    const result = evaluateRules({ packageActive: true, requiredFieldsComplete: false });
    expect(result.status).toBe("MANUAL_REVIEW");
    expect(result.reasonCodes).toContain("RC04");
  });

  it("inactive package => NOT_RECOMMENDED RC09", () => {
    const result = evaluateRules({ packageActive: false });
    expect(result.status).toBe("NOT_RECOMMENDED");
    expect(result.reasonCodes).toContain("RC09");
  });
});
