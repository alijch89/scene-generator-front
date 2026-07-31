"use client";

import { apiFetch } from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ErrorMessage } from "./error-message";
import { SubmitButton } from "./submit-button";

export function ResetPasswordForm({ token }: { token: string }) {
  const [error, setError] = useState<string | null>(
    token ? null : "This reset link is incomplete.",
  );
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("newPassword"));
    if (password !== form.get("confirmPassword")) {
      setError("Passwords do not match.");
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
      setError(caught instanceof Error ? caught.message : "Reset failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <Label className="grid gap-2">
        New password
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
        Confirm new password
        <Input
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={12}
          maxLength={128}
        />
      </Label>
      <p className="field-hint">
        Use upper and lowercase letters, a number, and a symbol.
      </p>
      <ErrorMessage message={error} />
      <SubmitButton pending={pending || !token}>Set new password</SubmitButton>
    </form>
  );
}
