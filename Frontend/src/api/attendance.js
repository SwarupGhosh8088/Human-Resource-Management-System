import client from "./client.js";

// No attendance.route.js was uploaded, so these paths are inferred from the
// Attendance model (employee, date, checkIn, checkOut, status). Adjust the
// path strings if your actual route file names them differently.

export const getAllAttendance = (params) => client.get("/attendance", { params });

export const getMyAttendance = (params) => client.get("/attendance/me", { params });

export const checkIn = () => client.post("/attendance/checkin");

export const checkOut = () => client.post("/attendance/checkout");

export const markAttendance = (payload) => client.post("/attendance", payload); // admin manual entry

export const updateAttendance = (id, payload) => client.put(`/attendance/${id}`, payload);
