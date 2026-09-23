import { create } from "zustand";

import {
  login as loginRequest,
  refreshSession,
} from "../api/authApi";

import {
  clearSessionTokens,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "./authSession";

import type { AuthUser } from "../types/auth";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  error: string | null;

  login: (
    username: string,
    password: string,
  ) => Promise<void>;

  initializeAuth: () => Promise<void>;

  logout: () => void;

  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  error: null,

  login: async (username, password) => {
    set({
      error: null,
    });

    try {
      const response = await loginRequest({
        username,
        password,
      });

      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);

      set({
        user: {
          id: response.id,
          username: response.username,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          gender: response.gender,
          image: response.image,
        },
        isAuthenticated: true,
        error: null,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        error:
          error instanceof Error
            ? error.message
            : "Login failed",
      });

      throw error;
    }
  },

  initializeAuth: async () => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      set({
        isInitializing: false,
        isAuthenticated: false,
      });

      return;
    }

    try {
      const response = await refreshSession(refreshToken);

      setAccessToken(response.accessToken);
      setRefreshToken(response.refreshToken);

      set({
        user: response.user ?? null,
        isAuthenticated: true,
        isInitializing: false,
        error: null,
      });
    } catch {
      clearSessionTokens();

      set({
        user: null,
        isAuthenticated: false,
        isInitializing: false,
      });
    }
  },

  logout: () => {
    clearSessionTokens();

    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => {
    set({
      error: null,
    });
  },
}));