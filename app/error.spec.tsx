import { fireEvent, render, screen } from '@testing-library/react';
import RootError from './error';

describe('RootError', () => {
  afterEach(() => jest.restoreAllMocks());

  it('reports the error and retries the failed route', () => {
    const retry = jest.fn();
    const report = jest.spyOn(console, 'error').mockImplementation(() => {});
    const error = Object.assign(new Error('failed'), { digest: 'error-id' });

    render(<RootError error={error} retry={retry} />);
    fireEvent.click(screen.getByRole('button', { name: 'تلاش دوباره' }));

    expect(report).toHaveBeenCalledWith('failed [error-id]');
    expect(retry).toHaveBeenCalledTimes(1);
  });
});
