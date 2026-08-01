"use client";

import { AudioPlayer } from "@/components/audio-player";
import { apiFetch } from "@/lib/api-client";
import { assetUrl, type Story, type StoryPage } from "@/lib/types";
import { faDigits } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Expand } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useRef, useState } from "react";

/**
 * Renders an ownership-protected, keyboard-accessible story reader.
 *
 * The route parameter is untrusted client input and is forwarded only to
 * backend endpoints that validate UUID syntax and story ownership.
 */
export default function StoryReaderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [pageIndex, setPageIndex] = useState(0);
  const reader = useRef<HTMLDivElement>(null);
  const { data: story } = useQuery({
    queryKey: ["story", id],
    queryFn: () => apiFetch<Story>(`/api/stories/${id}`),
  });
  const { data: pages, isPending } = useQuery({
    queryKey: ["story-pages", id],
    queryFn: () => apiFetch<StoryPage[]>(`/api/stories/${id}/pages`),
  });
  useEffect(() => {
    // arrow keys follow the RTL reading order: right = previous, left = next
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        setPageIndex((value) => Math.max(value - 1, 0));
      }
      if (event.key === "ArrowLeft") {
        setPageIndex((value) => Math.min(value + 1, (pages?.length ?? 1) - 1));
      }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [pages?.length]);

  if (isPending || !pages || !story) {
    return (
      <div className="grid min-h-[80vh] place-items-center bg-[var(--night)]">
        <span className="size-8 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      </div>
    );
  }
  const page = pages[pageIndex];
  if (!page) {
    return (
      <div className="grid min-h-screen place-items-center bg-[var(--night)] p-12 text-center text-white">
        این قصه هنوز صفحه‌ای ندارد.
      </div>
    );
  }
  const contentRtl = ["fa", "ar"].includes(story.language);

  return (
    <div ref={reader} className="min-h-screen bg-[var(--night)] text-[#f6f3ff]">
      <header className="flex items-center justify-between px-4.5 py-3.5">
        <Link href={`/stories/${id}`} className="opacity-80">
          <ArrowRight className="size-5" />
        </Link>
        <div className="flex gap-1.5">
          {pages.map((item, index) => (
            <span
              key={item.id}
              className="h-1.5 rounded-full"
              style={{
                width: index === pageIndex ? 18 : 5,
                background:
                  index <= pageIndex ? "#f6f3ff" : "rgba(255,255,255,.28)",
              }}
            />
          ))}
        </div>
        <button
          aria-label="تمام‌صفحه"
          className="opacity-80"
          onClick={() => void reader.current?.requestFullscreen()}
        >
          <Expand className="size-5" />
        </button>
      </header>

      <main className="flex flex-col gap-4.5 px-4.5">
        <div className="min-h-[320px] flex-1 overflow-hidden rounded-3xl">
          {page.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={assetUrl(page.imageUrl)}
              alt={page.pageTitle || `صفحهٔ ${page.pageNumber}`}
              className="size-full object-cover"
            />
          ) : (
            <div className="grid aspect-square place-items-center bg-white/5 text-6xl">
              ✦
            </div>
          )}
        </div>
        <p
          dir={contentRtl ? "rtl" : "ltr"}
          className="m-0 text-[19px] leading-loose text-wrap-pretty"
        >
          {page.pageText}
        </p>
      </main>

      <footer className="flex flex-col gap-3.5 bg-black/20 p-4.5">
        {page.audioUrl && (
          <AudioPlayer src={assetUrl(page.audioUrl)!} variant="compact" />
        )}
        <div className="flex items-center justify-between">
          <button
            disabled={pageIndex === 0}
            onClick={() => setPageIndex((value) => value - 1)}
            className="rounded-2xl bg-white/12 px-5 py-3 text-sm font-semibold disabled:opacity-40"
          >
            صفحهٔ قبل
          </button>
          <span className="text-[13px] opacity-60">
            {faDigits(pageIndex + 1)} از {faDigits(pages.length)}
          </span>
          <button
            disabled={pageIndex === pages.length - 1}
            onClick={() => setPageIndex((value) => value + 1)}
            className="rounded-2xl bg-[#f6f3ff] px-5 py-3 text-sm font-bold text-[var(--night)] disabled:opacity-40"
          >
            صفحهٔ بعد
          </button>
        </div>
      </footer>
    </div>
  );
}
