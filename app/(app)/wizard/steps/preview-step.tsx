/**
 * @file preview-step.tsx
 * @description Renders the wizard's final summary card, cover preview, and price before payment.
 */

'use client';

import Image from 'next/image';
import { ChildAvatar } from '@/components/app/ui';
import { faDigits, faPrice } from '@/lib/fa';
import { LENGTH_LABEL, THEME_COVER, TONE_LABEL, WIZARD_THEMES } from '@/lib/story-art';
import type { ChildDto, StoryLength } from '@/lib/types';
import { cn } from '@/lib/utils';
import { type WizardDraft } from '../wizard-state';

/** «پیش‌نمایش» — the last look before the parent is sent to the gateway. */
export function PreviewStep({
  draft,
  child,
  hero,
  topic,
  prices,
}: {
  draft: WizardDraft;
  child: ChildDto | undefined;
  hero: string;
  topic: string;
  prices: Record<StoryLength, number>;
}) {
  const chosen = WIZARD_THEMES.find((theme) => theme.id === draft.theme)!;
  const namedCharacters = draft.characters.filter((character) =>
    Boolean(character.name.trim()),
  );

  return (
    <section className="animate-[pageIn_.4s_ease_both]">
      <h1 className="mb-2.5 font-display text-[clamp(26px,4.6vw,40px)] leading-[1.35]">
        همه‌چیز آماده است
      </h1>
      <p className="mb-7 text-[clamp(14px,1.8vw,17px)] leading-[1.8] text-muted">
        یک نگاه آخر، بعد به صفحهٔ پرداخت می‌روید.
      </p>

      <div className="grid items-start gap-5 sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
        <div className="rounded-3xl border border-border bg-surface p-2 shadow-card-lg">
          <div
            className={cn(
              "relative overflow-hidden rounded-[18px]",
              // Topic covers are 1408×768, so the frame takes their own
              // ratio and the last look at the story never loses a third
              // of the artwork to a crop. The drawn «ایدهٔ خودم» sky below
              // is composed as a portrait and keeps its taller frame.
              chosen.image ? "aspect-11/6" : "aspect-4/5",
            )}
            style={
              chosen.image
                ? undefined
                : { backgroundImage: THEME_COVER[draft.theme] }
            }
          >
            {chosen.image ? (
              <>
                <Image
                  src={chosen.image}
                  alt={`تصویر پیش‌نمایش موضوع ${chosen.title}`}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-t from-black/70 via-black/5 to-transparent"
                />
              </>
            ) : (
              <>
                <span
                  aria-hidden
                  className="absolute inset-e-[14%] top-[12%] size-13 rounded-full bg-[#FFF3D6] shadow-[0_0_40px_rgba(255,240,200,.8)]"
                />
                <span
                  aria-hidden
                  className="absolute bottom-0 inset-s-[-10%] inset-e-[-10%] h-[34%] rounded-t-[50%] bg-[#1F1A3C]"
                />
              </>
            )}
            <div className="absolute inset-x-4 bottom-4 flex items-end gap-3">
              {child ? <ChildAvatar child={child} size={62} /> : null}
              <div className="pb-1">
                <p className="mb-1 font-display text-[20px] text-[#FFF6E6] drop-shadow-[0_2px_12px_rgba(0,0,0,.5)]">
                  قصهٔ {hero}
                </p>
                <p className="text-[12px] text-[rgba(255,246,230,.8)]">
                  {chosen.title}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="overflow-hidden rounded-[20px] border border-border bg-surface shadow-card">
            <dl className="grid grid-cols-[auto_1fr]">
              {[
                ["قهرمان", `${hero} · ${faDigits(child?.age ?? 0)} ساله`],
                ["موضوع", topic],
                [
                  "تعداد صحنه",
                  `${faDigits(draft.nScenes)} صحنه · ${LENGTH_LABEL[draft.length]}`,
                ],
                ['لحن', TONE_LABEL[draft.tone]],
                ['سبک تصویر', draft.artStyle],
                ['بازهٔ سنی', draft.ageRange],
                ["خروجی", "ویدیو"],
              ].map(([label, value], i, all) => (
                <div key={label} className="contents">
                  <dt
                    className={cn(
                      "px-4.5 py-3.5 text-[13px] text-muted",
                      i < all.length - 1 && "border-b border-border",
                    )}
                  >
                    {label}
                  </dt>
                  <dd
                    className={cn(
                      "px-4.5 py-3.5 text-left text-[14px] font-semibold",
                      i < all.length - 1 && "border-b border-border",
                    )}
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {draft.theme === 'OWN' && draft.ownIdea ? (
            <div className="rounded-[20px] border border-border bg-elev px-4.5 py-4">
              <p className="mb-1.5 text-[12.5px] font-bold text-warm">
                ایدهٔ شما
              </p>
              <p className="text-[13.5px] leading-[1.9]">{draft.ownIdea}</p>
            </div>
          ) : null}

          {draft.storyConsiderations || draft.desiredMoral ? (
            <div className="rounded-[20px] border border-border bg-elev px-4.5 py-4">
              {draft.storyConsiderations ? (
                <div>
                  <p className="mb-1.5 text-[12.5px] font-bold text-warm">
                    ملاحظات داستان
                  </p>
                  <p className="text-[13.5px] leading-[1.9]">
                    {draft.storyConsiderations}
                  </p>
                </div>
              ) : null}
              {draft.desiredMoral ? (
                <div className={draft.storyConsiderations ? 'mt-3' : undefined}>
                  <p className="mb-1.5 text-[12.5px] font-bold text-warm">
                    پیام اخلاقی
                  </p>
                  <p className="text-[13.5px] leading-[1.9]">
                    {draft.desiredMoral}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          {namedCharacters.length ? (
            <div className="rounded-[20px] border border-border bg-elev px-4.5 py-4">
              <p className="mb-2 text-[12.5px] font-bold text-warm">
                شخصیت‌های جانبی
              </p>
              <ul className="flex flex-col gap-1.5 text-[13.5px]">
                {namedCharacters.map((character, index) => (
                  <li key={`${character.name}-${index}`}>
                    {character.name}
                    {character.relation ? ` · ${character.relation}` : ""}
                    {character.hasSavedPhoto ? " · همراه عکس" : ""}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="rounded-[20px] border border-border bg-elev px-4.5 py-4">
            <p className="mb-2 text-[13.5px] font-bold">هزینهٔ این قصه</p>
            <p className="font-display text-[22px]">
              {faPrice(prices[draft.length])}
            </p>
            <p className="mt-2 text-[12.5px] leading-[1.9] text-muted">
             پرداخت از طریق درگاه امن بانکی
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
