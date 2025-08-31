"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  auth as apiLogin,
  checkAuth as apiCheck,
  logout as apiLogout,
} from "@/lib/auth";
import { useSessionStore } from "@/store/session-store";

type Role = "broker" | "user";

export function useAuth(role: Role = "broker") {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    setUser,
    logout: clearStore,
  } = useSessionStore();
  const [checking, setChecking] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null);
      try {
        const u = await apiLogin(role, email, password);
        if (u) {
          router.push("/dashboard");
        }
        return true;
      } catch (e: any) {
        setError(e?.message || "Authentication failed");
        return false;
      }
    },
    [role, router],
  );

  const logout = useCallback(async () => {
    try {
      await apiLogout(role);
    } finally {
      clearStore();
      router.push("/brokers/login");
    }
  }, [role, clearStore, router]);

  const check = useCallback(async () => {
    setChecking(true);
    setError(null);
    try {
      const ok = await apiCheck(role);
      return ok;
    } catch (e: any) {
      setError(e?.message || "Check failed");
      return false;
    } finally {
      setChecking(false);
    }
  }, [role]);

  useEffect(() => {
    // initial auth check on mount
    check();
  }, [check]);

  return useMemo(
    () => ({
      user,
      isAuthenticated,
      checking,
      error,
      login,
      logout,
      check,
    }),
    [user, isAuthenticated, checking, error, login, logout, check],
  );
}
