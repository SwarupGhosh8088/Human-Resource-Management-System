import React, { createContext, useContext, useEffect, useState } from "react";
import { loginUser, logoutUser } from "../api/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("hrms_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("hrms_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("hrms_user");
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      // Expected shape: { token, user }. Adjust destructuring if your
      // auth.route.js returns a different response shape.
      const { token, user: loggedInUser } = res.data;
      if (token) localStorage.setItem("hrms_token", token);
      setUser(loggedInUser);
      return loggedInUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // ignore network errors on logout, clear local state regardless
    }
    localStorage.removeItem("hrms_token");
    setUser(null);
  };

  const isAdmin = user?.role === "Admin";

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
