'use client';

import { useState } from 'react';
import { Modal } from '@/components/app/dialog';
import { Alert, Field, Input, SubmitButton } from '@/components/form';
import { cn } from '@/lib/utils';

/**
 * Type-to-confirm. Used for deleting a child and for deleting the account —
 * both irreversible, both worth making the parent spell out.
 */
export function ConfirmDelete({
  triggerLabel,
  triggerClassName,
  triggerAriaLabel,
  title,
  description,
  confirmWord,
  confirmHint,
  confirmLabel = 'پاک کن',
  extraField,
  onConfirm,
}: {
  triggerLabel: React.ReactNode;
  triggerClassName?: string;
  triggerAriaLabel?: string;
  title: string;
  description: React.ReactNode;
  /** What has to be typed back before the destructive button unlocks. */
  confirmWord: string;
  confirmHint: React.ReactNode;
  confirmLabel?: string;
  /** e.g. the password box on «پاک کردن حساب». */
  extraField?: (props: {
    value: string;
    onChange: (value: string) => void;
    disabled: boolean;
  }) => React.ReactNode;
  onConfirm: (extra: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState('');
  const [extra, setExtra] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const close = () => {
    setOpen(false);
    setTyped('');
    setExtra('');
    setError(null);
  };

  const matches = typed.trim() === confirmWord;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!matches) return;
    setBusy(true);
    setError(null);
    try {
      await onConfirm(extra);
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'انجام نشد.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label={triggerAriaLabel}
        onClick={() => setOpen(true)}
        className={cn(
          'rounded-xl border border-border bg-elev px-3 py-2.5 text-[12.5px] text-error',
          triggerClassName,
        )}
      >
        {triggerLabel}
      </button>

      <Modal open={open} onClose={close} label="تأیید حذف">
        <span
          aria-hidden
          className="mb-4 grid size-12 place-items-center rounded-[15px] bg-[color-mix(in_srgb,var(--sh-error)_12%,var(--sh-surface))] text-[20px] text-error"
        >
          !
        </span>
        <h2 className="mb-2.5 font-display text-[20px]">{title}</h2>
        <p className="mb-4 text-[14px] leading-[1.95] text-muted">
          {description}
        </p>

        {error ? (
          <Alert tone="error" icon="✕">
            {error}
          </Alert>
        ) : null}

        <form onSubmit={submit} className="flex flex-col gap-4">
          <Field label={confirmHint}>
            <Input
              type="text"
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
              placeholder={confirmWord}
              autoComplete="off"
              disabled={busy}
            />
          </Field>

          {extraField?.({ value: extra, onChange: setExtra, disabled: busy })}

          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={close}
              className="flex-1 rounded-[14px] border border-border bg-elev p-3.5 text-[14px] font-bold"
            >
              انصراف
            </button>
            <SubmitButton
              loading={busy}
              loadingLabel="در حال حذف…"
              disabled={!matches}
              className="flex-1 bg-error bg-none disabled:opacity-50"
            >
              {confirmLabel}
            </SubmitButton>
          </div>
        </form>
      </Modal>
    </>
  );
}
