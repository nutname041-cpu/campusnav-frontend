import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";

import Home from "./pages/Home";
import ModePicture from "./pages/ModePicture";
import ModeBuildings from "./pages/ModeBuildings";
import IndoorFinder from "./pages/IndoorFinder";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRouteEditor from "./pages/AdminRouteEditor";
import AdminBuildingEditor from "./pages/AdminBuildingEditor";
import AdminFloorPlans from "./pages/AdminFloorPlans";

import { useTheme } from "./components/ThemeProvider";
import Splash from "./components/Splash";
import PageTransition from "./components/PageTransition";

export default function App() {
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 dark:text-gray-100">

      {/* Top Navigation */}
      <nav className="px-5 py-3 bg-white dark:bg-gray-800 shadow flex items-center gap-6 text-sm justify-between">
        <div className="flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-semibold" : "text-gray-700 dark:text-gray-200"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/picture"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-semibold" : "text-gray-700 dark:text-gray-200"
            }
          >
            Picture Mode
          </NavLink>

          <NavLink
            to="/buildings"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-semibold" : "text-gray-700 dark:text-gray-200"
            }
          >
            Buildings Mode
          </NavLink>

          <NavLink
            to="/indoor"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-semibold" : "text-gray-700 dark:text-gray-200"
            }
          >
            Indoor Finder
          </NavLink>

          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive ? "text-yellow-600 font-semibold" : "text-gray-700 dark:text-gray-200"
            }
          >
            Admin
          </NavLink>
        </div>

        <button
          onClick={toggle}
          className="px-3 py-1 border rounded dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Toggle theme"
        >
          {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </nav>

      {/* Main */}
      <main className="flex-1 p-5">
        <Splash>
          <PageTransition>
            <Routes>
              {/* USER MODES */}
              <Route path="/" element={<Home />} />
              <Route path="/picture" element={<ModePicture />} />
              <Route path="/buildings" element={<ModeBuildings />} />
              <Route path="/indoor" element={<IndoorFinder />} />

              {/* ADMIN */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/route-editor" element={<AdminRouteEditor />} />
              <Route path="/admin/building-editor" element={<AdminBuildingEditor />} />
              <Route path="/admin/floorplans" element={<AdminFloorPlans />} />
            </Routes>
          </PageTransition>
        </Splash>
      </main>
    </div>
  );
}
