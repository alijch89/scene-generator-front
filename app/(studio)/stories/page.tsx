"use client";

import { StoryStatusBadge } from "@/components/story-status";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";
import { assetUrl, type StoryList, type StoryStatus } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const statuses: Array<StoryStatus | ""> = [
  "",
  "Queued",
  "Processing",
  "Completed",
  "Failed",
];

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
  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12 lg:py-11">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">All your adventures</p>
          <h1 className="font-[var(--font-serif)] text-4xl">Story library</h1>
          <p className="mt-2 text-[var(--muted)]">
            {data?.pagination.total ?? 0} stories made with care.
          </p>
        </div>
        <Button asChild>
          <Link href="/stories/new">
            <Plus /> New story
          </Link>
        </Button>
      </header>

      <div className="mt-8 flex flex-col gap-3 rounded-xl border border-[var(--line)] bg-[var(--card)] p-3 sm:flex-row">
        <label className="flex flex-1 items-center gap-2 rounded-lg border border-[var(--line)] bg-white px-3">
          <Search className="size-4 text-[var(--muted)]" />
          <input
            className="h-11 w-full bg-transparent text-sm outline-none"
            placeholder="Search title or child's name"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </label>
        <select
          className="h-11 rounded-lg border border-[var(--line)] bg-white px-3 text-sm"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as StoryStatus | "");
            setPage(1);
          }}
        >
          {statuses.map((value) => (
            <option key={value} value={value}>
              {value || "Every status"}
            </option>
          ))}
        </select>
      </div>

      {isPending ? (
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="h-72 animate-pulse rounded-xl bg-black/5" />
          ))}
        </div>
      ) : data?.items.length ? (
        <>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((story) => (
              <Link
                key={story.id}
                href={`/stories/${story.id}`}
                className="group overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--card)] transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className="grid h-44 place-items-center bg-[#e9e1d3] bg-cover bg-center"
                  style={
                    story.coverImageUrl
                      ? {
                          backgroundImage: `url("${assetUrl(story.coverImageUrl)}")`,
                        }
                      : undefined
                  }
                >
                  {!story.coverImageUrl && (
                    <BookOpen className="size-9 text-[#9b806e]" />
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="line-clamp-2 font-[var(--font-serif)] text-xl">
                      {story.title}
                    </h2>
                    <StoryStatusBadge status={story.status} />
                  </div>
                  <p className="mt-3 text-sm text-[var(--muted)]">
                    {story.childName} · {story.topic.replaceAll("-", " ")}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {new Intl.DateTimeFormat(undefined, {
                      dateStyle: "medium",
                    }).format(new Date(story.createdAt))}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((value) => value - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-[var(--muted)]">
              {page} / {data.pagination.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page >= data.pagination.totalPages}
              onClick={() => setPage((value) => value + 1)}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <div className="mt-14 text-center">
          <BookOpen className="mx-auto size-9 text-[var(--clay)]" />
          <h2 className="mt-4 font-[var(--font-serif)] text-2xl">
            No stories found
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Try a different search or create something new.
          </p>
        </div>
      )}
    </div>
  );
}
