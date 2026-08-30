import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/dal';
import { homeFor } from '@/lib/session';
import { ForcedPasswordChangeForm } from './forced-password-change-form';

export const metadata: Metadata = { title: 'تغییر گذرواژه' };

/**
 * Where an account lands when an administrator reset its password.
 *
 * It reads the session directly rather than through `verifySession`, which
 * sends locked accounts here — that would be a redirect loop. Anyone who
 * arrives without owing a change is sent on to their own home, so this page
 * is never a second «تغییر گذرواژه» competing with the one in پروفایل.
 */
export default async function ChangePasswordPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?reason=expired');
  if (!user.mustChangePassword) redirect(homeFor(user.role));

  return <ForcedPasswordChangeForm home={homeFor(user.role)} />;
}
/**
 * @file page.tsx
 * @description Renders the mandatory password change that follows an administrator reset.
 */
