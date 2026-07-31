import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; registered?: string; reset?: string; changed?: string }>;
}) {
  const query = await searchParams;
  const notice = query.registered
    ? "Account created. You can sign in now."
    : query.reset
      ? "Password reset. Sign in with your new password."
      : query.changed
        ? "Password changed. Sign in again on this device."
        : null;
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your studio"
      description="Continue shaping the scenes and stories waiting for you."
      footer={
        <p>
          New to Scene Studio? <Link href="/register">Create an account</Link>
        </p>
      }
    >
      {notice && <p className="form-message success-message">{notice}</p>}
      <LoginForm nextPath={query.next} />
    </AuthShell>
  );
}
