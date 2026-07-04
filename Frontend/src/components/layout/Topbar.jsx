import React from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Topbar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-white/70 bg-white/80 backdrop-blur">
      <div>
        <h1 className="font-semibold text-xl">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium leading-tight">{user?.name}</p>
          <p className="text-xs text-slate-500 leading-tight">{user?.employeeId}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-gold-600 text-white flex items-center justify-center font-semibold text-sm">
          {user?.name?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <button onClick={handleLogout} className="text-slate-400 hover:text-danger-600 transition-colors" aria-label="Log out">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
