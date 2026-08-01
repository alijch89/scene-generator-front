import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { RegisterForm } from "@/components/register-form";

/** Renders the new-account registration page. */
export default function RegisterPage() {
  return (
    <AuthShell
      title="حساب بسازید و اولین قصه مهمان ما"
      description="یک اعتبار رایگان بدون کارت بانکی. هر وقت خواستید حساب را پاک کنید."
      footer={
        <>
          حساب دارید؟{" "}
          <Link href="/login" className="font-bold text-[var(--primary)]">
            ورود
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
