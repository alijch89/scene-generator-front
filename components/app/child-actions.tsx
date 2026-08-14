/**
 * @file child-actions.tsx
 * @description Implements destructive child actions and editable story preferences and interests.
 */

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ConfirmDelete } from '@/components/app/confirm-delete';
import { InterestsPicker } from '@/components/app/interests-picker';
import { Alert, Select, Toggle } from '@/components/form';
import { api } from '@/lib/api';
import { faDigits } from '@/lib/fa';
import { LENGTH_SHORT_LABEL, STYLE_LABEL, VOICE_LABEL } from '@/lib/story-art';
import type {
  ChildDto,
  IllustrationStyle,
  NarratorVoice,
  StoryLength,
} from '@/lib/types';

/** Opens a type-to-confirm flow that permanently deletes a child profile. */
export function DeleteChildButton({
  child,
  triggerLabel = 'حذف',
  triggerClassName,
  /** Where to land afterwards — the list page, or stay put. */
  redirectTo,
}: {
  child: ChildDto;
  triggerLabel?: React.ReactNode;
  triggerClassName?: string;
  redirectTo?: string;
}) {
  const router = useRouter();

  return (
    <ConfirmDelete
      triggerLabel={triggerLabel}
      triggerClassName={triggerClassName}
      // Only name the icon-sized «حذف» button; a spelled-out label must stay
      // its own accessible name (WCAG «Label in Name»).
      triggerAriaLabel={
        triggerLabel === 'حذف' ? `حذف پروندهٔ ${child.firstName}` : undefined
      }
      title={`پروندهٔ ${child.firstName} پاک شود؟`}
      description={
        <>
          عکس، علاقه‌ها و {faDigits(child.storyCount)} قصهٔ {child.firstName} پاک
          می‌شوند. این کار بازگشت‌ناپذیر است.
        </>
      }
      confirmWord={child.firstName}
      confirmHint={`برای تأیید، «${child.firstName}» را بنویسید`}
      onConfirm={async () => {
        await api.delete(`/children/${child.id}`);
        if (redirectTo) router.push(redirectTo);
        router.refresh();
      }}
    />
  );
}

/** «پاک کردن عکس (قصه‌ها می‌مانند)» on the privacy tab. */
export function DeletePhotoButton({ child }: { child: ChildDto }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy || !child.hasPhoto}
      onClick={async () => {
        setBusy(true);
        try {
          await api.delete(`/children/${child.id}/photo`);
          router.refresh();
        } finally {
          setBusy(false);
        }
      }}
      className="rounded-2xl border border-border bg-surface px-4.5 py-4 text-right text-[14px] font-semibold disabled:opacity-60"
    >
      {child.hasPhoto
        ? 'پاک کردن عکس (قصه‌ها می‌مانند)'
        : 'عکسی ذخیره نشده است'}
    </button>
  );
}

/**
 * The ترجیح‌های قصه tab. The design has no save button, so each control
 * saves itself and the row reports back.
 */
export function ChildPrefsForm({ child }: { child: ChildDto }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Persists a partial preference or interest update for the child profile. */
  async function save(patch: Partial<ChildDto>) {
    setError(null);
    try {
      await api.patch(`/children/${child.id}`, patch);
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ذخیره نشد.');
    }
  }

  const card =
    'flex flex-col gap-2 rounded-[18px] border border-border bg-surface p-4 shadow-card';

  return (
    <div className="flex max-w-190 flex-col gap-3">
      {error ? (
        <Alert tone="error" icon="✕">
          {error}
        </Alert>
      ) : null}
      {saved && !error ? (
        <p role="status" className="text-[13px] text-success">
          ✓ ذخیره شد
        </p>
      ) : null}

      <div className="grid gap-3.5 sm:grid-cols-2">
        <label className={card}>
          <span className="text-[13.5px] font-bold">طول پیش‌فرض</span>
          <Select
            defaultValue={child.prefLength}
            onChange={(event) =>
              save({ prefLength: event.target.value as StoryLength })
            }
          >
            {Object.entries(LENGTH_SHORT_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </label>

        <label className={card}>
          <span className="text-[13.5px] font-bold">صدای راوی</span>
          <Select
            defaultValue={child.prefVoice}
            onChange={(event) =>
              save({ prefVoice: event.target.value as NarratorVoice })
            }
          >
            {Object.entries(VOICE_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </label>

        <label className={card}>
          <span className="text-[13.5px] font-bold">سبک تصویر</span>
          <Select
            defaultValue={child.prefStyle}
            onChange={(event) =>
              save({ prefStyle: event.target.value as IllustrationStyle })
            }
          >
            {Object.entries(STYLE_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </label>

        <div className="rounded-[18px] border border-border bg-surface px-4 shadow-card">
          <Toggle
            label="پرهیز از صحنه‌های ترسناک"
            hint="برای خواب راحت‌تر"
            defaultChecked={child.prefAvoidScary}
            onChange={(event) => save({ prefAvoidScary: event.target.checked })}
          />
        </div>
      </div>
    </div>
  );
}

/** The علاقه‌ها tab: pick chips, then save the set. */
export function ChildInterestsEditor({ child }: { child: ChildDto }) {
  const router = useRouter();
  const [interests, setInterests] = useState(child.interests);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty =
    interests.length !== child.interests.length ||
    interests.some((value, i) => value !== child.interests[i]);

  return (
    <div className="max-w-160 rounded-[22px] border border-border bg-surface p-5.5 shadow-card">
      <p className="mb-4 text-[14px] leading-[1.9] text-muted">
        علاقه‌ها به قصه شکل می‌دهند. هر زمان می‌توانید عوض کنید.
      </p>

      {error ? (
        <Alert tone="error" icon="✕">
          {error}
        </Alert>
      ) : null}

      <InterestsPicker
        value={interests}
        onChange={setInterests}
        disabled={busy}
      />

      <button
        type="button"
        disabled={!dirty || busy}
        onClick={async () => {
          setBusy(true);
          setError(null);
          try {
            await api.patch(`/children/${child.id}`, { interests });
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : 'ذخیره نشد.');
          } finally {
            setBusy(false);
          }
        }}
        className="mt-4 rounded-2xl bg-linear-to-br from-brand to-warm px-5 py-3 text-[14px] font-bold text-brand-fg disabled:opacity-50"
      >
        {busy ? 'در حال ذخیره…' : 'ذخیرهٔ علاقه‌ها'}
      </button>
    </div>
  );
}
