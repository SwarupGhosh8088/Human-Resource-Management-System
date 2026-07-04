import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import Card from "../components/ui/Card.jsx";
import { updateProfile } from "../api/users.js";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await updateProfile(user._id, form);
      const updated = res.data?.user || res.data;
      setUser({ ...user, ...updated });
      setMessage("Profile updated.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Couldn't save your changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card title="Employee record">
        <dl className="space-y-2.5 text-sm">
          <Row label="Employee ID" value={user?.employeeId} mono />
          <Row label="Email" value={user?.email} />
          <Row label="Department" value={user?.department || "—"} />
          <Row label="Designation" value={user?.designation || "—"} />
          <Row label="Role" value={user?.role} />
          <Row label="Joined" value={user?.dateOfJoining ? new Date(user.dateOfJoining).toLocaleDateString() : "—"} />
        </dl>
      </Card>
      <Card title="Update your details">
        <form onSubmit={handleSubmit} className="space-y-4">
          {message && <div className="text-sm bg-slate-50 rounded-md px-3 py-2 text-slate-600">{message}</div>}
          <div>
            <label className="field-label">Full name</label>
            <input className="field-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Phone</label>
            <input className="field-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="field-label">Address</label>
            <textarea className="field-input" rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      </Card>
    </div>
  );
}

function Row({ label, value, mono }) {
  return (
    <div className="flex justify-between border-b border-slate-50 pb-2.5">
      <dt className="text-slate-500">{label}</dt>
      <dd className={mono ? "font-mono text-xs" : "font-medium"}>{value}</dd>
    </div>
  );
}
