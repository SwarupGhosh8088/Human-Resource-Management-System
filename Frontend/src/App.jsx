import React from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Employees from "./pages/Employees.jsx";
import Attendance from "./pages/Attendance.jsx";
import Leave from "./pages/Leave.jsx";
import Salary from "./pages/Salary.jsx";
import Documents from "./pages/Documents.jsx";
import Profile from "./pages/Profile.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        
        <Route
          path="/employees"
          element={
            <ProtectedRoute adminOnly>
              <Employees />
            </ProtectedRoute>
          }
        />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/salary" element={<Salary />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Login />} />
    </Routes>
  );
}
