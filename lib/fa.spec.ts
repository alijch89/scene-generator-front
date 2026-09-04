import { iranDayBound } from './fa';

/**
 * The rest of `fa.ts` asserts itself on import, because it is formatting and
 * a wrong separator is visible. This one is arithmetic against a timezone the
 * test machine is almost certainly not in, which is exactly the case those
 * assertions cannot cover.
 */
describe('iranDayBound', () => {
  it('starts the day at midnight in Tehran, not in the server’s zone', () => {
    // Iran is UTC+03:30 and dropped daylight saving in 2022, so a day there
    // begins at 20:30 UTC on the day before.
    expect(iranDayBound('2026-09-04', 'start')).toBe('2026-09-03T20:30:00.000Z');
    expect(iranDayBound('2026-01-01', 'start')).toBe('2025-12-31T20:30:00.000Z');
  });

  it('ends the day on its last millisecond, so «تا» includes it', () => {
    expect(iranDayBound('2026-09-04', 'end')).toBe('2026-09-04T20:29:59.999Z');
  });

  it('bounds a whole day between the two edges', () => {
    const start = Date.parse(iranDayBound('2026-09-04', 'start'));
    const end = Date.parse(iranDayBound('2026-09-04', 'end'));
    expect(end - start).toBe(86_400_000 - 1);
  });

  it('is unaffected by the process timezone', () => {
    // The panel renders on a server that is almost always UTC and is read by
    // operators who never are; the bound must not depend on which.
    const original = process.env.TZ;
    try {
      process.env.TZ = 'America/Los_Angeles';
      expect(iranDayBound('2026-09-04', 'start')).toBe(
        '2026-09-03T20:30:00.000Z',
      );
    } finally {
      process.env.TZ = original;
    }
  });

  it('returns nothing for a value that is not a day', () => {
    expect(iranDayBound('', 'start')).toBe('');
    expect(iranDayBound('nope', 'start')).toBe('');
    expect(iranDayBound('2026-9-4', 'start')).toBe('');
    expect(iranDayBound('2026-09-04T10:00:00Z', 'start')).toBe('');
  });
});
