import type { Metadata } from 'next';
import { LoginForm } from './login-form';

export const metadata: Metadata = { title: 'ورود · شهرزاد قصه‌گو' };

/** Server page that derives initial login feedback and redirect intent from the URL. */
export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const params = await searchParams;
  const reason = typeof params.reason === 'string' ? params.reason : undefined;
  const next = typeof params.next === 'string' ? params.next : undefined;

  return (
    <LoginForm
      initialStatus={reason === 'expired' ? 'expired' : 'idle'}
      next={next}
    />
  );
}
/**
 * @file page.tsx
 * @description Renders the login route with session-expiry and safe next-route context.
 */
