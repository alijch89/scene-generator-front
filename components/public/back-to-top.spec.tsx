import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BackToTopButton } from './back-to-top';

describe('BackToTopButton', () => {
  it('smoothly scrolls to the top on every click', async () => {
    const user = userEvent.setup();
    const scrollTo = jest.fn();

    Object.defineProperty(window, 'scrollTo', {
      configurable: true,
      value: scrollTo,
    });
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: jest.fn().mockReturnValue({ matches: false }),
    });

    render(<BackToTopButton />);
    const button = screen.getByRole('button', { name: 'بازگشت به بالا' });

    await user.click(button);
    await user.click(button);

    expect(scrollTo).toHaveBeenCalledTimes(2);
    expect(scrollTo).toHaveBeenNthCalledWith(1, {
      top: 0,
      behavior: 'smooth',
    });
    expect(scrollTo).toHaveBeenNthCalledWith(2, {
      top: 0,
      behavior: 'smooth',
    });
  });
});
