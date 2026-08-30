import { expect, test } from '@playwright/test';

test.describe('public and protected browser journeys', () => {
  test('renders the public landing page and exposes the registration CTA', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /کودک شما قهرمان قصهٔ خودش می‌شود/ })).toBeVisible();
    await page.getByRole('link', { name: 'ساخت حساب رایگان' }).click();
    await expect(page).toHaveURL(/\/register$/);
    await expect(page.getByRole('heading', { name: 'حساب خانوادگی بسازید' })).toBeVisible();
  });

  test('redirects an anonymous visitor from a protected route to login', async ({ page }) => {
    await page.goto('/library');

    await expect(page).toHaveURL(/\/login\?reason=expired&next=%2Flibrary$/);
    await expect(page.getByRole('heading', { name: 'خوش آمدید' })).toBeVisible();
  });

  test('shows browser validation before submitting an incomplete login form', async ({ page }) => {
    await page.goto('/login');

    await page.getByRole('button', { name: 'ورود' }).click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toHaveAttribute('required', '');
  });

  test('completes registration against the real Nest API', async ({ page }) => {
    test.skip(
      process.env.FULL_STACK_E2E !== '1',
      'Set FULL_STACK_E2E=1 with the Nest API and test database running.',
    );
    const phone = `09${String(Date.now()).slice(-9)}`;
    const password = 'browser-journey-password';

    await page.goto('/register');
    await page.getByPlaceholder('09123456789').fill(phone);
    await page.getByPlaceholder('سحر رضایی').fill('والد مرورگر');
    await page.getByPlaceholder('حداقل ۸ نویسه').fill(password);
    await page.getByPlaceholder('••••••••').fill(password);
    await page.getByRole('button', { name: 'ساخت حساب' }).click();

    // Registration is the whole of signing up now — the session comes back
    // with the account, so this lands in the product. No API is mocked.
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 10_000 });
  });

  test('reveals a password when the eye beside the field is pressed', async ({
    page,
  }) => {
    await page.goto('/login');

    const field = page.locator('input[name="password"]');
    await expect(field).toHaveAttribute('type', 'password');
    await page.getByRole('button', { name: 'نمایش گذرواژه' }).click();
    await expect(field).toHaveAttribute('type', 'text');
    await page.getByRole('button', { name: 'پنهان کردن گذرواژه' }).click();
    await expect(field).toHaveAttribute('type', 'password');
  });
});
