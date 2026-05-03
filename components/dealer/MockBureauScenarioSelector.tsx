"use client";

import type { MockReason, MockScenario } from "@/lib/bureau/mockScenario";

export function MockBureauScenarioSelector({ scenario, reason, onScenario, onReason }: { scenario: MockScenario; reason: MockReason; onScenario: (v: MockScenario) => void; onReason: (v: MockReason) => void }) {
  return (
    <div className="space-y-2 border rounded p-3 bg-amber-50">
      <p className="text-xs font-medium">Prototype Mode: Bureau result is simulated. No real PEFINDO inquiry is performed.</p>
      <label className="block text-sm">Mock Bureau Scenario
        <select className="border rounded p-2 w-full" value={scenario} onChange={(e) => onScenario(e.target.value as MockScenario)}>
          <option>GREEN</option><option>YELLOW</option><option>MANUAL_REVIEW</option><option>NOT_RECOMMENDED</option>
        </select>
      </label>
      <label className="block text-sm">Mock Reason
        <select className="border rounded p-2 w-full" value={reason} onChange={(e) => onReason(e.target.value as MockReason)}>
          <option>CUSTOMER_PROFILE_CLEAN</option><option>INSTALLMENT_TOO_HIGH</option><option>DP_TOO_LOW</option><option>DATA_INCOMPLETE</option><option>BUREAU_REVIEW_REQUIRED</option><option>POLICY_DEVIATION</option><option>HIGH_RISK_FLAG</option>
        </select>
      </label>
    </div>
  );
}
