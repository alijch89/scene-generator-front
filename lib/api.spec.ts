import { ApiError, request } from './api';

const response = (payload: unknown, status: number, statusText = '') =>
  ({
    status,
    statusText,
    ok: status >= 200 && status < 300,
    json: async () => payload,
  }) as Response;

describe('request', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('serializes JSON, includes credentials, and returns a parsed response', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(
      response({ id: 'story-1' }, 200),
    );

    await expect(
      request('/stories', {
        method: 'POST',
        body: { theme: 'SPACE' },
        cookie: 'sid=session-token',
      }),
    ).resolves.toEqual({ id: 'story-1' });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/api\/stories$/),
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ theme: 'SPACE' }),
        headers: expect.objectContaining({
          'content-type': 'application/json',
          cookie: 'sid=session-token',
        }),
      }),
    );
  });

  it('returns undefined for a successful 204 response', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(response(undefined, 204));
    await expect(request('/auth/logout', { method: 'POST' })).resolves.toBeUndefined();
  });

  it('maps API error arrays and preserves status and payload', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(
      response(
        { message: ['phone is invalid', 'name is short'], code: 'VALIDATION' },
        400,
        'Bad Request',
      ),
    );

    await expect(request('/auth/register', { method: 'POST', body: {} })).rejects.toEqual(
      expect.objectContaining<ApiError>({
        name: 'ApiError',
        status: 400,
        message: 'phone is invalid، name is short',
        body: { message: ['phone is invalid', 'name is short'], code: 'VALIDATION' },
      }),
    );
  });
});
