import api from "@/lib/axios";
import axios from "axios";

export type AvailableSurveyTab =
  | "ALL"
  | "HIGH_PAYING"
  | "SHORT_SURVEYS"
  | "TRENDING"
  | "NEW";

export type AvailableSurveySortBy =
  | "MOST_RELEVANT"
  | "REWARD_HIGH"
  | "REWARD_LOW"
  | "NEWEST"
  | "SHORTEST";

export type AvailableSurveyStatus =
  | "AVAILABLE"
  | "LOCKED"
  | "IN_PROGRESS"
  | "COMPLETED";

export type ParticipantSurveyQuestionType =
  | "MULTIPLE_CHOICE"
  | "SINGLE_SELECT"
  | "SHORT_ANSWER"
  | "LONG_ANSWER"
  | "RATING_SCALE"
  | "YES_NO";

export type AvailableSurveysQuery = {
  participantId: string;
  search?: string;
  tab?: AvailableSurveyTab;
  sortBy?: AvailableSurveySortBy;
  page?: number;
  limit?: number;
};

export type AvailableSurvey = {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedTime: string;
  estimatedCompletionDays: number;
  questionCount: number;
  rewardAmount: number;
  currency: string;
  completedResponses: number;
  requiredResponses: number;
  completionPercentage: number;
  publishedAt: string;
  isVerifiedOnly: boolean;
  tags: string[];
  isLocked: boolean;
  status?: AvailableSurveyStatus;
  lockedReason?: string;
};

export type ParticipantSurveyQuestionOption = {
  id: string;
  optionText: string;
  order: number;
};

export type ParticipantSurveyQuestion = {
  id: string;
  questionText: string;
  type: ParticipantSurveyQuestionType;
  order: number;
  isRequired: boolean;
  options: ParticipantSurveyQuestionOption[];
};

export type ParticipantSurveyDetail = AvailableSurvey & {
  questions: ParticipantSurveyQuestion[];
};

export type ParticipantSurveyDetailResponse = {
  survey: ParticipantSurveyDetail;
  participant?: {
    id: string;
    username?: string;
    isVerified?: boolean;
  };
  existingResponse?: {
    id: string;
    status?: string;
    answers?: Array<{
      questionId: string;
      answer?: string | string[] | number | boolean | null;
      selectedOptionIds?: string[];
      textAnswer?: string;
      ratingValue?: number;
      booleanAnswer?: boolean;
    }>;
  };
};

export type SubmitParticipantSurveyResponsePayload = {
  questionId: string;
  answer?: string | string[] | number | boolean | null;
};

export type SubmitParticipantSurveyResponseRequest = {
  participantId: string;
  surveyId: string;
  answers: SubmitParticipantSurveyResponsePayload[];
};

export type SubmitParticipantSurveyResponseResult = {
  message: string;
  response?: {
    id: string;
    status?: string;
    submittedAt?: string;
  };
};

export type AvailableSurveysResponse = {
  participant: {
    id: string;
    username: string;
    isVerified: boolean;
  };
  summary: {
    availableCount: number;
    lockedCount: number;
    totalCount: number;
  };
  filters: {
    search: string | null;
    tab: AvailableSurveyTab;
    sortBy: AvailableSurveySortBy;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    showingFrom: number;
    showingTo: number;
  };
  surveys: AvailableSurvey[];
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

export async function getAvailableSurveys(query: AvailableSurveysQuery) {
  try {
    const response = await api.get<AvailableSurveysResponse>(
      "/participant/available-surveys",
      {
        params: {
          participantId: query.participantId,
          search: query.search || undefined,
          tab: query.tab,
          sortBy: query.sortBy,
          page: query.page,
          limit: query.limit,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getParticipantSurveyDetail(
  participantId: string,
  surveyId: string
) {
  try {
    const response = await api.get<ParticipantSurveyDetailResponse>(
      `/participant/available-surveys/${surveyId}`,
      {
        params: {
          participantId,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function submitParticipantSurveyResponse(
  payload: SubmitParticipantSurveyResponseRequest
) {
  try {
    const response = await api.post<SubmitParticipantSurveyResponseResult>(
      `/participant/available-surveys/${payload.surveyId}/responses`,
      {
        participantId: payload.participantId,
        answers: payload.answers,
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
