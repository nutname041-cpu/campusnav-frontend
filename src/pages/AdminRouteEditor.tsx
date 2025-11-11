import React, { useEffect, useState } from "react";
import { MapContainer, ImageOverlay, Polyline, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const IMG_URL = "/campus-base.png";
const IMG_WIDTH = 2000;
const IMG_HEIGHT = 1400;
const bounds: any = [
  [0, 0],
  [IMG_HEIGHT, IMG_WIDTH]
];

function ClickHandler({ onClickPoint }: { onClickPoint: (p: any) => void }) {
  useMapEvents({
    click(e) {
      onClickPoint(e.latlng);
    }
  });
  return null;
}

export default function AdminRouteEditor() {
  const [buildings, setBuildings] = useState([]);
  const [startId, setStartId] = useState("");
  const [endId, setEndId] = useState("");
  const [points, setPoints] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/buildings", { credentials: "include" })
      .then(r => r.json())
      .then(setBuildings);
  }, []);

  function addPoint(latlng: any) {
    setPoints(p => [...p, latlng]);
  }

  function reset() {
    setPoints([]);
  }

  async function saveRoute() {
    const converted = points.map(p => ({
      x: (p.lng / IMG_WIDTH) * 100,
      y: (p.lat / IMG_HEIGHT) * 100
    }));

    const polylineJson = JSON.stringify(converted);

    const res = await fetch("/api/routes", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startId: +startId,
        endId: +endId,
        polylineJson
      })
    });

    if (res.ok) alert("Route created ✅");
    else alert("Failed ❌");
  }

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold">Route Editor (Click on Map)</h1>

      <div className="flex gap-3">
        <select
          className="border p-2 rounded"
          value={startId}
          onChange={(e) => setStartId(e.target.value)}
        >
          <option value="">Start Building</option>
          {buildings.map((b: any) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={endId}
          onChange={(e) => setEndId(e.target.value)}
        >
          <option value="">End Building</option>
          {buildings.map((b: any) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={reset}>
          Reset
        </button>
      </div>

      <div className="text-sm text-gray-600">
        Click on map to add route points.  
        Total points: <b>{points.length}</b>
      </div>

      <div className="h-[70vh] border rounded overflow-hidden">
        <MapContainer
          crs={L.CRS.Simple}
          bounds={bounds}
          minZoom={-1}
          style={{ height: "100%", width: "100%" }}
        >
          <ImageOverlay url={IMG_URL} bounds={bounds} />

          <ClickHandler onClickPoint={addPoint} />

          <Polyline
            pathOptions={{ color: "blue" }}
            positions={points.map((p) => [p.lat, p.lng])}
          />
        </MapContainer>
      </div>

      <button
        className="px-4 py-2 bg-black text-white rounded"
        onClick={saveRoute}
      >
        Save Route
      </button>
    </div>
  );
}
