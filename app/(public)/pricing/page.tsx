import type { Metadata } from 'next';
import {
  Check,
  CreditCard,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { Card, PageHeader } from '@/components/public/ui';
import { STORY_PRICE_BY_LENGTH } from '@/lib/config';
import { faNum } from '@/lib/fa';

export const metadata: Metadata = { title: 'قیمت' };

/**
 * There are no subscription plans, credit packs, or usage meters. The only
 * price difference is the requested video length.
 */
const INCLUDED = [
  'متن اختصاصی با نام، سن و علاقه‌های کودک',
  'تصویرسازی همهٔ صفحه‌ها در سبک انتخابی شما',
  'روایت فارسی با سه صدای راوی',
  'ویدئوی قصه برای تماشا، و متن صفحه‌به‌صفحه برای خواندن',
  'دانلود قصه و نگهداری همیشگی در کتابخانهٔ خانه',
  'پروندهٔ کودک به هر تعداد که لازم دارید',
];

const REASSURANCES = [
  {
    Icon: Sparkles,
    title: 'بدون اشتراک',
    body: 'تمدید خودکاری در کار نیست. هر قصه یک پرداخت جداگانه است و اگر قصه‌ای نسازید، چیزی پرداخت نمی‌کنید.',
  },
  {
    Icon: ShieldCheck,
    title: 'پرداخت امن',
    body: 'پرداخت در درگاه بانکی انجام می‌شود. ما اطلاعات کارت شما را نمی‌بینیم و نگه نمی‌داریم.',
  },
  {
    Icon: RefreshCcw,
    title: 'اگر ساخت ناموفق بماند',
    body: 'قصه‌ای که با خطا متوقف شود دوباره ساخته می‌شود، بدون پرداخت دوباره.',
  },
];

const PRICE_OPTIONS = [
  {
    label: 'ویدیوی کوتاه',
    detail: '۵ صفحه · حدود ۳ دقیقه',
    price: STORY_PRICE_BY_LENGTH.SHORT,
  },
  {
    label: 'ویدیوی متوسط',
    detail: '۱۰ صفحه · حدود ۶ دقیقه',
    price: STORY_PRICE_BY_LENGTH.MEDIUM,
  },
  {
    label: 'ویدیوی بلند',
    detail: '۱۶ صفحه · حدود ۱۰ دقیقه',
    price: STORY_PRICE_BY_LENGTH.LONG,
  },
];

/** Public per-length pricing driven by the frontend display configuration. */
export default function PricingPage() {
  return (
    <main className="mx-auto max-w-[1080px] px-5 pt-[clamp(46px,7vw,82px)] pb-20">
      <PageHeader
        eyebrow="شفاف، ساده و بدون اشتراک"
        title="قیمت متناسب با طول ویدیو"
        lead="نه اشتراک ماهانه، نه بستهٔ اعتبار. فقط طول ویدیوی قصه را انتخاب می‌کنید و یک بار پرداخت می‌کنید."
      />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-start gap-5">
        <div className="motion-rise relative overflow-hidden rounded-[30px] border-2 border-[color-mix(in_srgb,var(--sh-primary)_72%,var(--sh-border))] bg-[color-mix(in_srgb,var(--sh-surface)_92%,transparent)] p-6 shadow-[var(--sh-shadow-float)] sm:p-7">
          <span className="absolute top-0 end-6 rounded-b-xl bg-brand px-3 py-1.5 text-[10.5px] font-bold text-white shadow-card">
            انتخاب ساده، بدون پلن گیج‌کننده
          </span>
          <span
            aria-hidden
            className="absolute -top-16 -start-16 size-44 rounded-full bg-[color-mix(in_srgb,var(--sh-primary)_13%,transparent)] blur-3xl"
          />
          <strong className="relative mt-5 mb-1.5 block font-display text-[21px]">
            قیمت هر ویدیو
          </strong>
          <p className="relative mb-5 text-[13px] text-muted">
            متن، تصویر، روایت و ویدئو
          </p>

          <dl className="relative mb-6 flex flex-col gap-2.5">
            {PRICE_OPTIONS.map((option, index) => (
              <div
                key={option.label}
                className={`flex items-center gap-3 rounded-[17px] border px-4 py-3.5 transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 ${
                  index === 1
                    ? 'border-[color-mix(in_srgb,var(--sh-primary)_42%,var(--sh-border))] bg-[color-mix(in_srgb,var(--sh-primary)_8%,var(--sh-elev))]'
                    : 'border-border bg-elev'
                }`}
              >
                <div>
                  <dt className="flex items-center gap-2 text-[14px] font-bold">
                    {option.label}
                    {index === 1 ? (
                      <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[9.5px] text-brand">
                        محبوب
                      </span>
                    ) : null}
                  </dt>
                  <dd className="mt-0.5 text-[11.5px] text-muted">
                    {option.detail}
                  </dd>
                </div>
                <dd className="ms-auto whitespace-nowrap font-display text-[20px]">
                  {faNum(option.price)}{' '}
                  <span className="font-sans text-[11px] text-muted">تومان</span>
                </dd>
              </div>
            ))}
          </dl>

          <Link
            href="/wizard"
            className="public-cta gradient-brand flex items-center justify-center gap-2 rounded-[14px] py-3.5 text-center text-[15px] font-bold text-white hover:no-underline"
          >
            <Sparkles className="size-4.5" />
            ساخت قصه
          </Link>
          <p className="mt-3.5 text-center text-xs text-muted">
            برای شروع فقط یک حساب کاربری لازم است.
          </p>
        </div>

        <Card className="motion-rise rounded-[30px] p-7 [--motion-delay:110ms]">
          <span className="mb-4 grid size-11 place-items-center rounded-[15px] bg-[color-mix(in_srgb,var(--sh-teal)_12%,var(--sh-elev))] text-teal">
            <CreditCard className="size-5" strokeWidth={1.7} />
          </span>
          <strong className="mb-4 block font-display text-[20px]">
            چه چیزی شامل می‌شود
          </strong>
          <ul className="flex list-none flex-col gap-3 text-[14px] leading-[1.9] text-muted">
            {INCLUDED.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span
                  aria-hidden
                  className="mt-1 grid size-5 flex-none place-items-center rounded-full bg-success/12 text-success"
                >
                  <Check className="size-3.5" strokeWidth={2.2} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
        {REASSURANCES.map((item, index) => (
          <Card
            key={item.title}
            style={
              { '--motion-delay': `${index * 80 + 160}ms` } as React.CSSProperties
            }
            className="motion-rise rounded-[20px] p-5"
          >
            <span className="mb-3 grid size-9 place-items-center rounded-[13px] bg-elev text-brand">
              <item.Icon className="size-4.5" strokeWidth={1.8} />
            </span>
            <strong className="mb-2 block text-[15px]">{item.title}</strong>
            <p className="text-[13.5px] leading-[1.9] text-muted">
              {item.body}
            </p>
          </Card>
        ))}
      </div>

      <p className="mt-7 text-[13.5px] text-muted">
        پرسش دیگری دارید؟{' '}
        <Link href="/faq" className="font-bold text-brand">
          پرسش‌های پرتکرار
        </Link>{' '}
        را ببینید یا{' '}
        <Link href="/contact" className="font-bold text-brand">
          به ما بنویسید
        </Link>
        .
      </p>
    </main>
  );
}
/**
 * @file page.tsx
 * @description Renders per-video-length prices and explains the no-subscription model.
 */
