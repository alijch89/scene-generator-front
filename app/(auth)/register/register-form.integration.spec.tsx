import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterForm } from './register-form';

const router = { replace: jest.fn(), refresh: jest.fn() };

jest.mock('next/navigation', () => ({
  useRouter: () => router,
}));

/** Fills every required box with a valid, self-consistent set of values. */
async function fillForm(
  user: ReturnType<typeof userEvent.setup>,
  { password = 'chosen-password', confirm = 'chosen-password' } = {},
) {
  await user.type(screen.getByPlaceholderText('09123456789'), '09123456789');
  await user.type(screen.getByPlaceholderText('سحر رضایی'), 'سارا');
  await user.type(screen.getByPlaceholderText('حداقل ۸ نویسه'), password);
  await user.type(screen.getByPlaceholderText('••••••••'), confirm);
}

describe('RegisterForm integration', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    router.replace.mockReset();
    router.refresh.mockReset();
  });

  it('shows a duplicate-account error returned by the API', async () => {
    const user = userEvent.setup();
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'already exists' }), {
        status: 409,
        statusText: 'Conflict',
      }),
    );
    render(<RegisterForm />);

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: 'ساخت حساب' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'این شماره قبلاً ثبت شده',
    );
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('will not submit while the confirmation does not match', async () => {
    const user = userEvent.setup();
    // A fresh jest.fn(), not the spy itself: re-spying on an already-spied
    // property hands back the existing mock, call log and all.
    const fetchMock = jest.fn();
    jest.spyOn(global, 'fetch').mockImplementation(fetchMock);
    render(<RegisterForm />);

    await fillForm(user, { confirm: 'chosen-passwrod' });
    await user.click(screen.getByRole('button', { name: 'ساخت حساب' }));

    expect(screen.getByText('گذرواژه‌ها یکی نیستند.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('posts the chosen password and follows the session it comes back with', async () => {
    const user = userEvent.setup();
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(
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
        { status: 201 },
      ),
    );
    render(<RegisterForm />);

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: 'ساخت حساب' }));

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith('/dashboard');
      expect(router.refresh).toHaveBeenCalled();
    });

    const body = JSON.parse(String(fetchSpy.mock.calls[0][1]?.body));
    expect(body).toMatchObject({
      phone: '09123456789',
      fullName: 'سارا',
      password: 'chosen-password',
      confirmPassword: 'chosen-password',
    });
  });

  it('reveals the password when the eye is pressed', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const field = screen.getByPlaceholderText('حداقل ۸ نویسه');
    expect(field).toHaveAttribute('type', 'password');

    await user.click(
      screen.getAllByRole('button', { name: 'نمایش گذرواژه' })[0],
    );
    expect(field).toHaveAttribute('type', 'text');
  });
});
