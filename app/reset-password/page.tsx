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
      eyebrow="Secure reset"
      title="Choose a new password"
      description="This one-time link expires quickly and becomes unusable after submission."
      footer={<Link href="/login">← Return to sign in</Link>}
    >
      <ResetPasswordForm token={token} />
    </AuthShell>
  );
}
