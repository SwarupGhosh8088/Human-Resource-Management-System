import client from "./client.js";

// Inferred from the Leave model (employee, leaveType, fromDate, toDate,
// remarks, status, adminComment). Adjust paths to match your actual route file.

export const getAllLeaves = (params) => client.get("/leave", { params });

export const getMyLeaves = () => client.get("/leave/me");

export const applyLeave = (payload) => client.post("/leave", payload);

export const updateLeaveStatus = (id, payload) => client.put(`/leave/${id}/status`, payload); // { status, adminComment }

export const cancelLeave = (id) => client.delete(`/leave/${id}`);
