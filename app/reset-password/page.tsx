import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { ResetPasswordForm } from "@/components/reset-password-form";

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
