"use client";

import { apiFetch } from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      <Label className="grid gap-2">
        رمز عبور فعلی
        <Input
          name="currentPassword"
          type="password"
          dir="ltr"
          autoComplete="current-password"
          required
          maxLength={128}
        />
      </Label>
      <Label className="grid gap-2">
        رمز عبور تازه
        <Input
          name="newPassword"
          type="password"
          dir="ltr"
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
          dir="ltr"
          autoComplete="new-password"
          required
          minLength={12}
          maxLength={128}
        />
      </Label>
      <ErrorMessage message={error} />
      <SubmitButton pending={pending}>تغییر رمز عبور</SubmitButton>
    </form>
  );
}
