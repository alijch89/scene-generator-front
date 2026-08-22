/**
 * @file form.tsx
 * @description Provides accessible client-side fields, alerts, toggles, and submission controls shared by product forms.
 */

'use client';

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
      <input
        {...props}
        type="checkbox"
        className="size-5 accent-brand"
      />
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

/** Centred success/failure panels — verify, expired, password-changed. */
export function Notice({
  icon,
  tone = 'neutral',
  title,
  children,
}: {
  icon: string;
  tone?: Tone;
  title: string;
  children?: React.ReactNode;
}) {
  const ring =
    tone === 'success'
      ? 'border-success text-success bg-[color-mix(in_srgb,var(--sh-success)_16%,var(--sh-surface))]'
      : tone === 'warning'
        ? 'border-border text-warning bg-elev'
        : 'border-border text-brand bg-elev';

  return (
    <section className="animate-[pageIn_.4s_ease_both] text-center">
      <span
        aria-hidden
        className={cn(
          'mx-auto mb-4.5 grid size-14 place-items-center rounded-[18px] border text-[22px]',
          ring,
        )}
      >
        {icon}
      </span>
      <h1 className="mb-2.5 font-display text-[26px]">{title}</h1>
      {children}
    </section>
  );
}
