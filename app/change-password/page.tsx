import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { ChangePasswordForm } from "@/components/change-password-form";

export default function ChangePasswordPage() {
  return (
    <AuthShell
      eyebrow="Account security"
      title="Change your password"
      description="All active sessions, including this one, will be revoked when your password changes."
      footer={<Link href="/profile">← Back to profile</Link>}
    >
      <ChangePasswordForm />
    </AuthShell>
  );
}
