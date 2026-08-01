"use client";

import { StoryStatusBadge } from "@/components/story-status";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";
import { assetUrl, type StoryList, type StoryStatus } from "@/lib/types";
import { faDigits } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const statusLabels: Record<StoryStatus | "", string> = {
  "": "همه",
  Draft: "پیش‌نویس",
  Queued: "در صف",
  Processing: "در حال ساخت",
  Completed: "آماده",
  Failed: "ناموفق",
  Cancelled: "لغوشده",
  Expired: "منقضی",
};
const statuses: Array<StoryStatus | ""> = [
  "",
  "Queued",
  "Processing",
  "Completed",
  "Failed",
];
const dateFormat = new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" });

export default function StoryLibraryPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StoryStatus | "">("");
  const [page, setPage] = useState(1);
  const query = new URLSearchParams({
    page: String(page),
    limit: "12",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  if (search) query.set("search", search);
  if (status) query.set("status", status);
  const { data, isPending } = useQuery({
    queryKey: ["stories", "library", search, status, page],
    queryFn: () => apiFetch<StoryList>(`/api/stories?${query}`),
  });
  const childNames = useMemo(
    () => [...new Set((data?.items ?? []).map((s) => s.childName))],
    [data],
  );

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 px-5 py-8 sm:px-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="m-0 text-2xl font-extrabold">کتابخانه</h1>
          <p className="m-0 mt-1 text-sm text-[var(--ink-3)]">
            {faDigits(data?.pagination.total ?? 0)} قصه با عشق ساخته شده
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/stories/new">
            <Plus /> قصهٔ تازه
          </Link>
        </Button>
      </header>

      <label className="flex items-center gap-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-3 text-[15px] text-[var(--ink-3)]">
        <Search className="size-4" />
        <input
          className="h-6 w-full bg-transparent text-[var(--ink)] outline-none"
          placeholder="جست‌وجو در قصه‌ها"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
      </label>

      {childNames.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {["", ...childNames].map((name) => (
            <button
              key={name || "all"}
              onClick={() => {
                setSearch(name);
                setPage(1);
              }}
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                search === name
                  ? "bg-[var(--surface)] shadow-[var(--shadow-1)]"
                  : "text-[var(--ink-3)]"
              }`}
            >
              {name || "همه"}
            </button>
          ))}
        </div>
      )}

      <select
        className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm"
        value={status}
        onChange={(event) => {
          setStatus(event.target.value as StoryStatus | "");
          setPage(1);
        }}
      >
        {statuses.map((value) => (
          <option key={value} value={value}>
            {statusLabels[value]}
          </option>
        ))}
      </select>

      {isPending ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-60 animate-pulse rounded-2xl bg-black/5" />
          ))}
        </div>
      ) : data?.items.length ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.items.map((story) => (
              <Link
                key={story.id}
                href={`/stories/${story.id}`}
                className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
              >
                <div
                  className="grid aspect-[3/4] place-items-center bg-[var(--surface-2)] bg-cover bg-center"
                  style={
                    story.coverImageUrl
                      ? { backgroundImage: `url("${assetUrl(story.coverImageUrl)}")` }
                      : undefined
                  }
                >
                  {!story.coverImageUrl && (
                    <BookOpen className="size-9 text-[var(--ink-3)]" />
                  )}
                </div>
                <div className="flex flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="m-0 line-clamp-2 text-[15px] font-semibold">
                      {story.title}
                    </h2>
                    <StoryStatusBadge status={story.status} />
                  </div>
                  <p className="m-0 text-xs text-[var(--ink-3)]">
                    {story.childName} · {dateFormat.format(new Date(story.createdAt))}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((value) => value - 1)}
            >
              قبلی
            </Button>
            <span className="text-sm text-[var(--ink-3)]">
              {faDigits(page)} / {faDigits(data.pagination.totalPages)}
            </span>
            <Button
              variant="outline"
              disabled={page >= data.pagination.totalPages}
              onClick={() => setPage((value) => value + 1)}
            >
              بعدی
            </Button>
          </div>
        </>
      ) : (
        <div className="mt-6 flex flex-col items-center gap-3 text-center">
          <BookOpen className="size-9 text-[var(--accent)]" />
          <h2 className="m-0 text-xl font-bold">قصه‌ای پیدا نشد</h2>
          <p className="m-0 text-sm text-[var(--ink-3)]">
            جست‌وجوی دیگری امتحان کنید یا قصهٔ تازه بسازید.
          </p>
        </div>
      )}
    </div>
  );
}
