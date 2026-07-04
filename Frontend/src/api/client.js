import axios from "axios";

// Base URL of your Express backend. Set VITE_API_URL in a .env file to override
// (see .env.example). Defaults to the local dev server from index.js.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const client = axios.create({
  baseURL,
});

// Attach a bearer token if one was issued and stored locally.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("hrms_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized 401 handling -> bounce back to login.
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("hrms_token");
      localStorage.removeItem("hrms_user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default client;
