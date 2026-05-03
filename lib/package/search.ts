import type { Package, RecommendationStatus } from "@prisma/client";
import { calculateSimulation } from "../simulation/calculator";
import { evaluateRules } from "../rules/engine";
import { rankCandidates } from "../recommendation/ranker";

export type PackageSearchInput = {
  productType: string;
  model?: string;
  otr: number;
  desiredInstallment?: number;
  desiredTdp?: number;
  dp?: number;
  tenor?: number;
  paymentType?: "ADDM" | "ADDB";
  dealerId?: string;
  branchId?: string;
};

export type SearchCandidate = {
  packageId: string;
  packageName: string;
  dpPct: number;
  tenorMonths: number;
  paymentType: "ADDM" | "ADDB";
  estimatedInstallment: number;
  estimatedTdp: number;
  status: RecommendationStatus;
  reasonCodes: string[];
  score: number;
};

export function findPackageOptions(input: PackageSearchInput, packages: Package[]): SearchCandidate[] {
  const today = new Date();
  const normalizedPaymentType = input.paymentType ?? "ADDM";

  const activePackages = packages.filter((pkg) => {
    const inDate = pkg.status === "ACTIVE" && pkg.effectiveFrom <= today && pkg.effectiveTo >= today;
    const productMatch = pkg.productType === input.productType;
    const modelMatch = !pkg.model || !input.model || pkg.model === input.model;
    const dealerMatch = !pkg.dealerId || pkg.dealerId === input.dealerId;
    const branchMatch = !pkg.branchId || pkg.branchId === input.branchId;
    const otrMinOk = pkg.otrMin ? Number(pkg.otrMin) <= input.otr : true;
    const otrMaxOk = pkg.otrMax ? Number(pkg.otrMax) >= input.otr : true;
    return inDate && productMatch && modelMatch && dealerMatch && branchMatch && otrMinOk && otrMaxOk;
  });

  const candidates: SearchCandidate[] = [];
  for (const pkg of activePackages) {
    const minDp = Number(pkg.dpMinPct) / 100;
    const maxDp = Number(pkg.dpMaxPct ?? pkg.dpMinPct) / 100;
    const dpOptions = [minDp, Math.min((minDp + maxDp) / 2, maxDp), maxDp];
    const tenorOptions = Array.from(new Set([pkg.tenorMin, input.tenor ?? pkg.tenorMax, pkg.tenorMax])).filter(
      (t) => t >= pkg.tenorMin && t <= pkg.tenorMax,
    );

    for (const dpPct of dpOptions) {
      for (const tenor of tenorOptions) {
        const sim = calculateSimulation({ otr: input.otr, dpPct, annualRatePct: Number(pkg.annualRatePct), tenorMonths: tenor, paymentType: normalizedPaymentType });
        const rule = evaluateRules({ dpPct: dpPct * 100, tenorMonths: tenor, packageMinDpPct: Number(pkg.dpMinPct), packageMaxTenor: pkg.tenorMax, packageActive: true, requiredFieldsComplete: true, riskManualReview: pkg.code.includes("BZ4X") });
        const installmentFit = Math.abs((input.desiredInstallment ?? sim.installment) - sim.installment);
        const tdpFit = Math.abs((input.desiredTdp ?? sim.tdp) - sim.tdp);
        const score = installmentFit + tdpFit + rule.riskPenalty;
        candidates.push({ packageId: pkg.id, packageName: pkg.name, dpPct, tenorMonths: tenor, paymentType: normalizedPaymentType, estimatedInstallment: sim.installment, estimatedTdp: sim.tdp, status: rule.status as RecommendationStatus, reasonCodes: rule.reasonCodes, score });
      }
    }
  }

  return rankCandidates(candidates).slice(0, 3);
}
