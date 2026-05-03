import type { RecommendationStatus } from "@prisma/client";

type Props = {
  packageName: string;
  productType: string;
  model?: string;
  dpAmount: number;
  tenorMonths: number;
  paymentType: "ADDM" | "ADDB";
  estimatedInstallment: number;
  estimatedTdp: number;
  status: RecommendationStatus;
  nextAction: string;
};

export function RecommendationCard(props: Props) {
  return (
    <div className="rounded border p-4">
      <h3 className="font-semibold">{props.packageName}</h3>
      <p>{props.productType} {props.model ? `- ${props.model}` : ""}</p>
      <p>DP: Rp{props.dpAmount.toLocaleString("id-ID")}</p>
      <p>Tenor: {props.tenorMonths} bulan</p>
      <p>Payment: {props.paymentType}</p>
      <p>Installment: Rp{props.estimatedInstallment.toLocaleString("id-ID")}</p>
      <p>TDP: Rp{props.estimatedTdp.toLocaleString("id-ID")}</p>
      <p>Status: {props.status}</p>
      <p>Next: {props.nextAction}</p>
      <p className="text-xs text-gray-500">Rekomendasi awal dan tetap mengikuti proses approval TAF.</p>
    </div>
  );
}
