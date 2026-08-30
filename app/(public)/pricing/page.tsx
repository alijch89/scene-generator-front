import type { Metadata } from 'next';
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
    title: 'بدون اشتراک',
    body: 'تمدید خودکاری در کار نیست. هر قصه یک پرداخت جداگانه است و اگر قصه‌ای نسازید، چیزی پرداخت نمی‌کنید.',
  },
  {
    title: 'پرداخت امن',
    body: 'پرداخت در درگاه بانکی انجام می‌شود. ما اطلاعات کارت شما را نمی‌بینیم و نگه نمی‌داریم.',
  },
  {
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
    <main className="mx-auto max-w-[1080px] animate-[pageIn_.4s_ease_both] px-5 pt-[clamp(30px,5vw,60px)] pb-20">
      <PageHeader
        title="قیمت متناسب با طول ویدیو"
        lead="نه اشتراک ماهانه، نه بستهٔ اعتبار. فقط طول ویدیوی قصه را انتخاب می‌کنید و یک بار پرداخت می‌کنید."
      />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-start gap-5">
        <div className="rounded-3xl border-2 border-brand bg-surface p-7 shadow-card-lg">
          <strong className="mb-1.5 block text-[17px]">قیمت هر ویدیو</strong>
          <p className="mb-4 text-[13px] text-muted">
            متن، تصویر، روایت و ویدئو
          </p>

          <dl className="mb-6 divide-y divide-border rounded-[18px] border border-border bg-elev px-4">
            {PRICE_OPTIONS.map((option) => (
              <div key={option.label} className="flex items-center gap-3 py-3.5">
                <div>
                  <dt className="text-[14px] font-bold">{option.label}</dt>
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
            className="gradient-brand block rounded-[14px] py-3.5 text-center text-[15px] font-bold text-white hover:no-underline"
          >
            ساخت قصه
          </Link>
          <p className="mt-3.5 text-center text-xs text-muted">
            برای شروع فقط یک حساب کاربری لازم است.
          </p>
        </div>

        <Card className="rounded-3xl p-7">
          <strong className="mb-4 block text-[17px]">چه چیزی شامل می‌شود</strong>
          <ul className="flex list-none flex-col gap-3 text-[14px] leading-[1.9] text-muted">
            {INCLUDED.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span aria-hidden className="flex-none text-success">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
        {REASSURANCES.map((item) => (
          <Card key={item.title} className="rounded-[20px] p-5">
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
