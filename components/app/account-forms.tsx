'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ConfirmDelete } from '@/components/app/confirm-delete';
import { Alert, Field, Input, Select, SubmitButton, Toggle } from '@/components/form';
import { api } from '@/lib/api';
import { faDate } from '@/lib/fa';
import type { NotificationPrefs, SessionDto } from '@/lib/types';
import type { UserDto } from '@/lib/session';
import { useTheme } from '@/app/providers';

type Feedback = { tone: 'success' | 'error'; text: string } | null;

/** اطلاعات شخصی. Email is shown but not editable — see UpdateProfileDto. */
export function ProfileForm({ user }: { user: UserDto }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        setBusy(true);
        setFeedback(null);
        try {
          await api.patch('/auth/me', {
            fullName: String(form.get('fullName') ?? ''),
            phone: String(form.get('phone') ?? '') || undefined,
          });
          setFeedback({ tone: 'success', text: 'تغییرات ذخیره شد.' });
          router.refresh();
        } catch (err) {
          setFeedback({
            tone: 'error',
            text: err instanceof Error ? err.message : 'ذخیره نشد.',
          });
        } finally {
          setBusy(false);
        }
      }}
    >
      {feedback ? (
        <Alert
          tone={feedback.tone === 'success' ? 'success' : 'error'}
          icon={feedback.tone === 'success' ? '✓' : '✕'}
        >
          {feedback.text}
        </Alert>
      ) : null}

      <div className="grid gap-3.5 sm:grid-cols-2">
        <Field label="نام">
          <Input name="fullName" defaultValue={user.fullName} required minLength={2} />
        </Field>
        <Field label="ایمیل" hint="برای تغییر ایمیل با پشتیبانی تماس بگیرید.">
          <Input defaultValue={user.email} type="email" disabled readOnly />
        </Field>
        <Field label="شماره تماس" hint="۱۱ رقم، مثل ۰۹۱۲۳۴۵۶۷۸۹">
          <Input
            name="phone"
            type="tel"
            inputMode="numeric"
            pattern="0[0-9]{10}"
            defaultValue={user.phone ?? ''}
          />
        </Field>
      </div>

      <SubmitButton loading={busy} loadingLabel="در حال ذخیره…" className="mt-4.5 px-5.5 py-3.5">
        ذخیرهٔ تغییرات
      </SubmitButton>
    </form>
  );
}

/** «تغییر گذرواژه» — a <details> disclosure, as the design's button implies. */
export function ChangePasswordForm() {
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  return (
    <details className="rounded-2xl border border-border bg-elev px-4 py-3.5">
      <summary className="cursor-pointer text-[14px] font-semibold">
        تغییر گذرواژه
      </summary>

      <form
        className="mt-4 flex flex-col gap-3"
        onSubmit={async (event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const data = new FormData(form);
          setBusy(true);
          setFeedback(null);
          try {
            await api.post('/auth/change-password', {
              currentPassword: String(data.get('currentPassword') ?? ''),
              newPassword: String(data.get('newPassword') ?? ''),
            });
            form.reset();
            setFeedback({
              tone: 'success',
              text: 'گذرواژه عوض شد. نشست‌های دیگر بسته شدند.',
            });
          } catch (err) {
            setFeedback({
              tone: 'error',
              text: err instanceof Error ? err.message : 'انجام نشد.',
            });
          } finally {
            setBusy(false);
          }
        }}
      >
        {feedback ? (
          <Alert
            tone={feedback.tone === 'success' ? 'success' : 'error'}
            icon={feedback.tone === 'success' ? '✓' : '✕'}
          >
            {feedback.text}
          </Alert>
        ) : null}

        <Field label="گذرواژهٔ فعلی">
          <Input
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
          />
        </Field>
        <Field label="گذرواژهٔ تازه" hint="حداقل ۸ نویسه">
          <Input
            name="newPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </Field>
        <SubmitButton loading={busy} loadingLabel="در حال تغییر…">
          تغییر گذرواژه
        </SubmitButton>
      </form>
    </details>
  );
}

/** iPhone سحر · تهران · همین حالا — from a raw user-agent string. */
function deviceLabel(device: string | null) {
  if (!device) return 'دستگاه ناشناس';
  const os =
    /iPhone/i.test(device) ? 'iPhone'
    : /iPad/i.test(device) ? 'iPad'
    : /Android/i.test(device) ? 'Android'
    : /Macintosh|Mac OS/i.test(device) ? 'Mac'
    : /Windows/i.test(device) ? 'Windows'
    : /Linux/i.test(device) ? 'Linux'
    : 'دستگاه';
  const browser =
    /Edg\//i.test(device) ? 'Edge'
    : /Chrome\//i.test(device) ? 'Chrome'
    : /Firefox\//i.test(device) ? 'Firefox'
    : /Safari\//i.test(device) ? 'Safari'
    : '';
  return browser ? `${os} · ${browser}` : os;
}

export function SessionList({ sessions }: { sessions: SessionDto[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-border bg-elev px-4 py-3.5">
        <p className="mb-2.5 text-[14px] font-semibold">نشست‌های فعال</p>
        <ul className="flex flex-col gap-2">
          {sessions.map((session) => (
            <li key={session.id} className="flex items-center gap-3">
              <span className="flex-1 text-[12.5px] text-muted">
                {deviceLabel(session.device)}
                {session.ip ? ` · ${session.ip}` : ''} ·{' '}
                {faDate(session.createdAt)}
                {session.current ? ' · این دستگاه' : ''}
              </span>
              {session.current ? null : (
                <button
                  type="button"
                  disabled={busy === session.id}
                  onClick={async () => {
                    setBusy(session.id);
                    try {
                      await api.delete(`/auth/sessions/${session.id}`);
                      router.refresh();
                    } finally {
                      setBusy(null);
                    }
                  }}
                  className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-[12px] font-semibold"
                >
                  خروج
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={async () => {
          await api.post('/auth/logout-all');
          router.replace('/login');
          router.refresh();
        }}
        className="rounded-2xl border border-error bg-surface px-4 py-3.5 text-right text-[14px] font-semibold text-error"
      >
        خروج از همهٔ دستگاه‌ها
      </button>
    </div>
  );
}

export function NotificationPrefsForm({ prefs }: { prefs: NotificationPrefs }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const save = async (patch: Partial<NotificationPrefs>) => {
    setError(null);
    try {
      await api.patch('/auth/me', { prefs: patch });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ذخیره نشد.');
    }
  };

  return (
    <>
      {error ? (
        <Alert tone="error" icon="✕">
          {error}
        </Alert>
      ) : null}
      <Toggle
        label="قصه آماده شد"
        hint="وقتی ساخت تمام شود خبر می‌دهیم"
        defaultChecked={prefs.notifyStoryReady}
        onChange={(e) => save({ notifyStoryReady: e.target.checked })}
        className="border-b border-border"
      />
      <Toggle
        label="پرداخت"
        hint="تأیید پرداخت، خطای پرداخت و صورت‌حساب"
        defaultChecked={prefs.notifyPayment}
        onChange={(e) => save({ notifyPayment: e.target.checked })}
        className="border-b border-border"
      />
      <Toggle
        label="خبرهای محصول"
        hint="ماجراهای تازه و صداهای جدید"
        defaultChecked={prefs.notifyProductNews}
        onChange={(e) => save({ notifyProductNews: e.target.checked })}
      />
    </>
  );
}

/** نمایش و زبان. Theme goes through the same provider as the header toggle. */
export function DisplaySettings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="grid gap-3.5 sm:grid-cols-2">
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-bold">زبان</span>
        <Select defaultValue="fa" disabled>
          <option value="fa">فارسی</option>
        </Select>
        <span className="text-xs text-muted">فعلاً فقط فارسی.</span>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-bold">حالت نمایش</span>
        <Select
          value={theme}
          onChange={(event) => {
            if (event.target.value !== theme) toggleTheme();
          }}
        >
          <option value="light">روشن</option>
          <option value="dark">تاریک</option>
        </Select>
      </label>

      <div className="sm:col-span-2">
        <Toggle
          label="کاهش حرکت"
          hint="انیمیشن‌ها را ساده می‌کند"
          // <html data-motion> is the source of truth — it is stamped before
          // hydration, so reading it through a ref keeps the box in sync
          // without a state copy that would mismatch on the server.
          ref={(el: HTMLInputElement | null) => {
            if (el) el.checked = document.documentElement.dataset.motion === 'reduce';
          }}
          onChange={(event) => {
            const on = event.target.checked;
            // Mirrors prefers-reduced-motion, which globals.css already honours.
            if (on) document.documentElement.dataset.motion = 'reduce';
            else delete document.documentElement.dataset.motion;
            try {
              localStorage.setItem('motion', on ? 'reduce' : 'full');
            } catch {
              // private mode — the choice just won't survive a reload
            }
          }}
        />
      </div>
    </div>
  );
}

export function DeleteAccountButton() {
  const router = useRouter();

  return (
    <ConfirmDelete
      triggerLabel="پاک کردن حساب"
      triggerClassName="rounded-[14px] border-error bg-surface px-4 py-3.5 text-right text-[14px] font-semibold"
      title="حساب شما پاک شود؟"
      description="پرونده‌های کودکان، قصه‌ها و صورت‌حساب‌ها پاک می‌شوند. این کار بازگشت‌ناپذیر است."
      confirmWord="پاک کردن حساب"
      confirmHint="برای تأیید، «پاک کردن حساب» را بنویسید"
      confirmLabel="حساب را پاک کن"
      extraField={({ value, onChange, disabled }) => (
        <Field label="گذرواژه">
          <Input
            type="password"
            autoComplete="current-password"
            value={value}
            disabled={disabled}
            required
            onChange={(event) => onChange(event.target.value)}
          />
        </Field>
      )}
      onConfirm={async (password) => {
        await api.delete('/auth/me', { body: { password } });
        router.replace('/');
        router.refresh();
      }}
    />
  );
}

