export type PaymentType = "ADDM" | "ADDB";

export type SimulationInput = {
  otr: number;
  dpPct: number;
  annualRatePct: number;
  tenorMonths: number;
  financedInsurance?: number;
  cashInsurance?: number;
  adminFee?: number;
  paymentType: PaymentType;
};

export type SimulationResult = {
  amountDp: number;
  principal: number;
  interest: number;
  totalReceivable: number;
  installment: number;
  tdp: number;
};
