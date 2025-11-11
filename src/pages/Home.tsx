import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Welcome to Campus Navigation</h1>

      <p className="text-gray-700 max-w-2xl">
        This tool helps you explore the campus using three modes:
        Map mode for building location, Picture mode for step-by-step visual navigation,
        and Indoor mode for floor plans and rooms.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/buildings" className="p-6 border rounded-lg shadow hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Map Mode</h2>
          <p className="text-sm text-gray-600">Explore campus buildings on the campus map.</p>
        </Link>

        <Link to="/navigate" className="p-6 border rounded-lg shadow hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Picture Mode</h2>
          <p className="text-sm text-gray-600">View step-by-step images to reach your destination.</p>
        </Link>

        <Link to="/indoor" className="p-6 border rounded-lg shadow hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Indoor Mode</h2>
          <p className="text-sm text-gray-600">View floor plans & search rooms inside buildings.</p>
        </Link>
      </div>
    </div>
  );
}
