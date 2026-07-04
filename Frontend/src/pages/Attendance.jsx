import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import Card from "../components/ui/Card.jsx";
import DataTable from "../components/ui/DataTable.jsx";
import StatusPill from "../components/ui/StatusPill.jsx";
import { getAllAttendance, getMyAttendance, checkIn, checkOut } from "../api/attendance.js";

export default function Attendance() {
  const { isAdmin } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = isAdmin ? await getAllAttendance() : await getMyAttendance();
      setRecords(res.data?.records || res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [isAdmin]);

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

  const todayStr = new Date().toDateString();
  const todaysRecord = !isAdmin ? records.find((r) => new Date(r.date).toDateString() === todayStr) : null;

  const columns = [
    ...(isAdmin ? [{ key: "employee", header: "Employee", render: (r) => r.employee?.name || r.employee?.employeeId || r.employee || "—" }] : []),
    { key: "date", header: "Date", render: (r) => new Date(r.date).toLocaleDateString() },
    { key: "checkIn", header: "Check in", render: (r) => (r.checkIn ? new Date(r.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—") },
    { key: "checkOut", header: "Check out", render: (r) => (r.checkOut ? new Date(r.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—") },
    { key: "status", header: "Status", render: (r) => <StatusPill status={r.status} /> },
  ];

  return (
    <div className="space-y-6">
      {!isAdmin && (
        <Card title="Punch clock">
          <div className="flex items-center gap-3">
            <button onClick={handleCheckIn} disabled={busy || !!todaysRecord?.checkIn} className="btn-primary">
              Check in
            </button>
            <button onClick={handleCheckOut} disabled={busy || !todaysRecord?.checkIn || !!todaysRecord?.checkOut} className="btn-secondary">
              Check out
            </button>
          </div>
        </Card>
      )}
      <Card title={isAdmin ? "Attendance log — all employees" : "My attendance history"}>
        {loading ? (
          <p className="text-sm text-slate-400 font-mono py-8 text-center">Loading records…</p>
        ) : (
          <DataTable columns={columns} rows={records} emptyMessage="No attendance records yet." />
        )}
      </Card>
    </div>
  );
}
