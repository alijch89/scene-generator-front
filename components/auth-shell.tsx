import Link from "next/link";

/**
 * Shared accessible layout for registration, login, and password workflows.
 */
export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-[var(--bg)] px-5 py-8">
      <div className="flex w-full max-w-[440px] flex-col gap-5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-8.5 place-items-center rounded-xl bg-[var(--primary)] text-[var(--primary-ink)]">
            ✦
          </span>
          <span className="text-sm font-bold">سازندهٔ صحنه</span>
        </Link>
        <div className="flex flex-col gap-2">
          <h1 className="m-0 text-[27px] font-extrabold leading-snug">
            {title}
          </h1>
          <p className="m-0 text-[15px] leading-loose text-[var(--ink-2)]">
            {description}
          </p>
        </div>
        {children}
        {footer && (
          <p className="m-0 text-center text-sm text-[var(--ink-2)]">
            {footer}
          </p>
        )}
      </div>
    </main>
  );
}
