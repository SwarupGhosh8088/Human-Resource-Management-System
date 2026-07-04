import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutGrid, Users, CalendarCheck, FileText, Wallet, FolderOpen, UserCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const employeeLinks = [
  { to: "/", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/leave", label: "Leave", icon: FileText },
  { to: "/salary", label: "Salary", icon: Wallet },
  { to: "/documents", label: "Documents", icon: FolderOpen },
  { to: "/profile", label: "Profile", icon: UserCircle },
];

const adminLinks = [
  { to: "/", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/employees", label: "Employees", icon: Users },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/leave", label: "Leave", icon: FileText },
  { to: "/salary", label: "Salary", icon: Wallet },
  { to: "/documents", label: "Documents", icon: FolderOpen },
  { to: "/profile", label: "Profile", icon: UserCircle },
];

export default function Sidebar() {
  const { isAdmin } = useAuth();
  const links = isAdmin ? adminLinks : employeeLinks;

  return (
    <aside className="w-64 shrink-0 bg-white/90 backdrop-blur border-r border-slate-100 flex flex-col h-screen sticky top-0">
      <div className="px-6 py-6 border-b border-slate-100">
        <p className="font-bold text-lg leading-tight">HRMS</p>
        <p className="text-xs text-slate-500">People operations</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label, icon: Icon, end }, i) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `ledger-tab ${isActive ? "active" : ""}`}
          >
            <span className="text-xs text-slate-400 w-4">{String(i + 1).padStart(2, "0")}</span>
            <Icon size={16} strokeWidth={2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
