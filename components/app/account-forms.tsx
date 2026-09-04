/**
 * @file account-forms.tsx
 * @description Implements parent profile, password, session, notification, display, and account-deletion controls.
 */

'use client';

import { useRouter } from 'next/navigation';
import { useActionState, useRef, useState } from 'react';
import { ConfirmDelete } from '@/components/app/confirm-delete';
import {
  Alert,
  Field,
  Input,
  PASSWORD_HINT,
  PasswordInput,
  PasswordStrength,
  Select,
  SubmitButton,
  Toggle,
  passwordStrength,
} from '@/components/form';
import {
  IDLE,
  changePassword,
  revokeOtherSessions,
  revokeSession,
  updateNotificationPrefs,
  updateProfile,
} from '@/lib/actions/account';
import { api } from '@/lib/api';
import { faDate } from '@/lib/fa';
import type { NotificationPrefs, SessionDto } from '@/lib/types';
import type { UserDto } from '@/lib/session';
import { useTheme } from '@/app/providers';

/** اطلاعات شخصی. The login phone is shown but changes require verification. */
export function ProfileForm({ user }: { user: UserDto }) {
  const [state, action, pending] = useActionState(updateProfile, IDLE);

  return (
    <form action={action}>
      {state.tone === 'idle' ? null : (
        <Alert
          tone={state.tone}
          icon={state.tone === 'success' ? '✓' : '✕'}
        >
          {state.text}
        </Alert>
      )}

      <div className="grid gap-3.5 sm:grid-cols-2">
        <Field label="نام">
          <Input
            name="fullName"
            defaultValue={user.fullName}
            required
            minLength={2}
          />
        </Field>
        <Field
          label="شمارهٔ موبایل"
          hint="برای تغییر شماره با پشتیبانی تماس بگیرید."
        >
          <Input
            type="tel"
            defaultValue={user.phone ?? ''}
            dir="ltr"
            disabled
            readOnly
          />
        </Field>
      </div>

      <SubmitButton
        loading={pending}
        loadingLabel="در حال ذخیره…"
        className="mt-4.5 px-5.5 py-3.5"
      >
        ذخیرهٔ تغییرات
      </SubmitButton>
    </form>
  );
}

/**
 * «تغییر گذرواژه» — a <details> disclosure, as the design's button implies.
 *
 * This is the only way to change a password from inside the product, and the
 * same endpoint the forced post-reset screen posts to, so the confirmation
 * box and the reveal toggle live here rather than only on the sign-up form.
 */
export function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changePassword, IDLE);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const strength = passwordStrength(password);
  const mismatch = confirm.length > 0 && confirm !== password;

  return (
    <details className="rounded-2xl border border-border bg-elev px-4 py-3.5">
      <summary className="cursor-pointer text-[14px] font-semibold">
        تغییر گذرواژه
      </summary>

      <form className="mt-4 flex flex-col gap-3" action={action}>
        {state.tone === 'idle' ? null : (
          <Alert
            tone={state.tone}
            icon={state.tone === 'success' ? '✓' : '✕'}
          >
            {state.text}
          </Alert>
        )}

        <Field label="گذرواژهٔ فعلی">
          <PasswordInput
            name="currentPassword"
            autoComplete="current-password"
            required
          />
        </Field>
        <Field label="گذرواژهٔ تازه" hint={PASSWORD_HINT[strength]}>
          <PasswordInput
            name="newPassword"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <PasswordStrength score={strength} />
        </Field>
        <Field
          label="تکرار گذرواژهٔ تازه"
          hint={mismatch ? 'گذرواژه‌ها یکی نیستند.' : undefined}
        >
          <PasswordInput
            name="confirmPassword"
            autoComplete="new-password"
            required
            value={confirm}
            invalid={mismatch}
            onChange={(event) => setConfirm(event.target.value)}
          />
        </Field>
        <SubmitButton
          loading={pending}
          disabled={mismatch}
          loadingLabel="در حال تغییر…"
        >
          تغییر گذرواژه
        </SubmitButton>
      </form>
    </details>
  );
}

/** iPhone سحر · تهران · همین حالا — from a raw user-agent string. */
function deviceLabel(device: string | null) {
  if (!device) return 'دستگاه ناشناس';
  const os = /iPhone/i.test(device)
    ? 'iPhone'
    : /iPad/i.test(device)
      ? 'iPad'
      : /Android/i.test(device)
        ? 'Android'
        : /Macintosh|Mac OS/i.test(device)
          ? 'Mac'
          : /Windows/i.test(device)
            ? 'Windows'
            : /Linux/i.test(device)
              ? 'Linux'
              : 'دستگاه';
  const browser = /Edg\//i.test(device)
    ? 'Edge'
    : /Chrome\//i.test(device)
      ? 'Chrome'
      : /Firefox\//i.test(device)
        ? 'Firefox'
        : /Safari\//i.test(device)
          ? 'Safari'
          : '';
  return browser ? `${os} · ${browser}` : os;
}

/** Lists active device sessions and allows non-current sessions to be revoked. */
export function SessionList({ sessions }: { sessions: SessionDto[] }) {
  const router = useRouter();

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
              {session.current ? null : <RevokeSessionButton id={session.id} />}
            </li>
          ))}
        </ul>
      </div>

      <form
        action={async () => {
          await revokeOtherSessions();
          // Every other device is signed out; this one stays valid, but the
          // design's «همه» promises otherwise, so it leaves too.
          router.replace('/login');
          router.refresh();
        }}
      >
        <button
          type="submit"
          className="w-full rounded-2xl border border-error bg-surface px-4 py-3.5 text-right text-[14px] font-semibold text-error"
        >
          خروج از همهٔ دستگاه‌ها
        </button>
      </form>
    </div>
  );
}

/** One row's «خروج», bound to the session it ends. */
function RevokeSessionButton({ id }: { id: string }) {
  // bind() rather than a hidden field: the id is then not part of the
  // rendered HTML, and the API scopes the delete by the caller's user anyway.
  const [, action, pending] = useActionState(revokeSession.bind(null, id), IDLE);

  return (
    <form action={action}>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-[12px] font-semibold disabled:opacity-60"
      >
        {pending ? '…' : 'خروج'}
      </button>
    </form>
  );
}

/** Edits the three persisted account notification preferences. */
export function NotificationPrefsForm({ prefs }: { prefs: NotificationPrefs }) {
  const [state, action, pending] = useActionState(
    updateNotificationPrefs,
    IDLE,
  );
  const form = useRef<HTMLFormElement>(null);

  // Each toggle saves on change, as it did before — but the action sends all
  // three, so a PATCH can never be read as "the other two were turned off".
  const submit = () => form.current?.requestSubmit();

  return (
    <form action={action} ref={form}>
      {state.tone === 'error' ? (
        <Alert tone="error" icon="✕">
          {state.text}
        </Alert>
      ) : null}
      <Toggle
        label="قصه آماده شد"
        hint="وقتی ساخت تمام شود خبر می‌دهیم"
        name="notifyStoryReady"
        defaultChecked={prefs.notifyStoryReady}
        disabled={pending}
        onChange={submit}
        className="border-b border-border"
      />
      <Toggle
        label="پرداخت"
        hint="تأیید پرداخت، خطای پرداخت و صورت‌حساب"
        name="notifyPayment"
        defaultChecked={prefs.notifyPayment}
        disabled={pending}
        onChange={submit}
        className="border-b border-border"
      />
      <Toggle
        label="خبرهای محصول"
        hint="ماجراهای تازه و صداهای جدید"
        name="notifyProductNews"
        defaultChecked={prefs.notifyProductNews}
        disabled={pending}
        onChange={submit}
      />
    </form>
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
            if (el)
              el.checked = document.documentElement.dataset.motion === 'reduce';
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

/** Opens an irreversible type-and-password confirmation for account deletion. */
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
          <PasswordInput
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
