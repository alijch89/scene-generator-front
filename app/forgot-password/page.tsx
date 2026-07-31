import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Find your way back"
      description="Enter your mobile number. If a recovery email is attached, we’ll send a short-lived reset link."
      footer={<Link href="/login">← Return to sign in</Link>}
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
