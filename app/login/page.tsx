import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "@/components/login-form";
import { SuccessMessage } from "@/components/error-message";

/**
 * Renders login with an optional local destination and post-account notices.
 *
 * The login form independently validates the `next` path before navigation.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; registered?: string; reset?: string; changed?: string }>;
}) {
  const query = await searchParams;
  const notice = query.registered
    ? "حساب شما ساخته شد. حالا می‌توانید وارد شوید."
    : query.reset
      ? "رمز عبور تغییر کرد. با رمز تازه وارد شوید."
      : query.changed
        ? "رمز عبور تغییر کرد. دوباره وارد شوید."
        : null;
  return (
    <AuthShell
      title="خوش برگشتید"
      description="قصه‌های در انتظار شما همین‌جا ادامه پیدا می‌کنند."
      footer={
        <>
          حساب ندارید؟{" "}
          <Link href="/register" className="font-bold text-[var(--primary)]">
            ثبت‌نام
          </Link>
        </>
      }
    >
      <SuccessMessage message={notice} />
      <LoginForm nextPath={query.next} />
    </AuthShell>
  );
}
