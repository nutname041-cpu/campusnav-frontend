import React from "react";
import MapCanvas from "../components/MapCanvas";

export default function ModeBuildings() {
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">Buildings Mode</h1>
      <p className="text-sm text-gray-600">View building locations on your campus map.</p>
      <MapCanvas onNavigateClick={(b)=>{ window.location.href = `/picture?end=${b.id}`; }} />
    </div>
  );
}
