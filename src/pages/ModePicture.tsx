import React, { useEffect, useMemo, useState } from "react";
import ImageStepPlayer, { Step } from "../components/ImageStepPlayer";
import MapCanvas from "../components/MapCanvas";

type Building = { id: number; name: string };
type Route = { id: number; startId: number; endId: number; polylineJson?: string; steps: Step[] };

export default function ModePicture() {
  const qs = new URLSearchParams(window.location.search);
  const qsStart = Number(qs.get("start")) || undefined;
  const qsEnd = Number(qs.get("end")) || undefined;

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [startId, setStartId] = useState<number | "">((qsStart as any) || "");
  const [endId, setEndId] = useState<number | "">((qsEnd as any) || "");

  useEffect(() => {
    fetch(`${API}/api/buildings`, { credentials: "include" }).then(r => r.json()).then(setBuildings);
    fetch(`${API}/api/routes`, { credentials: "include" }).then(r => r.json()).then(setRoutes);
  }, []);

  const match = useMemo(() => {
    if (!startId || !endId) return null;
    return routes.find(r => r.startId === startId && r.endId === endId) || null;
  }, [routes, startId, endId]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Picture Mode</h1>

      {/* card */}
      <div className="p-4 border rounded-lg shadow bg-white">
        <div className="flex gap-3 flex-wrap items-center">
          <select className="border px-2 py-1 rounded" value={startId as any} onChange={e => setStartId(+e.target.value)}>
            <option value="">Start…</option>
            {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>

          <span>→</span>

          <select className="border px-2 py-1 rounded" value={endId as any} onChange={e => setEndId(+e.target.value)}>
            <option value="">Destination…</option>
            {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>

        {/* quick chips */}
        <div className="flex flex-wrap gap-2 mt-3">
          {buildings.slice(0, 8).map(b => (
            <button
              key={b.id}
              className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
              onClick={() => setEndId(b.id)}
              title="Navigate to this building"
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* show route on map, auto-fit */}
      {match?.polylineJson && (
        <div className="p-3 border rounded bg-white">
          <div className="text-sm text-gray-600 mb-2">Route preview</div>
          <MapCanvas polylineJson={match.polylineJson} />
        </div>
      )}

      {/* image steps */}
      {match ? (
        <ImageStepPlayer steps={match.steps} />
      ) : (
        <p className="text-gray-600 text-sm">Select start & destination to view photos.</p>
      )}
    </div>
  );
}
