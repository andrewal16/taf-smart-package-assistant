import { REASON_CODES } from "@/lib/rules/reason-codes";
import { db } from "@/lib/db";

export default async function AdminRulesPage() {
  const rules = await db.rule.findMany({ orderBy: { updatedAt: "desc" } });
  const canEdit = false;

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Rules</h1>
      <table className="w-full border"><thead><tr><th>Code</th><th>Name</th><th>Status</th><th>Output</th></tr></thead><tbody>{rules.map((r)=><tr key={r.id}><td>{r.code}</td><td>{r.name}</td><td>{r.isActive ? "Active" : "Inactive"}</td><td>{r.outputStatus}</td></tr>)}</tbody></table>
      <p className="text-sm">Role restricted edit: {canEdit ? "Enabled" : "Read-only"}</p>
      <h2 className="font-semibold">Reason Codes</h2>
      <table className="w-full border"><tbody>{Object.entries(REASON_CODES).map(([code,text])=><tr key={code}><td className="w-24">{code}</td><td>{text}</td></tr>)}</tbody></table>
    </main>
  );
}
