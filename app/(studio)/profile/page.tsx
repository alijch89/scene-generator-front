"use client";

import { useAuth } from "@/components/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiFetch } from "@/lib/api-client";
import type { StoryList } from "@/lib/types";
import { faDigits } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const { data: stories } = useQuery({
    queryKey: ["stories", "all-children"],
    queryFn: () => apiFetch<StoryList>("/api/stories?limit=50"),
    enabled: Boolean(user),
  });
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useThemeSync(setTheme);

  if (loading) {
    return (
      <main className="grid min-h-[70vh] place-items-center">
        <span
          className="size-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent"
          aria-label="در حال بارگذاری"
        />
      </main>
    );
  }
  if (!user) {
    return (
      <main className="grid min-h-[70vh] place-items-center text-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="m-0 text-xl font-bold">نشست شما پایان یافته است</h1>
          <Button asChild size="lg">
            <Link href="/login">دوباره وارد شوید</Link>
          </Button>
        </div>
      </main>
    );
  }

  const children = new Map<string, { age: number; count: number }>();
  for (const story of stories?.items ?? []) {
    const existing = children.get(story.childName);
    children.set(story.childName, {
      age: story.childAge,
      count: (existing?.count ?? 0) + 1,
    });
  }

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("sg-theme", next);
    setTheme(next);
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-5 px-5 py-8 sm:px-8">
      <h1 className="m-0 text-2xl font-extrabold">حساب من</h1>

      <Card className="flex-row items-center gap-3.5 p-5 shadow-none">
        <span className="grid size-[58px] shrink-0 place-items-center rounded-full bg-[var(--primary-soft)] text-lg font-bold text-[var(--primary)]">
          {(user.displayName || user.phoneNumber).slice(0, 1)}
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-base font-bold">
            {user.displayName || "قصه‌گو"}
          </span>
          <span dir="ltr" className="text-[13px] text-[var(--ink-3)]">
            {user.phoneNumber}
          </span>
        </div>
      </Card>

      <Card className="gap-3 p-5 shadow-none">
        <h2 className="m-0 text-base font-bold">هویت</h2>
        <Row label="موبایل" value={user.phoneNumber} ltr />
        <Row label="ایمیل بازیابی" value={user.email || "ثبت نشده"} ltr />
      </Card>

      {children.size > 0 && (
        <Card className="gap-3 p-5 shadow-none">
          <h2 className="m-0 text-base font-bold">کودکان</h2>
          <div className="flex flex-wrap gap-3">
            {[...children.entries()].map(([name, info]) => (
              <div key={name} className="flex flex-col items-center gap-1.5">
                <span className="grid size-[58px] place-items-center rounded-full border border-[var(--border)] bg-[var(--accent-soft)] text-base font-bold text-[var(--accent-ink)]">
                  {name.slice(0, 1)}
                </span>
                <span className="text-[13px]">
                  {name} · {faDigits(info.age)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="gap-3 p-5 shadow-none">
        <h2 className="m-0 text-base font-bold">دسترسی</h2>
        <div className="flex flex-wrap gap-2">
          {user.roles.map((role) => (
            <Badge key={role}>{role}</Badge>
          ))}
        </div>
        <p className="m-0 text-sm text-[var(--ink-3)]">
          {faDigits(user.permissions.length)} دسترسی فعال
        </p>
      </Card>

      <Card className="gap-3 p-5 shadow-none">
        <h2 className="m-0 text-base font-bold">امنیت</h2>
        <p className="m-0 text-sm text-[var(--ink-3)]">
          رمز عبور را تغییر دهید یا نشست‌ها را در همهٔ دستگاه‌ها ببندید.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <Button asChild size="sm">
            <Link href="/change-password">تغییر رمز عبور</Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={() => void logout(true)}>
            خروج از همه‌جا
          </Button>
        </div>
      </Card>

      <Card className="gap-0 overflow-hidden p-0 shadow-none">
        <h2 className="m-0 p-5 pb-3 text-base font-bold">تنظیمات</h2>
        <div className="flex items-center justify-between border-t border-[var(--border)] p-4 text-sm">
          <span>زبان برنامه</span>
          <span className="text-[var(--ink-3)]">فارسی</span>
        </div>
        <button
          onClick={toggleTheme}
          className="flex items-center justify-between border-t border-[var(--border)] p-4 text-sm"
        >
          <span>حالت نمایش</span>
          <span className="text-[var(--primary)]">
            {theme === "dark" ? "تاریک" : "روشن"}
          </span>
        </button>
      </Card>
    </main>
  );
}

function Row({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[var(--ink-3)]">{label}</span>
      <span dir={ltr ? "ltr" : undefined} className="font-semibold">
        {value}
      </span>
    </div>
  );
}

// One-time sync from the theme already applied by the blocking script in
// the root layout's <head> — an effect is the correct tool here since the
// current value lives in the DOM/localStorage, not in anything render can see.
function useThemeSync(setTheme: (t: "light" | "dark") => void) {
  const [synced, setSynced] = useState(false);
  if (!synced && typeof document !== "undefined") {
    setSynced(true);
    const current = document.documentElement.dataset.theme;
    if (current === "dark") setTheme("dark");
  }
}
