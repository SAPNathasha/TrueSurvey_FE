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
  source?: string;
  order: number;
  isRequired: boolean;
  options: ParticipantSurveyQuestionOption[];
};

export type ParticipantSurveyDetail = AvailableSurvey & {
  audience?: string | null;
  targetAudience?: {
    minimumAge?: number | null;
    maximumAge?: number | null;
    gender?: string | null;
    city?: string | null;
    district?: string | null;
    educationLevel?: string | null;
    occupation?: string | null;
    sampleBase?: string | null;
    estimatedReach?: number | null;
  } | null;
  sampleBudget?: {
    requiredResponses: number;
    rewardPerParticipant: number;
    currency: string;
    totalBudget: number;
    participantRewardBudget: number;
    rewardDistribution?: string | null;
  } | null;
  questions: ParticipantSurveyQuestion[];
};

export type ParticipantSurveyDetailResponse = {
  participant: {
    id: string;
    username: string;
    isVerified: boolean;
  };
  survey: ParticipantSurveyDetail;
  submission: {
    participantId: string;
    surveyId: string;
    questionCount: number;
    canSubmit: boolean;
  };
};

export type SubmitParticipantSurveyResponsePayload = {
  questionId: string;
  answerText?: string;
  selectedOptionId?: string;
  selectedOptionIds?: string[];
  ratingValue?: number;
  yesNoValue?: boolean;
};

export type SubmitParticipantSurveyResponseRequest = {
  participantId: string;
  surveyId: string;
  answers: SubmitParticipantSurveyResponsePayload[];
};

export type SubmitParticipantSurveyResponseResult = {
  message: string;
  submission?: {
    id: string;
    status?: string;
    rewardAmount?: number;
    rewardStatus?: string;
    completedAt?: string;
  };
  summary?: {
    surveyTitle?: string;
    answerCount?: number;
    completedResponses?: number;
    requiredResponses?: number;
  };
  note?: string;
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
      `/participant/available-surveys/${payload.surveyId}/submit`,
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
