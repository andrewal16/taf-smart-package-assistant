"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const submit = async () => {
    setError("");
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ usernameOrEmail, password }) });
    if (!res.ok) {
      setError("Username/email atau password salah");
      return;
    }
    const body = await res.json();
    if (body.role === "PRODUCT_ADMIN") router.push("/admin/packages");
    else router.push("/chat");
  };

  return <main className="mx-auto max-w-sm p-6 space-y-3"><h1 className="text-xl font-semibold">Demo Login</h1><input className="border rounded p-2 w-full" placeholder="username atau email" value={usernameOrEmail} onChange={(e)=>setUsernameOrEmail(e.target.value)} /><input type="password" className="border rounded p-2 w-full" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)} /><button className="bg-black text-white rounded px-4 py-2" onClick={submit}>Login</button>{error && <p className="text-red-600 text-sm">{error}</p>}<p className="text-xs text-gray-500">Demo: admin/admin123 atau dealer/dealer123</p></main>;
}
