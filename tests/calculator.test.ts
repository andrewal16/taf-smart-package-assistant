import { describe, it, expect } from "vitest";
import { calculateSimulation } from "../lib/simulation/calculator";

describe("calculator", () => {
  it("calculates ADDM with installment included in tdp", () => {
    const result = calculateSimulation({ otr: 260_000_000, dpPct: 0.2, annualRatePct: 6.5, tenorMonths: 60, paymentType: "ADDM" });
    expect(result.amountDp).toBe(52_000_000);
    expect(result.installment % 1000).toBe(0);
    expect(result.tdp).toBe(result.amountDp + result.installment);
  });

  it("calculates ADDB without installment in tdp", () => {
    const result = calculateSimulation({ otr: 260_000_000, dpPct: 0.2, annualRatePct: 6.5, tenorMonths: 60, paymentType: "ADDB", adminFee: 1000000 });
    expect(result.tdp).toBe(result.amountDp + 1_000_000);
  });
});
