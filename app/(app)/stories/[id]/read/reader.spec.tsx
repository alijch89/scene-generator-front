import { act, render, screen } from '@testing-library/react';
import type { StoryDto } from '@/lib/types';
import { Reader } from './reader';

const story = {
  id: 'story-1',
  title: 'قصهٔ آوا',
  lastReadPage: 0,
  durationSec: 42,
  theme: 'TEAMWORK',
  voice: 'MARYAM',
} as StoryDto;

it('plays a completed video without requiring reader pages or recording a nonexistent page', () => {
  jest.useFakeTimers();
  (global.fetch as jest.Mock).mockClear();
  try {
    const { container } = render(
      <Reader story={story} pages={[]} autoPlay={false} />,
    );

    expect(container.querySelector('video')).toHaveAttribute(
      'src',
      expect.stringContaining('/stories/story-1/video'),
    );
    expect(screen.getByRole('button', { name: 'پخش روایت' })).toBeEnabled();
    expect(
      screen.queryByRole('button', { name: 'صفحهٔ بعد' }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/صفحهٔ/)).not.toBeInTheDocument();
    act(() => jest.advanceTimersByTime(1000));
    expect(global.fetch).not.toHaveBeenCalled();
  } finally {
    jest.useRealTimers();
  }
});
