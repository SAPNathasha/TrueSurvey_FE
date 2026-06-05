import api from "@/lib/axios";
import axios from "axios";

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

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      return message[0];
    }

    return message || "Request failed";
  }

  return "Request failed";
}

export async function loginUser(payload: LoginPayload) {
  try {
    const response = await api.post("/auth/login", payload);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function registerUser(payload: RegisterPayload) {
  const formData = new FormData();

  formData.append("username", payload.username);
  formData.append("email", payload.email);
  formData.append("password", payload.password);
  formData.append("role", payload.role);

  if (payload.nicNumber) {
    formData.append("nicNumber", payload.nicNumber);
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
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  try {
    const response = await api.post("/auth/forgot-password", payload);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function resetPassword(payload: ResetPasswordPayload) {
  try {
    const response = await api.post("/auth/reset-password", payload);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export interface LogoutPayload {
  userId: string;
}

export async function logoutUser(payload: LogoutPayload) {
  try {
    const response = await api.post("/auth/logout", payload);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
