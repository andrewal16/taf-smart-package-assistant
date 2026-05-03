"use client";

import Link from "next/link";
import { useState } from "react";

type PackageRow = { id: string; code: string; name: string; brand: string | null; model: string | null; status: string; approvalStatus: string; effectiveFrom: string; effectiveTo: string };

export default function AdminPackagesPage() {
  const [rows, setRows] = useState<PackageRow[]>([]);
  const [status, setStatus] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");

  const load = async () => {
    const params = new URLSearchParams({ ...(status ? { status } : {}), ...(brand ? { brand } : {}), ...(model ? { model } : {}) });
    const res = await fetch(`/api/packages?${params.toString()}`);
    setRows(await res.json());
  };


  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Admin Packages</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <input className="border rounded p-2" placeholder="Status" value={status} onChange={(e) => setStatus(e.target.value)} />
        <input className="border rounded p-2" placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
        <input className="border rounded p-2" placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} />
        <button className="border rounded p-2" onClick={load}>Apply Filters</button>
      </div>
      <button className="rounded bg-black text-white px-4 py-2">Create Package</button>
      <table className="w-full border-collapse border">
        <thead><tr><th>Code</th><th>Name</th><th>Status</th><th>Approval</th><th>Effective</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td><Link className="underline" href={`/admin/packages/${r.id}`}>{r.code}</Link></td>
              <td>{r.name}</td><td>{r.status}</td><td>{r.approvalStatus}</td>
              <td>{new Date(r.effectiveFrom).toLocaleDateString()} - {new Date(r.effectiveTo).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
