import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import Card from "../components/ui/Card.jsx";
import StatusPill from "../components/ui/StatusPill.jsx";
import { getMyAttendance, checkIn, checkOut } from "../api/attendance.js";
import { getMyLeaves, getAllLeaves } from "../api/leave.js";
import { getEmployees } from "../api/users.js";
import { CalendarCheck, Users, Clock, FileText } from "lucide-react";

export default function Dashboard() {
  const { user, isAdmin } = useAuth();

  if (isAdmin) return <AdminDashboard />;
  return <EmployeeDashboard />;
}

function EmployeeDashboard() {
  const [today, setToday] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [attRes, leaveRes] = await Promise.all([
        getMyAttendance().catch(() => ({ data: [] })),
        getMyLeaves().catch(() => ({ data: [] })),
      ]);
      const records = attRes.data?.records || attRes.data || [];
      const todayStr = new Date().toDateString();
      const todaysRecord = Array.isArray(records)
        ? records.find((r) => new Date(r.date).toDateString() === todayStr)
        : null;
      setToday(todaysRecord || null);
      setLeaves((leaveRes.data?.leaves || leaveRes.data || []).slice(0, 5));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCheckIn = async () => {
    setBusy(true);
    try {
      await checkIn();
      await load();
    } finally {
      setBusy(false);
    }
  };

  const handleCheckOut = async () => {
    setBusy(true);
    try {
      await checkOut();
      await load();
    } finally {
      setBusy(false);
    }
  };

  const pendingLeaves = leaves.filter((l) => l.status === "Pending").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card title="Today's status">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-display font-semibold">
                {today?.checkIn ? new Date(today.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
              </p>
              <p className="text-xs text-slate-400 font-mono mt-1">check-in</p>
            </div>
            <Clock size={22} className="text-slate-300" />
          </div>
        </Card>
        <Card title="Pending leaves">
          <p className="text-2xl font-display font-semibold">{pendingLeaves}</p>
          <p className="text-xs text-slate-400 font-mono mt-1">awaiting review</p>
        </Card>
        <Card title="This month">
          <p className="text-2xl font-display font-semibold">{today?.status ? <StatusPill status={today.status} /> : "—"}</p>
          <p className="text-xs text-slate-400 font-mono mt-1">today's mark</p>
        </Card>
      </div>

      <Card title="Punch clock">
        <div className="flex items-center gap-3">
          <button onClick={handleCheckIn} disabled={busy || !!today?.checkIn} className="btn-primary">
            Check in
          </button>
          <button onClick={handleCheckOut} disabled={busy || !today?.checkIn || !!today?.checkOut} className="btn-secondary">
            Check out
          </button>
          {!loading && !today && <span className="text-sm text-slate-400 font-mono">No record for today yet.</span>}
        </div>
      </Card>

      <Card title="Recent leave requests">
        <div className="space-y-3">
          {leaves.length === 0 && <p className="text-sm text-slate-400 font-mono">No leave requests filed yet.</p>}
          {leaves.map((l) => (
            <div key={l._id} className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium">{l.leaveType} leave</p>
                <p className="text-xs text-slate-400 font-mono">
                  {new Date(l.fromDate).toLocaleDateString()} – {new Date(l.toDate).toLocaleDateString()}
                </p>
              </div>
              <StatusPill status={l.status} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState({ employees: 0, pendingLeaves: 0, presentToday: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [empRes, leaveRes] = await Promise.all([
          getEmployees().catch(() => ({ data: [] })),
          getAllLeaves().catch(() => ({ data: [] })),
        ]);
        const employees = empRes.data?.users || empRes.data || [];
        const allLeaves = leaveRes.data?.leaves || leaveRes.data || [];
        setStats({
          employees: employees.length,
          pendingLeaves: allLeaves.filter((l) => l.status === "Pending").length,
          presentToday: employees.length, // best-effort placeholder until attendance summary endpoint is confirmed
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card title="Total employees">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-display font-semibold">{loading ? "…" : stats.employees}</p>
            <Users size={22} className="text-slate-300" />
          </div>
        </Card>
        <Card title="Pending leave requests">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-display font-semibold">{loading ? "…" : stats.pendingLeaves}</p>
            <FileText size={22} className="text-slate-300" />
          </div>
        </Card>
        <Card title="Attendance">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-display font-semibold">—</p>
            <CalendarCheck size={22} className="text-slate-300" />
          </div>
        </Card>
      </div>
      <Card title="Getting started">
        <p className="text-sm text-slate-600 leading-relaxed">
          Use <span className="">Employees</span> to onboard staff,Leave 
           to review requests, and{" "}
         Salary to manage compensation records.
        </p>
      </Card>
    </div>
  );
}
