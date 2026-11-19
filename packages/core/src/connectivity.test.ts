import { CONNECTIVITY_CHECK_URL, isOnline } from './connectivity';

const answering = (status: number) =>
  jest.fn((_url: RequestInfo | URL, _init?: RequestInit) =>
    Promise.resolve(new Response(null, { status })),
  );

describe('isOnline', () => {
  it('is online when the check answers 204', async () => {
    const fetchImpl = answering(204);
    expect(await isOnline({ fetchImpl })).toBe(true);
    expect(fetchImpl).toHaveBeenCalledWith(
      CONNECTIVITY_CHECK_URL,
      expect.objectContaining({ cache: 'no-store' }),
    );
  });

  it('is offline behind a Wi-Fi login page (any answer other than 204)', async () => {
    expect(await isOnline({ fetchImpl: answering(200) })).toBe(false);
    expect(await isOnline({ fetchImpl: answering(302) })).toBe(false);
  });

  it('is offline when the request fails', async () => {
    const fetchImpl = jest.fn(() => Promise.reject(new TypeError('Network request failed')));
    expect(await isOnline({ fetchImpl })).toBe(false);
  });

  it('gives up after the timeout', async () => {
    jest.useFakeTimers();
    // Never answers on its own; only the abort signal ends it.
    const fetchImpl = jest.fn(
      (_url: RequestInfo | URL, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(new Error('aborted')));
        }),
    );
    const result = isOnline({ fetchImpl, timeoutMs: 5_000 });
    jest.advanceTimersByTime(5_000);
    expect(await result).toBe(false);
    jest.useRealTimers();
  });
});
