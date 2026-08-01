"use client";

import { useAuth } from "@/components/auth-provider";
import { cn, faDigits, STUB_CREDITS } from "@/lib/utils";
import {
  BookOpen,
  CircleUserRound,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/dashboard", label: "داشبورد", icon: LayoutDashboard },
  { href: "/stories", label: "کتابخانه", icon: BookOpen },
  { href: "/billing", label: "اعتبار", icon: CreditCard },
  { href: "/profile", label: "حساب من", icon: CircleUserRound },
];

function isTabActive(pathname: string, href: string) {
  if (href === "/stories") {
    return (
      pathname === "/stories" ||
      (pathname.startsWith("/stories/") && pathname !== "/stories/new")
    );
  }
  return pathname === href;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const showTabBar = pathname !== "/stories/new";

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[var(--bg)]">
        <Sparkles className="size-7 animate-pulse text-[var(--accent)]" />
      </main>
    );
  }
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[var(--bg)] lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="hidden bg-[var(--surface)] px-5 py-7 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:gap-5 lg:border-e lg:border-[var(--border)]">
        <Link href="/dashboard" className="flex items-center gap-2.5 px-1">
          <span className="grid size-8 place-items-center rounded-[11px] bg-[var(--primary)] text-[var(--primary-ink)]">
            ✦
          </span>
          <span className="font-bold">سازندهٔ صحنه</span>
        </Link>

        <Link
          href="/stories/new"
          className="flex items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-4 py-3.5 text-sm font-bold text-[var(--primary-ink)] shadow-[var(--shadow-2)] transition hover:bg-[var(--primary-hover)]"
        >
          <Plus className="size-4" /> ساخت قصهٔ تازه
        </Link>

        <nav className="flex flex-col gap-1">
          {tabs.map(({ href, label, icon: Icon }) => {
            const active = isTabActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-[var(--ink-2)] transition hover:bg-[var(--surface-2)]",
                  active && "bg-[var(--primary-soft)] text-[var(--primary)]",
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-2.5 rounded-2xl bg-[var(--night)] p-4.5 text-[#f6f3ff]">
          <span className="text-xs opacity-70">اعتبار باقی‌مانده</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[28px] font-extrabold">
              {faDigits(STUB_CREDITS)}
            </span>
            <span className="text-[13px] opacity-70">قصه</span>
          </div>
          <Link
            href="/billing"
            className="rounded-[11px] bg-white/14 px-2.5 py-2.5 text-center text-sm font-semibold"
          >
            خرید اعتبار
          </Link>
        </div>

        <div className="flex items-center gap-2.5 px-1.5 py-2">
          <span className="grid size-9 place-items-center rounded-full bg-[var(--primary-soft)] text-sm font-bold text-[var(--primary)]">
            {(user.displayName || user.phoneNumber).slice(0, 1)}
          </span>
          <div className="flex min-w-0 flex-col">
            <p className="truncate text-sm font-semibold">
              {user.displayName || "قصه‌گو"}
            </p>
            <p className="truncate text-xs text-[var(--ink-3)]">
              {user.phoneNumber}
            </p>
          </div>
          <button
            aria-label="خروج"
            className="ms-auto rounded-lg p-2 text-[var(--ink-3)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
            onClick={() => void logout()}
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </aside>

      <main className={cn("min-w-0", showTabBar && "pb-20 lg:pb-0")}>
        {children}
      </main>

      {showTabBar && (
        <nav className="fixed inset-x-0 bottom-0 z-10 flex border-t border-[var(--border)] bg-[var(--surface)] pb-[env(safe-area-inset-bottom)] lg:hidden">
          {tabs.map(({ href, label, icon: Icon }) => {
            const active = isTabActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-2.5 text-[var(--ink-3)]",
                  active && "text-[var(--primary)]",
                )}
              >
                <Icon className="size-5" />
                <span className="text-[11px] font-semibold">{label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
