import client from "./client.js";

// NOTE: auth.route.js was not part of the uploaded backend files, so these
// paths follow the most common convention for the User model provided
// (register -> OTP verification -> login, since the schema has otp/otpExpires
// and isVerified fields). Adjust the string paths below if your routes differ
// — nothing else in the app needs to change.

export const registerUser = (payload) => client.post("/auth/register", payload);

export const verifyOtp = (payload) => client.post("/auth/verify-otp", payload);

export const resendOtp = (payload) => client.post("/auth/resend-otp", payload);

export const loginUser = (payload) => client.post("/auth/login", payload);

export const logoutUser = () => client.post("/auth/logout");

export const fetchCurrentUser = () => client.get("/auth/me");
