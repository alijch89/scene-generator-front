/**
 * @file hero-step.tsx
 * @description Renders the wizard's child-selection step and its privacy note.
 */

'use client';

import { AddChildButton } from '@/components/app/child-form';
import { ChildAvatar } from '@/components/app/ui';
import { faDigits } from '@/lib/fa';
import type { ChildDto } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ring, type WizardAction, type WizardDraft } from '../wizard-state';

/** «قهرمان» — picks whose story this is. */
export function HeroStep({
  draft,
  childProfiles,
  dispatch,
}: {
  draft: WizardDraft;
  childProfiles: ChildDto[];
  dispatch: (action: WizardAction) => void;
}) {
  return (
    <section className="animate-[pageIn_.4s_ease_both]">
      <h1 className="mb-2.5 font-display text-[clamp(26px,4.6vw,40px)] leading-[1.35]">
        امشب قصهٔ کی را بسازیم؟
      </h1>
      <p className="mb-7 max-w-[52ch] text-[clamp(14px,1.8vw,17px)] leading-[1.8] text-muted">
        قهرمان این ماجرا را انتخاب کنید. قصه با نام، سن و علاقه‌های او نوشته
        می‌شود.
      </p>

      <div className="grid gap-4 sm:grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
        {childProfiles.map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={draft.childId === c.id}
            onClick={() => dispatch({ type: 'child', child: c })}
            className={cn(
              "flex items-center gap-4 rounded-[22px] border border-border bg-surface p-4.5 text-right shadow-card",
              "transition-transform duration-250 hover:-translate-y-0.5",
              ring(draft.childId === c.id),
            )}
          >
            <ChildAvatar child={c} size={76} />
            <span className="flex min-w-0 flex-col gap-1.25">
              <strong className="text-[18px]">{c.firstName}</strong>
              <span className="text-[13.5px] text-muted">
                {faDigits(c.age)} ساله
                {c.interests.length ? ` · ${c.interests.join("، ")}` : ""}
              </span>
              <span className="text-[12.5px] font-semibold text-brand">
                {faDigits(c.storyCount)} قصه ساخته شده
              </span>
            </span>
            {draft.childId === c.id ? (
              <span aria-hidden className="ms-auto text-[18px] text-brand">
                ✓
              </span>
            ) : null}
          </button>
        ))}

        <AddChildButton className="flex items-center gap-4 rounded-[22px] border-2 border-dashed border-border p-4.5 text-right text-muted">
          <span className="grid size-19 flex-none place-items-center rounded-full bg-elev text-[26px]">
            +
          </span>
          <span className="flex flex-col gap-1.25">
            <strong className="text-[17px] text-ink">افزودن کودک</strong>
            <span className="text-[13.5px]">
              نام، سن و یک عکس؛ کمتر از یک دقیقه
            </span>
          </span>
        </AddChildButton>
      </div>

      <div className="mt-6.5 flex max-w-160 items-start gap-3 rounded-[18px] border border-border bg-elev px-4.5 py-4">
        <span aria-hidden className="text-[17px] text-success">
          🛡
        </span>
        <p className="text-[13.5px] leading-[1.85] text-muted">
          عکس کودک شما خصوصی است و فقط برای شخصی‌سازی قصه‌هایش استفاده
          می‌شود. هر زمان بخواهید می‌توانید آن را پاک کنید.
        </p>
      </div>
    </section>
  );
}
