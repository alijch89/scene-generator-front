import type { Metadata } from 'next';
import { RegisterForm } from './register-form';

export const metadata: Metadata = { title: 'ساخت حساب · شهرزاد قصه‌گو' };

export default function RegisterPage() {
  return <RegisterForm />;
}
