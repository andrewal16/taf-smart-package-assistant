"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  type DashboardData = {leadVolume: unknown; statusMix: unknown; counterofferAcceptanceRate: string; funnel: unknown; lostReasonBreakdown: unknown; slaMetrics: unknown};
  const [data, setData] = useState<DashboardData | null>(null);
  useEffect(() => { fetch("/api/dashboard").then((r) => r.json()).then(setData); }, []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Sales Head Dashboard</h1>
      {data && (
        <>
          <pre className="border p-3 rounded">Lead Volume: {JSON.stringify(data.leadVolume, null, 2)}</pre>
          <pre className="border p-3 rounded">Status Mix: {JSON.stringify(data.statusMix, null, 2)}</pre>
          <p>Counteroffer Acceptance Rate: {data.counterofferAcceptanceRate}%</p>
          <pre className="border p-3 rounded">Funnel: {JSON.stringify(data.funnel, null, 2)}</pre>
          <pre className="border p-3 rounded">Lost Reason Breakdown: {JSON.stringify(data.lostReasonBreakdown, null, 2)}</pre>
          <pre className="border p-3 rounded">SLA Metrics: {JSON.stringify(data.slaMetrics, null, 2)}</pre>
        </>
      )}
    </main>
  );
}
