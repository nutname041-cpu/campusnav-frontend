import React, { useEffect, useState } from "react";
import { MapContainer, ImageOverlay, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const IMG_URL = "/campus-base.png";
const IMG_WIDTH = 2000;
const IMG_HEIGHT = 1400;

const bounds: any = [
  [0, 0],
  [IMG_HEIGHT, IMG_WIDTH]
];

function ClickHandler({ onMapClick }: { onMapClick: (latlng: any) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    }
  });
  return null;
}

export default function AdminBuildingEditor() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState("");
  const [desc, setDesc] = useState("");

  const [x, setX] = useState("");
  const [y, setY] = useState("");

  const [message, setMessage] = useState("");

  // Handle map clicking
  function handleClick(latlng: any) {
    const pxX = (latlng.lng / IMG_WIDTH) * 100;
    const pxY = (latlng.lat / IMG_HEIGHT) * 100;

    setX(pxX.toFixed(2));
    setY(pxY.toFixed(2));
  }

  async function saveBuilding(e: any) {
    e.preventDefault();

    const res = await fetch("/api/buildings", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        code,
        type,
        description: desc,
        x: parseFloat(x),
        y: parseFloat(y)
      })
    });

    if (res.ok) {
      setMessage("✅ Building added successfully");
    } else {
      setMessage("❌ Failed to add building");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add Building (Click on Map)</h1>

      {message && <div className="p-2 bg-gray-100 rounded">{message}</div>}

      {/* Map */}
      <div className="h-[70vh] border rounded overflow-hidden">
        <MapContainer
          crs={L.CRS.Simple}
          bounds={bounds}
          minZoom={-1}
          style={{ height: "100%", width: "100%" }}
        >
          <ImageOverlay url={IMG_URL} bounds={bounds} />
          <ClickHandler onMapClick={handleClick} />
        </MapContainer>
      </div>

      <div className="text-sm text-gray-700">
        Click on the map above to auto-fill coordinates.
      </div>

      {/* Building form */}
      <form onSubmit={saveBuilding} className="grid grid-cols-2 gap-3 max-w-2xl">
        <input
          className="border p-2 rounded"
          placeholder="Building Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Code (LIB, ADM, CSE)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Type (hostel, academic)"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="X (auto-filled)"
          value={x}
          onChange={(e) => setX(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Y (auto-filled)"
          value={y}
          onChange={(e) => setY(e.target.value)}
        />

        <button className="col-span-2 p-2 bg-black text-white rounded">
          Add Building
        </button>
      </form>
    </div>
  );
}
