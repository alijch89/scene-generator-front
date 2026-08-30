/**
 * @file form.tsx
 * @description Provides accessible client-side fields, alerts, toggles, and submission controls shared by product forms.
 */

'use client';

import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

/** Semantic feedback tones supported by the shared form alert. */
export type Tone = 'error' | 'warning' | 'neutral' | 'success';

const TONES: Record<Tone, { box: string; icon: string }> = {
  error: {
    box: 'border-error bg-[color-mix(in_srgb,var(--sh-error)_12%,var(--sh-surface))]',
    icon: 'text-error',
  },
  warning: {
    box: 'border-warning bg-[color-mix(in_srgb,var(--sh-warning)_14%,var(--sh-surface))]',
    icon: 'text-warning',
  },
  neutral: { box: 'border-border bg-elev', icon: 'text-brand' },
  success: {
    box: 'border-success bg-[color-mix(in_srgb,var(--sh-success)_16%,var(--sh-surface))]',
    icon: 'text-success',
  },
};

/** The design never signals state with colour alone — every banner has a glyph. */
export function Alert({
  tone = 'neutral',
  icon,
  children,
}: {
  tone?: Tone;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="alert"
      className={cn(
        'mb-4 flex items-start gap-3 rounded-2xl border px-4 py-3.5',
        TONES[tone].box,
      )}
    >
      <span aria-hidden className={cn('font-bold', TONES[tone].icon)}>
        {icon}
      </span>
      <p className="m-0 text-[13.5px] leading-[1.8]">{children}</p>
    </div>
  );
}

/** Renders a label, optional hint, and associated form control. */
export function Field({
  label,
  hint,
  children,
}: {
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.75">
      <span className="flex items-center text-[13.5px] font-bold">{label}</span>
      {children}
      {hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

/** Renders a consistently styled text input. */
export function Input({
  invalid,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      {...props}
      aria-invalid={invalid || undefined}
      className={cn(
        'rounded-2xl border bg-surface px-3.75 py-3.25 text-[14.5px] text-ink',
        'transition-colors placeholder:text-muted/70',
        'focus:border-brand focus:outline-none focus:ring-4 focus:ring-[color-mix(in_srgb,var(--sh-primary)_18%,transparent)]',
        invalid ? 'border-error' : 'border-border',
        className,
      )}
    />
  );
}

/**
 * A password box with the «نمایش گذرواژه» eye beside it.
 *
 * Typing a password you cannot see is the main way people mistype one, and
 * every password field in the product is a place a typo costs something — so
 * the toggle lives in the shared input rather than being re-implemented per
 * form. Flipping to `text` is what browsers' own reveal buttons do; the value
 * is only ever visible to whoever is already looking at the screen.
 */
export function PasswordInput({
  invalid,
  className,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  invalid?: boolean;
}) {
  const [shown, setShown] = useState(false);

  return (
    <span className="relative flex">
      <Input
        {...props}
        type={shown ? 'text' : 'password'}
        invalid={invalid}
        // Room for the button, on whichever side the end of the line is.
        className={cn('w-full pe-12', className)}
      />
      <button
        type="button"
        onClick={() => setShown((on) => !on)}
        // The label carries the state rather than aria-pressed, so a screen
        // reader announces one thing instead of a name and a pressed state
        // that repeat each other.
        aria-label={shown ? 'پنهان کردن گذرواژه' : 'نمایش گذرواژه'}
        className="absolute inset-y-0 end-0 grid w-12 place-items-center text-muted transition-colors hover:text-ink"
      >
        {shown ? (
          <EyeOffIcon aria-hidden className="size-4.5" />
        ) : (
          <EyeIcon aria-hidden className="size-4.5" />
        )}
      </button>
    </span>
  );
}

/**
 * Scores a password 0–3 for the design's three-segment meter.
 *
 * Length is the only thing the API insists on; the segments past it are
 * encouragement, not a second gate, so a long letters-only password still
 * reads as acceptable rather than being blocked.
 */
export function passwordStrength(password: string) {
  if (password.length < 8) return password.length === 0 ? 0 : 1;
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  return hasDigit && hasSpecial ? 3 : 2;
}

/** Hint text paired with each {@link passwordStrength} score. */
export const PASSWORD_HINT = [
  'حداقل ۸ نویسه.',
  'گذرواژه باید حداقل ۸ نویسه باشد.',
  'گذرواژه خوب است. یک عدد یا نویسهٔ ویژه آن را قوی‌تر می‌کند.',
  'گذرواژهٔ قوی.',
];

/** The three-segment strength bar shown under a new-password field. */
export function PasswordStrength({ score }: { score: number }) {
  return (
    <span className="mt-0.5 flex gap-[5px]" aria-hidden>
      {[1, 2, 3].map((step) => (
        <span
          key={step}
          className={cn(
            'h-1 flex-1 rounded-[3px]',
            score >= step
              ? score === 1
                ? 'bg-error'
                : score === 2
                  ? 'bg-warning'
                  : 'bg-success'
              : 'bg-border',
          )}
        />
      ))}
    </span>
  );
}

/** Renders a consistently styled native select control. */
export function Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        'rounded-[13px] border border-border bg-elev px-3.5 py-2.5 text-[13.5px] text-ink',
        className,
      )}
    />
  );
}

/**
 * The design's toggle is a native checkbox tinted with accent-color — no
 * custom switch, and it keeps keyboard and screen-reader behaviour for free.
 */
export function Toggle({
  label,
  hint,
  className,
  ...props
}: React.ComponentPropsWithRef<'input'> & {
  label: React.ReactNode;
  hint?: React.ReactNode;
}) {
  return (
    <label className={cn('flex items-center gap-3.5 py-3.5', className)}>
      <span className="flex-1">
        <strong className="block text-[14px]">{label}</strong>
        {hint ? (
          <span className="block text-[12.5px] text-muted">{hint}</span>
        ) : null}
      </span>
      <input {...props} type="checkbox" className="size-5 accent-brand" />
    </label>
  );
}

/** Renders a submit button with disabled and busy feedback states. */
export function SubmitButton({
  loading,
  children,
  loadingLabel,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingLabel?: string;
}) {
  return (
    <button
      {...props}
      type={props.type ?? 'submit'}
      disabled={loading || props.disabled}
      className={cn(
        'flex items-center justify-center gap-2.5 rounded-[15px] p-3.75',
        'bg-linear-to-br from-brand to-warm text-[15.5px] font-bold text-brand-fg shadow-card',
        'transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[.985]',
        loading && 'opacity-75',
        props.className,
      )}
    >
      {loading ? (
        <span
          aria-hidden
          className="size-3.75 animate-[spinIt_.8s_linear_infinite] rounded-full border-2 border-white/40 border-t-white"
        />
      ) : null}
      {loading ? (loadingLabel ?? children) : children}
    </button>
  );
}
