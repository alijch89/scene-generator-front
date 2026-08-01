"use client";

import { AudioPlayer } from "@/components/audio-player";
import { ErrorMessage } from "@/components/error-message";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";
import {
  assetUrl,
  type Story,
  type StoryAsset,
  type StoryPage,
  type StoryStatus,
} from "@/lib/types";
import { faDigits } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  Download,
  RefreshCw,
  Sparkles,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

/** Story status endpoint shape used by progress and failure UI. */
interface StatusResponse {
  /** Story aggregate UUID. */
  storyId: string;
  /** Current user-visible state. */
  status: StoryStatus;
  /** Latest generation job summary, when one exists. */
  job: { id: string; status: string; errorMessage: string | null } | null;
  /** Ordered lifecycle transition history. */
  history: Array<{
    id: string;
    toStatus: StoryStatus;
    reason: string;
    createdAt: string;
  }>;
}

/**
 * Renders live story progress, generated content, downloads, and lifecycle
 * actions for one owned story.
 *
 * Security:
 * The dynamic ID is untrusted and every API request validates UUID syntax,
 * session permission, and story ownership. EventSource messages contain no
 * authoritative data; they only invalidate ownership-checked queries.
 */
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
        <span className="size-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      </div>
    );
  }
  const pages = pagesQuery.data ?? [];
  const assets = assetsQuery.data ?? [];
  const status = statusQuery.data?.status ?? story.status;
  const narration = assets.find((a) => a.assetType === "NarrationAudio");

  /** Starts a new generation job and refreshes story/status queries. */
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
      setActionError(error instanceof Error ? error.message : "بازسازی ممکن نشد.");
    }
  }

  /** Confirms destructive intent, soft-deletes the story, and leaves the detail page. */
  async function remove() {
    if (!window.confirm("این قصه و فایل‌هایش حذف شود؟ این کار قابل بازگشت نیست.")) {
      return;
    }
    await apiFetch(`/api/stories/${id}`, { method: "DELETE" });
    router.replace("/stories");
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-5 py-7 sm:px-8">
      <Link
        href="/stories"
        className="flex w-fit items-center gap-2 text-sm font-bold text-[var(--ink-3)]"
      >
        <ArrowRight className="size-4" /> کتابخانه
      </Link>

      {["Draft", "Queued", "Processing"].includes(status) && (
        <GenerationProgress status={status} childName={story.childName} />
      )}

      {status === "Failed" && (
        <div className="rounded-2xl bg-[var(--error-soft)] p-5 text-sm text-[var(--error)]">
          <strong>ساخت قصه متوقف شد.</strong>
          <p className="m-0 mt-1">
            {statusQuery.data?.job?.errorMessage ??
              "سرویس ساخت قصه نتوانست این تلاش را کامل کند."}
          </p>
        </div>
      )}

      {["Completed", "Failed", "Cancelled", "Expired"].includes(status) && (
        <section className="flex flex-col gap-5">
          <div
            className="grid aspect-[3/4] w-full max-w-[280px] place-self-center place-items-center overflow-hidden rounded-3xl bg-[var(--surface-2)] shadow-[var(--shadow-4)]"
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
              <BookOpen className="size-14 text-[var(--ink-3)]" />
            )}
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="m-0 text-2xl font-extrabold">{story.title}</h1>
            <div className="flex flex-wrap justify-center gap-2">
              <Pill>{faDigits(story.childAge)} ساله</Pill>
              <Pill>{faDigits(pages.length)} صفحه</Pill>
              <Pill>{story.language.toUpperCase()}</Pill>
            </div>
          </div>

          {narration && status === "Completed" && (
            <AudioPlayer
              src={assetUrl(narration.publicUrl)!}
              title="روایت کامل"
              variant="compact"
            />
          )}

          {actionError && (
            <ErrorMessage message={actionError} />
          )}

          <div className="flex flex-wrap justify-center gap-3">
            {status === "Completed" && pages.length > 0 && (
              <Button asChild size="lg">
                <Link href={`/stories/${id}/read`}>
                  <BookOpen /> شروع خواندن
                </Link>
              </Button>
            )}
            <Button variant="outline" onClick={() => void regenerate()}>
              <RefreshCw /> بازسازی
            </Button>
            <Button variant="ghost" onClick={() => void remove()}>
              <Trash2 /> حذف
            </Button>
          </div>
        </section>
      )}

      <section className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex items-center justify-between">
            <h2 className="m-0 text-lg font-bold">صفحه‌های قصه</h2>
            <span className="text-sm text-[var(--ink-3)]">
              {faDigits(pages.length)} صفحه
            </span>
          </div>
          {pages.length ? (
            <div className="grid grid-cols-2 gap-2.5">
              {pages.slice(0, 6).map((page) => (
                <Link
                  key={page.id}
                  href={`/stories/${id}/read?page=${page.pageNumber}`}
                  className="rounded-xl border border-[var(--border)] p-3 hover:border-[var(--primary)]"
                >
                  <span className="text-xs font-bold text-[var(--accent)]">
                    صفحهٔ {faDigits(page.pageNumber)}
                  </span>
                  <h3 className="m-0 mt-1 truncate text-sm font-semibold">
                    {page.pageTitle || `فصل ${faDigits(page.pageNumber)}`}
                  </h3>
                </Link>
              ))}
            </div>
          ) : (
            <p className="m-0 text-sm text-[var(--ink-3)]">
              صفحه‌ها به‌محض اتمام ساخت نمایش داده می‌شوند.
            </p>
          )}
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="m-0 text-lg font-bold">دانلودها</h2>
          {assets.length ? (
            <div className="flex flex-col gap-2">
              {assets.map((asset) => (
                <a
                  key={asset.id}
                  href={assetUrl(asset.publicUrl)}
                  download
                  className="flex items-center justify-between rounded-xl border border-[var(--border)] p-3 text-sm font-semibold hover:border-[var(--primary)]"
                >
                  <span>{assetTypeLabel(asset.assetType)}</span>
                  <Download className="size-4 text-[var(--primary)]" />
                </a>
              ))}
            </div>
          ) : (
            <p className="m-0 text-sm text-[var(--ink-3)]">
              هنوز فایلی برای دانلود آماده نیست.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

/** Localized labels for downloadable asset categories. */
const assetLabels: Record<string, string> = {
  ChildPhoto: "عکس کودک",
  CoverImage: "تصویر جلد",
  PageImage: "تصویر صفحه",
  NarrationAudio: "فایل صوتی روایت",
  FinalVideo: "ویدئوی نهایی",
};

/** Maps a backend asset category to a localized label with a safe fallback. */
function assetTypeLabel(type: string) {
  return assetLabels[type] ?? type;
}

/** Renders compact story metadata. */
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--ink-2)]">
      {children}
    </span>
  );
}

/** Approximate visible progress percentages for active story states. */
const STAGE_DEGREES: Record<string, number> = {
  Draft: 25,
  Queued: 50,
  Processing: 85,
};

/** Renders the active generation stage and step-by-step progress indicator. */
function GenerationProgress({
  status,
  childName,
}: {
  status: StoryStatus;
  childName: string;
}) {
  const active = status === "Draft" ? 0 : status === "Queued" ? 1 : 2;
  const steps = ["نوشتن قصه", "در صف ساخت", "تصویرسازی و روایت صوتی"];
  const degree = STAGE_DEGREES[status] ?? 25;
  return (
    <div className="flex flex-col items-center gap-6 py-6 text-center">
      <div
        className="grid size-[132px] place-items-center rounded-full"
        style={{
          background: `conic-gradient(var(--primary) 0 ${degree * 3.6}deg, var(--surface-3) ${degree * 3.6}deg 360deg)`,
        }}
      >
        <div className="grid size-[108px] place-items-center rounded-full bg-[var(--bg)] text-2xl font-extrabold">
          {faDigits(degree)}٪
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <h1 className="m-0 text-2xl font-extrabold">
          در حال ساخت قصهٔ {childName}
        </h1>
        <p className="m-0 text-[15px] leading-loose text-[var(--ink-2)]">
          می‌توانید برنامه را ببندید؛ وقتی آماده شد خبرتان می‌کنیم.
        </p>
      </div>
      <div className="flex w-full flex-col gap-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-start">
        {steps.map((label, index) => (
          <div key={label} className="flex items-center gap-3">
            <span
              className={`grid size-[22px] shrink-0 place-items-center rounded-full text-[11px] ${
                index < active
                  ? "bg-[var(--success)] text-white"
                  : index === active
                    ? "border-2 border-[var(--primary)]"
                    : "border-2 border-dashed border-[var(--border-strong)]"
              }`}
            >
              {index < active ? "✓" : ""}
            </span>
            <span
              className={`text-sm ${
                index <= active ? "text-[var(--ink)]" : "text-[var(--ink-3)]"
              }`}
            >
              {label}
            </span>
            {index === active && (
              <Sparkles className="ms-auto size-4 animate-pulse text-[var(--accent)]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
