import React, { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import Card from "../components/ui/Card.jsx";
import Modal from "../components/ui/Modal.jsx";
import DataTable from "../components/ui/DataTable.jsx";
import { getMySalary, getAllSalaries, upsertSalary } from "../api/salary.js";
import { getEmployees } from "../api/users.js";

const fmt = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

const emptyForm = { employee: "", basic: 0, hra: 0, allowances: 0, deductions: 0, ctc: 0 };

export default function Salary() {
  const { isAdmin } = useAuth();
  if (isAdmin) return <AdminSalary />;
  return <EmployeeSalary />;
}

function EmployeeSalary() {
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMySalary();
        setSalary(res.data?.salary || res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-sm text-slate-400 font-mono py-8 text-center">Loading salary details…</p>;
  if (!salary) return <Card title="Salary breakdown"><p className="text-sm text-slate-400 font-mono py-6 text-center">No salary record on file yet.</p></Card>;

  const net = (salary.basic || 0) + (salary.hra || 0) + (salary.allowances || 0) - (salary.deductions || 0);

  const rows = [
    { label: "Basic", value: salary.basic },
    { label: "HRA", value: salary.hra },
    { label: "Allowances", value: salary.allowances },
    { label: "Deductions", value: -salary.deductions },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card title="Salary breakdown">
        <div className="divide-y divide-slate-50">
          {rows.map((r) => (
            <div key={r.label} className="flex justify-between py-2.5 text-sm">
              <span className="text-slate-600">{r.label}</span>
              <span className="font-mono">{fmt(r.value)}</span>
            </div>
          ))}
          <div className="flex justify-between py-2.5 text-sm font-semibold">
            <span>Net pay (monthly)</span>
            <span className="font-mono">{fmt(net)}</span>
          </div>
        </div>
      </Card>
      <Card title="Annual CTC">
        <p className="text-3xl font-display font-semibold">{fmt(salary.ctc)}</p>
        <p className="text-xs text-slate-400 font-mono mt-2">cost to company, per year</p>
      </Card>
    </div>
  );
}

function AdminSalary() {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [salRes, empRes] = await Promise.all([getAllSalaries(), getEmployees()]);
      setSalaries(salRes.data?.salaries || salRes.data || []);
      setEmployees(empRes.data?.users || empRes.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (row) => {
    setForm({
      employee: row.employee?._id || row.employee || "",
      basic: row.basic || 0,
      hra: row.hra || 0,
      allowances: row.allowances || 0,
      deductions: row.deductions || 0,
      ctc: row.ctc || 0,
    });
    setModalOpen(true);
  };

  const openNew = () => {
    setForm(emptyForm);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await upsertSalary(form);
      setModalOpen(false);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save this salary record.");
    }
  };

  const columns = [
    { key: "employee", header: "Employee", render: (r) => r.employee?.name || r.employee?.employeeId || "—" },
    { key: "basic", header: "Basic", render: (r) => fmt(r.basic) },
    { key: "hra", header: "HRA", render: (r) => fmt(r.hra) },
    { key: "allowances", header: "Allowances", render: (r) => fmt(r.allowances) },
    { key: "deductions", header: "Deductions", render: (r) => fmt(r.deductions) },
    { key: "ctc", header: "CTC (annual)", render: (r) => fmt(r.ctc) },
    {
      key: "actions",
      header: "",
      render: (r) => (
        <button onClick={() => openEdit(r)} className="text-slate-400 hover:text-ink transition-colors" aria-label="Edit">
          <Pencil size={15} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card
        title={`Salary records (${salaries.length})`}
        action={
          <button onClick={openNew} className="btn-primary text-xs px-3 py-2">
            Set salary
          </button>
        }
      >
        {loading ? (
          <p className="text-sm text-slate-400 font-mono py-8 text-center">Loading records…</p>
        ) : (
          <DataTable columns={columns} rows={salaries} emptyMessage="No salary records yet." />
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Set salary">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-sm text-danger-600 bg-danger-50 rounded-md px-3 py-2">{error}</div>}
          <div>
            <label className="field-label">Employee</label>
            <select required className="field-input" value={form.employee} onChange={(e) => setForm({ ...form, employee: e.target.value })}>
              <option value="">Select employee</option>
              {employees.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.name} ({e.employeeId})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Basic</label>
              <input type="number" className="field-input" value={form.basic} onChange={(e) => setForm({ ...form, basic: Number(e.target.value) })} />
            </div>
            <div>
              <label className="field-label">HRA</label>
              <input type="number" className="field-input" value={form.hra} onChange={(e) => setForm({ ...form, hra: Number(e.target.value) })} />
            </div>
            <div>
              <label className="field-label">Allowances</label>
              <input type="number" className="field-input" value={form.allowances} onChange={(e) => setForm({ ...form, allowances: Number(e.target.value) })} />
            </div>
            <div>
              <label className="field-label">Deductions</label>
              <input type="number" className="field-input" value={form.deductions} onChange={(e) => setForm({ ...form, deductions: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <label className="field-label">Annual CTC</label>
            <input type="number" className="field-input" value={form.ctc} onChange={(e) => setForm({ ...form, ctc: Number(e.target.value) })} />
          </div>
          <button type="submit" className="btn-primary w-full">
            Save salary record
          </button>
        </form>
      </Modal>
    </div>
  );
}
