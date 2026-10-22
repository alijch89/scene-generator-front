import Link from 'next/link';
import { Panel } from '@/components/admin/ui';
import { faDateTime, faElapsed } from '@/lib/fa';
import type { AdminGenerationApiCall } from '@/lib/types';

const OPERATION: Record<AdminGenerationApiCall['operation'], string> = {
  submit: 'ارسال درخواست ساخت',
  poll: 'پیگیری وضعیت',
  assets: 'دریافت خروجی‌های قصه',
  download: 'دریافت فایل ویدیو',
};

/** React escapes strings here, including untrusted HTML returned by a provider. */
export function GenerationJson({ value }: { value: unknown }) {
  return (
    <pre
      dir="ltr"
      className="max-h-110 overflow-auto rounded-lg border border-border bg-elev p-3 text-left font-mono text-[11.5px] leading-[1.9] whitespace-pre-wrap break-all"
    >
      {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
    </pre>
  );
}

export function GenerationApiCalls({
  calls,
}: {
  calls: AdminGenerationApiCall[];
}) {
  if (!calls.length) {
    return (
      <p className="text-[12.5px] leading-[1.9] text-muted">
        هنوز ارتباطی با سرویس خارجی ثبت نشده است. پاسخ‌های پیش از فعال‌شدن ثبت
        سابقه و اجراهای سرویس آزمایشی در این فهرست وجود ندارند.
      </p>
    );
  }

  return (
    <ol className="flex flex-col gap-3">
      {calls.map((call, index) => (
        <li key={call.id}>
          <details
            open={index === 0}
            className="min-w-0 rounded-xl border border-border bg-surface p-3.5"
          >
            <summary className="cursor-pointer text-[13px] font-bold">
              {OPERATION[call.operation]} · {faDateTime(call.startedAt)} ·{' '}
              <span className={call.error ? 'text-error' : 'text-muted'}>
                {call.responseStatus !== null
                  ? `HTTP ${call.responseStatus}`
                  : call.endedAt
                    ? 'بدون پاسخ HTTP'
                    : 'هنوز پاسخی ثبت نشده'}
              </span>
              {call.durationMs !== null
                ? ` · ${faElapsed(call.durationMs)}`
                : ''}
            </summary>
            <div className="mt-3 flex flex-col gap-3">
              <p
                dir="ltr"
                className="break-all text-left font-mono text-[11.5px] text-muted"
              >
                {call.method} {call.url}
              </p>
              <dl className="grid gap-2 text-[12px] sm:grid-cols-2">
                <div>
                  <dt className="text-muted">شناسهٔ اجرای ساخت</dt>
                  <dd dir="ltr" className="break-all font-mono">
                    {call.runId}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">شناسهٔ کار در سرویس خارجی</dt>
                  <dd dir="ltr" className="break-all font-mono">
                    {call.providerJobRef ?? '—'}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">تراکنش مرتبط</dt>
                  <dd>
                    {call.orderId ? (
                      <Link
                        href={`/admin/payments/${call.orderId}`}
                        className="break-all font-mono"
                      >
                        {call.orderId}
                      </Link>
                    ) : (
                      'ثبت نشده'
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">زمان ثبت پاسخ</dt>
                  <dd>
                    {call.endedAt ? faDateTime(call.endedAt) : 'ثبت نشده'}
                  </dd>
                </div>
              </dl>
              {call.error ? (
                <p
                  role="alert"
                  className="break-words text-[12.5px] text-error"
                >
                  {call.error}
                </p>
              ) : null}
              <div className="grid min-w-0 gap-3 xl:grid-cols-2">
                <Panel title="دادهٔ ارسال‌شده">
                  <GenerationJson value={call.requestBody} />
                </Panel>
                <Panel
                  title={
                    call.operation === 'download'
                      ? 'مشخصات پاسخ دریافت ویدیو'
                      : 'پاسخ اصلی سرویس'
                  }
                >
                  {call.endedAt ? (
                    <GenerationJson value={call.responseBody} />
                  ) : (
                    <p className="text-[12px] text-muted">
                      پاسخی ثبت نشده؛ درخواست ممکن است در حال اجرا باشد یا کارگر
                      متوقف شده باشد.
                    </p>
                  )}
                </Panel>
              </div>
              <details className="text-[12px]">
                <summary className="cursor-pointer font-semibold">
                  اطلاعات کاربر، کودک و تراکنش هنگام شروع این اجرا
                </summary>
                <div className="mt-2">
                  <GenerationJson value={call.context} />
                </div>
              </details>
              <p className="text-[11.5px] text-muted">
                شناسهٔ ثبت:{' '}
                <span dir="ltr" className="break-all font-mono">
                  {call.id}
                </span>
              </p>
            </div>
          </details>
        </li>
      ))}
    </ol>
  );
}
