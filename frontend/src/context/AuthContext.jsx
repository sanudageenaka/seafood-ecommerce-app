import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

// ✅ Base URL (NO trailing slash)
const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

// ✅ Create one axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: false, // set true only if you use cookies
});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null); // { user, token }
  const [loading, setLoading] = useState(true);

  // keep latest token without re-registering interceptors every render
  const tokenRef = useRef(null);

  const setAndPersistAuth = (nextAuth) => {
    setAuth(nextAuth);
    tokenRef.current = nextAuth?.token || null;

    if (nextAuth) localStorage.setItem("auth", JSON.stringify(nextAuth));
    else localStorage.removeItem("auth");
  };

  const refreshAuthFromStorage = () => {
    try {
      const stored = localStorage.getItem("auth");
      if (!stored) return setAndPersistAuth(null);

      const parsed = JSON.parse(stored);
      if (parsed?.token) {
        setAndPersistAuth(parsed);
      } else {
        setAndPersistAuth(null);
      }
    } catch (e) {
      console.error("Auth storage parse error:", e);
      localStorage.removeItem("auth");
      setAndPersistAuth(null);
    }
  };

  // ✅ Load auth on refresh
  useEffect(() => {
    refreshAuthFromStorage();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Axios interceptors (attach token + handle 401)
  useEffect(() => {
    const reqId = api.interceptors.request.use((config) => {
      const token = tokenRef.current;
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    const resId = api.interceptors.response.use(
      (res) => res,
      (error) => {
        const status = error?.response?.status;

        // ✅ If token expired / invalid → logout
        if (status === 401) {
          setAndPersistAuth(null);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(reqId);
      api.interceptors.response.eject(resId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalizeError = (error, fallback = "Something went wrong") => {
    return (
      error?.response?.data?.details ||
      error?.response?.data?.error ||
      error?.message ||
      fallback
    );
  };

  // 🟢 Register
  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/api/auth/register", { name, email, password });

      // If backend returns token + user -> auto login
      if (data?.token) {
        setAndPersistAuth({ user: data?.user || null, token: data.token });
      }

      return data;
    } catch (error) {
      console.error("REGISTER ERROR:", error?.response?.data || error);
      throw new Error(normalizeError(error, "Registration failed"));
    }
  };

  // 🟢 Login
  const login = async (email, password) => {
    try {
      const { data } = await api.post("/api/auth/login", { email, password });

      if (data?.token) {
        setAndPersistAuth({ user: data?.user || null, token: data.token });
      } else {
        throw new Error("Token not returned from server");
      }

      return data;
    } catch (error) {
      console.error("LOGIN ERROR:", error?.response?.data || error);
      throw new Error(normalizeError(error, "Login failed"));
    }
  };

  // 🔴 Logout
  const logout = () => {
    setAndPersistAuth(null);
  };

  // ✅ helper if you ever need headers manually (optional)
  const authHeader = () => {
    const token = tokenRef.current;
    return token ? { Authorization: `Bearer ${token}` } : {};
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

      // expose api instance for use everywhere
      api,

      // helpful utilities
      authHeader,
      refreshAuthFromStorage,
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
