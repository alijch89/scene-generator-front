/**
 * @file photo-picker.tsx
 * @description Shared photo chooser that shows the stored photo, the chosen file, and exactly why a file was refused.
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { faPercent } from '@/lib/fa';
import { faMegabytes, normalizePhoto, photoError } from '@/lib/upload';
import { cn } from '@/lib/utils';

/**
 * Chooses one photo and keeps the parent informed about what will happen to it.
 *
 * The old pickers showed nothing but a preview of a freshly chosen file, so a
 * stored photo looked like no photo, and a refused file left only a message at
 * the top of the form that saving wiped. Here the stored photo is shown, the
 * chosen file is named with its size and a note that saving uploads it, and a
 * refusal stays next to the control until a valid file replaces it.
 */
export function PhotoPicker({
  title,
  inputLabel,
  currentSrc,
  placeholder,
  required,
  badge = '(الزامی)',
  shape = 'round',
  progress,
  onChange,
}: {
  title: string;
  /** Accessible name of the hidden file input. */
  inputLabel: string;
  /** Credentialed URL of the photo already stored, if any. */
  currentSrc?: string | null;
  /** Shown when there is neither a stored photo nor a chosen one. */
  placeholder: React.ReactNode;
  required?: boolean;
  /** Reminder shown beside the title while the photo is still missing. */
  badge?: string;
  shape?: 'round' | 'rounded';
  /** 0–1 while the chosen file is being uploaded. */
  progress?: number | null;
  /** The validated file, or null when none is chosen. */
  onChange: (file: File | null) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);

  // Object URLs hold the file in memory until they are revoked.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  /** Validates the chosen file; a refusal keeps any earlier valid choice. */
  function pick(chosen: File | undefined) {
    if (!chosen) return;
    const candidate = normalizePhoto(chosen);
    const refusal = photoError(candidate);
    if (refusal) {
      setProblem(refusal);
      // Let the same file be chosen again after fixing it elsewhere.
      if (input.current) input.current.value = '';
      return;
    }
    setProblem(null);
    setFile(candidate);
    setPreview(URL.createObjectURL(candidate));
    onChange(candidate);
  }

  function clear() {
    setFile(null);
    setPreview(null);
    setProblem(null);
    if (input.current) input.current.value = '';
    onChange(null);
  }

  const shown = preview ?? currentSrc ?? null;
  const frame = cn(
    'size-22 flex-none border border-border',
    shape === 'round' ? 'rounded-full' : 'rounded-[18px]',
  );

  return (
    <div>
      <p className="mb-2 text-[13.5px] font-bold">
        {title}{' '}
        {required && !currentSrc && !file ? (
          <span className="font-normal text-error">{badge}</span>
        ) : null}
      </p>
      <div className="flex items-center gap-3.5">
        {shown ? (
          // A local preview or the private, credentialed API image;
          // next/image cannot proxy either.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={shown}
            alt=""
            crossOrigin={preview ? undefined : 'use-credentials'}
            className={cn(frame, 'object-cover')}
          />
        ) : (
          <span
            aria-hidden
            className={cn(
              frame,
              'grid place-items-center overflow-hidden bg-elev text-[26px] text-muted',
            )}
          >
            {placeholder}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <p className="mb-2 text-[12.5px] leading-[1.8] text-muted">
            صورت رو به دوربین، حداکثر ۱۰ مگابایت، JPG، PNG یا WebP.
          </p>
          <input
            ref={input}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-label={inputLabel}
            className="sr-only"
            onChange={(event) => pick(event.target.files?.[0])}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => input.current?.click()}
              className="rounded-[10px] border border-border bg-elev px-3 py-2 text-[12.5px] font-semibold"
            >
              {file || currentSrc ? 'تغییر عکس' : 'انتخاب فایل'}
            </button>
            {file ? (
              <button
                type="button"
                onClick={clear}
                className="rounded-[10px] border border-border bg-elev px-3 py-2 text-[12.5px] text-error"
              >
                لغو انتخاب
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {file ? (
        <p
          role="status"
          className="mt-2.5 break-all text-[12.5px] leading-[1.8] text-success"
        >
          ✓ «{file.name}» ({faMegabytes(file.size)}) انتخاب شد؛ با زدن «ذخیره»
          بارگذاری می‌شود.
        </p>
      ) : null}

      {problem ? (
        <p role="alert" className="mt-2.5 text-[12.5px] leading-[1.8] text-error">
          ✕ {problem}
        </p>
      ) : null}

      {progress !== null && progress !== undefined && file ? (
        <div className="mt-3 flex items-center gap-2.5">
          <span className="h-1.5 flex-1 overflow-hidden rounded bg-border">
            <span
              className="block h-full bg-brand transition-[width]"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </span>
          <span className="text-xs text-muted">
            {faPercent(progress * 100)} · {faMegabytes(file.size)}
          </span>
        </div>
      ) : null}
    </div>
  );
}
