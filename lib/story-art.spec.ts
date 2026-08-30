import { coverFor, FAILED_COVER, LENGTH_LABEL, STATUS_LABEL, WIZARD_THEMES } from './story-art';

describe('story presentation data', () => {
  it('uses the failed cover for failed stories and theme covers otherwise', () => {
    expect(coverFor('HONESTY', 'FAILED')).toBe(FAILED_COVER);
    expect(coverFor('HONESTY', 'READY')).toContain('linear-gradient');
  });

  it('keeps length labels and page counts consistent with the product contract', () => {
    expect(LENGTH_LABEL.SHORT).toContain('۵ صفحه');
    expect({ SHORT: 5, MEDIUM: 10, LONG: 16 }).toEqual({ SHORT: 5, MEDIUM: 10, LONG: 16 });
    expect(STATUS_LABEL.READY).toBe('آماده');
  });

  it('offers the own-idea theme as well as predefined adventures', () => {
    expect(WIZARD_THEMES.map((theme) => theme.id)).toContain('OWN');
    expect(WIZARD_THEMES).toHaveLength(9);
  });
});
