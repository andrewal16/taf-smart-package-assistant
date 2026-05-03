import { db } from "@/lib/db";

export default async function LeadsPage() {
  const leads = await db.lead.findMany({ orderBy: { createdAt: "desc" } });
  return <main className="p-6"><h1 className="text-xl font-semibold mb-4">Leads</h1><table className="w-full border"><thead><tr><th>Status</th><th>Dealer</th><th>SO</th><th>Outcome</th></tr></thead><tbody>{leads.map((l)=><tr key={l.id}><td>{l.status ?? "-"}</td><td>{l.dealerId ?? "-"}</td><td>{l.createdById}</td><td>{l.finalOutcome ?? "-"}</td></tr>)}</tbody></table></main>;
}
