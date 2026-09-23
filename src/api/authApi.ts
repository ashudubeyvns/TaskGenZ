import type { LoginResponse, RefreshResponse } from "../types/auth";
import { apiRequest } from "./apiClient";

interface LoginCredentials { username: string; password: string; }

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function refreshSession(refreshToken: string): Promise<RefreshResponse> {
  return apiRequest<RefreshResponse>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}
