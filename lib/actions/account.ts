'use server';

import { revalidatePath } from 'next/cache';
import { ApiError, request } from '@/lib/api';
import { serverCookieHeader, verifySession } from '@/lib/dal';

/**
 * What every account action hands back to `useActionState`.
 *
 * Deliberately narrow: an action's return value is serialized to the client,
 * so it carries a message a person is meant to read and nothing else out of
 * the API's response body.
 */
export interface ActionState {
  tone: 'success' | 'error' | 'idle';
  text: string;
}

/** The state a form starts in, before anything has been submitted. */
export const IDLE: ActionState = { tone: 'idle', text: '' };

/**
 * Runs one authenticated mutation against the API and normalises the outcome.
 *
 * `verifySession()` runs inside every action rather than only around the form:
 * a Server Action is a POST endpoint reachable by anyone who can send the
 * request, so rendering the form on an authenticated page is not a boundary.
 */
async function mutate(
  path: string,
  method: 'POST' | 'PATCH' | 'DELETE',
  body: unknown,
  success: string,
): Promise<ActionState> {
  await verifySession();

  try {
    await request(path, {
      method,
      body,
      cookie: await serverCookieHeader(),
    });
    return { tone: 'success', text: success };
  } catch (err) {
    return {
      tone: 'error',
      text:
        err instanceof ApiError
          ? err.message
          : 'انجام نشد. لطفاً دوباره تلاش کنید.',
    };
  }
}

/** اطلاعات شخصی — the display name; the login phone needs verification to change. */
export async function updateProfile(
  _previous: ActionState,
  form: FormData,
): Promise<ActionState> {
  const fullName = String(form.get('fullName') ?? '').trim();
  // Cheap shape check before a round trip; the API validates properly.
  if (fullName.length < 2) {
    return { tone: 'error', text: 'نام باید دست‌کم دو نویسه باشد.' };
  }

  const result = await mutate(
    '/auth/me',
    'PATCH',
    { fullName },
    'تغییرات ذخیره شد.',
  );
  // The name is rendered by server components in the header and on the
  // settings page, so the route has to re-render for the change to show.
  if (result.tone === 'success') revalidatePath('/', 'layout');
  return result;
}

/** تغییر گذرواژه. */
export async function changePassword(
  _previous: ActionState,
  form: FormData,
): Promise<ActionState> {
  const currentPassword = String(form.get('currentPassword') ?? '');
  const newPassword = String(form.get('newPassword') ?? '');
  const confirmPassword = String(form.get('confirmPassword') ?? '');

  if (newPassword !== confirmPassword) {
    return { tone: 'error', text: 'گذرواژهٔ تازه و تکرار آن یکی نیستند.' };
  }

  const result = await mutate(
    '/auth/change-password',
    'POST',
    { currentPassword, newPassword, confirmPassword },
    'گذرواژه عوض شد.',
  );
  if (result.tone === 'success') revalidatePath('/settings');
  return result;
}

/** اعلان‌ها — the three notification toggles, saved as a whole. */
export async function updateNotificationPrefs(
  _previous: ActionState,
  form: FormData,
): Promise<ActionState> {
  const prefs = {
    notifyStoryReady: form.get('notifyStoryReady') === 'on',
    notifyPayment: form.get('notifyPayment') === 'on',
    notifyProductNews: form.get('notifyProductNews') === 'on',
  };

  const result = await mutate(
    '/auth/me',
    'PATCH',
    { prefs },
    'تنظیمات اعلان ذخیره شد.',
  );
  if (result.tone === 'success') revalidatePath('/settings');
  return result;
}

/**
 * Ends one named session from «دستگاه‌های واردشده».
 *
 * The id is bound with `.bind()` rather than carried in a hidden field, so it
 * is not part of the rendered HTML — and the API scopes the delete by the
 * caller's own user id regardless.
 */
export async function revokeSession(
  sessionId: string,
  _previous: ActionState,
): Promise<ActionState> {
  const result = await mutate(
    `/auth/sessions/${sessionId}`,
    'DELETE',
    undefined,
    'آن دستگاه خارج شد.',
  );
  if (result.tone === 'success') revalidatePath('/settings');
  return result;
}

/** Ends every session except the one making the request. */
export async function revokeOtherSessions(): Promise<ActionState> {
  const result = await mutate(
    '/auth/logout-all',
    'POST',
    undefined,
    'همهٔ دستگاه‌های دیگر خارج شدند.',
  );
  if (result.tone === 'success') revalidatePath('/settings');
  return result;
}
/**
 * @file account.ts
 * @description Server Actions for the parent account's profile, password, notification, and session mutations.
 */
