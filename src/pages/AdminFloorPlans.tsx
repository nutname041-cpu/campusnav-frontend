import React, { useEffect, useState } from "react";

export default function AdminFloorPlans() {
  const [buildings, setBuildings] = useState([]);
  const [buildingId, setBuildingId] = useState("");
  const [level, setLevel] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/buildings`, { credentials: "include" })
      .then(r => r.json())
      .then(setBuildings);
  }, []);

  function loadPlans() {
    if (!buildingId) return;

    fetch(`/api/floorplans/${buildingId}`)
      .then(r => r.json())
      .then(setPlans);
  }

  async function uploadFloorPlan(e: any) {
    e.preventDefault();
    if (!file) return alert("Choose an image");

    const fd = new FormData();
    fd.append("image", file);
    fd.append("buildingId", buildingId);
    fd.append("level", level);

    const res = await fetch(`${API}/api/floorplans`, {
      method: "POST",
      credentials: "include",
      body: fd
    });

    if (res.ok) {
      alert("Uploaded ✅");
      loadPlans();
    } else alert("Failed ❌");
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Floor Plan Manager</h1>

      <div className="flex gap-3">
        <select
          value={buildingId}
          onChange={e => {
            setBuildingId(e.target.value);
            loadPlans();
          }}
          className="border p-2 rounded"
        >
          <option value="">Select Building</option>
          {buildings.map((b: any) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <button
          onClick={loadPlans}
          className="px-3 py-2 bg-gray-800 text-white rounded"
        >
          Load Plans
        </button>
      </div>

      {/* UPLOAD FORM */}
      <form onSubmit={uploadFloorPlan} className="grid grid-cols-2 gap-3 max-w-xl">
        <input
          className="border p-2 rounded"
          placeholder="Floor level (0,1,2…)"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        />

        <input
          type="file"
          className="border p-2 rounded col-span-2"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button className="col-span-2 p-2 bg-black text-white rounded">
          Upload Floor Plan
        </button>
      </form>

      {/* DISPLAY EXISTING FLOOR PLANS */}
      <div className="grid grid-cols-2 gap-4">
        {plans.map((p: any) => (
          <div key={p.id} className="border rounded p-2">
            <div>Floor: {p.level}</div>
            <img src={p.imageUrl} className="w-full rounded mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
