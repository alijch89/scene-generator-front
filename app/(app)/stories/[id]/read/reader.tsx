'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { videoSrc } from '@/components/app/story-media';
import { api } from '@/lib/api';
import { faDigits, faDuration } from '@/lib/fa';
import { THEME_COVER, VOICE_LABEL } from '@/lib/story-art';
import type { StoryDto, StoryPageDto } from '@/lib/types';

const SPEEDS = [0.75, 1, 1.25, 1.5];
const SPEED_LABEL = ['۰٫۷۵×', '۱×', '۱٫۲۵×', '۱٫۵×'];

export function Reader({
  story,
  pages,
  autoPlay,
}: {
  story: StoryDto;
  pages: StoryPageDto[];
  autoPlay: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [page, setPage] = useState(
    Math.min(Math.max(story.lastReadPage, 0), Math.max(pages.length - 1, 0)),
  );
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [at, setAt] = useState(0);
  const [total, setTotal] = useState(story.durationSec ?? 0);

  // Tell the API where the child stopped, so «ادامهٔ خواندن» is truthful.
  useEffect(() => {
    const timer = setTimeout(() => {
      void api.post(`/stories/${story.id}/read`, { page }).catch(() => {
        // Losing a bookmark is not worth interrupting the reading.
      });
    }, 800);
    return () => clearTimeout(timer);
  }, [page, story.id]);

  useEffect(() => {
    if (video.current) video.current.playbackRate = speed;
  }, [speed]);

  function toggle() {
    const el = video.current;
    if (!el) return;
    if (el.paused) void el.play();
    else el.pause();
  }

  const last = pages.length - 1;
  const readProgress = total > 0 ? Math.min(100, (at / total) * 100) : 0;

  return (
    <section className="mx-auto max-w-260 animate-[pageIn_.45s_ease_both] pt-6.5">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Link
          href={`/stories/${story.id}/ready`}
          className="text-[13.5px] font-bold text-brand"
        >
          → بازگشت
        </Link>
        <strong className="font-display text-[17px]">
          {story.title ?? 'قصهٔ بی‌نام'}
        </strong>
        <span className="ms-auto text-[13px] text-muted">
          صفحهٔ {faDigits(page + 1)} از {faDigits(pages.length)}
        </span>
      </div>

      <div className="overflow-hidden rounded-[26px] border border-border bg-surface shadow-card-lg">
        {/* The narrated video is the illustration — the book pages read along. */}
        <video
          ref={video}
          src={videoSrc(story.id)}
          crossOrigin="use-credentials"
          autoPlay={autoPlay}
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => setAt(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => {
            if (Number.isFinite(e.currentTarget.duration)) {
              setTotal(e.currentTarget.duration);
            }
            e.currentTarget.playbackRate = speed;
          }}
          className="block aspect-video max-h-[62vh] w-full bg-[#1F1A44] object-contain"
          style={{ backgroundImage: THEME_COVER[story.theme] }}
        >
          <track kind="captions" />
        </video>

        <div className="px-[clamp(20px,4vw,44px)] pt-6.5 pb-7.5">
          <p className="max-w-[60ch] text-[clamp(16px,2.2vw,21px)] leading-[2.15] text-pretty">
            {pages[page]?.text ?? 'این صفحه متنی ندارد.'}
          </p>
          <p className="mt-5.5 text-[12.5px] text-muted">
            صفحهٔ {faDigits(page + 1)} از {faDigits(pages.length)}
          </p>
        </div>
      </div>

      <div className="sticky bottom-4 z-20 mt-4.5 flex flex-wrap items-center gap-3 rounded-[20px] border border-border bg-[color-mix(in_srgb,var(--sh-surface)_92%,transparent)] px-3.5 py-3 shadow-card-lg backdrop-blur-lg">
        {/* RTL: → is the previous page, ← is the next. */}
        <button
          type="button"
          aria-label="صفحهٔ قبل"
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          className="size-10.5 rounded-[14px] border border-border bg-elev text-[15px] disabled:opacity-40"
        >
          →
        </button>

        <button
          type="button"
          onClick={toggle}
          className="flex items-center gap-2.25 rounded-[14px] bg-linear-to-br from-brand to-warm px-4.5 py-2.75 text-[14px] font-bold text-brand-fg"
        >
          <span aria-hidden>{playing ? '❙❙' : '▶'}</span>
          {playing ? 'توقف روایت' : 'پخش روایت'}
        </button>

        <button
          type="button"
          aria-label="صفحهٔ بعد"
          disabled={page >= last}
          onClick={() => setPage((p) => Math.min(last, p + 1))}
          className="size-10.5 rounded-[14px] border border-border bg-elev text-[15px] disabled:opacity-40"
        >
          ←
        </button>

        <div className="flex min-w-30 flex-1 basis-40 flex-col gap-1.25">
          <div className="h-1.5 overflow-hidden rounded bg-border">
            <div
              className="h-full rounded bg-brand transition-[width] duration-400"
              style={{ width: `${readProgress}%` }}
            />
          </div>
          <span className="text-[11.5px] text-muted">
            روایت {VOICE_LABEL[story.voice]} · {faDuration(at)} از{' '}
            {faDuration(total)}
          </span>
        </div>

        <button
          type="button"
          aria-label={`سرعت پخش ${SPEED_LABEL[SPEEDS.indexOf(speed)]}`}
          onClick={() => setSpeed(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length])}
          className="min-w-15.5 rounded-[14px] border border-border bg-elev px-3.5 py-2.5 text-[13px] font-bold"
        >
          {SPEED_LABEL[SPEEDS.indexOf(speed)]}
        </button>
      </div>
    </section>
  );
}
