import { render, screen } from '@testing-library/react';
import { GenerationApiCalls } from './generation-api-calls';
import type { AdminGenerationApiCall } from '@/lib/types';

const call: AdminGenerationApiCall = {
  id: 'call-1',
  storyId: 'story-1',
  runId: 'run-1',
  userId: 'user-1',
  childId: 'child-1',
  orderId: 'order-1',
  context: {
    user: { fullName: 'والد' },
    child: { firstName: 'آوا' },
    order: { paymentRef: 'bank-123' },
  },
  operation: 'submit',
  providerJobRef: 'provider-job-1',
  method: 'POST',
  url: 'https://provider.example/jobs',
  requestBody: {
    topic: 'فضا',
    child_photo: { filename: 'photo.png', size: 100, sha256: 'photo-hash' },
  },
  responseBody: {
    job_id: 'provider-job-1',
    detail: '<script>window.compromised = true</script>',
  },
  responseStatus: 200,
  error: null,
  startedAt: '2026-10-23T08:00:00Z',
  endedAt: '2026-10-23T08:00:01Z',
  durationMs: 1000,
};

describe('stored provider exchanges', () => {
  it('shows original payloads as escaped text alongside bank and run references', () => {
    const { container } = render(<GenerationApiCalls calls={[call]} />);
    expect(screen.getByText(/window.compromised/)).toBeInTheDocument();
    expect(container.querySelector('script')).toBeNull();
    expect(screen.getByText(/photo-hash/)).toBeInTheDocument();
    expect(screen.getByText(/bank-123/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'order-1' })).toHaveAttribute(
      'href',
      '/admin/payments/order-1',
    );
    expect(screen.getByText('run-1')).toBeInTheDocument();
  });

  it('distinguishes an interrupted call from a recorded rejection without losing raw error data', () => {
    const { rerender } = render(
      <GenerationApiCalls
        calls={[
          {
            ...call,
            responseStatus: null,
            responseBody: null,
            endedAt: null,
            durationMs: null,
          },
        ]}
      />,
    );
    expect(screen.getByText('هنوز پاسخی ثبت نشده')).toBeInTheDocument();
    rerender(
      <GenerationApiCalls
        calls={[
          {
            ...call,
            responseStatus: 422,
            responseBody: { detail: 'provider rejection' },
            error: 'HTTP 422',
          },
        ]}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('HTTP 422');
    expect(screen.getByText(/provider rejection/)).toBeInTheDocument();
  });

  it('explains why historical calls cannot be recovered', () => {
    render(<GenerationApiCalls calls={[]} />);
    expect(
      screen.getByText(/پاسخ‌های پیش از فعال‌شدن ثبت سابقه/),
    ).toBeInTheDocument();
  });
});
