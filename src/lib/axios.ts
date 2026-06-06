import axios from "axios";
import type {
  AxiosError,
  AxiosRequestHeaders,
  InternalAxiosRequestConfig,
} from "axios";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_ENDPOINT = "/auth/refresh";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

function isBrowser() {
  return typeof window !== "undefined";
}

function getStoredAccessToken() {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

function setStoredAccessToken(token: string) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

function clearStoredAccessToken() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}

function redirectToLogin() {
  if (!isBrowser()) {
    return;
  }

  window.location.href = "/login";
}

function extractAccessToken(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const tokenPayload = payload as Record<string, unknown>;
  const tokenCandidates = [
    tokenPayload.accessToken,
    tokenPayload.access_token,
    tokenPayload.token,
  ];

  for (const candidate of tokenCandidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate;
    }
  }

  return null;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshRequest: Promise<string> | null = null;

function setAuthorizationHeader(
  headers: InternalAxiosRequestConfig["headers"] | undefined,
  accessToken: string
) {
  const authorizationHeader = `Bearer ${accessToken}`;

  if (headers && typeof headers.set === "function") {
    headers.set("Authorization", authorizationHeader);
    return headers;
  }

  return {
    ...(headers ?? {}),
    Authorization: authorizationHeader,
  } as AxiosRequestHeaders;
}

async function refreshAccessToken() {
  if (refreshRequest) {
    return refreshRequest;
  }

  refreshRequest = refreshApi
    .post(REFRESH_ENDPOINT)
    .then((response) => {
      const newAccessToken = extractAccessToken(response.data);

      if (!newAccessToken) {
        throw new Error("Refresh succeeded but no access token returned");
      }

      setStoredAccessToken(newAccessToken);
      return newAccessToken;
    })
    .finally(() => {
      refreshRequest = null;
    });

  return refreshRequest;
}

api.interceptors.request.use((config) => {
  const accessToken = getStoredAccessToken();

  if (accessToken && !config.url?.includes(REFRESH_ENDPOINT)) {
    config.headers = setAuthorizationHeader(config.headers, accessToken);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;

    if (!originalRequest || status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes(REFRESH_ENDPOINT)) {
      clearStoredAccessToken();
      redirectToLogin();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const newAccessToken = await refreshAccessToken();
      originalRequest.headers = setAuthorizationHeader(
        originalRequest.headers,
        newAccessToken
      );
      return api(originalRequest);
    } catch (refreshError) {
      clearStoredAccessToken();
      redirectToLogin();
      return Promise.reject(refreshError);
    }
  }
);

export default api;
export {
  ACCESS_TOKEN_KEY,
  getStoredAccessToken,
  setStoredAccessToken,
  clearStoredAccessToken,
};
