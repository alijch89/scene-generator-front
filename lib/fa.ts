/**
 * Persian formatting. Intl already knows the Persian calendar and the ٬ / ٫
 * separators the design uses, so there is nothing to hand-roll here.
 */

const numberFmt = new Intl.NumberFormat('fa-IR');
const dateFmtLong = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'long' });
const dateFmtShort = new Intl.DateTimeFormat('fa-IR', {
  day: 'numeric',
  month: 'long',
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

if (process.env.NODE_ENV !== 'production') {
  // ponytail: the separators are the whole point of this module — assert the
  // ones the design specifies rather than trusting the ICU build.
  console.assert(faNum(190000) === '۱۹۰٬۰۰۰', 'faNum grouping separator');
  console.assert(faDigits(2026) === '۲۰۲۶', 'faDigits');
  console.assert(faPrice(490_000) === '۴۹٬۰۰۰ تومان', 'faPrice ریال→تومان');
  console.assert(faDuration(360) === '۶:۰۰', 'faDuration');
  console.assert(faPercent(62) === '۶۲٪', 'faPercent');
}
