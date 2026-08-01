import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { ChangePasswordForm } from "@/components/change-password-form";

/** Renders the authenticated password-change workflow. */
export default function ChangePasswordPage() {
  return (
    <AuthShell
      title="تغییر رمز عبور"
      description="با تغییر رمز عبور، همهٔ نشست‌های فعال از جمله همین دستگاه لغو می‌شوند."
      footer={
        <Link href="/profile" className="font-bold text-[var(--primary)]">
          ← بازگشت به حساب من
        </Link>
      }
    >
      <ChangePasswordForm />
    </AuthShell>
  );
}
