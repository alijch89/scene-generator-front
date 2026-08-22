import '@testing-library/jest-dom';

// `server-only` is a compile-time guard in Next.js. It has no runtime behavior
// in a Jest process, so the test environment supplies the minimal module shim.
jest.mock('server-only', () => ({}));

// jsdom deliberately does not provide the browser fetch API. The request
// tests replace this deterministic placeholder with their own response.
Object.defineProperty(globalThis, 'fetch', {
  configurable: true,
  writable: true,
  value: jest.fn(),
});

class TestResponse {
  readonly status: number;
  readonly statusText: string;
  readonly ok: boolean;
  private readonly body: unknown;

  constructor(body: unknown, init: { status?: number; statusText?: string } = {}) {
    this.body = body;
    this.status = init.status ?? 200;
    this.statusText = init.statusText ?? '';
    this.ok = this.status >= 200 && this.status < 300;
  }

  async json() {
    if (typeof this.body === 'string') return JSON.parse(this.body);
    return this.body;
  }
}

Object.defineProperty(globalThis, 'Response', {
  configurable: true,
  writable: true,
  value: TestResponse,
});
