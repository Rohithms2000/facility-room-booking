"use client";
import { useRouter } from "next/navigation"
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  role: string | null;
  setRole: (role: string | null) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [token, setToken] = useState<string | null>(() => {
    if (globalThis.window === undefined) return null;
    return localStorage.getItem("token");
  });

  const [role, setRole] = useState<string | null>(() => {
    if (globalThis.window === undefined) return null;
    return localStorage.getItem("role");
  });

  useEffect(() => {
    const load = async () => {
      setLoading(false);
    }
    load();
  }, []);



  const updateToken = useCallback((newToken: string | null) => {
    setToken(newToken);
    if (newToken) localStorage.setItem("token", newToken);
    else localStorage.removeItem("token");
  }, []);

  const updateRole = useCallback((newRole: string | null) => {
    setRole(newRole);
    if (newRole) localStorage.setItem("role", newRole);
    else localStorage.removeItem("role");
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
    router.push("/login")
  }, [router]);

  const value = useMemo(
    () => ({
      token,
      setToken: updateToken,
      role,
      setRole: updateRole,
      logout,
      loading,
    }),
    [token, role, logout, updateRole, updateToken, loading]
  );


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
