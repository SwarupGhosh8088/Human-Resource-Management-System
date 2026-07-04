import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, Lock, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "We could not sign you in. Check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-paper px-4 py-8 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden rounded-lg border border-slate-100 bg-surface shadow-sm lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden bg-ink px-10 py-12 text-paper lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-paper/10">
              <BriefcaseBusiness size={22} />
            </div>
            <h1 className="mt-8 max-w-sm text-4xl font-semibold leading-tight text-paper">
              Every workday, perfectly aligned.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-200">
              Sign in to manage attendance, leave requests, employee records, and payroll details from one steady HR workspace.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-md border border-paper/10 bg-paper/5 p-4">
              <p className="font-semibold text-paper">Attendance</p>
              <p className="mt-1 text-xs text-slate-200">Daily records</p>
            </div>
            <div className="rounded-md border border-paper/10 bg-paper/5 p-4">
              <p className="font-semibold text-paper">Leave</p>
              <p className="mt-1 text-xs text-slate-200">Fast approvals</p>
            </div>
            <div className="rounded-md border border-paper/10 bg-paper/5 p-4">
              <p className="font-semibold text-paper">Payroll</p>
              <p className="mt-1 text-xs text-slate-200">Clear views</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-10">
          <div className="w-full max-w-md">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-700">HRMS Portal</p>
            <h2 className="mt-3 text-3xl font-semibold">Welcome back</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Use your work email and password to continue to your dashboard.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="field-label" htmlFor="email">Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={handleChange}
                    className="field-input pl-10"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="field-label" htmlFor="password">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                  <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    className="field-input pl-10"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-md border border-danger-50 bg-danger-50 px-3 py-2 text-sm text-danger-600">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? "Signing in..." : "Sign in"}
                <ArrowRight size={17} />
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              New to HRMS?{" "}
              <Link to="/register" className="font-semibold text-ink underline-offset-4 hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
