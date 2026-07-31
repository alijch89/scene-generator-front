"use client";

import { StoryStatusBadge } from "@/components/story-status";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiFetch } from "@/lib/api-client";
import {
  assetUrl,
  type Story,
  type StoryAsset,
  type StoryPage,
  type StoryStatus,
} from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  BookOpen,
  Clock3,
  Download,
  LoaderCircle,
  RefreshCw,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

interface StatusResponse {
  storyId: string;
  status: StoryStatus;
  job: { id: string; status: string; errorMessage: string | null } | null;
  history: Array<{
    id: string;
    toStatus: StoryStatus;
    reason: string;
    createdAt: string;
  }>;
}

export default function StoryDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState("");
  const storyQuery = useQuery({
    queryKey: ["story", id],
    queryFn: () => apiFetch<Story>(`/api/stories/${id}`),
  });
  const statusQuery = useQuery({
    queryKey: ["story-status", id],
    queryFn: () => apiFetch<StatusResponse>(`/api/stories/${id}/status`),
    refetchInterval: (query) =>
      ["Queued", "Processing", "Draft"].includes(query.state.data?.status ?? "")
        ? 10_000
        : false,
  });
  const pagesQuery = useQuery({
    queryKey: ["story-pages", id],
    queryFn: () => apiFetch<StoryPage[]>(`/api/stories/${id}/pages`),
  });
  const assetsQuery = useQuery({
    queryKey: ["story-assets", id],
    queryFn: () => apiFetch<StoryAsset[]>(`/api/stories/${id}/assets`),
  });

  useEffect(() => {
    const events = new EventSource(`/api/stories/${id}/events`);
    events.onmessage = () => {
      void queryClient.invalidateQueries({ queryKey: ["story", id] });
      void queryClient.invalidateQueries({ queryKey: ["story-status", id] });
      void queryClient.invalidateQueries({ queryKey: ["story-pages", id] });
      void queryClient.invalidateQueries({ queryKey: ["story-assets", id] });
    };
    return () => events.close();
  }, [id, queryClient]);

  const story = storyQuery.data;
  if (storyQuery.isPending || !story) {
    return (
      <div className="grid min-h-[70vh] place-items-center">
        <LoaderCircle className="size-7 animate-spin text-[var(--sage)]" />
      </div>
    );
  }
  const pages = pagesQuery.data ?? [];
  const assets = assetsQuery.data ?? [];
  const status = statusQuery.data?.status ?? story.status;

  async function regenerate() {
    setActionError("");
    try {
      await apiFetch(`/api/stories/${id}/regenerate`, {
        method: "POST",
        body: "{}",
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["story", id] }),
        queryClient.invalidateQueries({ queryKey: ["story-status", id] }),
      ]);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Could not regenerate.");
    }
  }

  async function remove() {
    if (!window.confirm("Delete this story and its assets? This cannot be undone.")) {
      return;
    }
    await apiFetch(`/api/stories/${id}`, { method: "DELETE" });
    router.replace("/stories");
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8 lg:px-12 lg:py-10">
      <Link
        href="/stories"
        className="inline-flex items-center gap-2 text-sm font-bold text-[var(--muted)] hover:text-[var(--ink)]"
      >
        <ArrowLeft className="size-4" /> Story library
      </Link>
      <section className="mt-6 grid gap-7 lg:grid-cols-[0.85fr_1.15fr]">
        <div
          className="grid min-h-[390px] place-items-center overflow-hidden rounded-2xl bg-[#e6ddcf] bg-cover bg-center shadow-sm"
          style={
            story.coverImageUrl
              ? { backgroundImage: `url("${assetUrl(story.coverImageUrl)}")` }
              : undefined
          }
        >
          {!story.coverImageUrl && (
            <BookOpen className="size-16 text-[#9b806e]" />
          )}
        </div>
        <div className="flex flex-col justify-center">
          <StoryStatusBadge status={status} className="self-start" />
          <p className="eyebrow mt-6">{story.topic.replaceAll("-", " ")}</p>
          <h1 className="font-[var(--font-serif)] text-4xl leading-tight sm:text-5xl">
            {story.title}
          </h1>
          <p className="mt-4 text-[var(--muted)]">
            A {story.durationMinutes}-minute {story.language.toUpperCase()} story
            created for {story.childName}, age {story.childAge}.
          </p>
          {["Draft", "Queued", "Processing"].includes(status) && (
            <GenerationProgress status={status} />
          )}
          {status === "Failed" && (
            <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-900">
              <strong>Generation paused.</strong>
              <p className="mt-1">
                {statusQuery.data?.job?.errorMessage ??
                  "The generation service could not finish this attempt."}
              </p>
            </div>
          )}
          {actionError && (
            <p className="mt-4 text-sm text-red-800">{actionError}</p>
          )}
          <div className="mt-7 flex flex-wrap gap-3">
            {status === "Completed" && pages.length > 0 && (
              <Button asChild size="lg">
                <Link href={`/stories/${id}/read`}>
                  <BookOpen /> Read story
                </Link>
              </Button>
            )}
            {["Completed", "Failed", "Cancelled", "Expired"].includes(status) && (
              <Button variant="outline" onClick={() => void regenerate()}>
                <RefreshCw /> Regenerate
              </Button>
            )}
            <Button variant="ghost" onClick={() => void remove()}>
              <Trash2 /> Delete
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="gap-5 p-6 shadow-none">
          <div className="flex items-center justify-between">
            <h2 className="font-[var(--font-serif)] text-2xl">Story pages</h2>
            <span className="text-sm text-[var(--muted)]">{pages.length} pages</span>
          </div>
          {pages.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {pages.slice(0, 6).map((page) => (
                <Link
                  key={page.id}
                  href={`/stories/${id}/read?page=${page.pageNumber}`}
                  className="rounded-lg border border-[var(--line)] bg-white p-4 hover:border-[var(--sage)]"
                >
                  <span className="text-xs font-bold text-[var(--clay)]">
                    PAGE {page.pageNumber}
                  </span>
                  <h3 className="mt-1 truncate font-[var(--font-serif)] text-lg">
                    {page.pageTitle || `Chapter ${page.pageNumber}`}
                  </h3>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--muted)]">
              Pages will appear as soon as generation finishes.
            </p>
          )}
        </Card>
        <Card className="gap-4 p-6 shadow-none">
          <h2 className="font-[var(--font-serif)] text-2xl">Downloads</h2>
          {assets.length ? (
            <div className="grid gap-2">
              {assets.map((asset) => (
                <a
                  key={asset.id}
                  href={assetUrl(asset.publicUrl)}
                  download
                  className="flex items-center justify-between rounded-lg border border-[var(--line)] bg-white p-3 text-sm font-semibold hover:border-[var(--sage)]"
                >
                  <span>{asset.assetType.replace(/([A-Z])/g, " $1").trim()}</span>
                  <Download className="size-4 text-[var(--sage)]" />
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--muted)]">No assets are ready yet.</p>
          )}
        </Card>
      </section>
    </div>
  );
}

function GenerationProgress({ status }: { status: StoryStatus }) {
  const active = status === "Draft" ? 0 : status === "Queued" ? 1 : 2;
  const labels = ["Draft saved", "Waiting in queue", "Creating pages"];
  return (
    <div className="mt-7 rounded-xl border border-[var(--line)] bg-white/60 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold">
        <Clock3 className="size-4 text-[var(--clay)]" />
        We&apos;re building the story in the background
      </div>
      <div className="grid grid-cols-3 gap-2">
        {labels.map((label, index) => (
          <div key={label}>
            <div
              className={`h-1.5 rounded-full ${
                index <= active ? "bg-[var(--sage)]" : "bg-black/10"
              }`}
            />
            <span className="mt-2 block text-[11px] text-[var(--muted)]">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
