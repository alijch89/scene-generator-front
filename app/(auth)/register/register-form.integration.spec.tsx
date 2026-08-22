import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterForm } from './register-form';

const router = { push: jest.fn() };

jest.mock('next/navigation', () => ({
  useRouter: () => router,
}));

describe('RegisterForm integration', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    router.push.mockReset();
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

    await user.type(screen.getByPlaceholderText('09123456789'), '09123456789');
    await user.click(screen.getByRole('button', { name: 'دریافت کد' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('این شماره قبلاً ثبت شده');
    expect(router.push).not.toHaveBeenCalled();
  });

  it('posts registration details and hands the user to phone verification', async () => {
    const user = userEvent.setup();
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ devToken: 'verify-token' }), { status: 201 }),
    );
    render(<RegisterForm />);

    await user.type(screen.getByPlaceholderText('09123456789'), '09123456789');
    await user.type(screen.getByPlaceholderText('سحر رضایی'), 'سارا');
    await user.click(screen.getByRole('button', { name: 'دریافت کد' }));

    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith(
        '/verify-phone?phone=09123456789&mode=signup&token=verify-token',
      );
    });
  });
});
