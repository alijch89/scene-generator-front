"use client";

import { apiFetch } from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "./auth-provider";
import { ErrorMessage } from "./error-message";
import { SubmitButton } from "./submit-button";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

/**
 * Authenticates credentials, reloads profile state, and performs a safe local
 * redirect.
 *
 * Security:
 * The destination must be a single-slash local path, preventing open redirects.
 * The backend owns credential verification, throttling, and cookie issuance.
 */
export function LoginForm({ nextPath = "/profile" }: { nextPath?: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const { reload } = useAuth();

  /** Submits credentials and navigates after the profile query succeeds. */
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const data = new FormData(event.currentTarget);
    try {
      await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          phoneNumber: data.get("phoneNumber"),
          password: data.get("password"),
        }),
      });
      await reload();
      const destination =
        nextPath.startsWith("/") && !nextPath.startsWith("//")
          ? nextPath
          : "/profile";
      router.replace(destination);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Sign in failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="grid gap-4.5" onSubmit={submit}>
      <Label className="grid gap-2">
        شمارهٔ موبایل
        <Input
          name="phoneNumber"
          type="tel"
          inputMode="tel"
          dir="ltr"
          autoComplete="tel"
          placeholder="۰۹۱۲ ۱۲۳ ۴۵۶۷"
          required
          maxLength={20}
        />
      </Label>
      <Label className="grid gap-2">
        <span className="flex justify-between">
          رمز عبور
          <a href="/forgot-password" className="text-[var(--primary)]">
            فراموش کردم
          </a>
        </span>
        <Input
          name="password"
          type="password"
          dir="ltr"
          autoComplete="current-password"
          required
          maxLength={128}
        />
      </Label>
      <ErrorMessage message={error} />
      <SubmitButton pending={pending}>ورود</SubmitButton>
    </form>
  );
}
