"use client";

import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";
import { assetUrl, type Story, type StoryPage } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Expand,
  LoaderCircle,
  Volume2,
} from "lucide-react";
import Link from "next/link";
import { use, useEffect, useRef, useState } from "react";

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
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        setPageIndex((value) => Math.min(value + 1, (pages?.length ?? 1) - 1));
      }
      if (event.key === "ArrowLeft") {
        setPageIndex((value) => Math.max(value - 1, 0));
      }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [pages?.length]);
  if (isPending || !pages || !story) {
    return (
      <div className="grid min-h-[80vh] place-items-center">
        <LoaderCircle className="size-7 animate-spin text-[var(--sage)]" />
      </div>
    );
  }
  const page = pages[pageIndex];
  if (!page) {
    return <div className="p-12 text-center">This story has no pages yet.</div>;
  }
  return (
    <div
      ref={reader}
      className="min-h-screen bg-[#e9e0d2] px-4 py-5 sm:px-7 lg:px-10"
    >
      <header className="mx-auto flex max-w-7xl items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href={`/stories/${id}`}>
            <ArrowLeft /> Back
          </Link>
        </Button>
        <div className="text-center">
          <p className="max-w-[45vw] truncate font-[var(--font-serif)] font-bold">
            {story.title}
          </p>
          <span className="text-xs text-[var(--muted)]">
            {pageIndex + 1} of {pages.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Fullscreen"
          onClick={() => void reader.current?.requestFullscreen()}
        >
          <Expand />
        </Button>
      </header>
      <main className="mx-auto mt-5 grid max-w-7xl overflow-hidden rounded-2xl bg-[#fffdf8] shadow-xl lg:min-h-[72vh] lg:grid-cols-2">
        <div className="grid min-h-[320px] place-items-center bg-[#dcd1c0]">
          {page.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={assetUrl(page.imageUrl)}
              alt={page.pageTitle || `Page ${page.pageNumber}`}
              className="h-full max-h-[76vh] w-full object-cover"
            />
          ) : (
            <span className="font-[var(--font-serif)] text-7xl text-[#9b806e]">
              ✦
            </span>
          )}
        </div>
        <article
          className="flex flex-col justify-center px-7 py-10 sm:px-12 lg:px-16"
          dir={["fa", "ar"].includes(story.language) ? "rtl" : "ltr"}
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--clay)]">
            Page {page.pageNumber}
          </span>
          {page.pageTitle && (
            <h1 className="mt-4 font-[var(--font-serif)] text-3xl leading-tight">
              {page.pageTitle}
            </h1>
          )}
          <p className="mt-6 whitespace-pre-line font-[var(--font-serif)] text-xl leading-[1.9] text-[#36443d]">
            {page.pageText}
          </p>
          {page.audioUrl && (
            <div className="mt-8 flex items-center gap-3 rounded-full bg-[#f2ede4] p-2 pr-5">
              <span className="grid size-9 place-items-center rounded-full bg-[var(--sage)] text-white">
                <Volume2 className="size-4" />
              </span>
              <audio
                controls
                preload="metadata"
                src={assetUrl(page.audioUrl)}
                className="h-9 w-full"
              />
            </div>
          )}
        </article>
      </main>
      <footer className="mx-auto mt-5 flex max-w-7xl items-center justify-between">
        <Button
          variant="outline"
          disabled={pageIndex === 0}
          onClick={() => setPageIndex((value) => value - 1)}
        >
          <ChevronLeft /> Previous
        </Button>
        <div className="flex max-w-[45vw] gap-1.5 overflow-hidden">
          {pages.map((item, index) => (
            <button
              key={item.id}
              aria-label={`Go to page ${index + 1}`}
              onClick={() => setPageIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === pageIndex
                  ? "w-8 bg-[var(--sage)]"
                  : "w-2 bg-black/15"
              }`}
            />
          ))}
        </div>
        <Button
          disabled={pageIndex === pages.length - 1}
          onClick={() => setPageIndex((value) => value + 1)}
        >
          Next <ChevronRight />
        </Button>
      </footer>
    </div>
  );
}
