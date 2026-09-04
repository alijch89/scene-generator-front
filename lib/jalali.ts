/**
 * @file jalali.ts
 * @description Converts between the Jalali and Gregorian calendars for the panel's date controls.
 *
 * `lib/fa.ts` formats instants for reading, and Intl is all that needs. A
 * date *picker* needs the other direction as well — which Gregorian day is
 * ۱۳ شهریور ۱۴۰۵, how many days does اسفند have this year — and Intl has no
 * inverse. This is Borkowski's arithmetic, the same the JavaScript ecosystem
 * has been shipping as jalaali-js for a decade, written out rather than
 * pulled in: it is a hundred lines with no runtime and no update treadmill.
 *
 * Everything here is civil-date arithmetic on plain integers. There is no
 * `Date` and no timezone: «از تاریخ» is a day on a calendar, and turning it
 * into an instant is the page's job, once, at the edge.
 */

/** Truncating integer division, which is what the algorithm is written in. */
const div = (a: number, b: number) => Math.trunc(a / b);

/** Remainder matching {@link div}'s truncation, including for negatives. */
const mod = (a: number, b: number) => a - Math.trunc(a / b) * b;

/** A civil date on either calendar. Months are 1-based. */
export interface CivilDate {
  year: number;
  month: number;
  day: number;
}

/**
 * The years where the 33-year leap cycle is interrupted.
 *
 * The Jalali calendar's leap years are not a formula but an observation: the
 * year is leap when the vernal equinox falls where it falls. This table is
 * the accepted approximation, valid from 1178 to 3177.
 */
const BREAKS = [
  -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 1673, 1749,
  1770, 1797, 1856, 1911, 1989, 2644, 2734, 2801, 2820, 2852, 2967, 3178,
];

/** Lowest and highest Jalali year {@link BREAKS} can answer for. */
const MIN_YEAR = 1178;
const MAX_YEAR = 3177;

/** What one Jalali year needs from the leap table. */
interface YearFacts {
  /** 0 when the year is leap; the algorithm's own encoding. */
  leap: number;
  /** The Gregorian year this Jalali year begins in. */
  gy: number;
  /** Day of March on which ۱ فروردین falls. */
  march: number;
}

/** Resolves one Jalali year against the leap table. */
const yearFacts = (jy: number): YearFacts => {
  const gy = jy + 621;
  let leapJ = -14;
  let jp = BREAKS[0]!;
  let jump = 0;

  for (let i = 1; i < BREAKS.length; i++) {
    const jm = BREAKS[i]!;
    jump = jm - jp;
    if (jy < jm) break;
    leapJ += div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }

  let n = jy - jp;
  leapJ += div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;

  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;

  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;

  return { leap, gy, march };
};

/** Gregorian date → Julian day number. */
const gregorianToJdn = (gy: number, gm: number, gd: number) => {
  let d =
    div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
    div(153 * mod(gm + 9, 12) + 2, 5) +
    gd -
    34840408;
  d -= div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) - 752;
  return d;
};

/** Julian day number → Gregorian date. */
const jdnToGregorian = (jdn: number): CivilDate => {
  let j = 4 * jdn + 139361631;
  j += div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const month = mod(div(i, 153), 12) + 1;
  return {
    year: div(j, 1461) - 100100 + div(8 - month, 6),
    month,
    day: div(mod(i, 153), 5) + 1,
  };
};

/** Jalali date → Julian day number. */
const jalaliToJdn = (jy: number, jm: number, jd: number) => {
  const { gy, march } = yearFacts(jy);
  return (
    gregorianToJdn(gy, 3, march) +
    (jm - 1) * 31 -
    div(jm, 7) * (jm - 7) +
    jd -
    1
  );
};

/** Whether اسفند has thirty days in this Jalali year. */
export const isJalaliLeapYear = (jy: number) => yearFacts(jy).leap === 0;

/** Days in one Jalali month: 31, 30, or 29 for اسفند in a common year. */
export const jalaliMonthLength = (jy: number, jm: number) => {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isJalaliLeapYear(jy) ? 30 : 29;
};

/** «فروردین … اسفند», indexed by month minus one. */
export const JALALI_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

/** «شنبه … جمعه» initials, in the order an Iranian calendar draws its columns. */
export const JALALI_WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

/** The Jalali year range {@link toJalali} and {@link toGregorian} accept. */
export const JALALI_YEAR_RANGE = { min: MIN_YEAR, max: MAX_YEAR };

/** Converts a Gregorian civil date to its Jalali equivalent. */
export const toJalali = ({ year, month, day }: CivilDate): CivilDate => {
  const jdn = gregorianToJdn(year, month, day);
  const gy = jdnToGregorian(jdn).year;
  let jy = gy - 621;
  const facts = yearFacts(jy);
  let k = jdn - gregorianToJdn(gy, 3, facts.march);

  if (k >= 0) {
    if (k <= 185) {
      return { year: jy, month: 1 + div(k, 31), day: mod(k, 31) + 1 };
    }
    k -= 186;
  } else {
    // Before ۱ فروردین: the day belongs to the second half of the year before.
    jy -= 1;
    k += 179;
    if (facts.leap === 1) k += 1;
  }

  return { year: jy, month: 7 + div(k, 30), day: mod(k, 30) + 1 };
};

/** Converts a Jalali civil date to its Gregorian equivalent. */
export const toGregorian = ({ year, month, day }: CivilDate): CivilDate =>
  jdnToGregorian(jalaliToJdn(year, month, day));

/**
 * Which weekday column ۱ of this Jalali month starts in.
 *
 * @returns 0 for شنبه through 6 for جمعه, matching {@link JALALI_WEEKDAYS}.
 */
export const jalaliMonthOffset = (jy: number, jm: number) =>
  // The Julian day number is 0 on a Monday, and شنبه is two days earlier.
  mod(jalaliToJdn(jy, jm, 1) + 2, 7);

/** `YYYY-MM-DD`, the value an `<input type="date">` and this panel's URLs use. */
export const toIsoDate = ({ year, month, day }: CivilDate) =>
  `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

/**
 * Parses `YYYY-MM-DD` into a Gregorian civil date.
 *
 * @param value - A date string, or anything else that arrived in the URL.
 * @returns The parsed date, or null when the string is not one.
 */
export const parseIsoDate = (value: string): CivilDate | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;

  const date = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
  if (date.month < 1 || date.month > 12 || date.day < 1 || date.day > 31) {
    return null;
  }
  // 31 آبان and 2026-02-31 both parse; only a round trip catches the second.
  const jalali = toJalali(date);
  if (jalali.year < MIN_YEAR || jalali.year > MAX_YEAR) return null;
  const back = toGregorian(jalali);
  return back.year === date.year &&
    back.month === date.month &&
    back.day === date.day
    ? date
    : null;
};

/** Today, as a Gregorian civil date in the viewer's own timezone. */
export const todayCivil = (now = new Date()): CivilDate => ({
  year: now.getFullYear(),
  month: now.getMonth() + 1,
  day: now.getDate(),
});

/** «۱۳ شهریور ۱۴۰۵» — how a chosen date reads on the button that opens the picker. */
export const faJalaliLabel = (date: CivilDate) => {
  const { year, month, day } = toJalali(date);
  const digits = (v: number) =>
    String(v).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]!);
  return `${digits(day)} ${JALALI_MONTHS[month - 1]} ${digits(year)}`;
};
