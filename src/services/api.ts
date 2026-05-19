import type { LoginResponse, PaginatedResponse, User, ValidationErrors } from "../types/api";

const API_BASE_URL = "http://localhost:8000/api/v1";
const ACCESS_KEY = "frontend_v2_access_token";
const REFRESH_KEY = "frontend_v2_refresh_token";

let refreshPromise: Promise<string | null> | null = null;

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function storeTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

async function refreshAccessToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  const refresh = getRefreshToken();
  if (!refresh) {
    return null;
  }

  refreshPromise = fetch(`${API_BASE_URL}/auth/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  })
    .then(async (response) => {
      if (!response.ok) {
        clearTokens();
        return null;
      }
      const payload = (await response.json()) as { access: string };
      localStorage.setItem(ACCESS_KEY, payload.access);
      return payload.access;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

async function parsePayload(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  if (response.status === 204) {
    return null;
  }
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

export async function apiRequest<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  const token = getAccessToken();
  const headers = new Headers(init.headers ?? {});

  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (response.status === 401 && retry && getRefreshToken()) {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      return apiRequest<T>(path, init, false);
    }
  }

  const payload = await parsePayload(response);

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "detail" in payload
        ? String(
            (payload as { detail?: string }).detail ??
              "تعذر الاتصال بالخادم. تأكد من تشغيل الواجهة الخلفية ثم حاول مرة أخرى."
          )
        : "تعذر الاتصال بالخادم. تأكد من تشغيل الواجهة الخلفية ثم حاول مرة أخرى.";
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}

export function isValidationErrors(payload: unknown): payload is ValidationErrors {
  return typeof payload === "object" && payload !== null;
}

export async function loginRequest(username: string, password: string) {
  const response = await apiRequest<LoginResponse>("/auth/login/", {
    method: "POST",
    body: JSON.stringify({
      username: username.trim(),
      password,
    }),
  });
  storeTokens(response.access, response.refresh);
  return response;
}

export async function logoutRequest() {
  const refresh = getRefreshToken();
  try {
    await apiRequest("/auth/logout/", {
      method: "POST",
      body: JSON.stringify({ refresh }),
    });
  } catch {
    // Keep logout resilient even if the refresh token is expired.
  } finally {
    clearTokens();
  }
}

export function meRequest() {
  return apiRequest<User>("/auth/me/");
}

export function fetchPaginated<T>(path: string, params?: URLSearchParams) {
  const query = params && params.toString() ? `?${params.toString()}` : "";
  return apiRequest<PaginatedResponse<T>>(`${path}${query}`);
}
