import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, ImageOverlay, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-polylinedecorator";

// Icon fix
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

const IMG_URL = "/campus-base.png";
const IMG_WIDTH = 2000;
const IMG_HEIGHT = 1400;
const bounds: L.LatLngBoundsExpression = [[0, 0], [IMG_HEIGHT, IMG_WIDTH]];

type Building = {
  id: number; name: string; code?: string; type?: string;
  description?: string; x: number; y: number;
};

export default function MapCanvas({
  polylineJson,
  onNavigateClick
}: {
  polylineJson?: string;
  onNavigateClick?: (b: Building) => void;
}) {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selected, setSelected] = useState<Building | null>(null);

  useEffect(() => {
    fetch(`${API}/api/buildings`, { credentials: "include" })
      .then(r => r.json())
      .then(setBuildings)
      .catch(() => setBuildings([]));
  }, []);

  const points = useMemo(
    () => buildings.map((b) => ({ ...b, lat: (b.y / 100) * IMG_HEIGHT, lng: (b.x / 100) * IMG_WIDTH })),
    [buildings]
  );

  const routeLatLngs = useMemo(() => {
    if (!polylineJson) return null;
    try {
      const pts: { x: number; y: number }[] = JSON.parse(polylineJson);
      return pts.map(p => L.latLng((p.y / 100) * IMG_HEIGHT, (p.x / 100) * IMG_WIDTH));
    } catch { return null; }
  }, [polylineJson]);

  return (
    <div className="relative h-[70vh] w-full border rounded dark:border-gray-700">
      {/* Floating card */}
      <div className="absolute top-4 right-4 z-[1000] max-w-sm">
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow p-3">
          <div className="text-sm text-gray-700 dark:text-gray-200">
            <div className="font-semibold">
              {selected ? selected.name : "Click a building"}
            </div>
            {selected?.description && <div className="mt-1">{selected.description}</div>}
            <div className="mt-2 flex gap-2">
              <button
                disabled={!selected}
                onClick={() => selected && onNavigateClick?.(selected)}
                className={"px-2 py-1 text-xs rounded " + (selected ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed")}
              >
                Navigate to building
              </button>
            </div>
          </div>
        </div>
      </div>

      <MapContainer crs={L.CRS.Simple} bounds={bounds} minZoom={-1} style={{ height: "100%", width: "100%" }}>
        <ImageOverlay url={IMG_URL} bounds={bounds} />
        {points.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng] as any} eventHandlers={{ click: () => setSelected(p) }}>
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{p.name}</div>
                {p.code && <div>Code: {p.code}</div>}
              </div>
            </Popup>
          </Marker>
        ))}

        {routeLatLngs && <RouteWithArrows latlngs={routeLatLngs} />}
      </MapContainer>
    </div>
  );
}

function RouteWithArrows({ latlngs }: { latlngs: L.LatLng[] }) {
  const map = useMap();
  const decoRef = useRef<any>(null);

  useEffect(() => {
    if (!latlngs.length) return;
    const group = L.polyline(latlngs, { color: "blue", weight: 3 });
    group.addTo(map);

    // Fit bounds
    map.fitBounds(group.getBounds(), { padding: [30, 30] });

    // Arrowheads
    const decorator = (L as any).polylineDecorator(group, {
      patterns: [
        {
          offset: 12,
          repeat: 30,
          symbol: (L as any).Symbol.arrowHead({ pixelSize: 10, pathOptions: { color: "blue", fillOpacity: 1 } })
        }
      ]
    });
    decorator.addTo(map);
    decoRef.current = { group, decorator };

    return () => {
      decoRef.current?.decorator?.remove();
      decoRef.current?.group?.remove();
    };
  }, [latlngs, map]);

  return null;
}
