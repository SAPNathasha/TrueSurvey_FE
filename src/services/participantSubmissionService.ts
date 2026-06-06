import api from "@/lib/axios";
import axios from "axios";

export type ParticipantSubmissionRewardStatus =
  | "PENDING"
  | "RELEASED"
  | "REJECTED"
  | "WITHDRAWN"
  | string;

export type ParticipantSubmissionRow = {
  submissionId: string;
  surveyId: string;
  surveyTitle: string;
  rewardStatus: ParticipantSubmissionRewardStatus;
  submittedAt: string;
  amount: number;
};

export type ParticipantSubmissionsResponse = {
  participant: {
    id: string;
    username: string;
  };
  total: number;
  submissions: ParticipantSubmissionRow[];
};

export type DeleteParticipantSubmissionResponse = {
  message: string;
  submission: {
    id: string;
    surveyId: string;
    surveyTitle: string;
    rewardStatus: ParticipantSubmissionRewardStatus;
    amount: number;
  };
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

export async function getParticipantSubmissions() {
  try {
    const response = await api.get<ParticipantSubmissionsResponse>(
      "/participant/submissions",
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteParticipantSubmission(submissionId: string) {
  try {
    const response = await api.delete<DeleteParticipantSubmissionResponse>(
      "/participant/submissions",
      {
        params: {
          submissionId,
        },
      },
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
