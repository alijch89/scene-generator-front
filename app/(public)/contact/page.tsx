import type { Metadata } from 'next';
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
    title: 'پشتیبانی',
    email: 'help@shahrzad.ir',
    body: 'شنبه تا چهارشنبه، ۹ تا ۱۷',
  },
  {
    title: 'حریم خصوصی و داده‌ها',
    email: 'privacy@shahrzad.ir',
    body: 'درخواست‌های حذف داده تا ۷۲ ساعت انجام می‌شود.',
  },
  {
    title: 'آموزش و مدرسه‌ها',
    body: 'برای کلاس‌ها و کتابخانه‌ها برنامهٔ جداگانه داریم؛ بنویسید تا صحبت کنیم.',
  },
];

const fieldClass =
  'rounded-[13px] border border-border bg-elev px-3.5 py-3 text-sm text-ink';

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-[940px] animate-[pageIn_.4s_ease_both] px-5 pt-[clamp(30px,5vw,60px)] pb-20">
      <PageHeader
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
          className="flex flex-col gap-3.5 rounded-3xl border border-border bg-surface p-6 shadow-card"
        >
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
            className="gradient-brand rounded-[14px] py-3.5 text-[15px] font-bold text-white"
          >
            فرستادن پیام
          </button>
          <p className="text-center text-xs text-muted">
            با فرستادن پیام، برنامهٔ ایمیل خودتان باز می‌شود.
          </p>
        </form>

        <div className="flex flex-col gap-3.5">
          {CHANNELS.map((channel) => (
            <div
              key={channel.title}
              className="rounded-[20px] border border-border bg-elev p-5"
            >
              <strong className="mb-2 block text-[15px]">
                {channel.title}
              </strong>
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
