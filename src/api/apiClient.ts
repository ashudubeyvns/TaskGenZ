import { refreshSession } from "./authApi";

import {
  clearSessionTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "../store/authSession";

interface RequestOptions
  extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
}

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "/api"
).replace(/\/$/, "");

let refreshPromise: Promise<string> | null = null;

export function apiUrl(path: string): string {
  return `${API_BASE_URL}${
    path.startsWith("/") ? path : `/${path}`
  }`;
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  if (!refreshPromise) {
    refreshPromise = refreshSession(refreshToken)
      .then((response) => {
        setAccessToken(response.accessToken);
        setRefreshToken(response.refreshToken);

        return response.accessToken;
      })
      .catch((error) => {
        clearSessionTokens();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const accessToken = getAccessToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  let response = await fetch(apiUrl(path), {
    ...options,
    headers,
  });

  /*
   * If API returns 401:
   *
   * 1. Try refresh token.
   * 2. If refresh token doesn't exist,
   *    refreshAccessToken() throws:
   *    "No refresh token available"
   *
   * This also matches the existing Vitest expectation.
   */
  if (
    response.status === 401 &&
    !path.includes("/auth/refresh")
  ) {
    const token = await refreshAccessToken();

    response = await fetch(apiUrl(path), {
      ...options,
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const data = await response.json();

      if (
        typeof data?.message === "string"
      ) {
        message = data.message;
      }
    } catch {
      // Response is empty or not JSON.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  return (
    text
      ? JSON.parse(text)
      : undefined
  ) as T;
}