import { render, screen } from '@testing-library/react';
import Loading from './loading';

describe('Loading', () => {
  it('announces the global loading state accessibly', () => {
    render(<Loading />);

    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveAttribute('aria-busy', 'true');
    expect(
      screen.getByRole('heading', { name: 'داریم صفحه را آماده می‌کنیم…' }),
    ).toBeInTheDocument();
  });
});
