import api from "@/lib/axios";
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000";

export interface LoginPayload {
  email: string;
  password: string;
}

export type RegisterRole = "PARTICIPANT" | "CREATOR" | "BOTH";

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  role: RegisterRole;
  nicNumber?: string;
  nicImage?: File | null;
  selfieImage?: File | null;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface LogoutPayload {
  userId: string;
}

export interface VerifyEmailPayload {
  token: string;
}

export interface ResendEmailVerificationPayload {
  email: string;
}

export interface LoginResponse {
  message: string;
  accessToken?: string;
  access_token?: string;
  token?: string;
  user?: unknown;
  participant?: unknown;
}

export class AuthApiError extends Error {
  code?: string;
  email?: string;
  statusCode?: number;

  constructor(
    message: string,
    code?: string,
    email?: string,
    statusCode?: number,
  ) {
    super(message);
    this.name = "AuthApiError";
    this.code = code;
    this.email = email;
    this.statusCode = statusCode;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function createAuthApiError(error: unknown): AuthApiError {
  if (!axios.isAxiosError(error)) {
    if (error instanceof Error) {
      return new AuthApiError(error.message);
    }

    return new AuthApiError("Request failed");
  }

  const statusCode = error.response?.status;
  const data = error.response?.data;

  console.log("AUTH ERROR STATUS:", statusCode);
  console.log("AUTH ERROR DATA:", data);

  if (!isRecord(data)) {
    return new AuthApiError("Request failed", undefined, undefined, statusCode);
  }

  const messageValue = data.message;

  if (isRecord(messageValue)) {
    const nestedMessage =
      typeof messageValue.message === "string"
        ? messageValue.message
        : "Request failed";

    const nestedCode =
      typeof messageValue.code === "string" ? messageValue.code : undefined;

    const nestedEmail =
      typeof messageValue.email === "string" ? messageValue.email : undefined;

    return new AuthApiError(nestedMessage, nestedCode, nestedEmail, statusCode);
  }

  if (Array.isArray(messageValue)) {
    const firstMessage =
      typeof messageValue[0] === "string" ? messageValue[0] : "Request failed";

    return new AuthApiError(firstMessage, undefined, undefined, statusCode);
  }

  const message =
    typeof messageValue === "string" ? messageValue : "Request failed";

  const code = typeof data.code === "string" ? data.code : undefined;
  const email = typeof data.email === "string" ? data.email : undefined;

  return new AuthApiError(message, code, email, statusCode);
}

export function isEmailNotVerifiedError(error: unknown): error is AuthApiError {
  if (!(error instanceof Error)) {
    return false;
  }

  if (error instanceof AuthApiError) {
    return (
      error.code === "EMAIL_NOT_VERIFIED" ||
      error.message.toLowerCase().includes("verify your email") ||
      error.message.toLowerCase().includes("email address before logging in")
    );
  }

  return (
    error.message.toLowerCase().includes("verify your email") ||
    error.message.toLowerCase().includes("email address before logging in")
  );
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      {
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
      },
      {
        withCredentials: true,
      },
    );

    return response.data as LoginResponse;
  } catch (error: unknown) {
    throw createAuthApiError(error);
  }
}

export async function registerUser(payload: RegisterPayload) {
  const formData = new FormData();

  formData.append("username", payload.username);
  formData.append("email", payload.email.trim().toLowerCase());
  formData.append("password", payload.password);
  formData.append("role", payload.role);

  if (payload.nicNumber?.trim()) {
    formData.append("nicNumber", payload.nicNumber.trim());
  }

  if (payload.nicImage) {
    formData.append("nicImage", payload.nicImage);
  }

  if (payload.selfieImage) {
    formData.append("selfieImage", payload.selfieImage);
  }

  try {
    const response = await api.post("/auth/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: unknown) {
    throw createAuthApiError(error);
  }
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  try {
    const response = await api.post("/auth/forgot-password", {
      email: payload.email.trim().toLowerCase(),
    });

    return response.data;
  } catch (error: unknown) {
    throw createAuthApiError(error);
  }
}

export async function resetPassword(payload: ResetPasswordPayload) {
  try {
    const response = await api.post("/auth/reset-password", payload);
    return response.data;
  } catch (error: unknown) {
    throw createAuthApiError(error);
  }
}

export async function verifyEmail(payload: VerifyEmailPayload) {
  try {
    const response = await api.post("/auth/verify-email", payload);
    return response.data;
  } catch (error: unknown) {
    throw createAuthApiError(error);
  }
}

export async function resendEmailVerification(
  payload: ResendEmailVerificationPayload,
) {
  try {
    const response = await api.post("/auth/resend-email-verification", {
      email: payload.email.trim().toLowerCase(),
    });

    return response.data;
  } catch (error: unknown) {
    throw createAuthApiError(error);
  }
}

export async function logoutUser(payload: LogoutPayload) {
  try {
    const response = await api.post("/auth/logout", payload, {
      withCredentials: true,
    });

    return response.data;
  } catch (error: unknown) {
    throw createAuthApiError(error);
  }
}
