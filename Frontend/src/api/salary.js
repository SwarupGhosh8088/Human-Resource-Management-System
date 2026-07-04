import client from "./client.js";

// Inferred from the Salary model (employee unique ref, basic, hra,
// allowances, deductions, ctc). Adjust paths to match your actual route file.

export const getAllSalaries = () => client.get("/salary");

export const getMySalary = () => client.get("/salary/me");

export const getSalaryByEmployee = (employeeId) => client.get(`/salary/${employeeId}`);

export const upsertSalary = (payload) => client.post("/salary", payload);

export const updateSalary = (id, payload) => client.put(`/salary/${id}`, payload);
