import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { ResetPasswordForm } from "@/components/reset-password-form";

/**
 * Reads the emailed token from the URL and renders the reset form.
 *
 * The token remains a transient client input; the backend hashes and validates
 * it before changing any account state.
 */
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;
  return (
    <AuthShell
      title="یک رمز عبور تازه انتخاب کنید"
      description="این پیوند یک‌بارمصرف به‌زودی منقضی می‌شود و پس از استفاده دیگر کار نمی‌کند."
      footer={
        <Link href="/login" className="font-bold text-[var(--primary)]">
          ← بازگشت به ورود
        </Link>
      }
    >
      <ResetPasswordForm token={token} />
    </AuthShell>
  );
}
