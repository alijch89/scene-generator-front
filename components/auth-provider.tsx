"use client";

import { apiFetch } from "@/lib/api-client";
import type { UserProfile } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  reload: () => Promise<void>;
  logout: (allDevices?: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isPending, refetch } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => apiFetch<UserProfile>("/api/auth/me"),
  });
  const user = data ?? null;
  const loading = isPending;

  const reload = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const logout = useCallback(
    async (allDevices = false) => {
      try {
        await apiFetch(`/api/auth/${allDevices ? "logout-all" : "logout"}`, {
          method: "POST",
          body: "{}",
        });
      } finally {
        queryClient.setQueryData(["auth", "me"], null);
        router.replace("/login");
        router.refresh();
      }
    },
    [queryClient, router],
  );

  const value = useMemo(
    () => ({ user, loading, reload, logout }),
    [user, loading, reload, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
