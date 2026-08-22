import { homeFor } from './session';

describe('session routing', () => {
  it('sends administrators to the admin panel and parents to the dashboard', () => {
    expect(homeFor('SuperAdmin')).toBe('/admin');
    expect(homeFor('Admin')).toBe('/admin');
    expect(homeFor('User')).toBe('/dashboard');
  });
});
