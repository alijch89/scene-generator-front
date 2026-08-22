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

  test('completes phone registration against the real Nest API', async ({ page }) => {
    test.skip(
      process.env.FULL_STACK_E2E !== '1',
      'Set FULL_STACK_E2E=1 with the Nest API and test database running.',
    );
    const phone = `09${String(Date.now()).slice(-9)}`;

    await page.goto('/register');
    await page.getByPlaceholder('09123456789').fill(phone);
    await page.getByPlaceholder('سحر رضایی').fill('والد مرورگر');
    await page.getByRole('button', { name: 'دریافت کد' }).click();

    await expect(page).toHaveURL(/\/verify-phone\?/);
    // The UI's deterministic mock SMS still exchanges the real registration
    // token with Nest; no API response is mocked in this journey.
    await expect(page).toHaveURL(/\/set-password$/, { timeout: 10_000 });
  });
});
