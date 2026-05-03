import { describe, it, expect } from "vitest";
import { parseIntent } from "../lib/ai/intent-parser";

describe("intent parser", () => {
  it("extracts indonesian budget phrasing", async () => {
    const out = await parseIntent("Customer maunya cicilan maksimal 4 juta, Avanza, DP 50 juta, tenor 60 bulan ADDM");
    expect(out.desiredInstallment).toBe(4_000_000);
    expect(out.model).toBe("Avanza");
    expect(out.dp).toBe(50_000_000);
    expect(out.tenor).toBe(60);
    expect(out.paymentType).toBe("ADDM");
  });

  it("fallback parser handles invalid/minimal input", async () => {
    const out = await parseIntent("tolong bantu");
    expect(out.intent).toBe("find_package_by_installment");
    expect(out.model).toBeNull();
  });
});
