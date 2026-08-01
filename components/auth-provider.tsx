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

/** Authentication state and actions exposed to client components. */
interface AuthContextValue {
  /** Current safe profile, or `null` when unauthenticated. */
  user: UserProfile | null;
  /** Whether the initial profile request is pending. */
  loading: boolean;
  /** Refetches the current profile after authentication changes. */
  reload: () => Promise<void>;
  /** Revokes the current or all account sessions. */
  logout: (allDevices?: boolean) => Promise<void>;
}

/** Nullable context used to detect consumers outside the provider. */
const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Loads the current profile and exposes session actions application-wide.
 *
 * Logout clears cached identity and navigates to login even when the revocation
 * request fails, preventing stale authenticated UI from remaining visible.
 */
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

/**
 * Reads the current authentication context.
 *
 * @throws Error When called outside `AuthProvider`.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
