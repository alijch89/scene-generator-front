/**
 * @file customize-step.tsx
 * @description Renders the wizard's length, tone, style, moral, age-range, and supporting-character controls.
 */

'use client';

import { faDigits, faPrice } from '@/lib/fa';
import {
  LENGTH_LABEL,
  LENGTH_SHORT_LABEL,
  STYLE_LABEL,
  TONE_LABEL,
} from '@/lib/story-art';
import type { ChildRelationDto, StoryLength } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CharacterEditor, Suggestions } from '../character-editor';
import {
  AGE_RANGE_EXAMPLES,
  CONSIDERATION_EXAMPLES,
  LENGTHS,
  MORAL_EXAMPLES,
  SCENES_FOR_LENGTH,
  STYLES,
  TONES,
  charactersAreValid,
  ring,
  type WizardAction,
  type WizardDraft,
} from '../wizard-state';

/** «سفارشی‌سازی» — every optional dial, with defaults already good enough. */
export function CustomizeStep({
  draft,
  hero,
  prices,
  savedRelations,
  dispatch,
  onPhoto,
}: {
  draft: WizardDraft;
  hero: string;
  prices: Record<StoryLength, number>;
  savedRelations: ChildRelationDto[];
  dispatch: (action: WizardAction) => void;
  /** Photo selection writes the shared error slot, which lives in the shell. */
  onPhoto: (index: number, file?: File) => void;
}) {
  return (
    <section className="max-w-190 animate-[pageIn_.4s_ease_both]">
      <h1 className="mb-2.5 font-display text-[clamp(26px,4.6vw,40px)] leading-[1.35]">
        قصه را به سلیقهٔ خودتان بسازید
      </h1>
      <p className="mb-7 text-[clamp(14px,1.8vw,17px)] leading-[1.8] text-muted">
        پیش‌فرض‌ها برای {hero} آماده‌اند. اگر چیزی را عوض نکنید هم قصه خوب
        از آب درمی‌آید.
      </p>

      <div className="flex flex-col gap-3.5">
        <fieldset className="rounded-[20px] border border-border bg-surface p-[18px_20px_20px] shadow-card">
          <legend className="px-1.5 text-[14.5px] font-bold">
            طول قصه
          </legend>
          <div className="mt-1.5 flex flex-wrap gap-2.5">
            {LENGTHS.map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={draft.length === id}
                onClick={() => dispatch({ type: 'length', length: id })}
                className={cn(
                  "flex-1 basis-37.5 rounded-2xl border border-border bg-elev p-[12px_14px] text-right",
                  ring(draft.length === id),
                )}
              >
                <strong className="block text-[14px]">
                  {LENGTH_SHORT_LABEL[id]}
                </strong>
                <span className="text-[12.5px] text-muted">
                  {faDigits(SCENES_FOR_LENGTH[id])} صحنه ·{" "}
                  {LENGTH_LABEL[id]} · {faPrice(prices[id])}
                </span>
              </button>
            ))}
          </div>
          <label className="mt-4 flex max-w-64 flex-col gap-1.5 text-[12.5px] text-muted">
            تعداد صحنهٔ دلخواه
            <input
              type="number"
              min={1}
              max={50}
              value={draft.nScenes}
              onChange={(event) =>
                dispatch({
                  type: 'set',
                  patch: { nScenes: Number(event.target.value) },
                })
              }
              className="rounded-[12px] border border-border bg-elev px-3.5 py-2.5 text-[14px] text-ink"
            />
          </label>
        </fieldset>

        <fieldset className="rounded-[20px] border border-border bg-surface p-[18px_20px_20px] shadow-card">
          <legend className="px-1.5 text-[14.5px] font-bold">لحن</legend>
          <div className="mt-1.5 flex flex-wrap gap-2.5">
            {TONES.map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={draft.tone === id}
                onClick={() => dispatch({ type: 'set', patch: { tone: id } })}
                className={cn(
                  "flex-1 basis-35 rounded-2xl border border-border bg-elev p-3 text-[14px] font-semibold",
                  ring(draft.tone === id),
                )}
              >
                {TONE_LABEL[id]}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="rounded-[20px] border border-border bg-surface p-[18px_20px_20px] shadow-card">
          <legend className="px-1.5 text-[14.5px] font-bold">
            ملاحظات داستان
          </legend>
          <p className="mb-3 text-[12.5px] leading-[1.8] text-muted">
            یک نمونه را انتخاب کنید یا هر توضیحی که برای داستان مهم است
            بنویسید.
          </p>
          <Suggestions
            values={CONSIDERATION_EXAMPLES}
            selected={draft.storyConsiderations}
            onSelect={(storyConsiderations) =>
                dispatch({ type: 'set', patch: { storyConsiderations } })
              }
          />
          <textarea
            rows={3}
            maxLength={1000}
            value={draft.storyConsiderations}
            onChange={(event) =>
                dispatch({
                  type: 'set',
                  patch: { storyConsiderations: event.target.value },
                })
              }
            placeholder="مثلاً سگ‌ها را خیلی دوست داشته باشد و صحنهٔ ترسناک نداشته باشد"
            className="w-full resize-y rounded-2xl border border-border bg-elev px-4 py-3 text-[13.5px] leading-[1.9] text-ink"
          />
        </fieldset>

        <fieldset className="rounded-[20px] border border-border bg-surface p-[18px_20px_20px] shadow-card">
          <legend className="px-1.5 text-[14.5px] font-bold">
            سبک تصویرسازی
          </legend>
          <div className="mt-1.5 grid gap-2.5 sm:grid-cols-[repeat(auto-fit,minmax(130px,1fr))]">
            {STYLES.map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={draft.style === id}
                onClick={() => dispatch({ type: 'style', style: id })}
                className={cn(
                  "overflow-hidden rounded-2xl border border-border bg-elev text-right",
                  ring(draft.style === id),
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "block h-14.5",
                    id === "WATERCOLOR" &&
                      "bg-[linear-gradient(140deg,#EBD6F0,#F6D9BC_55%,#CFE6E8)]",
                    id === "CLASSIC" &&
                      "bg-[repeating-linear-gradient(45deg,#D8C7A8_0_6px,#EDE0C6_6px_12px)]",
                    id === "PAPERCUT" &&
                      "bg-[linear-gradient(160deg,#F2C578,#DE7639)]",
                  )}
                />
                <span className="block px-3 py-2.25 text-[13px] font-semibold">
                  {STYLE_LABEL[id]}
                </span>
              </button>
            ))}
          </div>
          <label className="mt-4 flex flex-col gap-1.5 text-[12.5px] text-muted">
            نام سبک دلخواه
            <input
              list="art-style-examples"
              maxLength={100}
              value={draft.artStyle}
              onChange={(event) =>
                  dispatch({
                    type: 'set',
                    patch: { artStyle: event.target.value },
                  })
                }
              placeholder="مثلاً کارتونی سه‌بعدی با رنگ‌های شاد"
              className="rounded-[12px] border border-border bg-elev px-3.5 py-2.5 text-[14px] text-ink"
            />
            <datalist id="art-style-examples">
              {[
                "کارتونی",
                "آبرنگی",
                "کتاب داستان کلاسیک",
                "کلاژ کاغذی",
                "سه‌بعدی فانتزی",
              ].map((value) => (
                <option key={value} value={value} />
              ))}
            </datalist>
          </label>
        </fieldset>

        <fieldset className="rounded-[20px] border border-border bg-surface p-[18px_20px_20px] shadow-card">
          <legend className="px-1.5 text-[14.5px] font-bold">
            پیام یا نتیجهٔ اخلاقی
          </legend>
          <p className="mb-3 text-[12.5px] leading-[1.8] text-muted">
            اختیاری است؛ یک نمونه را انتخاب کنید یا پیام خودتان را بنویسید.
          </p>
          <Suggestions
            values={MORAL_EXAMPLES}
            selected={draft.desiredMoral}
            onSelect={(desiredMoral) =>
                dispatch({ type: 'set', patch: { desiredMoral } })
              }
          />
          <input
            maxLength={500}
            value={draft.desiredMoral}
            onChange={(event) =>
                dispatch({
                  type: 'set',
                  patch: { desiredMoral: event.target.value },
                })
              }
            placeholder="مثلاً مراقبت از طبیعت مسئولیت همهٔ ماست"
            className="w-full rounded-[12px] border border-border bg-elev px-3.5 py-2.5 text-[14px] text-ink"
          />
        </fieldset>

        <fieldset className="rounded-[20px] border border-border bg-surface p-[18px_20px_20px] shadow-card">
          <legend className="px-1.5 text-[14.5px] font-bold">
            بازهٔ سنی و نوع خروجی
          </legend>
          <p className="mb-3 text-[12.5px] leading-[1.8] text-muted">
            بازه بر اساس سن {hero} پیشنهاد شده و قابل ویرایش است. خروجی این
            سرویس ویدیو است.
          </p>
          <Suggestions
            values={AGE_RANGE_EXAMPLES}
            selected={draft.ageRange}
            onSelect={(ageRange) => dispatch({ type: 'set', patch: { ageRange } })}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-[12.5px] text-muted">
              بازهٔ سنی دلخواه
              <input
                maxLength={40}
                value={draft.ageRange}
                onChange={(event) =>
                      dispatch({
                        type: 'set',
                        patch: { ageRange: event.target.value },
                      })
                    }
                placeholder="مثلاً ۵ تا ۸ سال"
                className="rounded-[12px] border border-border bg-elev px-3.5 py-2.5 text-[14px] text-ink"
              />
            </label>
            <div className="flex flex-col gap-1.5 text-[12.5px] text-muted">
              نوع خروجی
              <div className="rounded-[12px] border border-brand bg-elev px-3.5 py-2.5 text-[14px] font-semibold text-ink">
                ویدیو
              </div>
            </div>
          </div>
        </fieldset>

        <CharacterEditor
          characters={draft.characters}
          savedRelations={savedRelations}
          childId={draft.childId}
          valid={charactersAreValid(draft.characters)}
          onAdd={() => dispatch({ type: 'character/add' })}
          onReuse={(relation) =>
            dispatch({ type: 'character/reuse', relation })
          }
          onUpdate={(index, patch) =>
            dispatch({ type: 'character/update', index, patch })
          }
          onRemove={(index) => dispatch({ type: 'character/remove', index })}
          onPhoto={onPhoto}
        />
      </div>
    </section>
  );
}
