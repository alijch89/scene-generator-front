/**
 * @jest-environment node
 */

import { request } from "./api";

const response = (payload: unknown, status = 200) =>
  ({
    status,
    statusText: "",
    ok: status >= 200 && status < 300,
    json: async () => payload,
  }) as Response;

/**
 * The header exempting server-rendered traffic from the API's per-IP throttle
 * only exists on the server. jsdom always defines `window`, so this file runs
 * in the node environment to exercise the branch that actually ships.
 */
describe("request, running on the server", () => {
  beforeEach(() => {
    delete process.env.INTERNAL_API_TOKEN;
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.INTERNAL_API_TOKEN;
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  it("marks itself as the first-party caller when a token is configured", async () => {
    process.env.INTERNAL_API_TOKEN = "internal-secret";
    const fetchMock = jest
      .spyOn(global, "fetch")
      .mockResolvedValue(response({ ok: true }));

    await request("/auth/me");

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          "x-internal-token": "internal-secret",
        }),
      }),
    );
  });

  it("sends no such header when none is configured", async () => {
    const fetchMock = jest
      .spyOn(global, "fetch")
      .mockResolvedValue(response({ ok: true }));

    await request("/auth/me");

    // `global.fetch` spies are reused across tests here, so read the call
    // this test just made rather than the first one recorded.
    const lastCall = fetchMock.mock.calls.at(-1);
    const headers = (lastCall?.[1] as RequestInit).headers as Record<
      string,
      string
    >;
    expect(headers["x-internal-token"]).toBeUndefined();
  });

  it("supplies the configured site Origin for a server-side mutation", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://app.example.test/path";
    const fetchMock = jest
      .spyOn(global, "fetch")
      .mockResolvedValue(response({ ok: true }));

    await request("/auth/logout", { method: "POST" });

    const lastCall = fetchMock.mock.calls.at(-1);
    const headers = (lastCall?.[1] as RequestInit).headers as Record<
      string,
      string
    >;
    expect(headers).toEqual(
      expect.objectContaining({
        origin: "https://app.example.test",
        "x-csrf-protection": "1",
      }),
    );
  });
});
