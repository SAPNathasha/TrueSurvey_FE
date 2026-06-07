"use client";

import {
  Box,
  Button,
  HStack,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiFileText,
  FiInfo,
  FiRadio,
} from "react-icons/fi";

import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";
import { toaster } from "@/components/ui/toaster";
import {
  getSurveyPreview,
  publishSurvey,
  type GetSurveyPreviewResponse,
  type SurveyPublishOption,
} from "@/services/creatorSurveyService";
import type { SurveyMethodId } from "../select-method/selectMethodTypes";

type PublishOption = "now" | "later" | "draft";

type PreviewSubmitRightPanelProps = {
  selectedMethod: SurveyMethodId;
};

function getStoredDraftId() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("creatorSurveyDraftId");
}

function updateStoredDraftAfterPublish(
  surveyId: string,
  updates: Record<string, unknown>
) {
  if (typeof window === "undefined") {
    return;
  }

  const storedDraft = window.localStorage.getItem("creatorSurveyDraft");

  if (!storedDraft) {
    return;
  }

  try {
    const parsedDraft = JSON.parse(storedDraft) as Record<string, unknown>;

    if (parsedDraft.id !== surveyId) {
      return;
    }

    window.localStorage.setItem(
      "creatorSurveyDraft",
      JSON.stringify({
        ...parsedDraft,
        ...updates,
      })
    );
  } catch {
    // Ignore malformed local draft payloads.
  }
}

function formatAudience(
  audience: GetSurveyPreviewResponse["survey"]["targetAudience"]
) {
  if (!audience) {
    return "Not configured";
  }

  const parts: string[] = [];

  if (audience.city) {
    parts.push(audience.city);
  }

  if (audience.minimumAge !== null || audience.maximumAge !== null) {
    parts.push(`Age ${audience.minimumAge ?? 13}-${audience.maximumAge ?? 100}`);
  }

  parts.push(
    audience.sampleBase
      .toLowerCase()
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );

  return parts.join(", ");
}

function formatCurrency(value?: string | null) {
  const numericValue = Number(value || 0);

  return `LKR ${numericValue.toLocaleString("en-LK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function ChecklistItem({
  label,
  complete,
}: {
  label: string;
  complete: boolean;
}) {
  return (
    <HStack gap="3">
      <Box color={complete ? "green.600" : "brand.mutedText"}>
        <FiCheckCircle />
      </Box>

      <Text fontSize="sm" color={complete ? "brand.dark" : "brand.mutedText"}>
        {label}
      </Text>
    </HStack>
  );
}

function PublishOptionCard({
  value,
  selected,
  title,
  description,
  children,
  onSelect,
}: {
  value: PublishOption;
  selected: PublishOption;
  title: string;
  description: string;
  children?: React.ReactNode;
  onSelect: (value: PublishOption) => void;
}) {
  const isSelected = value === selected;

  return (
    <Box
      as="button"
      onClick={() => onSelect(value)}
      textAlign="left"
      w="100%"
    >
      <HStack align="start" gap="3">
        <Box
          w="18px"
          h="18px"
          borderRadius="full"
          borderWidth="2px"
          borderColor={isSelected ? "brand.primary" : "brand.border"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink="0"
          mt="1"
        >
          {isSelected && (
            <Box w="8px" h="8px" borderRadius="full" bg="brand.primary" />
          )}
        </Box>

        <Box flex="1">
          <Text fontSize="sm" fontWeight="bold" color="brand.dark">
            {title}
          </Text>

          <Text fontSize="sm" color="brand.mutedText" mt="1">
            {description}
          </Text>

          {children}
        </Box>
      </HStack>
    </Box>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <HStack
      justify="space-between"
      borderBottomWidth="1px"
      borderColor="brand.border"
      pb="2"
      gap="4"
    >
      <Text fontSize="sm" color="brand.mutedText">
        {label}
      </Text>

      <Text
        fontSize="sm"
        color="brand.dark"
        fontWeight="semibold"
        textAlign="right"
      >
        {value}
      </Text>
    </HStack>
  );
}

export default function PreviewSubmitRightPanel({
  selectedMethod,
}: PreviewSubmitRightPanelProps) {
  const surveyId = getStoredDraftId();
  const missingDraftError =
    !surveyId
      ? "Survey draft was not found. Please complete the previous steps first."
      : "";
  const [publishOption, setPublishOption] = useState<PublishOption>("now");
  const [scheduledPublishAt, setScheduledPublishAt] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(surveyId));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(missingDraftError);
  const [previewResponse, setPreviewResponse] =
    useState<GetSurveyPreviewResponse | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!surveyId) {
      return;
    }

    getSurveyPreview(surveyId)
      .then((response) => {
        if (isMounted) {
          setPreviewResponse(response);
          setError("");
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Could not load survey readiness"
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [surveyId]);

  const readinessItems = useMemo(() => {
    const readiness = previewResponse?.readiness || {};

    return [
      {
        key: "basicDetails",
        label: "Basic details completed",
        complete: Boolean(
          readiness.basicDetailsCompleted ??
            readiness.basicDetails ??
            readiness.titleAndDescription
        ),
      },
      {
        key: "method",
        label: "Survey method selected",
        complete: Boolean(
          readiness.methodSelected ?? readiness.creationMethod ?? readiness.method
        ),
      },
      {
        key: "questions",
        label: "Questions added successfully",
        complete: Boolean(
          readiness.questionsAdded ?? readiness.questions ?? readiness.questionStep
        ),
      },
      {
        key: "audience",
        label: "Target audience defined",
        complete: Boolean(
          readiness.targetAudienceDefined ??
            readiness.targetAudience ??
            readiness.audience
        ),
      },
      {
        key: "budget",
        label: "Budget configured",
        complete: Boolean(
          readiness.sampleBudgetConfigured ??
            readiness.sampleBudget ??
            readiness.budget
        ),
      },
      {
        key: "reward",
        label: "Reward per participant calculated",
        complete: Boolean(
          readiness.rewardCalculated ??
            readiness.rewardPerParticipant ??
            readiness.rewards
        ),
      },
    ];
  }, [previewResponse]);

  const publishButtonLabel =
    publishOption === "draft"
      ? "Save Survey as Draft"
      : publishOption === "later"
        ? "Schedule Survey"
        : "Publish Survey";

  const handlePublish = async () => {
    if (!surveyId) {
      toaster.create({
        type: "error",
        title: "Survey draft missing",
        description: missingDraftError || "Please complete the previous steps first.",
      });
      return;
    }

    let publishOptionValue: SurveyPublishOption = "PUBLISH_NOW";
    let scheduledPublishAtValue: string | undefined;

    if (publishOption === "draft") {
      publishOptionValue = "SAVE_DRAFT";
    } else if (publishOption === "later") {
      publishOptionValue = "SCHEDULE";

      if (!scheduledPublishAt) {
        toaster.create({
          type: "error",
          title: "Schedule date required",
          description: "Choose a future publish date and time.",
        });
        return;
      }

      const scheduledDate = new Date(scheduledPublishAt);

      if (Number.isNaN(scheduledDate.getTime())) {
        toaster.create({
          type: "error",
          title: "Invalid schedule date",
          description: "Choose a valid publish date and time.",
        });
        return;
      }

      scheduledPublishAtValue = scheduledDate.toISOString();
    }

    try {
      setIsSubmitting(true);
      const response = await publishSurvey({
        surveyId,
        publishOption: publishOptionValue,
        scheduledPublishAt: scheduledPublishAtValue,
      });

      updateStoredDraftAfterPublish(surveyId, {
        status: response.survey.status,
        currentStep: response.survey.currentStep,
        publishedAt: response.survey.publishedAt ?? null,
        scheduledPublishAt: response.survey.scheduledPublishAt ?? null,
      });

      setPreviewResponse((current) =>
        current
          ? {
              ...current,
              canPublish:
                publishOptionValue === "SAVE_DRAFT" ? current.canPublish : false,
            }
          : current
      );

      toaster.create({
        type: "success",
        title:
          publishOptionValue === "SAVE_DRAFT"
            ? "Survey saved as draft"
            : publishOptionValue === "SCHEDULE"
              ? "Survey scheduled"
              : "Survey published",
        description: response.message,
      });
    } catch (publishError) {
      toaster.create({
        type: "error",
        title: "Could not update survey status",
        description:
          publishError instanceof Error
            ? publishError.message
            : "Please try again in a moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardCard p="8">
        <HStack justify="center" gap="3" minH="280px">
          <Spinner color="brand.primary" />
          <Text color="brand.mutedText">Loading publish settings...</Text>
        </HStack>
      </DashboardCard>
    );
  }

  if (error || !previewResponse) {
    return (
      <DashboardCard p="8">
        <Text fontWeight="bold" color="brand.dark">
          We could not load the publish panel.
        </Text>
        <Text color="brand.mutedText" mt="2">
          {error || "Please try again later."}
        </Text>
      </DashboardCard>
    );
  }

  const survey = previewResponse.survey;

  return (
    <VStack align="stretch" gap="5">
      <DashboardCard>
        <HStack justify="space-between" mb="4">
          <Text fontWeight="bold" color="brand.dark">
            Readiness Checklist
          </Text>

          <Box
            px="3"
            py="1"
            borderRadius="8px"
            bg={previewResponse.canPublish ? "#DCFCE7" : "#FEF3C7"}
            color={previewResponse.canPublish ? "green.700" : "#92400E"}
            fontSize="xs"
            fontWeight="bold"
          >
            {previewResponse.canPublish ? "Ready to Publish" : "Needs Review"}
          </Box>
        </HStack>

        <VStack align="stretch" gap="3">
          {readinessItems.map((item) => (
            <ChecklistItem
              key={item.key}
              label={item.label}
              complete={item.complete}
            />
          ))}
        </VStack>
      </DashboardCard>

      <DashboardCard>
        <Text fontWeight="bold" color="brand.dark" mb="5">
          Publishing Options
        </Text>

        <VStack align="stretch" gap="5">
          <PublishOptionCard
            value="now"
            selected={publishOption}
            title="Publish now"
            description="Make your survey live immediately."
            onSelect={setPublishOption}
          />

          <PublishOptionCard
            value="later"
            selected={publishOption}
            title="Schedule for later"
            description="Choose a date and time to publish."
            onSelect={setPublishOption}
          >
            <Box mt="3">
              <Input
                type="datetime-local"
                value={scheduledPublishAt}
                onChange={(event) => setScheduledPublishAt(event.target.value)}
                h="40px"
                borderColor="brand.border"
              />
            </Box>
          </PublishOptionCard>

          <PublishOptionCard
            value="draft"
            selected={publishOption}
            title="Save as draft"
            description="Save your survey and publish later."
            onSelect={setPublishOption}
          />
        </VStack>

        <Box
          mt="5"
          px="4"
          py="3"
          borderRadius="10px"
          bg="brand.lightBlue"
          color="brand.mutedText"
          fontSize="sm"
        >
          <HStack gap="2" align="start">
            <Box color="brand.primary" pt="1">
              <FiInfo />
            </Box>

            <Text>
              Once published, your survey will be available to matched
              participants.
            </Text>
          </HStack>
        </Box>
      </DashboardCard>

      <DashboardCard>
        <HStack gap="2" mb="5">
          <Box
            w="28px"
            h="28px"
            borderRadius="full"
            bg="#FFE999"
            color="#A66A00"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <FiFileText />
          </Box>

          <Text fontWeight="bold" color="brand.dark">
            Survey Summary
          </Text>
        </HStack>

        <VStack align="stretch" gap="3">
          <SummaryItem label="Survey Title" value={survey.title} />
          <SummaryItem
            label="Category"
            value={survey.category
              .toLowerCase()
              .split("_")
              .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
              .join(" ")}
          />
          <SummaryItem
            label="Method"
            value={selectedMethod === "ai" ? "AI-Assisted" : "Manual"}
          />
          <SummaryItem
            label="Audience"
            value={formatAudience(survey.targetAudience)}
          />
          <SummaryItem
            label="Questions Added"
            value={String(survey.questions.length)}
          />
          <SummaryItem
            label="Required Responses"
            value={
              survey.sampleBudget
                ? String(survey.sampleBudget.requiredResponses)
                : "Not configured"
            }
          />
          <SummaryItem
            label="Total Budget"
            value={
              survey.sampleBudget
                ? formatCurrency(survey.sampleBudget.totalBudget)
                : "Not configured"
            }
          />
          <SummaryItem
            label="Reward per Participant"
            value={
              survey.sampleBudget
                ? formatCurrency(survey.sampleBudget.rewardPerParticipant)
                : "Not configured"
            }
          />
        </VStack>

        <Button
          w="100%"
          mt="5"
          color="white"
          onClick={() => {
            void handlePublish();
          }}
          loading={isSubmitting}
        >
          <FiRadio />
          {publishButtonLabel}
        </Button>
      </DashboardCard>
    </VStack>
  );
}
