import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

const API = "http://localhost:3000/api/auth/register";

const emptyForm = {
  employeeId: "",
  name: "",
  email: "",
  password: "",
  role: "Employee",
  phone: "",
  address: "",
  department: "",
  designation: "",
  dateOfJoining: "",
};

export default function RegisterPage() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      await axios.post(API, form);
      setSuccess("Account created. You can sign in once your details are confirmed.");
      setForm(emptyForm);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please check the details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-paper px-4 py-8 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden rounded-lg border border-slate-100 bg-surface shadow-sm lg:grid-cols-[0.75fr_1.25fr]">
        <section className="hidden bg-ink px-10 py-12 text-paper lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-paper/10">
              <User size={22} />
            </div>
            <h1 className="mt-8 max-w-sm text-4xl font-semibold leading-tight text-paper">
              Set up a clean employee record from day one.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-200">
              Add the basics your team needs for attendance, approvals, profile details, and payroll visibility.
            </p>
          </div>

          
        </section>

        <section className="px-5 py-8 sm:px-10">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">Employee / HR Registration</p>
            <h2 className="mt-3 text-3xl font-semibold">Create account</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Enter the details exactly as they should appear in the HR record.
            </p>

            {error && (
              <div className="mt-6 rounded-md border border-danger-50 bg-danger-50 px-3 py-2 text-sm text-danger-600">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-6 rounded-md border border-success-50 bg-success-50 px-3 py-2 text-sm text-success-600">
                {success}
              </div>
            )}

            <form className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
              <Input label="Employee ID" icon={<User size={17} />} placeholder="EMP-001" value={form.employeeId} onChange={(v) => handleChange("employeeId", v)} required />
              <Input label="Full name" icon={<User size={17} />} placeholder="your name" value={form.name} onChange={(v) => handleChange("name", v)} required />
              <Input label="Email" icon={<Mail size={17} />} type="email" placeholder="you@company.com" value={form.email} onChange={(v) => handleChange("email", v)} required />
              <Input label="Password" icon={<Lock size={17} />} type="password" placeholder="At least 6 characters" value={form.password} onChange={(v) => handleChange("password", v)} required />
              <Input label="Phone" icon={<Phone size={17} />} placeholder="+91 98765 XXXXX" value={form.phone} onChange={(v) => handleChange("phone", v)} />

              <div>
                <label className="field-label" htmlFor="role">Role</label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                  <select
                    id="role"
                    className="field-input pl-10"
                    value={form.role}
                    onChange={(e) => handleChange("role", e.target.value)}
                  >
                    <option value="Employee">Employee</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <Input label="Department" icon={<Building2 size={17} />} placeholder="Human Resources" value={form.department} onChange={(v) => handleChange("department", v)} />
              <Input label="Designation" icon={<Briefcase size={17} />} placeholder="HR Executive" value={form.designation} onChange={(v) => handleChange("designation", v)} />
              <Input label="Address" icon={<MapPin size={17} />} placeholder="Office or home address" value={form.address} onChange={(v) => handleChange("address", v)} />
              <Input label="Joining date" icon={<Calendar size={17} />} type="date" value={form.dateOfJoining} onChange={(v) => handleChange("dateOfJoining", v)} />

              <button type="submit" disabled={loading} className="btn-primary md:col-span-2 w-full py-3">
                {loading ? "Creating account..." : "Create account"}
                <ArrowRight size={17} />
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-ink underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function Input({ icon, label, value, onChange, placeholder, type = "text", required = false }) {
  const id = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div>
      <label className="field-label" htmlFor={id}>{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="field-input pl-10"
          required={required}
        />
      </div>
    </div>
  );
}
