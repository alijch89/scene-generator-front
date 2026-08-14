/**
 * @file fa.ts
 * @description Formats numbers, prices, durations, relative times, and Jalali dates for Persian UI surfaces.
 *
 * Persian formatting. Intl already knows the Persian calendar and the ٬ / ٫
 * separators the design uses, so there is nothing to hand-roll here.
 */

const numberFmt = new Intl.NumberFormat('fa-IR');
const rateFmt = new Intl.NumberFormat('fa-IR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const dateFmtLong = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'long' });
const dateFmtShort = new Intl.DateTimeFormat('fa-IR', {
  day: 'numeric',
  month: 'long',
});
const dateFmtNumeric = new Intl.DateTimeFormat('fa-IR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});
const timeFmt = new Intl.DateTimeFormat('fa-IR', {
  hour: '2-digit',
  minute: '2-digit',
});
const relativeFmt = new Intl.RelativeTimeFormat('fa-IR', { numeric: 'auto' });
const weekdayFmt = new Intl.DateTimeFormat('fa-IR', { weekday: 'long' });
/** Latin digits on purpose — this one is arithmetic, not display. */
const persianDayFmt = new Intl.DateTimeFormat('en-u-ca-persian', {
  day: 'numeric',
});

/** 190000 → "۱۹۰٬۰۰۰" */
export const faNum = (n: number) => numberFmt.format(n);

/** Digits only, no grouping — for page numbers, counters, timers. */
export const faDigits = (v: number | string) =>
  String(v).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

/** The API stores ریال; the country prices in تومان. 490000 → "۴۹٬۰۰۰ تومان" */
export const faPrice = (rial: number) => `${faNum(Math.round(rial / 10))} تومان`;

/** Jalali. Date → "۲۲ مرداد ۱۴۰۵" */
export const faDate = (d: Date | string) =>
  dateFmtLong.format(typeof d === 'string' ? new Date(d) : d);

/** Jalali without the year — "۲۲ مرداد" */
export const faDateShort = (d: Date | string) =>
  dateFmtShort.format(typeof d === 'string' ? new Date(d) : d);

/** Seconds → "۶:۰۰", for the reader's narration timeline. */
export const faDuration = (totalSeconds: number) => {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${faDigits(m)}:${faDigits(String(s).padStart(2, '0'))}`;
};

/** 62 → "۶۲٪" */
export const faPercent = (n: number) => `${faDigits(Math.round(n))}٪`;

/** 3.34 → "۳٫۳٪" — rates the admin tables report to one decimal. */
export const faRate = (n: number) => `${rateFmt.format(n)}٪`;

/** Jalali, numeric — "۱۴۰۵/۰۵/۲۳". The admin tables' date column. */
export const faDateNumeric = (d: Date | string) =>
  dateFmtNumeric.format(typeof d === 'string' ? new Date(d) : d);

/** "۲۳ مرداد ۱۴۰۵، ۱۳:۳۰" — for audit trails, where the hour matters. */
export const faDateTime = (d: Date | string) => {
  const date = typeof d === 'string' ? new Date(d) : d;
  return `${dateFmtLong.format(date)}، ${timeFmt.format(date)}`;
};

/** The bare number of تومان, for tables that carry the unit in its own column. */
export const faAmount = (rial: number) => faNum(Math.round(rial / 10));

/**
 * "۸۴۲ م.ت" — the admin stat cards' shorthand for millions of تومان. Below a
 * million there is nothing to compress, so it falls back to the full figure.
 */
export const faCompactPrice = (rial: number) => {
  const toman = rial / 10;
  if (toman < 1_000_000) return faPrice(rial);
  const millions = toman / 1_000_000;
  return `${rateFmt.format(millions)} م.ت`;
};

/** "۸۷ ثانیه" / "۱۱ دقیقه" — how long a job or a generation took. */
export const faElapsed = (ms: number) => {
  const seconds = Math.round(ms / 1000);
  if (seconds < 90) return `${faDigits(seconds)} ثانیه`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 90) return `${faDigits(minutes)} دقیقه`;
  return `${rateFmt.format(minutes / 60)} ساعت`;
};

/** "۱۰ دقیقه پیش". Null-safe, because «آخرین فعالیت» is often empty. */
export const faAgo = (d: Date | string | null | undefined) => {
  if (!d) return '—';
  const then = typeof d === 'string' ? new Date(d) : d;
  const seconds = Math.round((Date.now() - then.getTime()) / 1000);

  const [value, unit]: [number, Intl.RelativeTimeFormatUnit] =
    seconds < 60
      ? [seconds, 'second']
      : seconds < 3600
        ? [Math.round(seconds / 60), 'minute']
        : seconds < 86_400
          ? [Math.round(seconds / 3600), 'hour']
          : seconds < 2_592_000
            ? [Math.round(seconds / 86_400), 'day']
            : [Math.round(seconds / 2_592_000), 'month'];

  return relativeFmt.format(-value, unit);
};

/** Jalali weekday initial — ش ی د س چ پ ج, the design's bar-chart axis. */
export const faWeekdayShort = (d: Date | string) =>
  weekdayFmt.format(typeof d === 'string' ? new Date(d) : d).slice(0, 1);

/** "۲۰ تا ۲۲" — the reports page's peak-hour band. */
export const faHourBand = (hour: number) =>
  `${faDigits(hour)} تا ${faDigits((hour + 2) % 24)}`;

/**
 * Midnight on the first of the current Jalali month, as a JS Date.
 *
 * The API filters by instants and knows nothing about calendars; the calendar
 * lives here, with the formatter. Intl gives the Persian day-of-month in latin
 * digits, and stepping back that many days lands on the first.
 */
export const jalaliMonthStart = (now = new Date()) => {
  const dayOfMonth = Number(persianDayFmt.format(now));
  const start = new Date(now);
  start.setDate(start.getDate() - (dayOfMonth - 1));
  start.setHours(0, 0, 0, 0);
  return start;
};

if (process.env.NODE_ENV !== 'production') {
  // ponytail: the separators are the whole point of this module — assert the
  // ones the design specifies rather than trusting the ICU build.
  console.assert(faNum(190000) === '۱۹۰٬۰۰۰', 'faNum grouping separator');
  console.assert(faDigits(2026) === '۲۰۲۶', 'faDigits');
  console.assert(faPrice(490_000) === '۴۹٬۰۰۰ تومان', 'faPrice ریال→تومان');
  console.assert(faDuration(360) === '۶:۰۰', 'faDuration');
  console.assert(faPercent(62) === '۶۲٪', 'faPercent');
  console.assert(faRate(3.34) === '۳٫۳٪', 'faRate decimal separator');
  console.assert(faAmount(1_449_700) === '۱۴۴٬۹۷۰', 'faAmount ریال→تومان');
  console.assert(faCompactPrice(8_420_000_000) === '۸۴۲٫۰ م.ت', 'faCompactPrice');
  console.assert(faCompactPrice(490_000) === faPrice(490_000), 'faCompactPrice small');
  console.assert(faElapsed(87_000) === '۸۷ ثانیه', 'faElapsed seconds');
  console.assert(faElapsed(660_000) === '۱۱ دقیقه', 'faElapsed minutes');
  console.assert(faAgo(null) === '—', 'faAgo empty');
  // The first of a Jalali month is the first of a Jalali month, whichever day
  // it is asked on.
  console.assert(
    Number(persianDayFmt.format(jalaliMonthStart())) === 1,
    'jalaliMonthStart lands on day 1',
  );
}
