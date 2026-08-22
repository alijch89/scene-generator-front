import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Alert, Field, Input, SubmitButton, Toggle } from './form';

describe('shared form controls', () => {
  it('renders alerts as assistive error content', () => {
    render(<Alert tone="error" icon="!">شماره درست نیست</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('شماره درست نیست');
  });

  it('associates a field label with its input and exposes invalid state', () => {
    render(
      <Field label="شمارهٔ موبایل">
        <Input aria-label="شمارهٔ موبایل" invalid name="phone" />
      </Field>,
    );
    expect(screen.getByRole('textbox', { name: 'شمارهٔ موبایل' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('disables submit controls and swaps their label while loading', () => {
    render(<SubmitButton loading loadingLabel="در حال ذخیره">ذخیره</SubmitButton>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveTextContent('در حال ذخیره');
  });

  it('keeps toggles keyboard and screen-reader friendly', async () => {
    const user = userEvent.setup();
    render(<Toggle label="اعلان پرداخت" aria-label="اعلان پرداخت" />);
    const checkbox = screen.getByRole('checkbox', { name: 'اعلان پرداخت' });
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});
