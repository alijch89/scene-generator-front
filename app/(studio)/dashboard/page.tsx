"use client";

import { useAuth } from "@/components/auth-provider";
import { StoryStatusBadge } from "@/components/story-status";
import { apiFetch } from "@/lib/api-client";
import { assetUrl, type StoryList } from "@/lib/types";
import { faDigits, STUB_CREDITS } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BookOpen, Clock3, Plus, Sparkles } from "lucide-react";
import Link from "next/link";

const dateFormat = new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" });

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isPending } = useQuery({
    queryKey: ["stories", "dashboard"],
    queryFn: () =>
      apiFetch<StoryList>("/api/stories?limit=6&sortBy=createdAt&sortOrder=desc"),
  });
  const stories = data?.items ?? [];
  const complete = stories.filter((story) => story.status === "Completed").length;
  const active = stories.filter((story) =>
    ["Draft", "Queued", "Processing"].includes(story.status),
  ).length;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 px-5 py-8 sm:px-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--ink-3)]">عصر بخیر</p>
          <h1 className="m-0 text-[22px] font-extrabold">
            {user?.displayName || "قصه‌گو"}
          </h1>
        </div>
        <Link
          href="/profile"
          className="grid size-11 place-items-center overflow-hidden rounded-full border border-[var(--border)]"
        >
          <span className="grid size-full place-items-center bg-[var(--primary-soft)] text-base font-bold text-[var(--primary)]">
            {(user?.displayName || user?.phoneNumber || "?").slice(0, 1)}
          </span>
        </Link>
      </header>

      <section className="relative flex flex-col gap-4 overflow-hidden rounded-3xl bg-[var(--night)] p-5.5 text-[#f6f3ff]">
        <span
          className="absolute start-5 top-4 text-[var(--accent)]"
          style={{ animation: "twinkle 3s infinite" }}
        >
          ✦
        </span>
        <div className="flex flex-col gap-1">
          <span className="text-[13px] opacity-70">اعتبار باقی‌مانده</span>
          <div className="flex items-baseline gap-2">
            <span className="text-[40px] font-extrabold">
              {faDigits(STUB_CREDITS)}
            </span>
            <span className="text-sm opacity-70">قصه</span>
          </div>
        </div>
        <div className="flex gap-2.5">
          <Link
            href="/stories/new"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-4 py-3.5 text-sm font-bold text-[#3b2405]"
          >
            <Plus className="size-4" /> ساخت قصهٔ تازه
          </Link>
          <Link
            href="/billing"
            className="rounded-2xl bg-white/12 px-4.5 py-3.5 text-sm font-semibold"
          >
            خرید
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3">
        {[
          { label: "قصه‌ها", value: data?.pagination.total, icon: BookOpen },
          { label: "آماده", value: complete, icon: Sparkles },
          { label: "در حال ساخت", value: active, icon: Clock3 },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex flex-col gap-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <Icon className="size-4 text-[var(--accent)]" />
            <strong className="text-2xl font-extrabold">
              {value === undefined ? "—" : faDigits(value)}
            </strong>
            <span className="text-xs font-semibold text-[var(--ink-3)]">
              {label}
            </span>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="m-0 text-lg font-bold">قصه‌های اخیر</h2>
          <Link
            href="/stories"
            className="flex items-center gap-1.5 text-sm font-bold text-[var(--primary)]"
          >
            همه <ArrowLeft className="size-4" />
          </Link>
        </div>
        {isPending ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[90px] animate-pulse rounded-2xl bg-black/5"
              />
            ))}
          </div>
        ) : stories.length ? (
          <div className="flex flex-col gap-3">
            {stories.map((story) => (
              <Link
                href={`/stories/${story.id}`}
                key={story.id}
                className="flex items-center gap-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3"
              >
                <div className="size-[66px] shrink-0 overflow-hidden rounded-2xl bg-[var(--surface-2)]">
                  {story.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={assetUrl(story.coverImageUrl)}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : ["Draft", "Queued", "Processing"].includes(
                      story.status,
                    ) ? (
                    <div className="grid size-full place-items-center">
                      <span className="size-5.5 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
                    </div>
                  ) : (
                    <div className="grid size-full place-items-center text-2xl text-[var(--ink-3)]">
                      ✦
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-[15px] font-semibold">
                    {story.title}
                  </span>
                  <span className="text-[13px] text-[var(--ink-3)]">
                    {story.childName} · {dateFormat.format(new Date(story.createdAt))}
                  </span>
                </div>
                <StoryStatusBadge status={story.status} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-14 text-center">
            <Sparkles className="size-8 text-[var(--accent)]" />
            <h3 className="m-0 text-xl font-bold">
              اولین قصه از همین‌جا شروع می‌شود
            </h3>
            <Link
              href="/stories/new"
              className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-[var(--primary-ink)]"
            >
              ساخت قصه
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
