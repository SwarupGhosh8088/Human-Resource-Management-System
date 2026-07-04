import React, { useEffect, useState } from "react";
import { Plus, Check, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import Card from "../components/ui/Card.jsx";
import Modal from "../components/ui/Modal.jsx";
import DataTable from "../components/ui/DataTable.jsx";
import StatusPill from "../components/ui/StatusPill.jsx";
import { getAllLeaves, getMyLeaves, applyLeave, updateLeaveStatus } from "../api/leave.js";

const emptyForm = { leaveType: "Paid", fromDate: "", toDate: "", remarks: "" };

export default function Leave() {
  const { isAdmin } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = isAdmin ? await getAllLeaves() : await getMyLeaves();
      setLeaves(res.data?.leaves || res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [isAdmin]);

  const handleApply = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await applyLeave(form);
      setModalOpen(false);
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't submit this request.");
    }
  };

  const handleDecision = async (id, status) => {
    const adminComment = status === "Rejected" ? prompt("Add a note for this decision (optional)") || "" : "";
    await updateLeaveStatus(id, { status, adminComment });
    await load();
  };

  const columns = [
    ...(isAdmin ? [{ key: "employee", header: "Employee", render: (r) => r.employee?.name || r.employee?.employeeId || "—" }] : []),
    { key: "leaveType", header: "Type" },
    { key: "fromDate", header: "From", render: (r) => new Date(r.fromDate).toLocaleDateString() },
    { key: "toDate", header: "To", render: (r) => new Date(r.toDate).toLocaleDateString() },
    { key: "remarks", header: "Remarks", render: (r) => r.remarks || "—" },
    { key: "status", header: "Status", render: (r) => <StatusPill status={r.status} /> },
    ...(isAdmin
      ? [
          {
            key: "actions",
            header: "",
            render: (r) =>
              r.status === "Pending" ? (
                <div className="flex items-center gap-2">
                  <button onClick={() => handleDecision(r._id, "Approved")} className="text-success-600 hover:opacity-70" aria-label="Approve">
                    <Check size={16} />
                  </button>
                  <button onClick={() => handleDecision(r._id, "Rejected")} className="text-danger-600 hover:opacity-70" aria-label="Reject">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <span className="text-xs text-slate-400 font-mono">{r.adminComment || "—"}</span>
              ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <Card
        title={isAdmin ? "Leave requests — all employees" : "My leave requests"}
        action={
          !isAdmin && (
            <button onClick={() => setModalOpen(true)} className="btn-primary text-xs px-3 py-2">
              <Plus size={14} /> Apply for leave
            </button>
          )
        }
      >
        {loading ? (
          <p className="text-sm text-slate-400 font-mono py-8 text-center">Loading requests…</p>
        ) : (
          <DataTable columns={columns} rows={leaves} emptyMessage="No leave requests yet." />
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Apply for leave">
        <form onSubmit={handleApply} className="space-y-4">
          {error && <div className="text-sm text-danger-600 bg-danger-50 rounded-md px-3 py-2">{error}</div>}
          <div>
            <label className="field-label">Leave type</label>
            <select className="field-input" value={form.leaveType} onChange={(e) => setForm({ ...form, leaveType: e.target.value })}>
              <option>Paid</option>
              <option>Sick</option>
              <option>Unpaid</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">From</label>
              <input type="date" required className="field-input" value={form.fromDate} onChange={(e) => setForm({ ...form, fromDate: e.target.value })} />
            </div>
            <div>
              <label className="field-label">To</label>
              <input type="date" required className="field-input" value={form.toDate} onChange={(e) => setForm({ ...form, toDate: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="field-label">Remarks</label>
            <textarea className="field-input" rows={3} value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} placeholder="Reason for leave" />
          </div>
          <button type="submit" className="btn-primary w-full">
            Submit request
          </button>
        </form>
      </Modal>
    </div>
  );
}
