import api from "@/lib/axios";
import axios from "axios";

export type CreateSurveyBasicDetailsPayload = {
  creatorId: string;
  title: string;
  description: string;
  category: string;
  estimatedCompletionDays: number;
};

export type SurveyCreationMethod = "AI_ASSISTED" | "MANUAL";
export type SurveyQuestionType =
  | "MULTIPLE_CHOICE"
  | "SINGLE_SELECT"
  | "SHORT_ANSWER"
  | "LONG_ANSWER"
  | "RATING_SCALE"
  | "YES_NO";
export type AudienceGender = "ALL" | "MALE" | "FEMALE" | "OTHER";
export type SurveyAudienceType =
  | "GENERAL"
  | "CUSTOMERS"
  | "VISITORS"
  | "EMPLOYEES"
  | "VERIFIED_USERS_ONLY";
export type RewardDistributionType =
  | "EQUAL_PER_PARTICIPANT"
  | "HIGHER_REWARD_FOR_VERIFIED_USERS"
  | "MANUAL_REWARD_ALLOCATION";
export type SurveyBudgetCurrency = "LKR";

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

export type SelectSurveyMethodPayload = {
  creatorId: string;
  surveyId: string;
  creationMethod: SurveyCreationMethod;
};

export type SelectSurveyMethodResponse = {
  message: string;
  survey: SurveyDraft;
  nextStep: "AI_QUESTION_GENERATION" | "MANUAL_QUESTION_CREATION";
};

export type ManualQuestionOptionPayload = {
  optionText: string;
};

export type CreateManualQuestionPayload = {
  creatorId: string;
  surveyId: string;
  questionText: string;
  type: SurveyQuestionType;
  isRequired?: boolean;
  options?: ManualQuestionOptionPayload[];
};

export type SurveyQuestionOption = {
  id: string;
  optionText: string;
  order: number;
};

export type SurveyQuestion = {
  id: string;
  questionText: string;
  type: SurveyQuestionType;
  source: string;
  order: number;
  isRequired: boolean;
  createdAt: string;
  updatedAt: string;
  options: SurveyQuestionOption[];
};

export type CreateManualQuestionResponse = {
  message: string;
  question: SurveyQuestion;
};

export type GetSurveyQuestionsResponse = {
  surveyId: string;
  questions: SurveyQuestion[];
};

export type CompleteQuestionStepResponse = {
  message: string;
  survey: Pick<
    SurveyDraft,
    "id" | "currentStep" | "creationMethod" | "status" | "updatedAt"
  >;
  nextStep: "TARGET_AUDIENCE";
};

export type SetTargetAudiencePayload = {
  creatorId: string;
  surveyId: string;
  minimumAge?: number;
  maximumAge?: number;
  gender?: AudienceGender;
  city?: string;
  district?: string;
  educationLevel?: string;
  occupation?: string;
  sampleBase: SurveyAudienceType;
};

export type SurveyTargetAudience = {
  id: string;
  minimumAge: number | null;
  maximumAge: number | null;
  gender: AudienceGender;
  city: string | null;
  district: string | null;
  educationLevel: string | null;
  occupation: string | null;
  sampleBase: SurveyAudienceType;
  estimatedReach: number;
  createdAt: string;
  updatedAt: string;
};

export type SetTargetAudienceResponse = {
  message: string;
  survey: Pick<
    SurveyDraft,
    | "id"
    | "title"
    | "audience"
    | "currentStep"
    | "status"
    | "creationMethod"
    | "updatedAt"
  >;
  targetAudience: SurveyTargetAudience;
  nextStep: "SAMPLE_BUDGET";
};

export type EstimateAudienceReachPayload = {
  userId: string;
  surveyId: string;
  minimumAge?: number;
  maximumAge?: number;
  gender?: AudienceGender;
  city?: string;
  district?: string;
  educationLevel?: string;
  occupation?: string;
  sampleBase: SurveyAudienceType;
};

export type EstimateAudienceReachResponse = {
  surveyId: string;
  estimatedReach: number;
  targetAudience: {
    minimumAge: number | null;
    maximumAge: number | null;
    gender: AudienceGender;
    city: string | null;
    district: string | null;
    educationLevel: string | null;
    occupation: string | null;
    sampleBase: SurveyAudienceType;
  };
  calculatedAt: string;
};

export type SetSampleBudgetPayload = {
  creatorId: string;
  surveyId: string;
  requiredResponses: number;
  totalBudget: number;
  platformCommissionPercentage: number;
  rewardDistribution?: RewardDistributionType;
  currency?: SurveyBudgetCurrency;
  budgetNotes?: string;
};

export type SurveySampleBudget = {
  id: string;
  requiredResponses: number;
  totalBudget: string;
  platformCommissionPercentage: string;
  platformCommissionAmount: string;
  participantRewardBudget: string;
  rewardPerParticipant: string;
  rewardDistribution: RewardDistributionType;
  currency: SurveyBudgetCurrency;
  budgetNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BudgetBreakdown = {
  totalBudget: number;
  platformCommissionPercentage: number;
  platformCommissionAmount: number;
  participantRewardBudget: number;
  requiredResponses: number;
  rewardPerParticipant: number;
  currency: SurveyBudgetCurrency;
};

export type SetSampleBudgetResponse = {
  message: string;
  survey: Pick<
    SurveyDraft,
    | "id"
    | "title"
    | "currentStep"
    | "status"
    | "creationMethod"
    | "audience"
    | "updatedAt"
  >;
  sampleBudget: SurveySampleBudget;
  budgetBreakdown: BudgetBreakdown;
  nextStep: "PREVIEW_SUBMIT";
};

export type SurveyPreviewQuestion = SurveyQuestion;

export type SurveyPreviewTargetAudience = {
  minimumAge: number | null;
  maximumAge: number | null;
  gender: AudienceGender;
  city: string | null;
  district: string | null;
  educationLevel: string | null;
  occupation: string | null;
  sampleBase: SurveyAudienceType;
  estimatedReach: number | null;
};

export type SurveyPreviewSampleBudget = {
  requiredResponses: number;
  totalBudget: string;
  platformCommissionPercentage: string;
  platformCommissionAmount: string;
  participantRewardBudget: string;
  rewardPerParticipant: string;
  rewardDistribution: RewardDistributionType;
  currency: SurveyBudgetCurrency;
  budgetNotes: string | null;
};

export type SurveyPreviewData = SurveyDraft & {
  questions: SurveyPreviewQuestion[];
  targetAudience: SurveyPreviewTargetAudience | null;
  sampleBudget: SurveyPreviewSampleBudget | null;
};

export type SurveyReadiness = Record<string, boolean>;

export type GetSurveyPreviewResponse = {
  survey: SurveyPreviewData;
  readiness: SurveyReadiness;
  canPublish: boolean;
};

export type SurveyPublishOption = "PUBLISH_NOW" | "SCHEDULE" | "SAVE_DRAFT";

export type PublishSurveyPayload = {
  creatorId: string;
  surveyId: string;
  publishOption: SurveyPublishOption;
  scheduledPublishAt?: string;
};

export type PublishSurveyResponse = {
  message: string;
  survey: {
    id: string;
    title: string;
    status: string;
    currentStep: string;
    updatedAt: string;
    scheduledPublishAt?: string | null;
    publishedAt?: string | null;
  };
  readiness: SurveyReadiness;
  nextStep?: "SCHEDULED" | "PUBLISHED";
};

export type CreatorSurveyStatus = "DRAFT" | "ACTIVE" | "CLOSED";

export type CreatorSurveyListItem = {
  id: string;
  title: string;
  description: string;
  category: string | null;
  audience: string | null;
  status: CreatorSurveyStatus;
  currentStep: string | null;
  creationMethod: SurveyCreationMethod | null;
  estimatedCompletionDays: number | null;
  responseCount: number;
  createdAt: string | null;
  updatedAt: string | null;
};

export type GetCreatorSurveysParams = {
  creatorId: string;
  status?: CreatorSurveyStatus | "ALL";
  limit?: number;
};

export type GetCreatorSurveysResponse = {
  surveys: CreatorSurveyListItem[];
  total: number;
  limit: number;
};

export const RewardStatus = {
  PENDING: "PENDING",
  RELEASED: "RELEASED",
  REJECTED: "REJECTED",
  WITHDRAWN: "WITHDRAWN",
} as const;

export type CreatorSurveySubmissionStatus = string;
export type RewardStatus = (typeof RewardStatus)[keyof typeof RewardStatus];

export type CreatorSurveySubmissionRow = {
  submissionId: string;
  submissionNumber: number;
  submittedAt: string | null;
  status: RewardStatus;
};

export type CreatorSurveySubmissionsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  showingFrom: number;
  showingTo: number;
};

export type GetCreatorSurveySubmissionsResponse = {
  survey: {
    id: string;
    title: string;
  };
  pagination: CreatorSurveySubmissionsPagination;
  submissions: CreatorSurveySubmissionRow[];
};

export type CreatorSubmissionParticipant = {
  id: string | null;
  username: string | null;
  email: string | null;
  verificationStatus: "VERIFIED" | "NOT_VERIFIED";
  isIdentityVerified: boolean;
};

export type CreatorSubmissionAnswer = {
  answerId: string;
  questionId: string;
  questionText: string;
  questionOrder: number;
  questionType: SurveyQuestionType;
  answerType: SurveyQuestionType;
  answer: {
    answerText: string | null;
    selectedOptionId: string | null;
    selectedOptionIds: string[] | null;
    ratingValue: number | null;
    booleanValue: boolean | null;
  };
  options: SurveyQuestionOption[];
};

export type GetCreatorSingleSubmissionResponse = {
  survey: {
    id: string;
    title: string;
  };
  submission: {
    id: string;
    submittedAt: string | null;
    status: string;
    isAccepted: boolean | null;
  };
  participant: CreatorSubmissionParticipant;
  answers: CreatorSubmissionAnswer[];
};

export type ReviewCreatorSubmissionResponse = {
  message: string;
  submission: {
    id: string;
    surveyId: string;
    participantId: string | null;
    status: string;
    rewardStatus: RewardStatus;
    rewardAmount: number;
    completedAt: string | null;
  };
};

function normalizeSurveyStatus(status: unknown): CreatorSurveyStatus {
  if (status === "ACTIVE" || status === "CLOSED") {
    return status;
  }

  return "DRAFT";
}

function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return 0;
}

function normalizeCreatorSurveyListItem(
  item: unknown,
): CreatorSurveyListItem | null {
  if (!item || typeof item !== "object") {
    return null;
  }

  const record = item as Record<string, unknown>;
  const id = typeof record.id === "string" ? record.id : null;
  const title = typeof record.title === "string" ? record.title : null;

  if (!id || !title) {
    return null;
  }

  const nestedCount =
    record._count && typeof record._count === "object"
      ? (record._count as Record<string, unknown>)
      : null;

  return {
    id,
    title,
    description:
      typeof record.description === "string" ? record.description : "",
    category: typeof record.category === "string" ? record.category : null,
    audience: typeof record.audience === "string" ? record.audience : null,
    status: normalizeSurveyStatus(record.status),
    currentStep:
      typeof record.currentStep === "string" ? record.currentStep : null,
    creationMethod:
      record.creationMethod === "AI_ASSISTED" ||
      record.creationMethod === "MANUAL"
        ? record.creationMethod
        : null,
    estimatedCompletionDays:
      typeof record.estimatedCompletionDays === "number"
        ? record.estimatedCompletionDays
        : null,
    responseCount:
      toNumber(record.responseCount) ||
      toNumber(record.totalResponses) ||
      toNumber(record.responsesCount) ||
      toNumber(nestedCount?.responses) ||
      toNumber(nestedCount?.surveyResponses),
    createdAt: typeof record.createdAt === "string" ? record.createdAt : null,
    updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : null,
  };
}

function normalizeCreatorSurveysResponse(
  payload: unknown,
  fallbackLimit: number,
): GetCreatorSurveysResponse {
  const record =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : null;

  const surveyCandidates = Array.isArray(payload)
    ? payload
    : Array.isArray(record?.surveys)
      ? record.surveys
      : Array.isArray(record?.items)
        ? record.items
        : Array.isArray(record?.data)
          ? record.data
          : [];

  const surveys = surveyCandidates
    .map(normalizeCreatorSurveyListItem)
    .filter((item): item is CreatorSurveyListItem => Boolean(item));

  const total =
    toNumber(record?.total) ||
    toNumber(record?.count) ||
    toNumber(record?.totalCount) ||
    surveys.length;
  const limit = toNumber(record?.limit) || fallbackLimit;

  return {
    surveys,
    total,
    limit,
  };
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

export async function createSurveyBasicDetails(
  payload: CreateSurveyBasicDetailsPayload,
) {
  try {
    const response = await api.post<CreateSurveyBasicDetailsResponse>(
      "/surveys/basic-details",
      payload,
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function selectSurveyMethod(payload: SelectSurveyMethodPayload) {
  try {
    const response = await api.patch<SelectSurveyMethodResponse>(
      `/surveys/${payload.surveyId}/method`,
      {
        creatorId: payload.creatorId,
        creationMethod: payload.creationMethod,
      },
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createManualQuestion(
  payload: CreateManualQuestionPayload,
) {
  try {
    const response = await api.post<CreateManualQuestionResponse>(
      `/surveys/${payload.surveyId}/questions/manual`,
      {
        creatorId: payload.creatorId,
        questionText: payload.questionText,
        type: payload.type,
        isRequired: payload.isRequired,
        options: payload.options,
      },
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getSurveyQuestions(creatorId: string, surveyId: string) {
  try {
    const response = await api.get<GetSurveyQuestionsResponse>(
      `/surveys/${surveyId}/questions`,
      {
        params: {
          creatorId,
        },
      },
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateManualQuestion(
  payload: CreateManualQuestionPayload & {
    questionId: string;
    questionText?: string;
    type?: SurveyQuestionType;
  },
) {
  try {
    const response = await api.patch<CreateManualQuestionResponse>(
      `/surveys/${payload.surveyId}/questions/${payload.questionId}`,
      {
        creatorId: payload.creatorId,
        questionText: payload.questionText,
        type: payload.type,
        isRequired: payload.isRequired,
        options: payload.options,
      },
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteSurveyQuestion(
  creatorId: string,
  surveyId: string,
  questionId: string,
) {
  try {
    const response = await api.delete<{ message: string }>(
      `/surveys/${surveyId}/questions/${questionId}`,
      {
        data: {
          creatorId,
        },
      },
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function completeQuestionStep(
  creatorId: string,
  surveyId: string,
) {
  try {
    const response = await api.patch<CompleteQuestionStepResponse>(
      `/surveys/${surveyId}/questions/complete`,
      {
        creatorId,
      },
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function setTargetAudience(payload: SetTargetAudiencePayload) {
  try {
    const response = await api.patch<SetTargetAudienceResponse>(
      `/surveys/${payload.surveyId}/target-audience`,
      {
        creatorId: payload.creatorId,
        minimumAge: payload.minimumAge,
        maximumAge: payload.maximumAge,
        gender: payload.gender,
        city: payload.city,
        district: payload.district,
        educationLevel: payload.educationLevel,
        occupation: payload.occupation,
        sampleBase: payload.sampleBase,
      },
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getEstimatedAudienceReach(
  payload: EstimateAudienceReachPayload,
) {
  try {
    const response = await api.get<EstimateAudienceReachResponse>(
      `/surveys/${payload.surveyId}/estimated-reach`,
      {
        params: {
          userId: payload.userId,
          minimumAge: payload.minimumAge,
          maximumAge: payload.maximumAge,
          gender: payload.gender,
          city: payload.city,
          district: payload.district,
          educationLevel: payload.educationLevel,
          occupation: payload.occupation,
          sampleBase: payload.sampleBase,
        },
      },
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function setSampleBudget(payload: SetSampleBudgetPayload) {
  try {
    const response = await api.patch<SetSampleBudgetResponse>(
      `/surveys/${payload.surveyId}/sample-budget`,
      {
        creatorId: payload.creatorId,
        requiredResponses: payload.requiredResponses,
        totalBudget: payload.totalBudget,
        platformCommissionPercentage: payload.platformCommissionPercentage,
        rewardDistribution: payload.rewardDistribution,
        currency: payload.currency,
        budgetNotes: payload.budgetNotes,
      },
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getSurveyPreview(creatorId: string, surveyId: string) {
  try {
    const response = await api.get<GetSurveyPreviewResponse>(
      `/surveys/${surveyId}/preview`,
      {
        params: {
          creatorId,
        },
      },
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function publishSurvey(payload: PublishSurveyPayload) {
  try {
    const response = await api.patch<PublishSurveyResponse>(
      `/surveys/${payload.surveyId}/publish`,
      {
        creatorId: payload.creatorId,
        publishOption: payload.publishOption,
        scheduledPublishAt: payload.scheduledPublishAt,
      },
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getCreatorSurveys(params: GetCreatorSurveysParams) {
  try {
    const response = await api.get("/creator/surveys", {
      params: {
        creatorId: params.creatorId,
        status:
          params.status && params.status !== "ALL" ? params.status : undefined,
        limit: params.limit,
      },
    });

    return normalizeCreatorSurveysResponse(response.data, params.limit ?? 10);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function deleteCreatorSurvey(creatorId: string, surveyId: string) {
  try {
    const response = await api.delete<{ message: string }>(
      `/surveys/${surveyId}`,
      {
        data: {
          creatorId,
        },
      },
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getCreatorSurveySubmissions(
  surveyId: string,
  page = 1,
  limit = 10,
) {
  try {
    const response = await api.get<GetCreatorSurveySubmissionsResponse>(
      "/creator/survey-submissions",
      {
        params: {
          surveyId,
          page,
          limit,
        },
      },
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getCreatorSingleSubmission(
  surveyId: string,
  submissionId: string,
) {
  try {
    const response = await api.get<GetCreatorSingleSubmissionResponse>(
      `/creator/surveys/${surveyId}/submissions/${submissionId}`,
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function acceptCreatorSubmission(
  surveyId: string,
  submissionId: string,
) {
  try {
    const response = await api.patch<ReviewCreatorSubmissionResponse>(
      `/creator/surveys/${surveyId}/submissions/${submissionId}/accept`,
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function rejectCreatorSubmission(
  surveyId: string,
  submissionId: string,
) {
  try {
    const response = await api.patch<ReviewCreatorSubmissionResponse>(
      `/creator/surveys/${surveyId}/submissions/${submissionId}/reject`,
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
