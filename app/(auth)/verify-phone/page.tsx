import type { Metadata } from 'next';
import { VerifyPhoneForm } from './verify-phone-form';

// The root layout already appends « · شهرزاد قصه‌گو» via its title template.
export const metadata: Metadata = { title: 'تأیید شماره' };

/** Server page that hands registration context to the code-entry form. */
export default async function VerifyPhonePage({
  searchParams,
}: PageProps<'/verify-phone'>) {
  const params = await searchParams;
  const phone = typeof params.phone === 'string' ? params.phone : '';
  const token = typeof params.token === 'string' ? params.token : '';
  // Registration continues to «گذرواژه یا کد؟»; a code sign-in is already done.
  const mode = params.mode === 'signup' ? 'signup' : 'login';

  return <VerifyPhoneForm phone={phone} initialToken={token} mode={mode} />;
}
/**
 * @file page.tsx
 * @description Renders the phone verification route that exchanges a code for a session.
 */
