import { faDigits, STUB_CREDITS } from "@/lib/utils";

// ponytail: no billing provider wired up yet — stub data only, matches
// the honest "not connected" note below. Swap for a real endpoint when
// the platform billing module lands.
const PACKS = [
  { credits: 3, perStory: "۳۲٬۷۰۰", price: "۹۸٬۰۰۰", highlight: false },
  { credits: 10, perStory: "۲۴٬۹۰۰", price: "۲۴۹٬۰۰۰", highlight: true },
];
const HISTORY = [
  { label: "۱۰ اعتبار", date: "۱۲ تیر ۱۴۰۵", amount: "۲۴۹٬۰۰۰" },
  { label: "۳ اعتبار", date: "۲ خرداد ۱۴۰۵", amount: "۹۸٬۰۰۰" },
];

export default function BillingPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5 px-5 py-8 sm:px-8">
      <h1 className="m-0 text-2xl font-extrabold">اعتبار و پرداخت</h1>

      <div className="flex items-center justify-between rounded-3xl bg-[var(--night)] p-5 text-[#f6f3ff]">
        <div className="flex flex-col gap-1">
          <span className="text-[13px] opacity-70">اعتبار فعلی</span>
          <span className="text-[30px] font-extrabold">
            {faDigits(STUB_CREDITS)}
          </span>
        </div>
        <span className="text-2xl text-[var(--accent)]">✦</span>
      </div>

      <div className="flex flex-col gap-3">
        {PACKS.map((pack) => (
          <div
            key={pack.credits}
            className={`relative flex items-center justify-between rounded-2xl p-4.5 ${
              pack.highlight
                ? "border-2 border-[var(--primary)] bg-[var(--surface)]"
                : "border border-[var(--border)] bg-[var(--surface)]"
            }`}
          >
            {pack.highlight && (
              <span className="absolute -top-2.5 end-4.5 rounded-full bg-[var(--primary)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--primary-ink)]">
                به‌صرفه‌ترین
              </span>
            )}
            <div className="flex flex-col gap-1">
              <span className="text-[15px] font-bold">
                {faDigits(pack.credits)} اعتبار
              </span>
              <span className="text-[13px] text-[var(--ink-3)]">
                هر قصه {pack.perStory} تومان
              </span>
            </div>
            <span
              className={`rounded-xl px-4 py-2.5 text-sm font-bold ${
                pack.highlight
                  ? "bg-[var(--primary)] text-[var(--primary-ink)]"
                  : "border border-[var(--border)] bg-[var(--surface-2)]"
              }`}
            >
              {pack.price}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4.5">
          <div className="flex flex-col gap-1">
            <span className="text-[15px] font-bold">اشتراک ماهانه</span>
            <span className="text-[13px] text-[var(--ink-3)]">۸ اعتبار در ماه</span>
          </div>
          <span className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5 text-sm font-semibold">
            ۱۸۹٬۰۰۰
          </span>
        </div>
      </div>

      <p className="m-0 text-xs leading-relaxed text-[var(--ink-3)]">
        درگاه پرداخت هنوز وصل نشده است؛ این بخش برای ماژول صورتحساب پلتفرم آماده است.
      </p>

      <span className="mt-2 text-base font-bold">تاریخچهٔ پرداخت</span>
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        {HISTORY.map((row, index) => (
          <div
            key={row.date}
            className={`flex items-center justify-between p-4 ${
              index < HISTORY.length - 1 ? "border-b border-[var(--border)]" : ""
            }`}
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold">{row.label}</span>
              <span className="text-xs text-[var(--ink-3)]">{row.date}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-sm">{row.amount}</span>
              <span className="text-xs text-[var(--primary)]">فاکتور</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
