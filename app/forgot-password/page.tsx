import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="بازیابی حساب"
      description="شمارهٔ موبایل خود را وارد کنید. اگر ایمیل بازیابی ثبت شده باشد، پیوندی کوتاه‌مدت برایتان می‌فرستیم."
      footer={
        <Link href="/login" className="font-bold text-[var(--primary)]">
          ← بازگشت به ورود
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
