import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { StoryDto, StoryStatus } from '@/lib/types';
import { StoryCard } from './story-card';

const router = { refresh: jest.fn(), push: jest.fn() };
jest.mock('next/navigation', () => ({ useRouter: () => router }));

const story: StoryDto = {
  id: 'story-1',
  childId: 'child-1',
  childName: 'آوا',
  title: 'ماجرای آوا',
  theme: 'TEAMWORK',
  length: 'SHORT',
  pageCount: 5,
  tone: 'CALM',
  style: 'WATERCOLOR',
  voice: 'MARYAM',
  topic: '',
  storyConsiderations: '',
  mode: 'video',
  artStyle: '',
  desiredMoral: null,
  nScenes: 6,
  ageRange: '5-8',
  additionalCharacters: [],
  status: 'READY',
  durationSec: null,
  isFavorite: false,
  readCount: 0,
  lastReadPage: 0,
  lastReadAt: null,
  failureReason: null,
  createdAt: '2026-10-22T10:00:00.000Z',
  readyAt: null,
};

beforeAll(() => {
  HTMLDialogElement.prototype.showModal ??= function () {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close ??= function () {
    this.removeAttribute('open');
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  (global.fetch as jest.Mock).mockReset();
  (global.fetch as jest.Mock).mockResolvedValue(
    new Response(null, { status: 204 }),
  );
});

async function openDelete(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByLabelText('گزینه‌های قصهٔ ماجرای آوا'));
  await user.click(screen.getByRole('button', { name: 'حذف قصه' }));
  return screen.getByRole('dialog', { name: 'حذف قصه' });
}

const statuses: StoryStatus[] = [
  'DRAFT',
  'AWAITING_PAYMENT',
  'GENERATING',
  'READY',
  'FAILED',
];

it.each(statuses)(
  'lets the parent delete a %s story after confirmation',
  async (status) => {
    const user = userEvent.setup();
    render(<StoryCard story={{ ...story, status }} />);
    const dialog = await openDelete(user);

    expect(dialog).toHaveTextContent(story.title!);
    expect(global.fetch).not.toHaveBeenCalled();
    await user.click(
      within(dialog).getByRole('button', { name: 'بله، حذف کن' }),
    );

    await waitFor(() => expect(router.refresh).toHaveBeenCalledTimes(1));
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/stories/story-1'),
      expect.objectContaining({
        method: 'DELETE',
        credentials: 'include',
        headers: expect.objectContaining({ 'x-csrf-protection': '1' }),
      }),
    );
  },
);

it('lets the parent cancel without deleting', async () => {
  const user = userEvent.setup();
  render(<StoryCard story={story} />);
  const dialog = await openDelete(user);

  await user.click(within(dialog).getByRole('button', { name: 'انصراف' }));

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(global.fetch).not.toHaveBeenCalled();
});

it('shows a deletion error and allows another attempt', async () => {
  (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('offline'));
  const user = userEvent.setup();
  render(<StoryCard story={story} />);
  const dialog = await openDelete(user);

  await user.click(within(dialog).getByRole('button', { name: 'بله، حذف کن' }));

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'حذف قصه انجام نشد',
  );
  expect(router.refresh).not.toHaveBeenCalled();
  await user.click(within(dialog).getByRole('button', { name: 'بله، حذف کن' }));
  await waitFor(() => expect(router.refresh).toHaveBeenCalledTimes(1));
});

it('refreshes the library if another tab already deleted the story', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce(
    new Response('{}', { status: 404 }),
  );
  const user = userEvent.setup();
  render(<StoryCard story={story} />);
  const dialog = await openDelete(user);

  await user.click(within(dialog).getByRole('button', { name: 'بله، حذف کن' }));

  await waitFor(() => expect(router.refresh).toHaveBeenCalledTimes(1));
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

it('retries the same paid failed story without navigating to payment or the wizard', async () => {
  const user = userEvent.setup();
  render(<StoryCard story={{ ...story, status: 'FAILED', canRetry: true }} />);

  await user.click(
    screen.getByRole('button', { name: 'تلاش دوباره بدون پرداخت' }),
  );

  await waitFor(() =>
    expect(router.push).toHaveBeenCalledWith('/stories/story-1/generating'),
  );
  expect(global.fetch).toHaveBeenCalledWith(
    expect.stringContaining('/stories/story-1/retry'),
    expect.objectContaining({ method: 'POST' }),
  );
  expect(
    screen.queryByRole('link', { name: 'ساخت قصهٔ جدید' }),
  ).not.toBeInTheDocument();
});

it('shows retry failures and allows the parent to try again', async () => {
  (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('offline'));
  const user = userEvent.setup();
  render(<StoryCard story={{ ...story, status: 'FAILED', canRetry: true }} />);
  await user.click(
    screen.getByRole('button', { name: 'تلاش دوباره بدون پرداخت' }),
  );

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'شروع دوبارهٔ ساخت انجام نشد',
  );
  expect(router.push).not.toHaveBeenCalled();
  await user.click(
    screen.getByRole('button', { name: 'تلاش دوباره بدون پرداخت' }),
  );
  await waitFor(() => expect(router.push).toHaveBeenCalledTimes(1));
});

it('offers online viewing and downloading for ready stories and never regeneration', () => {
  render(<StoryCard story={{ ...story, status: 'READY', canRetry: true }} />);

  expect(screen.getByRole('link', { name: 'تماشای آنلاین' })).toHaveAttribute(
    'href',
    '/stories/story-1/read?play=1',
  );
  expect(
    screen.getByRole('img', { name: 'دانلود' }).closest('a'),
  ).toHaveAttribute(
    'href',
    expect.stringContaining('/stories/story-1/video?download=1'),
  );
  expect(
    screen.queryByRole('button', { name: 'تلاش دوباره بدون پرداخت' }),
  ).not.toBeInTheDocument();
});
