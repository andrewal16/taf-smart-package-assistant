"use client";

import { useEffect, useState } from "react";
import { calculateSimulation } from "@/lib/simulation/calculator";

const fields = ["code","name","productType","brand","model","branchId","dealerId","customerSegment","otrMin","otrMax","dpMinPct","dpMaxPct","tenorMin","tenorMax","annualRatePct","addmAllowed","addbAllowed","insuranceMode","adminFee","tacpAllowed","effectiveFrom","effectiveTo","status","approvalStatus","createdById"];

export default function AdminPackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState("");
  const [form, setForm] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<Array<{ action: string; createdAt: string }>>([]);
  const [preview, setPreview] = useState<{ installment: number; tdp: number } | null>(null);

  useEffect(() => { (async () => { const p = await params; setId(p.id); const res = await fetch(`/api/packages/${p.id}`); const data = await res.json(); const next: Record<string,string> = {}; fields.forEach((f)=> next[f] = data.pkg?.[f]?.toString?.() ?? ""); setForm(next); setHistory(data.history || []); })(); }, [params]);

  const save = async () => {
    if (form.effectiveFrom && form.effectiveTo && new Date(form.effectiveFrom) > new Date(form.effectiveTo)) { alert("effectiveFrom harus <= effectiveTo"); return; }
    await fetch(`/api/packages/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    alert("Saved");
  };
  const submit = async () => { await fetch(`/api/packages/${id}/submit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }); alert("Submitted"); };
  const approve = async () => { await fetch(`/api/packages/${id}/approve`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }); alert("Approved step"); };
  const suspend = async () => { await fetch(`/api/packages/${id}/suspend`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }); alert("Suspended"); };
  const simulate = () => {
    const out = calculateSimulation({ otr: Number(form.otrMin || 0), dpPct: Number(form.dpMinPct || 0) / 100, annualRatePct: Number(form.annualRatePct || 0), tenorMonths: Number(form.tenorMin || 12), paymentType: "ADDM", adminFee: Number(form.adminFee || 0) });
    setPreview({ installment: out.installment, tdp: out.tdp });
  };

  return <main className="p-6 space-y-4"><h1 className="text-xl font-semibold">Package Detail</h1><div className="grid grid-cols-1 md:grid-cols-2 gap-2">{fields.map((f)=><label key={f} className="text-sm">{f}<input className="border rounded p-2 w-full" value={form[f] ?? ""} onChange={(e)=>setForm((prev)=>({...prev,[f]:e.target.value}))}/></label>)}</div><div className="flex gap-2"><button className="border rounded px-3 py-2" onClick={save}>Save</button><button className="border rounded px-3 py-2" onClick={simulate}>Preview Simulation</button><button className="border rounded px-3 py-2" onClick={submit}>Submit</button><button className="border rounded px-3 py-2" onClick={approve}>Approve Step</button><button className="border rounded px-3 py-2" onClick={suspend}>Suspend</button></div>{preview && <p>Preview installment: Rp{preview.installment.toLocaleString("id-ID")} | TDP: Rp{preview.tdp.toLocaleString("id-ID")}</p>}<section><h2 className="font-semibold">Version History</h2><ul>{history.map((h,idx)=><li key={idx}>{h.action} - {new Date(h.createdAt).toLocaleString()}</li>)}</ul></section></main>;
}
