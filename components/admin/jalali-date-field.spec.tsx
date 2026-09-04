import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JalaliDateField } from './jalali-date-field';

/** Reads the value the surrounding GET form would actually submit. */
const submitted = (container: HTMLElement, name: string) =>
  container.querySelector<HTMLInputElement>(`input[name="${name}"]`)?.value;

describe('JalaliDateField', () => {
  beforeEach(() => {
    jest.useFakeTimers({
      // ۱۳ شهریور ۱۴۰۵. The picker opens on «today» when nothing is chosen,
      // so the month it lands in has to be a fact rather than the clock.
      now: new Date('2026-09-04T09:00:00.000Z'),
      advanceTimers: true,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows an existing Gregorian value as its Jalali date', () => {
    render(
      <JalaliDateField name="from" label="از تاریخ" defaultValue="2026-09-04" />,
    );

    expect(
      screen.getByRole('button', { name: 'از تاریخ' }),
    ).toHaveTextContent('۱۳ شهریور ۱۴۰۵');
  });

  it('submits nothing when no date is chosen', () => {
    const { container } = render(
      <JalaliDateField name="from" label="از تاریخ" placeholder="از تاریخ" />,
    );

    expect(submitted(container, 'from')).toBe('');
    expect(screen.getByRole('button', { name: 'از تاریخ' })).toHaveTextContent(
      'از تاریخ',
    );
  });

  it('ignores a value the URL carried that is not a date', () => {
    const { container } = render(
      <JalaliDateField name="from" label="از تاریخ" defaultValue="2026-02-31" />,
    );

    expect(submitted(container, 'from')).toBe('');
  });

  it('submits the Gregorian day behind the Jalali one that was clicked', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const { container } = render(
      <JalaliDateField name="from" label="از تاریخ" defaultValue="2026-09-04" />,
    );

    await user.click(screen.getByRole('button', { name: 'از تاریخ' }));
    const calendar = screen.getByRole('dialog', { name: 'از تاریخ' });
    await user.click(within(calendar).getByRole('button', { name: '۱' }));

    // ۱ شهریور ۱۴۰۵ is 2026-08-23, which is the whole point of the control.
    expect(submitted(container, 'from')).toBe('2026-08-23');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('offers every Jalali month and a run of years to pick from', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<JalaliDateField name="from" label="از تاریخ" />);

    await user.click(screen.getByRole('button', { name: 'از تاریخ' }));
    const calendar = screen.getByRole('dialog', { name: 'از تاریخ' });

    const months = within(calendar).getByRole('combobox', { name: 'ماه' });
    expect(within(months).getAllByRole('option')).toHaveLength(12);
    expect(months).toHaveValue('6');

    const years = within(calendar).getByRole('combobox', { name: 'سال' });
    expect(within(years).getAllByRole('option').length).toBeGreaterThan(15);
    expect(years).toHaveValue('1405');
  });

  it('moves the grid when the year and month are changed', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const { container } = render(
      <JalaliDateField name="to" label="تا تاریخ" />,
    );

    await user.click(screen.getByRole('button', { name: 'تا تاریخ' }));
    const calendar = screen.getByRole('dialog', { name: 'تا تاریخ' });

    await user.selectOptions(
      within(calendar).getByRole('combobox', { name: 'ماه' }),
      '12',
    );
    await user.selectOptions(
      within(calendar).getByRole('combobox', { name: 'سال' }),
      '1403',
    );

    // اسفند ۱۴۰۳ is a leap اسفند: thirty days, ending on 2025-03-20.
    await user.click(within(calendar).getByRole('button', { name: '۳۰' }));
    expect(submitted(container, 'to')).toBe('2025-03-20');
  });

  it('gives اسفند twenty-nine days in a common year', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<JalaliDateField name="to" label="تا تاریخ" />);

    await user.click(screen.getByRole('button', { name: 'تا تاریخ' }));
    const calendar = screen.getByRole('dialog', { name: 'تا تاریخ' });
    await user.selectOptions(
      within(calendar).getByRole('combobox', { name: 'ماه' }),
      '12',
    );
    await user.selectOptions(
      within(calendar).getByRole('combobox', { name: 'سال' }),
      '1404',
    );

    expect(
      within(calendar).queryByRole('button', { name: '۳۰' }),
    ).not.toBeInTheDocument();
    expect(
      within(calendar).getByRole('button', { name: '۲۹' }),
    ).toBeInTheDocument();
  });

  it('steps a month at a time in the direction the arrow points', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<JalaliDateField name="from" label="از تاریخ" />);

    await user.click(screen.getByRole('button', { name: 'از تاریخ' }));
    const calendar = screen.getByRole('dialog', { name: 'از تاریخ' });
    const months = within(calendar).getByRole('combobox', { name: 'ماه' });

    await user.click(within(calendar).getByRole('button', { name: 'ماه قبل' }));
    expect(months).toHaveValue('5');
    await user.click(within(calendar).getByRole('button', { name: 'ماه بعد' }));
    await user.click(within(calendar).getByRole('button', { name: 'ماه بعد' }));
    expect(months).toHaveValue('7');
  });

  it('clears the filter without opening the calendar', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const { container } = render(
      <JalaliDateField name="from" label="از تاریخ" defaultValue="2026-09-04" />,
    );

    await user.click(screen.getByRole('button', { name: 'پاک کردن از تاریخ' }));

    expect(submitted(container, 'from')).toBe('');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on Escape without changing what is submitted', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const { container } = render(
      <JalaliDateField name="from" label="از تاریخ" defaultValue="2026-09-04" />,
    );

    await user.click(screen.getByRole('button', { name: 'از تاریخ' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(submitted(container, 'from')).toBe('2026-09-04');
    expect(screen.getByRole('button', { name: 'از تاریخ' })).toHaveFocus();
  });
});
