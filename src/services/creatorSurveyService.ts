import api from "@/lib/axios";
import axios from "axios";

export type CreateSurveyBasicDetailsPayload = {
  creatorId: string;
  title: string;
  description: string;
  category: string;
  estimatedCompletionDays: number;
};

export type SurveyDraft = {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  category: string;
  audience: string | null;
  estimatedCompletionDays: number;
  status: string;
  currentStep: string;
  creationMethod: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateSurveyBasicDetailsResponse = {
  message: string;
  survey: SurveyDraft;
};

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

export async function createSurveyBasicDetails(
  payload: CreateSurveyBasicDetailsPayload
) {
  try {
    const response = await api.post<CreateSurveyBasicDetailsResponse>(
      "/surveys/basic-details",
      payload
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
