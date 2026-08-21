import type { Metadata } from 'next';
import { SetPasswordForm } from './set-password-form';

export const metadata: Metadata = { title: 'گذرواژه' };

/** Hosts the post-verification choice between a password and code-only sign-in. */
export default function SetPasswordPage() {
  return <SetPasswordForm />;
}
/**
 * @file page.tsx
 * @description Renders the route where a new parent chooses a password or code-only sign-in.
 */
