import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

const TITLES = {
  "/": "Dashboard",
  "/employees": "Employees",
  "/attendance": "Attendance",
  "/leave": "Leave",
  "/salary": "Salary",
  "/documents": "Documents",
  "/profile": "Profile",
};

export default function AppLayout() {
  const { pathname } = useLocation();
  const title = TITLES[pathname] || "HRMS";

  return (
    <div className="flex min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#eef7ff_38%,#fff7ed_100%)] font-body">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Topbar title={title} />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
