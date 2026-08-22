import { render, screen } from '@testing-library/react';
import { StatusBadge } from './status-badge';

describe('StatusBadge', () => {
  it('renders the status text and optional non-colour icon', () => {
    render(
      <StatusBadge tone="success" icon="✓">
        پرداخت شد
      </StatusBadge>,
    );
    expect(screen.getByText('پرداخت شد')).toBeInTheDocument();
    expect(screen.getByText('✓')).toHaveAttribute('aria-hidden', 'true');
  });
});
