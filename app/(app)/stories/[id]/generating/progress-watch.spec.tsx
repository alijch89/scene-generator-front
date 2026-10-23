import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type {
  GenerationFailureCode,
  StoryDto,
  StoryProgressDto,
} from '@/lib/types';
import { ProgressWatch } from './progress-watch';

const router = { replace: jest.fn(), refresh: jest.fn() };
jest.mock('next/navigation', () => ({ useRouter: () => router }));

const raw =
  'ProviderFailure: OpenRouter image failed (400): Your request was rejected by the safety system. Contact help.openai.com with request ID req_356c07e8acb344d2a5487149f3259a05.';
const story = {
  id: 'story-1',
  childId: 'child-1',
  voice: 'MARYAM',
} as StoryDto;
const failed = (failureCode?: GenerationFailureCode): StoryProgressDto => ({
  status: 'FAILED',
  failureReason: raw,
  failureCode,
  orderId: 'order-1',
  percent: 0,
  stages: [],
});

describe('generation error screen', () => {
  beforeEach(() => jest.clearAllMocks());
  it.each([undefined, 'CONTENT_RESTRICTED' as const])(
    'never renders raw provider text for initial failures, including an old server response (%s)',
    (failureCode) => {
      const { container } = render(
        <ProgressWatch
          story={story}
          child={null}
          initial={failed(failureCode)}
        />,
      );
      expect(screen.getByRole('alert')).toHaveTextContent(
        failureCode ? 'بررسی ایمنی' : 'ساخت ویدیو با مشکلی',
      );
      expect(container.textContent).not.toMatch(
        /OpenRouter|ProviderFailure|400|req_356|help\.openai\.com/,
      );
    },
  );

  it('also blocks raw details in a live failure update and closes the stream', () => {
    const close = jest.fn();
    let source: {
      onmessage?: (event: { data: string }) => void;
      onerror?: () => void;
      close: () => void;
    };
    const original = globalThis.EventSource;
    Object.defineProperty(globalThis, 'EventSource', {
      configurable: true,
      writable: true,
      value: jest.fn().mockImplementation(() => {
        source = { close };
        return source;
      }),
    });
    try {
      const { container } = render(
        <ProgressWatch
          story={story}
          child={null}
          initial={{ ...failed(), failureReason: null, status: 'GENERATING' }}
        />,
      );
      act(() =>
        source.onmessage?.({
          data: JSON.stringify(failed('CONTENT_RESTRICTED')),
        }),
      );
      expect(screen.getByRole('alert')).toHaveTextContent('بررسی ایمنی');
      expect(container.textContent).not.toMatch(
        /OpenRouter|ProviderFailure|req_356/,
      );
      expect(close).toHaveBeenCalled();
    } finally {
      Object.defineProperty(globalThis, 'EventSource', {
        configurable: true,
        writable: true,
        value: original,
      });
    }
  });

  it('restarts the current failed story and reconnects to progress after a successful retry', async () => {
    (global.fetch as jest.Mock).mockResolvedValue(new Response('{}'));
    const original = globalThis.EventSource;
    let source: {
      onmessage?: (event: { data: string }) => void;
      close: jest.Mock;
    };
    Object.defineProperty(globalThis, 'EventSource', {
      configurable: true,
      writable: true,
      value: jest.fn().mockImplementation(() => {
        source = { close: jest.fn() };
        return source;
      }),
    });
    try {
      const user = userEvent.setup();
      render(
        <ProgressWatch
          story={story}
          child={null}
          initial={{ ...failed(), canRetry: true }}
        />,
      );
      await user.click(
        screen.getByRole('button', { name: 'تلاش دوباره بدون پرداخت' }),
      );

      await waitFor(() =>
        expect(
          screen.getByRole('heading', { name: /در حال ساختن قصه/ }),
        ).toBeInTheDocument(),
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/stories/story-1/retry'),
        expect.objectContaining({ method: 'POST' }),
      );
      expect(globalThis.EventSource).toHaveBeenCalled();
      act(() =>
        source.onmessage?.({
          data: JSON.stringify({
            ...failed(),
            status: 'READY',
            failureReason: null,
            canRetry: false,
          }),
        }),
      );
      expect(router.replace).toHaveBeenCalledWith('/stories/story-1/ready');
    } finally {
      Object.defineProperty(globalThis, 'EventSource', {
        configurable: true,
        writable: true,
        value: original,
      });
    }
  });
});
