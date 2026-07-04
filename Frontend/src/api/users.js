import client from "./client.js";

// user.route.js is mounted at /api/users in index.js. Exact sub-paths weren't
// in the uploaded files, so these follow standard REST conventions against
// the User model's fields (employeeId, name, email, role, department, etc).

export const getEmployees = (params) => client.get("/users", { params });

export const getEmployee = (id) => client.get(`/users/${id}`);

export const createEmployee = (payload) => client.post("/users", payload);

export const updateEmployee = (id, payload) => client.put(`/users/${id}`, payload);

export const deleteEmployee = (id) => client.delete(`/users/${id}`);

export const updateProfile = (id, payload) => client.put(`/users/${id}`, payload);
