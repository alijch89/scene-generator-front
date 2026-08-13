'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChildAvatar } from '@/components/app/ui';
import { api } from '@/lib/api';
import { faDigits, faPercent } from '@/lib/fa';
import { STAGE_LABEL, VOICE_LABEL } from '@/lib/story-art';
import type { ChildDto, StoryDto, StoryProgressDto } from '@/lib/types';
import { cn } from '@/lib/utils';

/**
 * ponytail: polls every 1.5s rather than opening an SSE channel. A story takes
 * about a minute, so this is ~40 cheap requests and it survives every proxy
 * and reconnect for free. Swap to Nest's `@Sse` if generation ever runs long
 * enough that the request count matters.
 */
const POLL_MS = 1500;

export function ProgressWatch({
  story,
  child,
  initial,
}: {
  story: StoryDto;
  child: ChildDto | null;
  initial: StoryProgressDto;
}) {
  const router = useRouter();
  const [progress, setProgress] = useState(initial);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (progress.status !== 'GENERATING') return;

    let alive = true;
    const tick = setInterval(() => setElapsed((s) => s + 1), 1000);

    const poll = setInterval(async () => {
      try {
        const next = await api.get<StoryProgressDto>(
          `/stories/${story.id}/progress`,
        );
        if (!alive) return;
        setProgress(next);
        if (next.status === 'READY') router.replace(`/stories/${story.id}/ready`);
      } catch {
        // A blip mid-generation is not worth a scary message — the next tick
        // recovers, and a hard failure surfaces as status FAILED anyway.
      }
    }, POLL_MS);

    return () => {
      alive = false;
      clearInterval(poll);
      clearInterval(tick);
    };
  }, [progress.status, story.id, router]);

  if (progress.status === 'FAILED') {
    return (
      <section
        role="alert"
        className="mx-auto max-w-125 animate-[pageIn_.4s_ease_both] py-[6vh] text-center"
      >
        <span
          aria-hidden
          className="mx-auto mb-5.5 grid size-16.5 place-items-center rounded-[20px] border border-error bg-[color-mix(in_srgb,var(--sh-error)_12%,var(--sh-surface))] text-[26px] text-error"
        >
          ✕
        </span>
        <h1 className="mb-2.5 font-display text-[25px]">ساخت قصه متوقف شد.</h1>
        <p className="mb-5.5 text-[14.5px] leading-[1.95] text-muted">
          {progress.failureReason ??
            'در میانهٔ کار مشکلی پیش آمد. مبلغی دوباره از شما گرفته نمی‌شود.'}
        </p>
        <div className="flex flex-wrap justify-center gap-2.75">
          <Link
            href={`/wizard?child=${story.childId}`}
            className="rounded-[15px] bg-linear-to-br from-brand to-warm px-6 py-3.75 text-[15px] font-bold text-brand-fg hover:no-underline"
          >
            ساخت دوباره
          </Link>
          <Link
            href="/help"
            className="rounded-[15px] border border-border bg-elev px-5.5 py-3.75 text-[14.5px] font-bold text-ink hover:no-underline"
          >
            تماس با پشتیبانی
          </Link>
        </div>
      </section>
    );
  }

  // The design promises ~45s; count down from there and never hit zero.
  const remaining = Math.max(5, 60 - elapsed);
  const hero = child?.firstName ?? 'کودک شما';

  return (
    <section className="mx-auto max-w-175 animate-[pageIn_.5s_ease_both] py-11 text-center">
      <div className="relative mx-auto mb-7.5 size-52.5">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,var(--sh-primary),var(--sh-accent),var(--sh-gold),var(--sh-primary))] opacity-65 blur-[2px] motion-safe:animate-[spinIt_9s_linear_infinite]"
        />
        <span aria-hidden className="absolute inset-2.25 rounded-full bg-bg" />
        <div className="absolute inset-5.5 overflow-hidden rounded-full shadow-card-lg">
          {child ? (
            <ChildAvatar child={child} size={166} className="size-full" />
          ) : null}
        </div>
        <span
          aria-hidden
          className="absolute -top-1 left-6 text-[16px] text-gold motion-safe:animate-[twinkle_4s_ease-in-out_infinite]"
        >
          ✦
        </span>
        <span
          aria-hidden
          className="absolute bottom-1.5 right-2 text-[13px] text-warm motion-safe:animate-[twinkle_5s_ease-in-out_infinite_1s]"
        >
          ✦
        </span>
      </div>

      <h1 className="mb-2 font-display text-[clamp(23px,4vw,33px)]">
        در حال ساختن قصهٔ {hero}…
      </h1>
      <p
        className="mb-6.5 text-[14.5px] text-muted"
        aria-live="polite"
        aria-atomic="true"
      >
        {faPercent(progress.percent)} انجام شد · حدود {faDigits(remaining)} ثانیه
        دیگر
      </p>

      <div className="rounded-[22px] border border-border bg-surface p-[8px_8px_12px] text-right shadow-card">
        <div className="mx-3 mt-2 mb-3.5 h-1.5 overflow-hidden rounded bg-border">
          <div
            className="h-full rounded bg-linear-to-l from-brand to-warm transition-[width] duration-600"
            style={{ width: `${progress.percent}%` }}
          />
        </div>

        <ul className="flex flex-col">
          {progress.stages.map((stage, i) => {
            const done = stage.status === 'DONE';
            const running = stage.status === 'RUNNING';
            const failed = stage.status === 'FAILED';
            return (
              <li
                key={stage.stage}
                className={cn(
                  'flex items-center gap-3 rounded-[14px] px-3.5 py-3',
                  running && 'bg-elev',
                )}
              >
                {/* Never colour alone: the glyph carries the state too. */}
                <span
                  aria-hidden
                  className={cn(
                    'grid size-6 flex-none place-items-center rounded-full border border-border bg-elev text-[12px]',
                    failed ? 'text-error' : 'text-brand',
                  )}
                >
                  {failed ? '✕' : done ? '✓' : running ? '✦' : faDigits(i + 1)}
                </span>
                <span className="text-[14.5px] font-semibold">
                  {STAGE_LABEL[stage.stage]}
                  {stage.stage === 'CHARACTER' ? ` ${hero}` : ''}
                  {stage.stage === 'NARRATION'
                    ? ` با صدای ${VOICE_LABEL[story.voice]}`
                    : ''}
                </span>
                <span className="ms-auto text-[12.5px] text-muted">
                  {failed
                    ? 'ناموفق'
                    : done
                      ? 'انجام شد'
                      : running
                        ? 'در حال انجام…'
                        : 'در انتظار'}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-5.5 flex flex-wrap justify-center gap-3">
        <Link
          href="/library"
          className="rounded-[14px] border border-border bg-elev px-5.5 py-3 text-[14px] font-semibold text-ink hover:no-underline"
        >
          در پس‌زمینه ادامه بده
        </Link>
      </div>
      <p className="mt-3.5 text-[12.5px] text-muted">
        می‌توانید صفحه را ببندید؛ وقتی قصه آماده شد خبرتان می‌کنیم.
      </p>
    </section>
  );
}
