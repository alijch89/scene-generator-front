import type { Metadata } from 'next';
import { Clock3, Mail, School, Send, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/public/ui';

export const metadata: Metadata = { title: 'تماس با ما' };

const SUBJECTS = [
  'پرسش دربارهٔ قیمت و پرداخت',
  'مشکل در ساخت قصه',
  'حریم خصوصی و داده‌ها',
  'همکاری و آموزش',
];

const CHANNELS = [
  {
    Icon: Clock3,
    title: 'پشتیبانی',
    email: 'help@shahrzad.ir',
    body: 'شنبه تا چهارشنبه، ۹ تا ۱۷',
  },
  {
    Icon: ShieldCheck,
    title: 'حریم خصوصی و داده‌ها',
    email: 'privacy@shahrzad.ir',
    body: 'درخواست‌های حذف داده تا ۷۲ ساعت انجام می‌شود.',
  },
  {
    Icon: School,
    title: 'آموزش و مدرسه‌ها',
    body: 'برای کلاس‌ها و کتابخانه‌ها برنامهٔ جداگانه داریم؛ بنویسید تا صحبت کنیم.',
  },
];

const fieldClass =
  'rounded-[14px] border border-border bg-elev/70 px-3.5 py-3 text-sm text-ink shadow-[0_1px_0_rgba(255,255,255,.35)_inset] transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted/65 hover:bg-elev focus:border-brand focus:bg-surface focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--sh-primary)_10%,transparent)] focus:outline-none';

/** Static contact page for support, business hours, and common inquiry routing. */
export default function ContactPage() {
  return (
    <main className="mx-auto max-w-[960px] px-5 pt-[clamp(46px,7vw,82px)] pb-20">
      <PageHeader
        eyebrow="پاسخ‌گوی خانواده‌ها هستیم"
        title="تماس با ما"
        lead="پاسخ‌ها معمولاً در یک روز کاری فرستاده می‌شوند."
      />

      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] items-start gap-4.5">
        {/* ponytail: a native mailto form — the public site is static and there
            is no contact endpoint. Swap action/method for a POST to the API
            when one exists; the fields already carry the right names. */}
        <form
          action="mailto:help@shahrzad.ir"
          method="post"
          encType="text/plain"
          className="motion-rise flex flex-col gap-4 rounded-[28px] border border-border bg-[color-mix(in_srgb,var(--sh-surface)_92%,transparent)] p-5 shadow-card-lg sm:p-7"
        >
          <div className="mb-1 flex items-center gap-3 border-b border-border pb-4">
            <span className="gradient-brand grid size-10 place-items-center rounded-[14px] text-white shadow-card">
              <Mail className="size-5" strokeWidth={1.7} />
            </span>
            <div>
              <strong className="block text-[15px]">یک پیام برای ما بنویسید</strong>
              <span className="text-[11.5px] text-muted">کوتاه یا مفصل؛ با دقت می‌خوانیم.</span>
            </div>
          </div>
          <label className="flex flex-col gap-2">
            <span className="text-[13.5px] font-bold">نام</span>
            <input
              type="text"
              name="نام"
              required
              placeholder="سحر رضایی"
              className={fieldClass}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[13.5px] font-bold">ایمیل</span>
            <input
              type="email"
              name="ایمیل"
              required
              placeholder="sahar@example.com"
              className={fieldClass}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[13.5px] font-bold">موضوع</span>
            <select name="موضوع" className={fieldClass}>
              {SUBJECTS.map((subject) => (
                <option key={subject}>{subject}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[13.5px] font-bold">پیام</span>
            <textarea
              name="پیام"
              rows={4}
              required
              placeholder="چه چیزی پیش آمده؟"
              className={`${fieldClass} resize-y leading-[1.9]`}
            />
          </label>

          <button
            type="submit"
            className="public-cta gradient-brand inline-flex items-center justify-center gap-2 rounded-[14px] py-3.5 text-[15px] font-bold text-white"
          >
            <Send className="size-4.5" strokeWidth={1.8} />
            فرستادن پیام
          </button>
          <p className="text-center text-xs text-muted">
            با فرستادن پیام، برنامهٔ ایمیل خودتان باز می‌شود.
          </p>
        </form>

        <div className="flex flex-col gap-3.5">
          {CHANNELS.map((channel, index) => (
            <div
              key={channel.title}
              style={
                { '--motion-delay': `${index * 85 + 80}ms` } as React.CSSProperties
              }
              className="motion-rise group rounded-[22px] border border-border bg-[color-mix(in_srgb,var(--sh-elev)_76%,transparent)] p-5 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--sh-primary)_28%,var(--sh-border))] hover:shadow-card"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-[13px] border border-border bg-surface text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                  <channel.Icon className="size-4.5" strokeWidth={1.8} />
                </span>
                <strong className="text-[15px]">{channel.title}</strong>
              </div>
              <p className="text-sm leading-[1.9] text-muted">
                {channel.email ? (
                  <>
                    <a href={`mailto:${channel.email}`} className="text-brand">
                      {channel.email}
                    </a>
                    <br />
                  </>
                ) : null}
                {channel.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
/**
 * @file page.tsx
 * @description Renders public contact channels and the informational contact form.
 */
