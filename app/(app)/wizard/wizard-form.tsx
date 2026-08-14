/**
 * @file wizard-form.tsx
 * @description Implements the client-side child, theme, style, preview, story creation, and payment handoff flow.
 */

'use client';

import { useState } from 'react';
import { AddChildButton } from '@/components/app/child-form';
import { ChildAvatar } from '@/components/app/ui';
import { Alert } from '@/components/form';
import { ApiError, api } from '@/lib/api';
import { faDigits, faPrice } from '@/lib/fa';
import {
  LENGTH_LABEL,
  LENGTH_SHORT_LABEL,
  STYLE_LABEL,
  THEME_COVER,
  TONE_LABEL,
  VOICE_LABEL,
  WIZARD_THEMES,
} from '@/lib/story-art';
import type {
  ChildDto,
  CreatedStory,
  IllustrationStyle,
  NarratorVoice,
  StoryLength,
  StoryTheme,
  StoryTone,
} from '@/lib/types';
import { cn } from '@/lib/utils';

const STEPS = ['قهرمان', 'ماجرا', 'سفارشی‌سازی', 'پیش‌نمایش'] as const;
const LENGTHS: StoryLength[] = ['SHORT', 'MEDIUM', 'LONG'];
const TONES: StoryTone[] = ['CALM', 'FUNNY', 'BRAVE'];
const STYLES: IllustrationStyle[] = ['WATERCOLOR', 'CLASSIC', 'PAPERCUT'];
const VOICES: NarratorVoice[] = ['MARYAM', 'BABAK', 'NAZANIN'];

const HINTS = [
  'قصه با نام و علاقه‌های او نوشته می‌شود.',
  'می‌توانید بعداً ماجرا را عوض کنید.',
  'اگر چیزی را عوض نکنید، پیش‌فرض‌ها استفاده می‌شوند.',
  'پس از پرداخت، ساخت قصه حدود یک دقیقه طول می‌کشد.',
];

/** The selected-card ring the design uses everywhere in this flow. */
const ring = (on: boolean) =>
  on ? 'outline outline-3 outline-brand outline-offset-[3px]' : '';

/** Manages all four wizard steps and redirects to the returned payment URL. */
export function WizardForm({
  childProfiles,
  initialChildId,
  initialIdea,
  price,
}: {
  childProfiles: ChildDto[];
  initialChildId?: string;
  initialIdea?: string;
  price: number;
}) {
  const [step, setStep] = useState(1);
  const [childId, setChildId] = useState(
    initialChildId && childProfiles.some((c) => c.id === initialChildId)
      ? initialChildId
      : (childProfiles[0]?.id ?? ''),
  );
  const [theme, setTheme] = useState<StoryTheme>(initialIdea ? 'OWN' : 'FANTASY');
  const [ownIdea, setOwnIdea] = useState(
    initialIdea ? `قصه‌ای دربارهٔ ${initialIdea}` : '',
  );
  const [length, setLength] = useState<StoryLength>('MEDIUM');
  const [tone, setTone] = useState<StoryTone>('CALM');
  const [style, setStyle] = useState<IllustrationStyle>('WATERCOLOR');
  const [voice, setVoice] = useState<NarratorVoice>('MARYAM');
  const [advanced, setAdvanced] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const child = childProfiles.find((c) => c.id === childId);
  const chosen = WIZARD_THEMES.find((t) => t.id === theme)!;
  const hero = child?.firstName ?? 'کودک شما';

  // The one place a step can be wrong: «ایدهٔ خودم» with nothing written.
  const blocked =
    (step === 1 && !childId) ||
    (step === 2 && theme === 'OWN' && ownIdea.trim().length < 10);

  /** Validates the final selection, creates the story/order, and starts payment. */
  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const created = await api.post<CreatedStory>('/stories', {
        childId,
        theme,
        ...(theme === 'OWN' ? { ownIdea: ownIdea.trim() } : {}),
        length,
        tone,
        style,
        voice,
      });
      // Straight to payment — nothing is generated until the callback lands.
      window.location.href = created.payUrl;
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'ساخت قصه ممکن نشد. دوباره تلاش کنید.',
      );
      setBusy(false);
    }
  }

  return (
    <>
      {/* step rail */}
      <nav
        aria-label="مراحل ساخت قصه"
        className="mb-7 flex flex-wrap items-center gap-2 rounded-full border border-border bg-elev px-3 py-1.5"
      >
        {STEPS.map((label, i) => (
          <span key={label} className="flex items-center gap-2">
            {i > 0 ? (
              <span aria-hidden className="h-0.75 w-5.5 rounded-sm bg-border" />
            ) : null}
            <span
              aria-current={step === i + 1 ? 'step' : undefined}
              className={cn(
                'text-[12.5px] font-semibold',
                step >= i + 1 ? 'text-ink' : 'text-muted',
              )}
            >
              {faDigits(i + 1)} {label}
            </span>
          </span>
        ))}
      </nav>

      {error ? (
        <Alert tone="error" icon="!">
          {error}
        </Alert>
      ) : null}

      <p className="mb-2 text-[13px] font-bold tracking-wide text-warm">
        گام {faDigits(step)} از ۴
      </p>

      {/* ————— STEP 1 : the hero ————— */}
      {step === 1 ? (
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
                aria-pressed={childId === c.id}
                onClick={() => setChildId(c.id)}
                className={cn(
                  'flex items-center gap-4 rounded-[22px] border border-border bg-surface p-4.5 text-right shadow-card',
                  'transition-transform duration-250 hover:-translate-y-0.5',
                  ring(childId === c.id),
                )}
              >
                <ChildAvatar child={c} size={76} />
                <span className="flex min-w-0 flex-col gap-1.25">
                  <strong className="text-[18px]">{c.firstName}</strong>
                  <span className="text-[13.5px] text-muted">
                    {faDigits(c.age)} ساله
                    {c.interests.length ? ` · ${c.interests.join('، ')}` : ''}
                  </span>
                  <span className="text-[12.5px] font-semibold text-brand">
                    {faDigits(c.storyCount)} قصه ساخته شده
                  </span>
                </span>
                {childId === c.id ? (
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
      ) : null}

      {/* ————— STEP 2 : the adventure ————— */}
      {step === 2 ? (
        <section className="animate-[pageIn_.4s_ease_both]">
          <h1 className="mb-2.5 font-display text-[clamp(26px,4.6vw,40px)] leading-[1.35]">
            یک ماجرا انتخاب کنید
          </h1>
          <p className="mb-7 max-w-[52ch] text-[clamp(14px,1.8vw,17px)] leading-[1.8] text-muted">
            {hero} در این قصه به کجا سفر کند؟
          </p>

          <div className="grid gap-3.5 sm:grid-cols-[repeat(auto-fill,minmax(210px,1fr))]">
            {WIZARD_THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={theme === t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  'overflow-hidden rounded-[20px] border text-right transition-transform duration-250 hover:-translate-y-1',
                  t.id === 'OWN'
                    ? 'border-2 border-dashed border-border bg-elev'
                    : 'border-border bg-surface shadow-card',
                  ring(theme === t.id),
                )}
              >
                <span
                  aria-hidden
                  className="grid h-26 place-items-center text-[26px] text-brand"
                  style={
                    t.id === 'OWN'
                      ? undefined
                      : { backgroundImage: THEME_COVER[t.id] }
                  }
                >
                  {t.id === 'OWN' ? '✎' : ''}
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
            {theme === 'OWN' ? (
              <div>
                <label
                  htmlFor="own-idea"
                  className="mb-2 block text-[14px] font-bold"
                >
                  ایدهٔ قصه‌تان را بنویسید
                </label>
                <textarea
                  id="own-idea"
                  rows={3}
                  value={ownIdea}
                  onChange={(e) => setOwnIdea(e.target.value)}
                  maxLength={500}
                  placeholder={`${hero} پشت درخت کهنسال حیاط دری مخفی پیدا می‌کند که به جنگلی جادویی باز می‌شود.`}
                  className="w-full resize-y rounded-[14px] border border-border bg-elev px-4 py-3.5 text-[14px] leading-[1.9] text-ink"
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
                    نمونه‌ای از این ماجرا
                  </p>
                  <p className="text-[14.5px] leading-[1.9]">{chosen.example}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      ) : null}

      {/* ————— STEP 3 : customise ————— */}
      {step === 3 ? (
        <section className="max-w-190 animate-[pageIn_.4s_ease_both]">
          <h1 className="mb-2.5 font-display text-[clamp(26px,4.6vw,40px)] leading-[1.35]">
            قصه را به سلیقهٔ خودتان بسازید
          </h1>
          <p className="mb-7 text-[clamp(14px,1.8vw,17px)] leading-[1.8] text-muted">
            پیش‌فرض‌ها برای {hero} آماده‌اند. اگر چیزی را عوض نکنید هم قصه خوب از
            آب درمی‌آید.
          </p>

          <div className="flex flex-col gap-3.5">
            <fieldset className="rounded-[20px] border border-border bg-surface p-[18px_20px_20px] shadow-card">
              <legend className="px-1.5 text-[14.5px] font-bold">طول قصه</legend>
              <div className="mt-1.5 flex flex-wrap gap-2.5">
                {LENGTHS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={length === id}
                    onClick={() => setLength(id)}
                    className={cn(
                      'flex-1 basis-37.5 rounded-[14px] border border-border bg-elev p-[12px_14px] text-right',
                      ring(length === id),
                    )}
                  >
                    <strong className="block text-[14px]">
                      {LENGTH_SHORT_LABEL[id]}
                    </strong>
                    <span className="text-[12.5px] text-muted">
                      {LENGTH_LABEL[id]}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="rounded-[20px] border border-border bg-surface p-[18px_20px_20px] shadow-card">
              <legend className="px-1.5 text-[14.5px] font-bold">لحن</legend>
              <div className="mt-1.5 flex flex-wrap gap-2.5">
                {TONES.map((id) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={tone === id}
                    onClick={() => setTone(id)}
                    className={cn(
                      'flex-1 basis-35 rounded-[14px] border border-border bg-elev p-3 text-[14px] font-semibold',
                      ring(tone === id),
                    )}
                  >
                    {TONE_LABEL[id]}
                  </button>
                ))}
              </div>
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
                    aria-pressed={style === id}
                    onClick={() => setStyle(id)}
                    className={cn(
                      'overflow-hidden rounded-[14px] border border-border bg-elev text-right',
                      ring(style === id),
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        'block h-14.5',
                        id === 'WATERCOLOR' &&
                          'bg-[linear-gradient(140deg,#EBD6F0,#F6D9BC_55%,#CFE6E8)]',
                        id === 'CLASSIC' &&
                          'bg-[repeating-linear-gradient(45deg,#D8C7A8_0_6px,#EDE0C6_6px_12px)]',
                        id === 'PAPERCUT' &&
                          'bg-[linear-gradient(160deg,#F2C578,#DE7639)]',
                      )}
                    />
                    <span className="block px-3 py-2.25 text-[13px] font-semibold">
                      {STYLE_LABEL[id]}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            <button
              type="button"
              aria-expanded={advanced}
              onClick={() => setAdvanced((v) => !v)}
              className="flex items-center gap-2 self-start px-1 py-2 text-[14px] font-bold text-brand"
            >
              <span aria-hidden>{advanced ? '▲' : '▼'}</span>
              {advanced ? 'بستن تنظیمات بیشتر' : 'تنظیمات بیشتر (راوی)'}
            </button>

            {advanced ? (
              <div className="animate-[pageIn_.35s_ease_both] rounded-[18px] border border-border bg-surface p-[15px_17px] shadow-card">
                <span className="mb-2 block text-[13.5px] font-bold">
                  صدای راوی
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {VOICES.map((id) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={voice === id}
                      onClick={() => setVoice(id)}
                      className={cn(
                        'flex-1 basis-30 rounded-[14px] border border-border bg-elev p-3 text-[13.5px] font-semibold',
                        ring(voice === id),
                      )}
                    >
                      {VOICE_LABEL[id]}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* ————— STEP 4 : preview ————— */}
      {step === 4 ? (
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
                className="relative aspect-4/5 overflow-hidden rounded-[18px]"
                style={{ backgroundImage: THEME_COVER[theme] }}
              >
                <span
                  aria-hidden
                  className="absolute end-[14%] top-[12%] size-13 rounded-full bg-[#FFF3D6] shadow-[0_0_40px_rgba(255,240,200,.8)]"
                />
                <span
                  aria-hidden
                  className="absolute bottom-0 -start-[10%] -end-[10%] h-[34%] rounded-t-[50%] bg-[#1F1A3C]"
                />
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
                    ['قهرمان', `${hero} · ${faDigits(child?.age ?? 0)} ساله`],
                    ['ماجرا', chosen.title],
                    ['طول و مدت', LENGTH_LABEL[length]],
                    ['لحن', TONE_LABEL[tone]],
                    ['سبک تصویر', STYLE_LABEL[style]],
                    ['راوی', VOICE_LABEL[voice]],
                  ].map(([label, value], i, all) => (
                    <div key={label} className="contents">
                      <dt
                        className={cn(
                          'px-4.5 py-3.5 text-[13px] text-muted',
                          i < all.length - 1 && 'border-b border-border',
                        )}
                      >
                        {label}
                      </dt>
                      <dd
                        className={cn(
                          'px-4.5 py-3.5 text-left text-[14px] font-semibold',
                          i < all.length - 1 && 'border-b border-border',
                        )}
                      >
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {theme === 'OWN' && ownIdea ? (
                <div className="rounded-[20px] border border-border bg-elev px-4.5 py-4">
                  <p className="mb-1.5 text-[12.5px] font-bold text-warm">
                    ایدهٔ شما
                  </p>
                  <p className="text-[13.5px] leading-[1.9]">{ownIdea}</p>
                </div>
              ) : null}

              <div className="rounded-[20px] border border-border bg-elev px-4.5 py-4">
                <p className="mb-2 text-[13.5px] font-bold">هزینهٔ این قصه</p>
                <p className="font-display text-[22px]">{faPrice(price)}</p>
                <p className="mt-2 text-[12.5px] leading-[1.9] text-muted">
                  یک پرداخت برای همین یک قصه. اشتراک و تمدید خودکاری در کار
                  نیست، و تا وقتی پرداخت انجام نشود چیزی ساخته نمی‌شود.
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* sticky footer, exactly as in the design */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-[color-mix(in_srgb,var(--sh-bg)_90%,transparent)] backdrop-blur-lg">
        <div className="mx-auto flex max-w-295 items-center gap-3.5 px-5 py-3.5">
          <button
            type="button"
            disabled={step === 1 || busy}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="rounded-[15px] border border-border bg-surface px-5 py-3.25 text-[14.5px] font-semibold text-muted disabled:opacity-45"
          >
            → مرحلهٔ قبل
          </button>
          <p className="min-w-0 flex-1 truncate text-[13px] text-muted">
            {HINTS[step - 1]}
          </p>
          <button
            type="button"
            disabled={blocked || busy}
            onClick={() => (step === 4 ? void submit() : setStep((s) => s + 1))}
            className={cn(
              'rounded-[15px] bg-linear-to-br from-brand to-warm px-7.5 py-3.5',
              'text-[15.5px] font-bold text-brand-fg shadow-card',
              'transition-transform duration-200 hover:-translate-y-0.5',
              (blocked || busy) && 'opacity-60',
            )}
          >
            {busy
              ? 'در حال رفتن به پرداخت…'
              : step === 4
                ? 'ادامه و پرداخت ✦'
                : 'ادامه'}
          </button>
        </div>
      </div>
    </>
  );
}
