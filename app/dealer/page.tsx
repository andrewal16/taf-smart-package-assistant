"use client";

import { useState } from "react";
import { MockBureauScenarioSelector } from "@/components/dealer/MockBureauScenarioSelector";
import type { MockReason, MockScenario } from "@/lib/bureau/mockScenario";

const prototypeMode = process.env.NEXT_PUBLIC_BUREAU_MODE === "mock";

type OcrData = { nikMasked: string; fullName: string | null; birthPlace: string | null; birthDate: string | null; gender: string | null; address: string | null; province: string | null; city: string | null; confidence: Record<string, number> };

export default function DealerPage() {
  const [simInput] = useState({ productType: "New Car", brand: "Toyota", model: "Avanza", otr: 260000000, desiredInstallment: 4000000, desiredTdp: 60000000, dp: 50000000, tenor: 60, paymentType: "ADDM", branch: "kelapa-gading", dealer: "dealer-kelapa-gading-1" });
  const [simResult, setSimResult] = useState<any>(null);
  const [consent, setConsent] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [ocr, setOcr] = useState<OcrData | null>(null);
  const [prescreen, setPrescreen] = useState<any>(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [scenario, setScenario] = useState<MockScenario>("GREEN");
  const [reason, setReason] = useState<MockReason>("CUSTOMER_PROFILE_CLEAN");

  const runSimulation = async () => { const r = await fetch("/api/package/simulate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(simInput) }); setSimResult(await r.json()); };
  const uploadKtp = async () => { if (!file) return; const fd = new FormData(); fd.append("ktpImage", file); fd.append("consentAttestation", String(consent)); const r = await fetch("/api/ocr/ktp", { method: "POST", body: fd }); const j = await r.json(); if (j.success) setOcr(j.data); };
  const runPrescreen = async () => {
    if (!ocr) return;
    const r = await fetch("/api/bureau/prescreen", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customer: { nik: "317xxxxxxxxxxxxx", fullName: ocr.fullName || "Mock Customer", birthDate: ocr.birthDate || "1990-01-01", mobileNumber }, packageInput: { productType: simInput.productType, model: simInput.model, otr: simInput.otr, dp: simInput.dp, tenor: simInput.tenor, estimatedInstallment: simResult?.options?.[0]?.estimatedInstallment ?? 0 }, consentAttestation: consent, mockScenario: scenario, mockReason: reason }) });
    setPrescreen(await r.json());
  };

  return <main className="p-6 space-y-6"><h1 className="text-2xl font-semibold">Dealer Prototype Flow</h1>
    {prototypeMode && <p className="bg-yellow-100 border border-yellow-300 rounded p-3 text-sm">Prototype Mode: Bureau result is simulated. No real PEFINDO inquiry is performed.</p>}
    <section className="border p-4 rounded space-y-2"><h2 className="font-semibold">Simulation Mode</h2><p className="text-xs text-gray-600">Estimasi awal, bukan approval kredit.</p><button onClick={runSimulation} className="border rounded px-3 py-2">Run Simulation</button>{simResult && <pre className="text-xs overflow-auto">{JSON.stringify(simResult, null, 2)}</pre>}</section>
    <section className="border p-4 rounded space-y-2"><h2 className="font-semibold">Verified Check Mode</h2><p className="text-xs text-red-600">Prototype internal. Hasil bukan approval kredit final.</p>
      {prototypeMode && <MockBureauScenarioSelector scenario={scenario} reason={reason} onScenario={setScenario} onReason={setReason} />}
      <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={(e)=>{ const f=e.target.files?.[0]||null; setFile(f); if (f) setPreview(URL.createObjectURL(f)); }} />{preview && <img src={preview} alt="preview" className="max-h-48"/>}
      <label className="flex gap-2 items-start"><input type="checkbox" checked={consent} onChange={(e)=>setConsent(e.target.checked)} /><span className="text-sm">Saya menyatakan bahwa customer telah memberikan persetujuan untuk penggunaan data identitasnya dalam proses simulasi/verifikasi awal pembiayaan TAF.</span></label>
      <button onClick={uploadKtp} disabled={!consent || !file} className="border rounded px-3 py-2">Upload & OCR</button>
      {ocr && <div className="space-y-2"><h3 className="font-medium">OCR Review</h3><p>NIK (masked): {ocr.nikMasked}</p><input className="border p-1" value={ocr.fullName ?? ""} onChange={(e)=>setOcr({...ocr, fullName:e.target.value})} /><input className="border p-1" placeholder="Mobile number" value={mobileNumber} onChange={(e)=>setMobileNumber(e.target.value)} /><button onClick={runPrescreen} className="border rounded px-3 py-2">Continue to Verified Check</button></div>}
      {prescreen?.success && <div className="border rounded p-3 space-y-2"><span className="inline-block text-xs font-bold px-2 py-1 rounded bg-blue-100">{prescreen.dealerVisibleResult.status}</span><h3 className="font-semibold">{prescreen.dealerVisibleResult.title}</h3><p>{prescreen.dealerVisibleResult.message}</p><ul>{prescreen.dealerVisibleResult.recommendedActions.map((a:string)=><li key={a}>- {a}</li>)}</ul><p className="text-xs text-gray-600">Hasil ini adalah simulasi prototype dan bukan approval kredit final.</p></div>}
    </section>
  </main>;
}
