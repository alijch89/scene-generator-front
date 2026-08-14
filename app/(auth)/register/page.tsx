import type { Metadata } from 'next';
import { RegisterForm } from './register-form';

export const metadata: Metadata = { title: 'ساخت حساب · شهرزاد قصه‌گو' };

/** Hosts the client registration form within the authentication layout. */
export default function RegisterPage() {
  return <RegisterForm />;
}
/**
 * @file page.tsx
 * @description Renders the public parent-account registration route.
 */
