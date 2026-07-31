"use client";

import { useAuth } from "@/components/auth-provider";
import { cn } from "@/lib/utils";
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

const navigation = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/stories", label: "Story library", icon: BookOpen },
  { href: "/stories/new", label: "Create a story", icon: Plus },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/profile", label: "Profile", icon: CircleUserRound },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f4ec]">
        <Sparkles className="size-7 animate-pulse text-[var(--clay)]" />
      </main>
    );
  }
  if (!user) return null;
  return (
    <div className="min-h-screen bg-[#f7f4ec] lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="border-b border-[var(--line)] bg-[#26483c] px-4 py-4 text-[#f8f4e9] lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:px-5 lg:py-7">
        <Link href="/dashboard" className="brand px-2">
          <span className="brand-mark">S</span>
          <span>Scene Studio</span>
        </Link>
        <nav className="mt-4 flex gap-1 overflow-x-auto lg:mt-10 lg:flex-col lg:overflow-visible">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              (href === "/stories" &&
                pathname.startsWith("/stories/") &&
                pathname !== "/stories/new");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white",
                  active && "bg-white/12 text-white",
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto hidden border-t border-white/10 pt-5 lg:block">
          <p className="truncate px-3 text-sm font-semibold">
            {user.displayName || "Storyteller"}
          </p>
          <p className="truncate px-3 text-xs text-white/50">
            {user.phoneNumber}
          </p>
          <button
            className="mt-3 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white"
            onClick={() => void logout()}
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </aside>
      <main className="min-w-0">{children}</main>
    </div>
  );
}
