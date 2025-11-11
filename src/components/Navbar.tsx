import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="px-6 py-3 bg-gray-900 text-white flex items-center justify-between shadow">
      <div className="text-xl font-semibold">
        Campus Navigation
      </div>

      <div className="flex gap-6 text-sm">
        <Link to="/" className="hover:text-blue-300">Home</Link>
        <Link to="/buildings" className="hover:text-blue-300">Map Mode</Link>
        <Link to="/navigate" className="hover:text-blue-300">Picture Mode</Link>
        <Link to="/indoor" className="hover:text-blue-300">Indoor</Link>
        <Link to="/admin/dashboard" className="hover:text-yellow-300">Admin</Link>
      </div>
    </nav>
  );
}
