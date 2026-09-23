import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  apiRequest,
} from "../api/apiClient";

import {
  clearSessionTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "../store/authSession";

import {
  refreshSession,
} from "../api/authApi";

vi.mock(
  "../api/authApi",
  () => ({
    refreshSession:
      vi.fn(),
  }),
);

describe(
  "apiClient",
  () => {
    beforeEach(() => {
      vi.restoreAllMocks();

      clearSessionTokens();

      vi.stubGlobal(
        "fetch",
        vi.fn(),
      );
    });

    it(
      "adds the access token to a successful request",
      async () => {
        setAccessToken(
          "access-token",
        );

        const mockFetch =
          vi.mocked(fetch);

        mockFetch.mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              success: true,
            }),
            {
              status: 200,
              headers: {
                "Content-Type":
                  "application/json",
              },
            },
          ),
        );

        const result =
          await apiRequest<{
            success: boolean;
          }>(
            "/api/tasks",
          );

        expect(result).toEqual({
          success: true,
        });

        expect(
          mockFetch,
        ).toHaveBeenCalledTimes(
          1,
        );

        const [
          ,
          options,
        ] =
          mockFetch.mock.calls[0];

        const headers =
          (options?.headers ??
            {}) as Record<
            string,
            string
          >;

        expect(
          headers.Authorization,
        ).toBe(
          "Bearer access-token",
        );
      },
    );

    it(
      "refreshes the token after a 401 and retries",
      async () => {
        setAccessToken(
          "expired-token",
        );

        setRefreshToken(
          "refresh-token",
        );

        const mockFetch =
          vi.mocked(fetch);

        mockFetch
          .mockResolvedValueOnce(
            new Response(
              null,
              {
                status: 401,
              },
            ),
          )
          .mockResolvedValueOnce(
            new Response(
              JSON.stringify({
                success: true,
              }),
              {
                status: 200,
                headers: {
                  "Content-Type":
                    "application/json",
                },
              },
            ),
          );

        vi.mocked(
          refreshSession,
        ).mockResolvedValueOnce({
          accessToken:
            "new-access-token",
          refreshToken:
            "new-refresh-token",
        });

        const result =
          await apiRequest<{
            success: boolean;
          }>(
            "/api/tasks",
          );

        expect(result).toEqual({
          success: true,
        });

        expect(
          refreshSession,
        ).toHaveBeenCalledWith(
          "refresh-token",
        );

        expect(
          mockFetch,
        ).toHaveBeenCalledTimes(
          2,
        );

        expect(
          getAccessToken(),
        ).toBe(
          "new-access-token",
        );

        expect(
          getRefreshToken(),
        ).toBe(
          "new-refresh-token",
        );
      },
    );

    it(
      "throws when there is no refresh token after a 401",
      async () => {
        setAccessToken(
          "expired-token",
        );

        const mockFetch =
          vi.mocked(fetch);

        mockFetch.mockResolvedValueOnce(
          new Response(
            null,
            {
              status: 401,
            },
          ),
        );

        await expect(
          apiRequest(
            "/api/tasks",
          ),
        ).rejects.toThrow(
          "No refresh token available",
        );

        expect(
          mockFetch,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );

    it(
      "throws on a non-401 API error",
      async () => {
        const mockFetch =
          vi.mocked(fetch);

        mockFetch.mockResolvedValueOnce(
          new Response(
            null,
            {
              status: 500,
            },
          ),
        );

        await expect(
          apiRequest(
            "/api/tasks",
          ),
        ).rejects.toThrow(
          "Request failed with status 500",
        );
      },
    );
  },
);