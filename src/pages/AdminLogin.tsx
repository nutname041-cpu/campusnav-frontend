import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const nav = useNavigate();
  const [username, setU] = useState("admin");
  const [password, setP] = useState("admin");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) nav("/admin/dashboard");
    else setErr("Invalid login");
  }

  return (
    <form onSubmit={submit} className="max-w-sm space-y-3">
      <h1 className="text-xl font-semibold">Admin Login</h1>

      <input
        className="border px-3 py-2 rounded w-full"
        value={username}
        onChange={e => setU(e.target.value)}
      />

      <input
        type="password"
        className="border px-3 py-2 rounded w-full"
        value={password}
        onChange={e => setP(e.target.value)}
      />

      {err && <div className="text-red-600 text-sm">{err}</div>}

      <button className="px-3 py-2 border rounded w-full">Login</button>
    </form>
  );
}
