"use client";

import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiCheckSquare,
  FiClock,
  FiEdit2,
  FiFileText,
  FiGift,
  FiGlobe,
  FiInfo,
  FiMonitor,
  FiSave,
  FiSmartphone,
  FiTag,
  FiUsers,
} from "react-icons/fi";

import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";
import { getStoredCreatorId } from "@/lib/creatorIdentity";
import {
  getSurveyPreview,
  type SurveyPreviewQuestion,
  type SurveyPreviewData,
} from "@/services/creatorSurveyService";

type PreviewSubmitStepProps = {
  onBack: () => void;
};

type PreviewMode = "desktop" | "mobile";

type DetailItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

type QuestionOverviewItemProps = {
  questionNumber: string;
  question: string;
  type: string;
  tagBg: string;
  tagColor: string;
};

function getStoredDraftId() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("creatorSurveyDraftId");
}

function toDisplayCategory(category: string) {
  return category
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function toDisplayMethod(method: string | null) {
  if (method === "AI_ASSISTED") {
    return "AI-Assisted";
  }

  if (method === "MANUAL") {
    return "Manual";
  }

  return "Not selected";
}

function toQuestionTypeMeta(questionType: string) {
  if (questionType === "RATING_SCALE") {
    return {
      label: "Rating Scale",
      bg: "#EAF2FF",
      color: "#0015D6",
    };
  }

  if (questionType === "MULTIPLE_CHOICE") {
    return {
      label: "Multiple Choice",
      bg: "#F3E8FF",
      color: "#6D28D9",
    };
  }

  if (questionType === "SINGLE_SELECT") {
    return {
      label: "Single Choice",
      bg: "#FFF7ED",
      color: "#C2410C",
    };
  }

  if (questionType === "SHORT_ANSWER" || questionType === "LONG_ANSWER") {
    return {
      label: "Short Answer",
      bg: "#E7FBEF",
      color: "#087A35",
    };
  }

  if (questionType === "YES_NO") {
    return {
      label: "Yes / No",
      bg: "#FCE7F3",
      color: "#BE185D",
    };
  }

  return {
    label: "Question",
    bg: "#E7FBEF",
    color: "#087A35",
  };
}

function formatAudience(audience: SurveyPreviewData["targetAudience"]) {
  if (!audience) {
    return "Not configured";
  }

  const parts: string[] = [];

  if (audience.city) {
    parts.push(audience.city);
  }

  if (audience.minimumAge !== null || audience.maximumAge !== null) {
    parts.push(
      `Age ${audience.minimumAge ?? 13}-${audience.maximumAge ?? 100}`
    );
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

function formatMoney(value?: string | number | null) {
  const numericValue = typeof value === "string" ? Number(value) : value ?? 0;

  return `LKR ${numericValue.toLocaleString("en-LK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function DetailItem({ icon, label, value }: DetailItemProps) {
  return (
    <HStack
      gap="3"
      align="center"
      borderRightWidth={{ base: "0", md: "1px" }}
      borderBottomWidth={{ base: "1px", md: "0" }}
      borderColor="brand.border"
      p="4"
      minH="82px"
    >
      <Box color="brand.primary" fontSize="24px" flexShrink="0">
        {icon}
      </Box>

      <Box>
        <Text fontSize="xs" color="brand.mutedText" fontWeight="semibold">
          {label}
        </Text>

        <Text fontSize="sm" color="brand.dark" fontWeight="bold" mt="1">
          {value}
        </Text>
      </Box>
    </HStack>
  );
}

function QuestionOverviewItem({
  questionNumber,
  question,
  type,
  tagBg,
  tagColor,
}: QuestionOverviewItemProps) {
  return (
    <HStack
      justify="space-between"
      gap="4"
      borderBottomWidth="1px"
      borderColor="brand.border"
      py="3"
    >
      <HStack gap="4">
        <Text color="brand.primary" fontWeight="bold" fontSize="sm">
          {questionNumber}
        </Text>

        <Text fontSize="sm" color="brand.dark" fontWeight="medium">
          {question}
        </Text>
      </HStack>

      <Box
        px="3"
        py="1"
        borderRadius="8px"
        bg={tagBg}
        color={tagColor}
        fontSize="xs"
        fontWeight="bold"
        whiteSpace="nowrap"
      >
        {type}
      </Box>
    </HStack>
  );
}

function QuestionPreview({
  question,
  index,
}: {
  question: SurveyPreviewQuestion;
  index: number;
}) {
  const typeMeta = toQuestionTypeMeta(question.type);

  return (
    <Box
      borderWidth="1px"
      borderColor="brand.border"
      borderRadius="12px"
      p="5"
    >
      <HStack align="start" gap="4">
        <Box
          w="28px"
          h="28px"
          borderRadius="6px"
          bg="brand.primary"
          color="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="sm"
          fontWeight="bold"
          flexShrink="0"
        >
          {index + 1}
        </Box>

        <Box flex="1">
          <Text fontWeight="bold" color="brand.dark">
            {question.questionText}
          </Text>

          <Text fontSize="sm" color="brand.mutedText" mt="2">
            {typeMeta.label}
            {question.isRequired ? " • Required" : " • Optional"}
          </Text>

          {question.type === "RATING_SCALE" && (
            <>
              <HStack justify="space-between" mt="5" maxW="620px">
                {[1, 2, 3, 4, 5].map((number) => (
                  <Box
                    key={number}
                    w="48px"
                    h="48px"
                    borderRadius="full"
                    borderWidth="1px"
                    borderColor="#BFD0FF"
                    color="brand.primary"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="bold"
                  >
                    {number}
                  </Box>
                ))}
              </HStack>
            </>
          )}

          {question.type !== "RATING_SCALE" &&
            question.options.length > 0 &&
            question.options.map((option) => (
              <HStack gap="3" mt="4" key={option.id}>
                <Box
                  w="18px"
                  h="18px"
                  borderRadius={
                    question.type === "MULTIPLE_CHOICE" ? "4px" : "full"
                  }
                  borderWidth="1px"
                  borderColor="brand.mutedText"
                />
                <Text fontSize="sm" color="brand.dark">
                  {option.optionText}
                </Text>
              </HStack>
            ))}

          {question.type === "SHORT_ANSWER" && (
            <Box
              mt="4"
              borderWidth="1px"
              borderColor="brand.border"
              borderRadius="10px"
              p="3"
              color="brand.mutedText"
              fontSize="sm"
            >
              Participant will type a short answer here
            </Box>
          )}
        </Box>
      </HStack>
    </Box>
  );
}

export default function PreviewSubmitStep({ onBack }: PreviewSubmitStepProps) {
  const creatorId = getStoredCreatorId();
  const surveyId = getStoredDraftId();
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const missingDraftError =
    !creatorId || !surveyId
      ? "Survey draft was not found. Please complete the previous steps first."
      : "";
  const [isLoading, setIsLoading] = useState(Boolean(creatorId && surveyId));
  const [error, setError] = useState(missingDraftError);
  const [previewData, setPreviewData] = useState<SurveyPreviewData | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!creatorId || !surveyId) {
      return;
    }

    getSurveyPreview(creatorId, surveyId)
      .then((response) => {
        if (isMounted) {
          setPreviewData(response.survey);
          setError("");
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Could not load survey preview"
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
  }, [creatorId, surveyId]);

  const previewQuestions = useMemo(
    () => previewData?.questions.slice(0, 2) ?? [],
    [previewData]
  );

  if (isLoading) {
    return (
      <DashboardCard p="8">
        <Flex align="center" justify="center" gap="3" minH="320px">
          <Spinner color="brand.primary" />
          <Text color="brand.mutedText">Loading survey preview...</Text>
        </Flex>
      </DashboardCard>
    );
  }

  if (error || !previewData) {
    return (
      <DashboardCard p="8">
        <Text fontWeight="bold" color="brand.dark">
          We could not load the preview.
        </Text>
        <Text color="brand.mutedText" mt="2">
          {error || "Please try again later."}
        </Text>
      </DashboardCard>
    );
  }

  const audienceSummary = formatAudience(previewData.targetAudience);
  const rewardPerParticipant = previewData.sampleBudget
    ? formatMoney(previewData.sampleBudget.rewardPerParticipant)
    : "Not configured";
  const totalBudget = previewData.sampleBudget
    ? formatMoney(previewData.sampleBudget.totalBudget)
    : "Not configured";
  const commission = previewData.sampleBudget
    ? `${Number(previewData.sampleBudget.platformCommissionPercentage).toLocaleString(
        "en-LK",
        {
          maximumFractionDigits: 2,
        }
      )}%`
    : "Not configured";

  return (
    <Box>
      <Box
        bg="brand.lightBlue"
        borderWidth="1px"
        borderColor="#D7E3FF"
        borderRadius="12px"
        px="5"
        py="4"
        mb="5"
      >
        <HStack gap="3" align="start">
          <Box color="brand.primary" pt="1">
            <FiInfo />
          </Box>

          <Text fontSize="sm" color="brand.mutedText">
            Review your survey details, preview how it will look to respondents,
            and publish when you are ready.
          </Text>
        </HStack>
      </Box>

      <DashboardCard p="0" overflow="hidden">
        <Box px={{ base: "5", lg: "6" }} py="4">
          <HStack justify="space-between" flexWrap="wrap" gap="4">
            <Text fontSize="xl" fontWeight="bold" color="brand.dark">
              Survey Preview
            </Text>

            <HStack
              borderWidth="1px"
              borderColor="brand.border"
              borderRadius="10px"
              overflow="hidden"
              bg="white"
            >
              <Button
                size="sm"
                borderRadius="0"
                variant={previewMode === "desktop" ? "solid" : "ghost"}
                color={previewMode === "desktop" ? "white" : "brand.mutedText"}
                onClick={() => setPreviewMode("desktop")}
                px={3}
                py={3}
              >
                <FiMonitor />
                Desktop Preview
              </Button>

              <Button
                size="sm"
                borderRadius="0"
                variant={previewMode === "mobile" ? "solid" : "ghost"}
                color={previewMode === "mobile" ? "white" : "brand.mutedText"}
                onClick={() => setPreviewMode("mobile")}
                px={3}
                py={3}
              >
                <FiSmartphone />
                Mobile Preview
              </Button>
            </HStack>
          </HStack>
        </Box>

        <Box
          mx={{ base: "5", lg: "6" }}
          mb="5"
          borderWidth="1px"
          borderColor="brand.border"
          borderRadius="12px"
          bg="#FBFCFF"
          p={{ base: "5", lg: "7" }}
        >
          <Box
            maxW={previewMode === "mobile" ? "430px" : "100%"}
            mx="auto"
            bg="white"
            borderRadius="14px"
            borderWidth="1px"
            borderColor="brand.border"
            p={{ base: "5", lg: "6" }}
            transition="0.2s"
          >
            <VStack align="stretch" gap="5">
              <Box textAlign="center">
                <Box
                  w="48px"
                  h="48px"
                  borderRadius="full"
                  bg="brand.lightBlue"
                  color="brand.primary"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mx="auto"
                  mb="3"
                  fontSize="24px"
                >
                  <FiFileText />
                </Box>

                <Text fontSize={{ base: "xl", lg: "2xl" }} fontWeight="bold">
                  {previewData.title}
                </Text>

                <Text fontSize="sm" color="brand.mutedText" mt="2">
                  {previewData.description}
                </Text>

                <HStack justify="center" gap="4" mt="4">
                  <Text fontSize="xs" color="brand.mutedText">
                    Question 1 of {previewData.questions.length}
                  </Text>

                  <Box w="260px" h="5px" bg="#E5E7EB" borderRadius="999px">
                    <Box
                      w={previewData.questions.length > 0 ? `${100 / previewData.questions.length}%` : "0%"}
                      h="full"
                      bg="brand.primary"
                      borderRadius="999px"
                    />
                  </Box>
                </HStack>
              </Box>

              {previewQuestions.map((question, index) => (
                <QuestionPreview
                  key={question.id}
                  question={question}
                  index={index}
                />
              ))}
            </VStack>
          </Box>
        </Box>

        <HStack
          px={{ base: "5", lg: "6" }}
          py="4"
          borderTopWidth="1px"
          borderColor="brand.border"
          gap="5"
          flexWrap="wrap"
          color="brand.mutedText"
          fontSize="sm"
        >
          <HStack>
            <FiClock />
            <Text>
              Estimated completion time: ~{previewData.estimatedCompletionDays} day
              {previewData.estimatedCompletionDays === 1 ? "" : "s"}
            </Text>
          </HStack>

          <Box h="20px" w="1px" bg="brand.border" />

          <Text>{previewData.questions.length} questions</Text>

          <Box h="20px" w="1px" bg="brand.border" />

          <Text>Thank you for your valuable feedback!</Text>
        </HStack>
      </DashboardCard>

      <Grid templateColumns={{ base: "1fr", xl: "1fr 0.9fr" }} gap="5" mt="5">
        <DashboardCard p="0" overflow="hidden">
          <Box px="5" py="4">
            <Text fontSize="lg" fontWeight="bold" color="brand.dark">
              Survey Details
            </Text>

            <Text fontSize="sm" color="brand.mutedText">
              Launch Summary
            </Text>
          </Box>

          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }}>
            <DetailItem
              icon={<FiTag />}
              label="Category"
              value={toDisplayCategory(previewData.category)}
            />

            <DetailItem
              icon={<FiFileText />}
              label="Questions Added"
              value={String(previewData.questions.length)}
            />

            <DetailItem
              icon={<FiCheckSquare />}
              label="Platform Commission"
              value={commission}
            />

            <DetailItem
              icon={<FiEdit2 />}
              label="Method"
              value={toDisplayMethod(previewData.creationMethod)}
            />

            <DetailItem
              icon={<FiUsers />}
              label="Required Responses"
              value={
                previewData.sampleBudget
                  ? String(previewData.sampleBudget.requiredResponses)
                  : "Not configured"
              }
            />

            <DetailItem
              icon={<FiGift />}
              label="Reward per Participant"
              value={rewardPerParticipant}
            />

            <DetailItem
              icon={<FiUsers />}
              label="Audience"
              value={audienceSummary}
            />

            <DetailItem
              icon={<FiSave />}
              label="Total Budget"
              value={totalBudget}
            />

            <DetailItem
              icon={<FiGlobe />}
              label="Estimated Reach"
              value={
                previewData.targetAudience?.estimatedReach !== null &&
                previewData.targetAudience?.estimatedReach !== undefined
                  ? `${previewData.targetAudience.estimatedReach} respondents`
                  : "Not estimated"
              }
            />
          </Grid>
        </DashboardCard>

        <DashboardCard p="0">
          <Box px="5" py="4">
            <HStack justify="space-between">
              <Text fontSize="lg" fontWeight="bold" color="brand.dark">
                Questions Overview
              </Text>

              <Button variant="ghost" color="brand.primary" size="sm">
                <FiEdit2 />
                Edit Questions
              </Button>
            </HStack>
          </Box>

          <Box px="5" pb="4">
            {previewData.questions.map((question, index) => {
              const typeMeta = toQuestionTypeMeta(question.type);

              return (
                <QuestionOverviewItem
                  key={question.id}
                  questionNumber={`Q${index + 1}`}
                  question={question.questionText}
                  type={typeMeta.label}
                  tagBg={typeMeta.bg}
                  tagColor={typeMeta.color}
                />
              );
            })}
          </Box>
        </DashboardCard>
      </Grid>

      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 1fr 1fr 1.45fr" }}
        gap="4"
        mt="5"
      >
        <Button h="48px" variant="outline" onClick={onBack}>
          <FiArrowLeft />
          Back
        </Button>

        <Button h="48px" variant="outline">
          <FiSave />
          Save as Draft
        </Button>

        <Button h="48px" variant="outline">
          <FiEdit2 />
          Edit Survey
        </Button>

        <Button h="48px" color="white">
          Publish Survey
        </Button>
      </Grid>
    </Box>
  );
}
