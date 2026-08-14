/**
 * @file settings-form.tsx
 * @description Implements validated administrator editing and reset of operational settings.
 */

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SETTINGS_FORM } from '@/lib/admin';
import { api } from '@/lib/api';
import { faPrice } from '@/lib/fa';
import type { AdminSettingsDto } from '@/lib/types';

/**
 * تنظیمات سیستم. Every field writes a real Setting row, and the generator
 * reads those rows at the start of each stage — so «حداکثر کار هم‌زمان» bites
 * on the next job, not the next deploy.
 *
 * The price is the one field that is not stored as typed: the country prices
 * in تومان and the database keeps ریال, so it is converted on the way in and
 * out rather than asking an operator to type a trailing zero correctly.
 */
export function SettingsForm({ initial }: { initial: AdminSettingsDto }) {
  const router = useRouter();
  const [values, setValues] = useState<AdminSettingsDto>(() => ({
    ...initial,
    'story.price': String(Math.round(Number(initial['story.price'] ?? 0) / 10)),
  }));
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(null);
  };

  const toPayload = () => ({
    ...values,
    'story.price': String(Math.round(Number(values['story.price'] || 0) * 10)),
  });

  /** Converts display units, submits changed settings, and refreshes server data. */
  async function save() {
    setBusy(true);
    setError(null);
    setSaved(null);
    try {
      const res = await api.patch<{
        settings: AdminSettingsDto;
        changed: { key: string }[];
      }>('/admin/settings', toPayload());

      setValues({
        ...res.settings,
        'story.price': String(
          Math.round(Number(res.settings['story.price'] ?? 0) / 10),
        ),
      });
      setSaved(
        res.changed.length === 0
          ? 'چیزی تغییر نکرده بود.'
          : `${res.changed.length} تنظیم ذخیره و در گزارش رخدادها ثبت شد.`,
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ذخیره نشد.');
    } finally {
      setBusy(false);
    }
  }

  /** Restores backend defaults after explicit administrator confirmation. */
  async function reset() {
    setBusy(true);
    setError(null);
    setSaved(null);
    try {
      const res = await api.post<{ settings: AdminSettingsDto }>(
        '/admin/settings/reset',
      );
      setValues({
        ...res.settings,
        'story.price': String(
          Math.round(Number(res.settings['story.price'] ?? 0) / 10),
        ),
      });
      setSaved('مقادیر پیش‌فرض بازگردانده شد.');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'انجام نشد.');
    } finally {
      setBusy(false);
    }
  }

  const input =
    'rounded-lg border border-border bg-elev px-2.75 py-2.25 text-[12.5px] text-ink';

  return (
    <div className="flex max-w-205 flex-col gap-3.5">
      {error ? (
        <p
          role="alert"
          className="rounded-[10px] border border-error bg-[color-mix(in_srgb,var(--sh-error)_10%,var(--sh-surface))] px-3.5 py-3 text-[12.5px] text-error"
        >
          {error}
        </p>
      ) : null}
      {saved ? (
        <p role="status" className="text-[12.5px] font-semibold text-success">
          ✓ {saved}
        </p>
      ) : null}

      {SETTINGS_FORM.map((group) => (
        <section
          key={group.title}
          className="rounded-xl border border-border bg-surface p-4.5 shadow-card"
        >
          <strong className="mb-3.5 block text-[13px]">{group.title}</strong>

          {group.fields[0].kind === 'switch' ? (
            <div>
              {group.fields.map((field, index) => (
                <label
                  key={field.key}
                  className={
                    index < group.fields.length - 1
                      ? 'flex items-center gap-3 border-b border-border py-2.75'
                      : 'flex items-center gap-3 py-2.75'
                  }
                >
                  <span className="flex-1">
                    <strong className="block text-[12.5px]">
                      {field.label}
                    </strong>
                    {field.hint ? (
                      <span className="block text-[11.5px] leading-[1.8] text-muted">
                        {field.hint}
                      </span>
                    ) : null}
                  </span>
                  <input
                    type="checkbox"
                    checked={values[field.key] === 'true'}
                    onChange={(event) =>
                      set(field.key, String(event.target.checked))
                    }
                    className="size-4.75 accent-brand"
                  />
                </label>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3">
              {group.fields.map((field) => (
                <label key={field.key} className="flex flex-col gap-1.5">
                  <span className="text-[12px] font-bold">{field.label}</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={field.min}
                    max={field.max}
                    value={values[field.key] ?? ''}
                    onChange={(event) => set(field.key, event.target.value)}
                    className={input}
                  />
                  {field.kind === 'price' ? (
                    <span className="text-[11.5px] text-muted">
                      یعنی {faPrice(Number(values[field.key] || 0) * 10)} برای هر
                      قصه
                    </span>
                  ) : null}
                  {field.hint ? (
                    <span className="text-[11.5px] leading-[1.8] text-muted">
                      {field.hint}
                    </span>
                  ) : null}
                </label>
              ))}
            </div>
          )}

          {group.note ? (
            <p className="mt-3.5 text-[11.5px] leading-[1.9] text-muted">
              {group.note}
            </p>
          ) : null}
        </section>
      ))}

      <div className="flex flex-wrap gap-2.25">
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="rounded-[9px] bg-brand px-5 py-2.75 text-[13px] font-bold text-brand-fg disabled:opacity-60"
        >
          {busy ? 'در حال ذخیره…' : 'ذخیرهٔ تنظیمات'}
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={busy}
          className="rounded-[9px] border border-border bg-elev px-4.5 py-2.75 text-[13px] font-semibold disabled:opacity-60"
        >
          بازگردانی مقادیر پیش‌فرض
        </button>
      </div>
    </div>
  );
}
