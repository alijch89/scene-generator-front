/**
 * @file theme-step.tsx
 * @description Renders the wizard's theme cards and the free-text idea field.
 */

'use client';

import Image from 'next/image';
import { WIZARD_THEMES } from '@/lib/story-art';
import { cn } from '@/lib/utils';
import { ring, type WizardAction, type WizardDraft } from '../wizard-state';

/** «موضوع» — the nine themes, or the parent's own idea. */
export function ThemeStep({
  draft,
  hero,
  dispatch,
}: {
  draft: WizardDraft;
  hero: string;
  dispatch: (action: WizardAction) => void;
}) {
  const chosen = WIZARD_THEMES.find((theme) => theme.id === draft.theme)!;

  return (
    <section className="animate-[pageIn_.4s_ease_both]">
      <h1 className="mb-2.5 font-display text-[clamp(26px,4.6vw,40px)] leading-[1.35]">
        موضوع قصه را انتخاب کنید
      </h1>
      <p className="mb-7 max-w-[52ch] text-[clamp(14px,1.8vw,17px)] leading-[1.8] text-muted">
        {hero} در این قصه چه چیزی را یاد بگیرد؟
      </p>

      <div className="grid gap-3.5 sm:grid-cols-[repeat(auto-fill,minmax(210px,1fr))]">
        {WIZARD_THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={draft.theme === t.id}
            onClick={() => dispatch({ type: 'set', patch: { theme: t.id } })}
            className={cn(
              "overflow-hidden rounded-[20px] border text-right transition-transform duration-250 hover:-translate-y-1",
              t.id === "OWN"
                ? "border-2 border-dashed border-border bg-elev"
                : "border-border bg-surface shadow-card",
              ring(draft.theme === t.id),
            )}
          >
            <span
              aria-hidden
              className="relative grid h-26 place-items-center overflow-hidden text-[26px] text-brand"
            >
              {t.image ? (
                <Image
                  src={t.image}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 240px, (min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
              ) : (
                "✎"
              )}
            </span>
            <span className="block p-[13px_15px_16px]">
              <strong className="mb-1.25 block text-[15.5px]">
                {t.title}
              </strong>
              <span className="block text-[12.5px] leading-[1.7] text-muted">
                {t.body}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5.5 rounded-[20px] border border-border bg-surface p-5 shadow-card">
        {draft.theme === 'OWN' ? (
          <div>
            <label
              htmlFor="own-idea"
              className="mb-2 block text-[14px] font-bold"
            >
              موضوع قصه‌تان را بنویسید
            </label>
            <textarea
              id="own-idea"
              rows={3}
              value={draft.ownIdea}
              onChange={(event) =>
                    dispatch({
                      type: 'set',
                      patch: { ownIdea: event.target.value },
                    })
                  }
              maxLength={500}
              placeholder={`${hero} یاد بگیرد اسباب‌بازی‌هایش را با دوستش قسمت کند.`}
              className="w-full resize-y rounded-2xl border border-border bg-elev px-4 py-3.5 text-[14px] leading-[1.9] text-ink"
            />
            <p className="mt-2.25 text-[12.5px] text-muted">
              یک یا دو جمله کافی است. باقی داستان را ما می‌نویسیم.
            </p>
          </div>
        ) : (
          <div className="flex items-start gap-3.5">
            <span aria-hidden className="text-[15px] text-gold">
              ✦
            </span>
            <div>
              <p className="mb-1.5 text-[12.5px] font-bold text-warm">
                نمونه‌ای از این موضوع
              </p>
              <p className="text-[14.5px] leading-[1.9]">
                {chosen.example}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
