import { proxy } from './proxy';

jest.mock('next/server', () => ({
  NextResponse: {
    redirect: (url: URL) => ({
      status: 307,
      headers: {
        get: (name: string) => (name === 'location' ? url.toString() : null),
      },
    }),
    next: () => ({ status: 200, headers: { get: () => null } }),
  },
}));

const requestFor = (path: string, cookies: Record<string, string> = {}) => {
  const nextUrl = new URL(`http://localhost${path}`) as URL & {
    clone: () => URL;
  };
  nextUrl.clone = () => {
    const clone = new URL(nextUrl.toString()) as URL & { clone: () => URL };
    clone.clone = () => new URL(clone.toString());
    return clone;
  };
  return {
    nextUrl,
    cookies: {
      get: (name: string) =>
        cookies[name] ? { value: cookies[name] } : undefined,
    },
  } as unknown as Parameters<typeof proxy>[0];
};

describe('route proxy', () => {
  it('redirects an anonymous visitor from protected parent routes to login', () => {
    const response = proxy(requestFor('/library'));
    expect(response.headers.get('location')).toBe(
      'http://localhost/login?reason=expired&next=%2Flibrary',
    );
  });

  it('keeps a forged parent role hint out of the admin area', () => {
    const response = proxy(
      requestFor('/admin', { sid: 'session', role: 'User' }),
    );
    expect(response.headers.get('location')).toBe('http://localhost/dashboard');
  });

  it('redirects an authenticated parent away from auth pages', () => {
    const response = proxy(
      requestFor('/login', { sid: 'session', role: 'User' }),
    );
    expect(response.headers.get('location')).toBe('http://localhost/dashboard');
  });

  it('allows public routes through without cookies', () => {
    expect(proxy(requestFor('/features')).status).toBe(200);
  });

  it('sends an anonymous visitor away from the forced password change', () => {
    const response = proxy(requestFor('/change-password'));
    expect(response.headers.get('location')).toBe(
      'http://localhost/login?reason=expired&next=%2Fchange-password',
    );
  });

  it.each([['User'], ['Admin']])(
    'lets a signed-in %s reach the forced password change',
    (role) => {
      // Neither half of the product owns this route: whether the change is
      // actually owed is decided by the page, which can read the account.
      expect(
        proxy(requestFor('/change-password', { sid: 'session', role })).status,
      ).toBe(200);
    },
  );
});
