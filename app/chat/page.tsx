"use client";

import { useState } from "react";
import { RecommendationCard } from "@/components/package/recommendation-card";

type ChatResponse = {
  status: "GREEN" | "YELLOW" | "MANUAL_REVIEW" | "NOT_RECOMMENDED";
  summary: string;
  options: Array<{
    packageId: string;
    packageName: string;
    dpAmount: number;
    tenorMonths: number;
    paymentType: "ADDM" | "ADDB";
    estimatedInstallment: number;
    estimatedTdp: number;
  }>;
  disclaimer: string;
};

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [model, setModel] = useState("");
  const [installment, setInstallment] = useState("");
  const [tdp, setTdp] = useState("");
  const [data, setData] = useState<ChatResponse | null>(null);

  const submitChat = async () => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        context: { dealerId: "dealer-kelapa-gading-1", branchId: "kelapa-gading-branch", userRole: "SALES_OFFICER" },
      }),
    });
    setData(await response.json());
  };


  const logout = async () => { await fetch("/api/auth/logout", { method: "POST" }); window.location.href = "/login"; };

  const saveLead = async () => {
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dealerId: "dealer-kelapa-gading-1",
        branchId: "kelapa-gading-branch",
        createdById: "so@example.com",
        customerAlias: "Customer A",
        productType: "New Car",
        desiredInstallment: installment ? Number(installment) : null,
        desiredTdp: tdp ? Number(tdp) : null,
        selectedModel: model || null,
      }),
    });
    alert("Lead saved");
  };

  return (
    <main className="mx-auto max-w-4xl space-y-4 p-6">
      <div className="flex items-center justify-between"><h1 className="text-xl font-semibold">Chat Recommendation</h1><button className="text-sm underline" onClick={logout}>Logout</button></div>
      <textarea className="w-full rounded border p-2" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Masukkan kebutuhan customer" />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <input className="rounded border p-2" placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} />
        <input className="rounded border p-2" placeholder="Desired Installment" value={installment} onChange={(e) => setInstallment(e.target.value)} />
        <input className="rounded border p-2" placeholder="Desired TDP" value={tdp} onChange={(e) => setTdp(e.target.value)} />
      </div>
      <button className="rounded bg-black px-4 py-2 text-white" onClick={submitChat}>Kirim Chat</button>

      {data && (
        <section className="space-y-3">
          <p className="font-medium">{data.summary}</p>
          {data.options.map((opt) => (
            <RecommendationCard key={opt.packageId} packageName={opt.packageName} productType="New Car" model={model || undefined} dpAmount={opt.dpAmount} tenorMonths={opt.tenorMonths} paymentType={opt.paymentType} estimatedInstallment={opt.estimatedInstallment} estimatedTdp={opt.estimatedTdp} status={data.status} nextAction="Follow up customer" />
          ))}
          <p className="text-xs text-gray-500">{data.disclaimer}</p>
          <button className="rounded border px-4 py-2" onClick={saveLead}>Save Lead</button>
        </section>
      )}
    </main>
  );
}
