import type { RecommendationStatus } from "@prisma/client";

export type RankedCandidate = {
  packageId: string;
  score: number;
  installmentFit: number;
  tdpFit: number;
  riskPenalty: number;
  status: RecommendationStatus;
  reasonCodes: string[];
};

export function rankCandidates<T extends RankedCandidate>(candidates: T[]): T[] {
  return [...candidates].sort((a, b) => a.score - b.score);
}
