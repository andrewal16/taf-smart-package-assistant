import type { SimulationInput, SimulationResult } from "./types";

function roundToNearestThousand(value: number): number {
  return Math.round(value / 1000) * 1000;
}

export function calculateSimulation(input: SimulationInput): SimulationResult {
  const financedInsurance = input.financedInsurance ?? 0;
  const cashInsurance = input.cashInsurance ?? 0;
  const adminFee = input.adminFee ?? 0;

  const amountDp = input.otr * input.dpPct;
  const principal = input.otr - amountDp + financedInsurance;
  const interest = principal * (input.annualRatePct / 100) * (input.tenorMonths / 12);
  const totalReceivable = principal + interest;
  const installment = roundToNearestThousand(totalReceivable / input.tenorMonths);
  const tdp = amountDp + adminFee + cashInsurance + (input.paymentType === "ADDM" ? installment : 0);

  return {
    amountDp,
    principal,
    interest,
    totalReceivable,
    installment,
    tdp,
  };
}
