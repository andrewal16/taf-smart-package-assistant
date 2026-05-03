"use client";

import { useState } from "react";

type OcrData = { nikMasked: string; fullName: string | null; birthPlace: string | null; birthDate: string | null; gender: string | null; address: string | null; province: string | null; city: string | null; confidence: Record<string, number> };

export default function DealerPage() {
  const [simInput, setSimInput] = useState({ productType: "New Car", brand: "Toyota", model: "Avanza", otr: 260000000, desiredInstallment: 4000000, desiredTdp: 60000000, dp: 50000000, tenor: 60, paymentType: "ADDM", branch: "kelapa-gading", dealer: "dealer-kelapa-gading-1" });
  const [simResult, setSimResult] = useState<any>(null);
  const [consent, setConsent] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [ocr, setOcr] = useState<OcrData | null>(null);
  const [prescreen, setPrescreen] = useState<any>(null);
  const [mobileNumber, setMobileNumber] = useState("");

  const runSimulation = async () => {
    const r = await fetch("/api/package/simulate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(simInput) });
    setSimResult(await r.json());
  };

  const uploadKtp = async () => {
    if (!file) return;
    const fd = new FormData();
    fd.append("ktpImage", file);
    fd.append("consentAttestation", String(consent));
    const r = await fetch("/api/ocr/ktp", { method: "POST", body: fd });
    const j = await r.json();
    if (j.success) setOcr(j.data);
  };

  const runPrescreen = async () => {
    if (!ocr) return;
    const r = await fetch("/api/bureau/prescreen", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customer: { nik: "masked", fullName: ocr.fullName, birthDate: ocr.birthDate, mobileNumber }, packageInput: { productType: simInput.productType, model: simInput.model, otr: simInput.otr, dp: simInput.dp, tenor: simInput.tenor, estimatedInstallment: simResult?.options?.[0]?.estimatedInstallment ?? 0 }, consentAttestation: consent }) });
    setPrescreen(await r.json());
  };

  return <main className="p-6 space-y-6"><h1 className="text-2xl font-semibold">Dealer Prototype Flow</h1>
    <section className="border p-4 rounded space-y-2"><h2 className="font-semibold">Simulation Mode</h2><p className="text-xs text-gray-600">Estimasi awal, bukan approval kredit.</p><button onClick={runSimulation} className="border rounded px-3 py-2">Run Simulation</button>{simResult && <pre className="text-xs overflow-auto">{JSON.stringify(simResult, null, 2)}</pre>}</section>
    <section className="border p-4 rounded space-y-2"><h2 className="font-semibold">Verified Check Mode</h2><p className="text-xs text-red-600">Prototype internal. Hasil bukan approval kredit final.</p><input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={(e)=>{ const f=e.target.files?.[0]||null; setFile(f); if (f) setPreview(URL.createObjectURL(f)); }} />{preview && <img src={preview} alt="preview" className="max-h-48"/>}<label className="flex gap-2 items-start"><input type="checkbox" checked={consent} onChange={(e)=>setConsent(e.target.checked)} /><span className="text-sm">Saya menyatakan bahwa customer telah memberikan persetujuan untuk penggunaan data identitasnya dalam proses simulasi/verifikasi awal pembiayaan TAF.</span></label><button onClick={uploadKtp} disabled={!consent || !file} className="border rounded px-3 py-2">Upload & OCR</button>
      {ocr && <div className="space-y-2"><h3 className="font-medium">OCR Review</h3><p>NIK (masked): {ocr.nikMasked}</p><input className="border p-1" value={ocr.fullName ?? ""} onChange={(e)=>setOcr({...ocr, fullName:e.target.value})} /><p>Birth Place: {ocr.birthPlace}</p><p>Birth Date: {ocr.birthDate}</p><p>Gender: {ocr.gender}</p><p>Address: {ocr.address}</p><p>Province/City: {ocr.province}/{ocr.city}</p><pre className="text-xs">Confidence: {JSON.stringify(ocr.confidence)}</pre><input className="border p-1" placeholder="Mobile number" value={mobileNumber} onChange={(e)=>setMobileNumber(e.target.value)} /><button onClick={runPrescreen} className="border rounded px-3 py-2">Continue to Verified Check</button></div>}
      {prescreen?.success && <div className="border rounded p-3"><h3 className="font-semibold">Risk Routing Result</h3><p>Status: {prescreen.dealerVisibleResult.status}</p><p>{prescreen.dealerVisibleResult.message}</p><ul>{prescreen.dealerVisibleResult.recommendedActions.map((a:string)=><li key={a}>- {a}</li>)}</ul></div>}
    </section>
  </main>;
}
