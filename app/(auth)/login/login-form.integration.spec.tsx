import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './login-form';

const router = {
  replace: jest.fn(),
  push: jest.fn(),
  refresh: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useRouter: () => router,
}));

describe('LoginForm integration', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    router.replace.mockReset();
    router.push.mockReset();
    router.refresh.mockReset();
  });

  it('maps an API credential failure to the user-facing invalid state', async () => {
    const user = userEvent.setup();
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({ code: 'INVALID_CREDENTIALS', message: 'invalid' }),
        {
          status: 401,
          statusText: 'Unauthorized',
        },
      ),
    );
    render(<LoginForm initialStatus="idle" />);

    await user.type(screen.getByPlaceholderText('09123456789'), '09123456789');
    await user.type(screen.getByPlaceholderText('••••••••'), 'wrong-password');
    await user.click(screen.getByRole('button', { name: 'ورود' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'شمارهٔ موبایل یا گذرواژه درست نیست',
    );
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('refreshes server-rendered state after successful password login', async () => {
    const user = userEvent.setup();
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          user: {
            id: 'user-1',
            fullName: 'سارا',
            phone: '09123456789',
            roles: ['User'],
            role: 'User',
            phoneVerified: true,
            mustChangePassword: false,
            prefs: {},
            createdAt: '2026-01-01T00:00:00.000Z',
          },
        }),
        { status: 200 },
      ),
    );
    render(<LoginForm initialStatus="idle" />);

    await user.type(screen.getByPlaceholderText('09123456789'), '09123456789');
    await user.type(
      screen.getByPlaceholderText('••••••••'),
      'correct-password',
    );
    await user.click(screen.getByRole('button', { name: 'ورود' }));

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/dashboard');
      expect(router.refresh).toHaveBeenCalled();
    });
  });

  it('sends an account owing an administrator reset to «تغییر گذرواژه»', async () => {
    const user = userEvent.setup();
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          user: {
            id: 'user-1',
            fullName: 'سارا',
            phone: '09123456789',
            roles: ['User'],
            role: 'User',
            phoneVerified: true,
            mustChangePassword: true,
            prefs: {},
            createdAt: '2026-01-01T00:00:00.000Z',
          },
        }),
        { status: 200 },
      ),
    );
    // Even with somewhere else to go, the forced change wins.
    render(<LoginForm initialStatus="idle" next="/library" />);

    await user.type(screen.getByPlaceholderText('09123456789'), '09123456789');
    await user.type(
      screen.getByPlaceholderText('••••••••'),
      'admin-issued-password',
    );
    await user.click(screen.getByRole('button', { name: 'ورود' }));

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/change-password');
    });
  });
});
