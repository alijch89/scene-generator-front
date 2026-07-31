import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Your next chapter"
      title="Create your account"
      description="Set up a protected workspace in less than a minute."
      footer={
        <p>
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
