import {
  isJalaliLeapYear,
  jalaliMonthLength,
  jalaliMonthOffset,
  parseIsoDate,
  toGregorian,
  toIsoDate,
  toJalali,
} from './jalali';

/**
 * The calendar is arithmetic nobody can check by reading it, so it is checked
 * against ICU — which the rest of the panel already trusts for display, and
 * which is the second implementation this file would otherwise not have.
 */
const icuJalali = new Intl.DateTimeFormat('en-u-ca-persian-nu-latn', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  timeZone: 'UTC',
});

const icuWeekday = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  timeZone: 'UTC',
});

/** ICU's weekday name → the column index a Persian calendar draws it in. */
const COLUMN: Record<string, number> = {
  Sat: 0,
  Sun: 1,
  Mon: 2,
  Tue: 3,
  Wed: 4,
  Thu: 5,
  Fri: 6,
};

/**
 * Reads ICU's Persian rendering back as numbers.
 *
 * Only the three parts are kept: some ICU builds also emit an era, and the
 * comparison is against a calendar date, not against a formatting decision.
 */
const viaIcu = (at: Date) => {
  const parts = new Map(
    icuJalali.formatToParts(at).map((part) => [part.type, part.value]),
  );
  return {
    year: Number(parts.get('year')),
    month: Number(parts.get('month')),
    day: Number(parts.get('day')),
  };
};

describe('the Jalali calendar', () => {
  it('converts every day of sixty years exactly as ICU does', () => {
    const day = 86_400_000;
    let checked = 0;

    for (let t = Date.UTC(1995, 0, 1); t < Date.UTC(2055, 0, 1); t += day) {
      const at = new Date(t);
      const gregorian = {
        year: at.getUTCFullYear(),
        month: at.getUTCMonth() + 1,
        day: at.getUTCDate(),
      };

      const jalali = toJalali(gregorian);
      expect(jalali).toEqual(viaIcu(at));
      // The inverse is the half Intl cannot do, and the half a picker needs.
      expect(toGregorian(jalali)).toEqual(gregorian);
      checked += 1;
    }

    expect(checked).toBeGreaterThan(21_900);
  });

  it('ends each month on the day before the next one begins', () => {
    for (let year = 1380; year <= 1440; year += 1) {
      for (let month = 1; month <= 12; month += 1) {
        const length = jalaliMonthLength(year, month);
        const first = toGregorian({ year, month, day: 1 });
        const after = new Date(
          Date.UTC(first.year, first.month - 1, first.day + length),
        );

        expect(viaIcu(after)).toEqual({
          year: month === 12 ? year + 1 : year,
          month: month === 12 ? 1 : month + 1,
          day: 1,
        });
      }
    }
  });

  it('starts each month in the weekday column ICU puts it in', () => {
    for (let year = 1400; year <= 1420; year += 1) {
      for (let month = 1; month <= 12; month += 1) {
        const first = toGregorian({ year, month, day: 1 });
        const at = new Date(Date.UTC(first.year, first.month - 1, first.day));

        expect(jalaliMonthOffset(year, month)).toBe(
          COLUMN[icuWeekday.format(at)],
        );
      }
    }
  });

  it('gives اسفند thirty days only in a leap year', () => {
    expect(isJalaliLeapYear(1403)).toBe(true);
    expect(jalaliMonthLength(1403, 12)).toBe(30);
    expect(isJalaliLeapYear(1404)).toBe(false);
    expect(jalaliMonthLength(1404, 12)).toBe(29);
    // The six long months and the five short ones never move.
    expect(jalaliMonthLength(1405, 6)).toBe(31);
    expect(jalaliMonthLength(1405, 7)).toBe(30);
  });

  it('round-trips an ISO date, and refuses one that is not a day', () => {
    expect(parseIsoDate('2026-09-04')).toEqual({
      year: 2026,
      month: 9,
      day: 4,
    });
    expect(toIsoDate({ year: 2026, month: 9, day: 4 })).toBe('2026-09-04');
    expect(toIsoDate({ year: 2026, month: 11, day: 20 })).toBe('2026-11-20');

    // A shape the regex accepts but the calendar does not.
    expect(parseIsoDate('2026-02-31')).toBeNull();
    expect(parseIsoDate('2026-13-01')).toBeNull();
    expect(parseIsoDate('2026-9-4')).toBeNull();
    expect(parseIsoDate('')).toBeNull();
    expect(parseIsoDate('nope')).toBeNull();
  });
});
