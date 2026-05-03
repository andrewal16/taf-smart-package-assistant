import { describe, it, expect } from "vitest";
import { findPackageOptions } from "../lib/package/search";

describe("package search", () => {
  it("filters active/date/product and returns top 3", () => {
    const now = new Date();
    const next = new Date(now); next.setDate(now.getDate()+1);
    const prev = new Date(now); prev.setDate(now.getDate()-1);
    const pkgs: Array<Record<string, unknown>> = [
      { id:"1", code:"A", name:"A", status:"ACTIVE", effectiveFrom:prev,effectiveTo:next,productType:"New Car", model:"Avanza", dealerId:null, branchId:null, otrMin:200000000, otrMax:300000000, dpMinPct:20, dpMaxPct:40, tenorMin:36, tenorMax:60, annualRatePct:6.5 },
      { id:"2", code:"B", name:"B", status:"ACTIVE", effectiveFrom:prev,effectiveTo:next,productType:"New Car", model:"Avanza", dealerId:null, branchId:null, otrMin:200000000, otrMax:300000000, dpMinPct:20, dpMaxPct:40, tenorMin:36, tenorMax:60, annualRatePct:6.5 },
      { id:"3", code:"C", name:"C", status:"ACTIVE", effectiveFrom:prev,effectiveTo:next,productType:"New Car", model:"Avanza", dealerId:null, branchId:null, otrMin:200000000, otrMax:300000000, dpMinPct:20, dpMaxPct:40, tenorMin:36, tenorMax:60, annualRatePct:6.5 },
      { id:"4", code:"D", name:"D", status:"DRAFT", effectiveFrom:prev,effectiveTo:next,productType:"New Car", model:"Avanza", dealerId:null, branchId:null, otrMin:200000000, otrMax:300000000, dpMinPct:20, dpMaxPct:40, tenorMin:36, tenorMax:60, annualRatePct:6.5 },
    ];
    const out = findPackageOptions({ productType:"New Car", model:"Avanza", otr:260000000, desiredInstallment:4000000, desiredTdp:60000000 }, pkgs as never);
    expect(out.length).toBe(3);
    expect(out.every((c)=>c.packageId!=="4")).toBe(true);
  });
});
