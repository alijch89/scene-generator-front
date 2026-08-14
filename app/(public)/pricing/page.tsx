import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, PageHeader } from '@/components/public/ui';
import { STORY_PRICE } from '@/lib/config';
import { faNum } from '@/lib/fa';

export const metadata: Metadata = { title: 'قیمت' };

/**
 * The design's three-tier subscription table is deliberately gone: there is one
 * static price per story, no plans, no credit packs and no usage meters. So
 * everything the product does is included — the list below is the whole thing.
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

/** Static public pricing page driven by the frontend display-price configuration. */
export default function PricingPage() {
  return (
    <main className="mx-auto max-w-[1080px] animate-[pageIn_.4s_ease_both] px-5 pt-[clamp(30px,5vw,60px)] pb-20">
      <PageHeader
        title="یک قیمت، همین."
        lead="نه اشتراک ماهانه، نه بستهٔ اعتبار. برای هر قصه‌ای که می‌سازید یک بار پرداخت می‌کنید و آن قصه برای همیشه مال شماست."
      />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-start gap-5">
        <div className="rounded-3xl border-2 border-brand bg-surface p-7 shadow-card-lg">
          <strong className="mb-1.5 block text-[17px]">یک قصهٔ کامل</strong>
          <p className="mb-5 text-[13px] text-muted">
            متن، تصویر، روایت و ویدئو
          </p>
          <p className="mb-1 font-display text-[44px] leading-none">
            {faNum(STORY_PRICE)}{' '}
            <span className="text-sm text-muted">تومان</span>
          </p>
          <p className="mb-6 text-[13px] text-muted">برای هر قصه</p>

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
 * @description Renders the single per-story price and explicitly explains the no-subscription model.
 */
