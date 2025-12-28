// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// ✅ Base URL from Vite env (production) with safe fallback (local dev)
const API_BASE_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

// ✅ One axios instance for the whole app
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Create AuthContext
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🧠 Load user from localStorage on refresh + set auth header
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);

      if (parsed?.token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${parsed.token}`;
      }
    }
    setLoading(false);
  }, []);

  // 🟢 Register
  const register = async (name, email, password) => {
    try {
      const res = await api.post("/api/auth/register", { name, email, password });
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  // 🟢 Login
  const login = async (email, password) => {
    try {
      const res = await api.post("/api/auth/login", { email, password });

      const userData = res.data;
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      // ✅ set auth header for future requests
      if (userData?.token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
      } else {
        delete api.defaults.headers.common["Authorization"];
      }

      return userData;
    } catch (error) {
      throw error;
    }
  };

  // 🔴 Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        apiBaseUrl: API_BASE_URL, // optional (useful for debugging)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
