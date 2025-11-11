import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  // BUILDINGS --------------------------
  const [bName, setBName] = useState("");
  const [bCode, setBCode] = useState("");
  const [bType, setBType] = useState("");
  const [bDesc, setBDesc] = useState("");
  const [bX, setBX] = useState("");
  const [bY, setBY] = useState("");
  const [buildings, setBuildings] = useState([]);

  // ROUTES -----------------------------
  const [startId, setStartId] = useState("");
  const [endId, setEndId] = useState("");
  const [polyline, setPolyline] = useState("");

  // STEPS ------------------------------
  const [stepRouteId, setStepRouteId] = useState("");
  const [stepIndex, setStepIndex] = useState("");
  const [stepCaption, setStepCaption] = useState("");
  const [stepDir, setStepDir] = useState("");
  const [stepFile, setStepFile] = useState<File | null>(null);

  const [routes, setRoutes] = useState([]);

  // FETCH BUILDINGS & ROUTES ----------
  useEffect(() => {
    refreshData();
  }, []);

  function refreshData() {
    fetch(`${API}/api/buildings`, { credentials: "include" })
      .then((r) => r.json())
      .then(setBuildings);

    fetch(`${API}/api/routes`, { credentials: "include" })
      .then((r) => r.json())
      .then(setRoutes);
  }

  // ADD BUILDING ----------------------
  async function addBuilding(e: any) {
    e.preventDefault();

    const res = await fetch(`${API}/api/buildings`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: bName,
        code: bCode,
        type: bType,
        description: bDesc,
        x: parseFloat(bX),
        y: parseFloat(bY)
      })
    });

    if (res.ok) {
      alert("Building added ✅");
      refreshData();
    } else alert("Failed ❌");
  }

  // ADD ROUTE -------------------------
  async function addRoute(e: any) {
    e.preventDefault();

    const res = await fetch(`${API}/api/routes`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startId: +startId,
        endId: +endId,
        polylineJson: polyline
      })
    });

    if (res.ok) {
      alert("Route created ✅");
      refreshData();
    } else alert("Failed ❌");
  }

  // UPLOAD STEP ------------------------
  async function uploadStep(e: any) {
    e.preventDefault();
    if (!stepFile) return alert("Choose an image");

    const fd = new FormData();
    fd.append("image", stepFile);
    fd.append("index", stepIndex);
    fd.append("caption", stepCaption);
    fd.append("dir", stepDir);

    const res = await fetch(`/api/routes/${stepRouteId}/steps`, {
      method: "POST",
      credentials: "include",
      body: fd
    });

    if (res.ok) {
      alert("Step uploaded ✅");
      refreshData();
    } else alert("Upload failed ❌");
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* QUICK LINKS */}
      <div className="flex flex-wrap gap-3 mb-2">
        <Link
          to="/admin/route-editor"
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          Route Editor (click map)
        </Link>

        <Link
          to="/admin/building-editor"
          className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
        >
          Add Building (click map)
        </Link>

        <Link
          to="/admin/floorplans"
          className="px-4 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-700"
        >
          Manage Floor Plans
        </Link>
      </div>

      {/* ADD BUILDING */}
      <section className="border p-5 rounded-xl shadow bg-white">
        <h2 className="text-xl font-semibold mb-3">Add Building</h2>

        <form className="grid grid-cols-2 gap-3" onSubmit={addBuilding}>
          <input className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Name" value={bName} onChange={(e)=>setBName(e.target.value)} />
          <input className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Code (LIB, CSE)" value={bCode} onChange={(e)=>setBCode(e.target.value)} />

          <input className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Type (academic, hostel)" value={bType} onChange={(e)=>setBType(e.target.value)} />
          <input className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Description" value={bDesc} onChange={(e)=>setBDesc(e.target.value)} />

          <input className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Map X (percentage)" value={bX} onChange={(e)=>setBX(e.target.value)} />
          <input className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Map Y (percentage)" value={bY} onChange={(e)=>setBY(e.target.value)} />

          <button className="col-span-2 p-2 bg-black text-white rounded hover:bg-gray-900">
            Add Building
          </button>
        </form>
      </section>

      {/* ADD ROUTE */}
      <section className="border p-5 rounded-xl shadow bg-white">
        <h2 className="text-xl font-semibold mb-3">Add Route</h2>

        <form className="grid grid-cols-2 gap-3" onSubmit={addRoute}>
          <select className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={startId} onChange={(e)=>setStartId(e.target.value)}>
            <option value="">Start Building</option>
            {buildings.map((b:any)=> (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          <select className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={endId} onChange={(e)=>setEndId(e.target.value)}>
            <option value="">End Building</option>
            {buildings.map((b:any)=> (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

          <textarea
            className="col-span-2 border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder='Polyline JSON [{"x":10,"y":80},{…}]'
            value={polyline}
            onChange={(e)=>setPolyline(e.target.value)}
            rows={3}
          />

          <button className="col-span-2 p-2 bg-black text-white rounded hover:bg-gray-900">
            Create Route
          </button>
        </form>
      </section>

      {/* ADD STEPS */}
      <section className="border p-5 rounded-xl shadow bg-white">
        <h2 className="text-xl font-semibold mb-3">Add Route Step (Photo)</h2>

        <form className="grid grid-cols-2 gap-3" onSubmit={uploadStep}>

          <select className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={stepRouteId} onChange={(e)=>setStepRouteId(e.target.value)}>
            <option value="">Select Route</option>
            {routes.map((r:any)=> (
              <option key={r.id} value={r.id}>
                Route #{r.id} ({r.startId} → {r.endId})
              </option>
            ))}
          </select>

          <input
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Step Index (1,2,3..)"
            value={stepIndex}
            onChange={(e)=>setStepIndex(e.target.value)}
          />

          <input
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Caption (optional)"
            value={stepCaption}
            onChange={(e)=>setStepCaption(e.target.value)}
          />

          <input
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Direction (left/right/straight)"
            value={stepDir}
            onChange={(e)=>setStepDir(e.target.value)}
          />

          <input
            type="file"
            className="col-span-2 border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e)=>setStepFile(e.target.files?.[0] || null)}
          />

          <button className="col-span-2 p-2 bg-black text-white rounded hover:bg-gray-900">
            Upload Step
          </button>
        </form>
      </section>

    </div>
  );
}
