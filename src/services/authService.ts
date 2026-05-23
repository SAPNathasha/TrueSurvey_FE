import api from "@/lib/axios";
import axios from "axios";

export interface LoginPayload {
  email: string;
  password: string;
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      return message[0];
    }

    return message || "Login failed";
  }

  return "Login failed";
}

export async function loginUser(payload: LoginPayload) {
  try {
    const response = await api.post("/auth/login", payload);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}