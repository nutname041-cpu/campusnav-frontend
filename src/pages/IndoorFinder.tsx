import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";
import Skeleton from "../components/Skeleton";

type Result = {
  id: number;
  name: string;
  floor: number;
  building: { id: number; name: string };
};

export default function IndoorFinder() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [plans, setPlans] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!q.trim()) { setResults([]); return; }
      fetch(`/api/rooms/search?q=${encodeURIComponent(q)}`, { credentials: "include" })
        .then(res => res.json())
        .then(setResults)
        .catch(() => setResults([]));
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  async function openPlans(buildingId: number) {
    setOpen(true);
    setLoading(true);
    setPlans(null);
    try {
      const res = await fetch(`/api/floorplans/${buildingId}`);
      const data = await res.json();
      setPlans(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Indoor Finder</h1>

      <div className="p-4 bg-white border rounded shadow max-w-xl mx-auto">
        <input
          className="border px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Search room (e.g. CS-104)"
          value={q}
          onChange={e => setQ(e.target.value)}
        />

        <div className="grid gap-3 mt-4">
          {results.map((r) => (
            <div key={r.id} className="p-3 border rounded shadow-sm bg-gray-50">
              <div className="font-semibold text-lg">{r.name}</div>
              <div className="text-sm text-gray-600">
                Building: <b>{r.building.name}</b> • Floor <b>{r.floor}</b>
              </div>

              <button
                className="mt-3 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => openPlans(r.building.id)}
              >
                View Floor Plans
              </button>
            </div>
          ))}

          {!results.length && (
            <p className="text-sm text-gray-500 text-center">Type to search rooms…</p>
          )}
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Floor Plans">
        {loading && (
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        )}

        {!loading && plans && (
          <div className="grid grid-cols-2 gap-3">
            {plans.map((p: any) => (
              <div key={p.id} className="border rounded p-2">
                <div className="text-sm mb-1">Floor: {p.level}</div>
                <img src={p.imageUrl} className="w-full rounded" />
              </div>
            ))}
            {!plans.length && (
              <div className="text-sm text-gray-600">No floor plans uploaded.</div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
