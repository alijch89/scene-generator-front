"use client";

import { apiFetch } from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "./auth-provider";
import { ErrorMessage } from "./error-message";
import { SubmitButton } from "./submit-button";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginForm({ nextPath = "/profile" }: { nextPath?: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const { reload } = useAuth();

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
    <form className="auth-form" onSubmit={submit}>
      <Label className="grid gap-2">
        Mobile number
        <Input
          name="phoneNumber"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+98 912 123 4567"
          required
          maxLength={20}
        />
      </Label>
      <Label className="grid gap-2">
        <span className="label-row">
          Password
          <a href="/forgot-password">Forgot password?</a>
        </span>
        <Input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={128}
        />
      </Label>
      <ErrorMessage message={error} />
      <SubmitButton pending={pending}>Sign in</SubmitButton>
    </form>
  );
}
