import { safeNextPath } from './safe-redirect';

describe('safeNextPath', () => {
  it('keeps ordinary in-app paths', () => {
    expect(safeNextPath('/library')).toBe('/library');
    expect(safeNextPath('/stories/abc?page=2')).toBe('/stories/abc?page=2');
  });

  it.each([
    ['//evil.example', 'protocol-relative absolute URL'],
    ['/\\evil.example', 'backslash form some browsers read as //'],
    ['https://evil.example', 'fully qualified URL'],
    ['evil.example', 'bare host'],
    ['', 'empty string'],
  ])('drops %s (%s)', (value) => {
    expect(safeNextPath(value)).toBeUndefined();
  });

  it('drops non-string values', () => {
    expect(safeNextPath(undefined)).toBeUndefined();
    expect(safeNextPath(['/library'])).toBeUndefined();
  });
});
