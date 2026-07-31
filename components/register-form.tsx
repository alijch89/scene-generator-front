"use client";

import { apiFetch } from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ErrorMessage } from "./error-message";
import { SubmitButton } from "./submit-button";

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    if (password !== form.get("confirmPassword")) {
      setError("Passwords do not match.");
      setPending(false);
      return;
    }
    try {
      await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          phoneNumber: form.get("phoneNumber"),
          password,
          email: form.get("email") || undefined,
          displayName: form.get("displayName") || undefined,
        }),
      });
      router.push("/login?registered=1");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Registration failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <div className="field-grid">
        <Label className="grid gap-2">
          Display name
          <Input name="displayName" autoComplete="name" maxLength={100} />
        </Label>
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
      </div>
      <Label className="grid gap-2">
        Recovery email <span className="optional">(optional)</span>
        <Input name="email" type="email" autoComplete="email" maxLength={320} />
        <span className="field-hint">Needed for email password recovery.</span>
      </Label>
      <div className="field-grid">
        <Label className="grid gap-2">
          Password
          <Input
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={12}
            maxLength={128}
          />
        </Label>
        <Label className="grid gap-2">
          Confirm password
          <Input
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={12}
            maxLength={128}
          />
        </Label>
      </div>
      <p className="field-hint">
        Use 12+ characters with upper and lowercase letters, a number, and a
        symbol.
      </p>
      <ErrorMessage message={error} />
      <SubmitButton pending={pending}>Create account</SubmitButton>
    </form>
  );
}
