import { render, screen } from '@testing-library/react';
import NotFound from './not-found';

describe('NotFound', () => {
  it('offers clear routes back into the application', () => {
    render(<NotFound />);

    expect(
      screen.getByRole('heading', { name: 'این صفحه توی قصه نیست!' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'بازگشت به خانه' }),
    ).toHaveAttribute('href', '/');
    expect(
      screen.getByRole('link', { name: /ساخت یک قصهٔ تازه/ }),
    ).toHaveAttribute('href', '/wizard');
  });
});
