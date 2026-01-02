import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

// ✅ Base URL (NO trailing slash)
const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(
  /\/$/,
  ""
);

// ✅ Axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null); // { user, token }
  const [loading, setLoading] = useState(true);

  // ✅ Load auth from localStorage on refresh
  useEffect(() => {
    try {
      const stored = localStorage.getItem("auth");
      if (stored) {
        const parsed = JSON.parse(stored);
        setAuth(parsed);

        if (parsed?.token) {
          api.defaults.headers.common.Authorization = `Bearer ${parsed.token}`;
        }
      }
    } catch (e) {
      console.error("Auth storage parse error:", e);
      localStorage.removeItem("auth");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ helper to save auth
  const setAndPersistAuth = (nextAuth) => {
    setAuth(nextAuth);
    localStorage.setItem("auth", JSON.stringify(nextAuth));

    if (nextAuth?.token) {
      api.defaults.headers.common.Authorization = `Bearer ${nextAuth.token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  };

  // 🟢 Register (returns backend response)
  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });

      // ✅ If your backend returns token + user, auto-login
      if (data?.token && data?.user) {
        setAndPersistAuth({ user: data.user, token: data.token });
      }

      return data;
    } catch (error) {
      const msg =
        error?.response?.data?.details ||
        error?.response?.data?.error ||
        error?.message ||
        "Registration failed";
      console.error("REGISTER ERROR:", error?.response?.data || error);
      throw new Error(msg);
    }
  };

  // 🟢 Login
  const login = async (email, password) => {
    try {
      const { data } = await api.post("/api/auth/login", { email, password });

      // ✅ expect { user, token }
      if (data?.token && data?.user) {
        setAndPersistAuth({ user: data.user, token: data.token });
      } else if (data?.token) {
        // fallback if backend returns only token
        setAndPersistAuth({ user: null, token: data.token });
      }

      return data;
    } catch (error) {
      const msg =
        error?.response?.data?.details ||
        error?.response?.data?.error ||
        error?.message ||
        "Login failed";
      console.error("LOGIN ERROR:", error?.response?.data || error);
      throw new Error(msg);
    }
  };

  // 🔴 Logout
  const logout = () => {
    setAndPersistAuth(null);
  };

  const value = useMemo(
    () => ({
      user: auth?.user || null,
      token: auth?.token || null,
      loading,
      isAuthenticated: !!auth?.token,
      register,
      login,
      logout,
      api,
    }),
    [auth, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
