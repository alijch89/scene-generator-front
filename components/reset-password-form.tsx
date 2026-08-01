"use client";

import { apiFetch } from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ErrorMessage } from "./error-message";
import { SubmitButton } from "./submit-button";

/**
 * Consumes an emailed one-time token to set a replacement password.
 *
 * The form disables submission when no token is present. The backend performs
 * authoritative token, expiry, single-use, and password-strength validation.
 */
export function ResetPasswordForm({ token }: { token: string }) {
  const [error, setError] = useState<string | null>(
    token ? null : "این پیوند بازیابی ناقص است.",
  );
  const [pending, setPending] = useState(false);
  const router = useRouter();

  /** Verifies confirmation locally and submits token plus replacement password. */
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("newPassword"));
    if (password !== form.get("confirmPassword")) {
      setError("رمز عبور و تکرار آن یکسان نیستند.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      await apiFetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword: password }),
      });
      router.replace("/login?reset=1");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "بازیابی ناموفق بود.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="grid gap-4.5" onSubmit={submit}>
      <Label className="grid gap-2">
        رمز عبور تازه
        <Input
          name="newPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={12}
          maxLength={128}
        />
      </Label>
      <Label className="grid gap-2">
        تکرار رمز عبور تازه
        <Input
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={12}
          maxLength={128}
        />
      </Label>
      <p className="text-xs leading-relaxed text-[var(--ink-3)]">
        از حروف بزرگ و کوچک، یک عدد و یک نماد استفاده کنید.
      </p>
      <ErrorMessage message={error} />
      <SubmitButton pending={pending || !token}>ثبت رمز تازه</SubmitButton>
    </form>
  );
}
