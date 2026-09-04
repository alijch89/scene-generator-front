import { render, screen, within } from '@testing-library/react';
import { AdminHeader, Pagination } from './ui';

describe('Pagination', () => {
  const href = (page: number) => `/admin/audit?page=${page}`;

  it('draws nothing when everything fits on one page', () => {
    const { container } = render(
      <Pagination page={1} pageCount={1} href={href} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('offers a numbered link per page, marking the current one', () => {
    render(<Pagination page={2} pageCount={4} total={140} href={href} />);

    const nav = screen.getByRole('navigation', { name: 'صفحه‌بندی' });
    const pages = within(nav).getAllByRole('listitem');
    expect(pages).toHaveLength(4);

    const current = within(nav).getByRole('link', { name: 'صفحهٔ ۲' });
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current).toHaveAttribute('href', '/admin/audit?page=2');
    expect(nav).toHaveTextContent('۱۴۰ ردیف');
  });

  it('keeps the first and last page reachable from the middle of a long run', () => {
    render(<Pagination page={50} pageCount={100} href={href} />);

    const nav = screen.getByRole('navigation', { name: 'صفحه‌بندی' });
    // Finding the oldest retained event should not cost fifty clicks.
    expect(within(nav).getByRole('link', { name: 'صفحهٔ ۱' })).toBeInTheDocument();
    expect(
      within(nav).getByRole('link', { name: 'صفحهٔ ۱۰۰' }),
    ).toBeInTheDocument();
    expect(
      within(nav).queryByRole('link', { name: 'صفحهٔ ۲۵' }),
    ).not.toBeInTheDocument();
    expect(within(nav).getAllByText('…')).toHaveLength(2);
  });

  it('disables the step that would leave the run', () => {
    render(<Pagination page={1} pageCount={3} href={href} />);
    expect(screen.getByRole('link', { name: 'قبلی' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(screen.getByRole('link', { name: 'بعدی' })).toHaveAttribute(
      'aria-disabled',
      'false',
    );
  });
});

describe('AdminHeader', () => {
  it('pins actions to the far end and leaves filters beside the title', () => {
    const { container } = render(
      <AdminHeader
        title="گزارش رخدادها"
        actions={<a href="/export">خروجی اکسل</a>}
      >
        <span>فیلترها</span>
      </AdminHeader>,
    );

    // On an RTL page `ms-auto` is the left edge; only one group may claim it,
    // or the filters drift away from the heading they narrow.
    const groups = container.firstElementChild!.querySelectorAll(':scope > div');
    expect(groups).toHaveLength(2);
    expect(groups[0]).not.toHaveClass('ms-auto');
    expect(groups[1]).toHaveClass('ms-auto');
    expect(groups[1]).toHaveTextContent('خروجی اکسل');
  });

  it('still pushes lone children to the far end, as every other table does', () => {
    const { container } = render(
      <AdminHeader title="کاربران">
        <span>فیلترها</span>
      </AdminHeader>,
    );

    expect(
      container.firstElementChild!.querySelector(':scope > div'),
    ).toHaveClass('ms-auto');
  });
});
