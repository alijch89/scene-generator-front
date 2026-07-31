"use client";

import { StoryStatusBadge } from "@/components/story-status";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiFetch } from "@/lib/api-client";
import { assetUrl, type StoryList } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, Clock3, Plus, Sparkles } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
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
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12 lg:py-11">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Your story workshop</p>
          <h1 className="font-[var(--font-serif)] text-4xl tracking-tight sm:text-5xl">
            Make a little magic.
          </h1>
          <p className="mt-3 max-w-xl text-[var(--muted)]">
            Turn one favorite photo into a story they can read, hear, and keep.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/stories/new">
            <Plus /> Create story
          </Link>
        </Button>
      </header>

      <section className="mt-9 grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Stories",
            value: data?.pagination.total ?? "—",
            icon: BookOpen,
          },
          { label: "Ready to read", value: complete, icon: Sparkles },
          { label: "In progress", value: active, icon: Clock3 },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="gap-3 px-5 py-5 shadow-none">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--muted)]">
                {label}
              </span>
              <Icon className="size-4 text-[var(--clay)]" />
            </div>
            <strong className="font-[var(--font-serif)] text-3xl">{value}</strong>
          </Card>
        ))}
      </section>

      <section className="mt-11">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="eyebrow">Continue creating</p>
            <h2 className="font-[var(--font-serif)] text-2xl">Recent stories</h2>
          </div>
          <Link
            href="/stories"
            className="flex items-center gap-2 text-sm font-bold text-[var(--sage)]"
          >
            View library <ArrowRight className="size-4" />
          </Link>
        </div>
        {isPending ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-xl bg-black/5"
              />
            ))}
          </div>
        ) : stories.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {stories.map((story, index) => (
              <Link
                href={`/stories/${story.id}`}
                key={story.id}
                className="group overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--card)] transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className="relative h-44 bg-[#e5ddd0]"
                  style={
                    story.coverImageUrl
                      ? {
                          backgroundImage: `url("${assetUrl(story.coverImageUrl)}")`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : undefined
                  }
                >
                  {!story.coverImageUrl && (
                    <div className="grid h-full place-items-center font-[var(--font-serif)] text-5xl text-[#9b806e]">
                      {["✦", "☾", "❋"][index % 3]}
                    </div>
                  )}
                  <StoryStatusBadge
                    status={story.status}
                    className="absolute right-3 top-3"
                  />
                </div>
                <div className="p-5">
                  <h3 className="truncate font-[var(--font-serif)] text-xl group-hover:text-[var(--sage)]">
                    {story.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    For {story.childName} · {story.durationMinutes} min
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="items-center px-6 py-14 text-center shadow-none">
            <Sparkles className="size-8 text-[var(--clay)]" />
            <h3 className="font-[var(--font-serif)] text-2xl">
              Your first story starts here
            </h3>
            <Button asChild>
              <Link href="/stories/new">Create a story</Link>
            </Button>
          </Card>
        )}
      </section>
    </div>
  );
}
