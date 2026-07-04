import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Card from "../components/ui/Card.jsx";
import Modal from "../components/ui/Modal.jsx";
import DataTable from "../components/ui/DataTable.jsx";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from "../api/users.js";

const emptyForm = {
  employeeId: "",
  name: "",
  email: "",
  password: "",
  role: "Employee",
  department: "",
  designation: "",
  phone: "",
};

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await getEmployees();
      setEmployees(res.data?.users || res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (emp) => {
    setForm({ ...emptyForm, ...emp, password: "" });
    setEditingId(emp._id);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        const { password, ...rest } = form;
        await updateEmployee(editingId, password ? form : rest);
      } else {
        await createEmployee(form);
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save this employee.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this employee record? This can't be undone.")) return;
    await deleteEmployee(id);
    await load();
  };

  const columns = [
    { key: "employeeId", header: "ID", render: (r) => <span className="font-mono text-xs">{r.employeeId}</span> },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "department", header: "Department", render: (r) => r.department || "—" },
    { key: "role", header: "Role" },
    {
      key: "actions",
      header: "",
      render: (r) => (
        <div className="flex items-center gap-3">
          <button onClick={() => openEdit(r)} className="text-slate-400 hover:text-ink transition-colors" aria-label="Edit">
            <Pencil size={15} />
          </button>
          <button onClick={() => handleDelete(r._id)} className="text-slate-400 hover:text-danger-600 transition-colors" aria-label="Delete">
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card
        title={`Employees (${employees.length})`}
        action={
          <button onClick={openCreate} className="btn-primary text-xs px-3 py-2">
            <Plus size={14} /> Add employee
          </button>
        }
      >
        {loading ? (
          <p className="text-sm text-slate-400 font-mono py-8 text-center">Loading roster…</p>
        ) : (
          <DataTable columns={columns} rows={employees} emptyMessage="No employees on record yet." />
        )}
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit employee" : "Add employee"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-sm text-danger-600 bg-danger-50 rounded-md px-3 py-2">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Employee ID</label>
              <input required className="field-input" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Full name</label>
              <input required className="field-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="field-label">Email</label>
            <input type="email" required className="field-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          {!editingId && (
            <div>
              <label className="field-label">Temporary password</label>
              <input type="password" required className="field-input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Department</label>
              <input className="field-input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Designation</label>
              <input className="field-input" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Phone</label>
              <input className="field-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Role</label>
              <select className="field-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option>Employee</option>
                <option>Admin</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">
            {editingId ? "Save changes" : "Create employee"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
