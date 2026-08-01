"use client";

import { apiFetch } from "@/lib/api-client";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ErrorMessage } from "./error-message";
import { SubmitButton } from "./submit-button";

/**
 * Submits an authenticated password change and returns the user to login.
 *
 * Security:
 * Browser validation confirms the replacement fields match, while the backend
 * revalidates strength/current credentials, hashes the secret, and revokes
 * every session.
 */
export function ChangePasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  /** Validates confirmation and submits the two required password values. */
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const newPassword = String(form.get("newPassword"));
    if (newPassword !== form.get("confirmPassword")) {
      setError("رمز عبور تازه و تکرار آن یکسان نیستند.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      await apiFetch("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword: form.get("currentPassword"),
          newPassword,
        }),
      });
      router.replace("/login?changed=1");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "تغییر رمز ناموفق بود.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="grid gap-4.5" onSubmit={submit}>
      <div className="grid gap-2">
        <Label htmlFor="change-current-password">رمز عبور فعلی</Label>
        <PasswordInput
          id="change-current-password"
          name="currentPassword"
          autoComplete="current-password"
          required
          maxLength={128}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="change-new-password">رمز عبور تازه</Label>
        <PasswordInput
          id="change-new-password"
          name="newPassword"
          autoComplete="new-password"
          required
          minLength={12}
          maxLength={128}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="change-confirm-password">تکرار رمز عبور تازه</Label>
        <PasswordInput
          id="change-confirm-password"
          name="confirmPassword"
          autoComplete="new-password"
          required
          minLength={12}
          maxLength={128}
        />
      </div>
      <ErrorMessage message={error} />
      <SubmitButton pending={pending}>تغییر رمز عبور</SubmitButton>
    </form>
  );
}
