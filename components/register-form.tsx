"use client";

import { apiFetch } from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { cn } from "@/lib/utils";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ErrorMessage } from "./error-message";
import { SubmitButton } from "./submit-button";

/**
 * Estimates how many visible password-strength criteria are satisfied.
 *
 * This is user guidance only; the backend validation policy is authoritative.
 */
function passwordScore(password: string) {
  let score = 0;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password) && /[^\w]/.test(password)) score++;
  return score;
}

/** Persian labels for visible password-strength tiers. */
const scoreLabel = ["ضعیف", "متوسط", "خوب"];
/** Clamps a score to the available label range. */
const scoreLabelIndex = (score: number) => Math.min(score, scoreLabel.length - 1);

/**
 * Collects new-account details and submits them to the registration API.
 *
 * Browser checks cover password confirmation and terms acknowledgement; the
 * backend independently normalizes identity fields and enforces password,
 * uniqueness, and validation rules.
 */
export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();
  const score = passwordScore(password);

  /** Validates browser-only confirmation fields and submits registration data. */
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (password !== new FormData(event.currentTarget).get("confirmPassword")) {
      setError("رمز عبور و تکرار آن یکسان نیستند.");
      return;
    }
    if (!agreed) {
      setError("برای ادامه باید با قوانین موافقت کنید.");
      return;
    }
    setPending(true);
    const form = new FormData(event.currentTarget);
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
      router.push("/welcome");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "ثبت‌نام ناموفق بود.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="grid gap-4.5" onSubmit={submit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Label className="grid gap-2">
          نام کودک یا شما
          <Input name="displayName" autoComplete="name" maxLength={100} />
        </Label>
        <Label className="grid gap-2">
          شمارهٔ موبایل
          <Input
            name="phoneNumber"
            type="tel"
            autoComplete="tel"
            placeholder="۰۹۱۲ ۱۲۳ ۴۵۶۷"
            required
            maxLength={20}
          />
        </Label>
      </div>
      <Label className="grid gap-2">
        ایمیل برای بازیابی{" "}
        <span className="text-xs font-normal text-[var(--ink-3)]">
          (اختیاری)
        </span>
        <Input
          name="email"
          type="email"
          autoComplete="email"
          maxLength={320}
        />
      </Label>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="register-password">رمز عبور</Label>
          <PasswordInput
            id="register-password"
            name="password"
            autoComplete="new-password"
            required
            minLength={12}
            maxLength={128}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="register-confirm-password">تکرار رمز عبور</Label>
          <PasswordInput
            id="register-confirm-password"
            name="confirmPassword"
            autoComplete="new-password"
            required
            minLength={12}
            maxLength={128}
          />
        </div>
      </div>
      {password && (
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full bg-[var(--surface-3)]",
                i < score && "bg-[var(--success)]",
              )}
            />
          ))}
          <span className="text-xs font-semibold text-[var(--success)]">
            {scoreLabel[scoreLabelIndex(score)]}
          </span>
        </div>
      )}
      <label className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--ink-2)]">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 size-4 accent-[var(--primary)]"
        />
        <span>
          با{" "}
          <Link
            href="/terms"
            className="font-bold text-[var(--primary)] underline decoration-[var(--primary-border)] underline-offset-4 hover:text-[var(--primary-hover)]"
          >
            قوانین
          </Link>{" "}
          و{" "}
          <Link
            href="/children-privacy-policy"
            className="font-bold text-[var(--primary)] underline decoration-[var(--primary-border)] underline-offset-4 hover:text-[var(--primary-hover)]"
          >
            سیاست حریم خصوصی کودکان
          </Link>{" "}
          موافقم.
        </span>
      </label>
      <ErrorMessage message={error} />
      <SubmitButton pending={pending}>ساخت حساب</SubmitButton>
    </form>
  );
}
