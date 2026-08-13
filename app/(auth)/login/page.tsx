import type { Metadata } from 'next';
import { LoginForm } from './login-form';

export const metadata: Metadata = { title: 'ورود · شهرزاد قصه‌گو' };

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
