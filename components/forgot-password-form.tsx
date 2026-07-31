"use client";

import { apiFetch } from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import { ErrorMessage, SuccessMessage } from "./error-message";
import { SubmitButton } from "./submit-button";

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      const result = await apiFetch<{ message: string }>(
        "/api/auth/forgot-password",
        {
          method: "POST",
          body: JSON.stringify({ phoneNumber: form.get("phoneNumber") }),
        },
      );
      setSuccess(result.message);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Request failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <Label className="grid gap-2">
        Mobile number
        <Input
          name="phoneNumber"
          type="tel"
          autoComplete="tel"
          placeholder="+98 912 123 4567"
          required
          maxLength={20}
        />
      </Label>
      <ErrorMessage message={error} />
      <SuccessMessage message={success} />
      <SubmitButton pending={pending}>Send reset instructions</SubmitButton>
    </form>
  );
}
