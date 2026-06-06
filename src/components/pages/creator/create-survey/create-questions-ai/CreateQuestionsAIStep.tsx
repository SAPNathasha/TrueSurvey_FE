"use client";

import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";
import { toaster } from "@/components/ui/toaster";
import { getStoredCreatorId } from "@/lib/creatorIdentity";
import {
  completeQuestionStep,
  generateAiQuestions,
  type GenerateAiQuestionItem,
  type SurveyQuestionType,
} from "@/services/creatorSurveyService";
import {
  Badge,
  Box,
  Button,
  Grid,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiArrowLeft, FiArrowRight, FiRefreshCw, FiSave } from "react-icons/fi";

type CreateQuestionsAIStepProps = {
  defaultTitle: string;
  defaultDescription: string;
  onBack: () => void;
  onNext: () => void;
};

type StoredAiQuestionDraft = {
  surveyTitle: string;
  description: string;
  maxNumberOfQuestions: number;
  questions: GenerateAiQuestionItem[];
};

const creatorAiQuestionDraftKey = "creatorAiQuestionDraft";
const defaultQuestionCount = 10;

const questionTypeLabels: Record<SurveyQuestionType, string> = {
  MULTIPLE_CHOICE: "Multiple Choice",
  SINGLE_SELECT: "Single Select",
  SHORT_ANSWER: "Short Answer",
  LONG_ANSWER: "Long Answer",
  RATING_SCALE: "Rating Scale",
  YES_NO: "Yes / No",
};

function getStoredDraftId() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("creatorSurveyDraftId");
}

function getStoredAiQuestionDraft() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedDraft = window.localStorage.getItem(creatorAiQuestionDraftKey);

  if (!storedDraft) {
    return null;
  }

  try {
    return JSON.parse(storedDraft) as StoredAiQuestionDraft;
  } catch {
    return null;
  }
}

function persistAiQuestionDraft(draft: StoredAiQuestionDraft) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(creatorAiQuestionDraftKey, JSON.stringify(draft));
}

function updateStoredDraftStep(surveyId: string, currentStep: string) {
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
        currentStep,
      })
    );
  } catch {
    // Ignore malformed local draft payloads.
  }
}

function toQuestionPreview(question: GenerateAiQuestionItem) {
  if (question.type === "SHORT_ANSWER" || question.type === "LONG_ANSWER") {
    return "Open text response";
  }

  if (question.type === "RATING_SCALE") {
    return "1, 2, 3, 4, 5";
  }

  if (question.type === "YES_NO") {
    return "Yes / No";
  }

  if (question.options.length > 0) {
    return question.options.join(" | ");
  }

  return "Response options will appear here";
}

export default function CreateQuestionsAIStep({
  defaultTitle,
  defaultDescription,
  onBack,
  onNext,
}: CreateQuestionsAIStepProps) {
  const storedAiDraft = getStoredAiQuestionDraft();
  const creatorId = getStoredCreatorId();
  const surveyId = getStoredDraftId();
  const [surveyTitle, setSurveyTitle] = useState(
    storedAiDraft?.surveyTitle || defaultTitle
  );
  const [description, setDescription] = useState(
    storedAiDraft?.description || defaultDescription
  );
  const [questionCount, setQuestionCount] = useState(
    String(storedAiDraft?.maxNumberOfQuestions ?? defaultQuestionCount)
  );
  const [questions, setQuestions] = useState<GenerateAiQuestionItem[]>(
    storedAiDraft?.questions ?? []
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false);

  const persistCurrentDraft = () => {
    const parsedQuestionCount = Number(questionCount);

    persistAiQuestionDraft({
      surveyTitle: surveyTitle.trim(),
      description: description.trim(),
      maxNumberOfQuestions: Number.isFinite(parsedQuestionCount)
        ? parsedQuestionCount
        : defaultQuestionCount,
      questions,
    });
  };

  const handleGenerateQuestions = async () => {
    if (!surveyId) {
      toaster.create({
        type: "error",
        title: "Survey draft not found",
        description: "Please save the survey basics first and try again.",
      });
      return;
    }

    const trimmedTitle = surveyTitle.trim();
    const trimmedDescription = description.trim();
    const parsedQuestionCount = Number(questionCount);

    if (!trimmedTitle) {
      toaster.create({
        type: "error",
        title: "Survey title is required",
        description: "Add a title so AI can generate relevant questions.",
      });
      return;
    }

    if (!trimmedDescription) {
      toaster.create({
        type: "error",
        title: "Description is required",
        description: "Add a short description to guide the AI generation.",
      });
      return;
    }

    if (
      !Number.isInteger(parsedQuestionCount) ||
      parsedQuestionCount < 1 ||
      parsedQuestionCount > 50
    ) {
      toaster.create({
        type: "error",
        title: "Invalid question count",
        description: "Choose a question count between 1 and 50.",
      });
      return;
    }

    try {
      setIsGenerating(true);

      const response = await generateAiQuestions({
        surveyId,
        title: trimmedTitle,
        description: trimmedDescription,
        maxNumberOfQuestions: parsedQuestionCount,
      });

      const nextQuestions = [...response.questions].sort(
        (left, right) => left.order - right.order
      );

      setSurveyTitle(response.surveyTitle || trimmedTitle);
      setQuestions(nextQuestions);

      persistAiQuestionDraft({
        surveyTitle: response.surveyTitle || trimmedTitle,
        description: trimmedDescription,
        maxNumberOfQuestions: parsedQuestionCount,
        questions: nextQuestions,
      });

      toaster.create({
        type: "success",
        title: "AI questions generated",
        description: response.message,
      });
    } catch (error) {
      toaster.create({
        type: "error",
        title: "Could not generate questions",
        description:
          error instanceof Error
            ? error.message
            : "Please try again in a moment.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = () => {
    persistCurrentDraft();

    toaster.create({
      type: "success",
      title: "Draft saved locally",
      description: "Your AI question draft is ready when you come back.",
    });
  };

  const handleContinue = async () => {
    if (!surveyId || !creatorId) {
      toaster.create({
        type: "error",
        title: "Survey draft not ready",
        description: "Please log in again and reopen this survey draft.",
      });
      return;
    }

    if (questions.length === 0) {
      toaster.create({
        type: "error",
        title: "Generate questions first",
        description: "Create at least one AI question before continuing.",
      });
      return;
    }

    try {
      setIsContinuing(true);
      persistCurrentDraft();

      const response = await completeQuestionStep(creatorId, surveyId);
      updateStoredDraftStep(surveyId, response.survey.currentStep);

      onNext();
    } catch (error) {
      toaster.create({
        type: "error",
        title: "Could not continue",
        description:
          error instanceof Error
            ? error.message
            : "Please try again in a moment.",
      });
    } finally {
      setIsContinuing(false);
    }
  };

  return (
    <VStack align="stretch" gap="6">
      <DashboardCard>
        <VStack align="stretch" gap="5">
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="brand.dark">
              Generate Questions with AI
            </Text>
            <Text mt="1" color="brand.mutedText">
              We&apos;ll use your survey details to generate a first draft of
              questions you can review and refine.
            </Text>
          </Box>

          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="5">
            <Box>
              <Text mb="2" fontSize="sm" fontWeight="semibold" color="brand.dark">
                Survey Title
              </Text>
              <Input
                value={surveyTitle}
                onChange={(event) => setSurveyTitle(event.target.value)}
                placeholder="Customer Satisfaction Survey"
                borderColor="#D9E2F2"
                bg="white"
              />
            </Box>

            <Box>
              <Text mb="2" fontSize="sm" fontWeight="semibold" color="brand.dark">
                Max Number of Questions
              </Text>
              <Input
                type="number"
                min={1}
                max={50}
                value={questionCount}
                onChange={(event) => setQuestionCount(event.target.value)}
                borderColor="#D9E2F2"
                bg="white"
              />
            </Box>
          </Grid>

          <Box>
            <Text mb="2" fontSize="sm" fontWeight="semibold" color="brand.dark">
              Survey Description
            </Text>
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the purpose of this survey and what you want to learn."
              minH="140px"
              resize="vertical"
              borderColor="#D9E2F2"
              bg="white"
            />
          </Box>

          <HStack justify="space-between" flexWrap="wrap" gap="3">
            <Text fontSize="sm" color="brand.mutedText">
              Generated questions: {questions.length}
            </Text>

            <Button
              bg="brand.primary"
              color="white"
              _hover={{ bg: "brand.primary" }}
              loading={isGenerating}
              onClick={handleGenerateQuestions}
            >
              <FiRefreshCw />
              Generate Questions with AI
            </Button>
          </HStack>
        </VStack>
      </DashboardCard>

      <DashboardCard>
        <VStack align="stretch" gap="4">
          <HStack justify="space-between" align="start" gap="4">
            <Box>
              <Text fontSize="lg" fontWeight="bold" color="brand.dark">
                AI Question Draft
              </Text>
              <Text fontSize="sm" color="brand.mutedText" mt="1">
                Review the generated questions before moving to target audience.
              </Text>
            </Box>

            <Badge
              borderRadius="full"
              px="3"
              py="1"
              bg="#EEF2FF"
              color="brand.primary"
            >
              {questions.length} Questions
            </Badge>
          </HStack>

          {questions.length === 0 ? (
            <Box
              borderWidth="1px"
              borderStyle="dashed"
              borderColor="#D9E2F2"
              borderRadius="16px"
              px="6"
              py="10"
              textAlign="center"
            >
              <Text fontWeight="semibold" color="brand.dark">
                No AI questions yet
              </Text>
              <Text mt="2" color="brand.mutedText">
                Generate a draft to see suggested questions here.
              </Text>
            </Box>
          ) : (
            <VStack align="stretch" gap="4">
              {questions.map((question) => (
                <Box
                  key={question.id}
                  borderWidth="1px"
                  borderColor="#E7EEF7"
                  borderRadius="16px"
                  px="5"
                  py="4"
                  bg="#FCFDFE"
                >
                  <HStack justify="space-between" align="start" gap="4">
                    <Box>
                      <Text fontSize="sm" color="brand.mutedText">
                        Question {question.order}
                      </Text>
                      <Text mt="1" fontWeight="semibold" color="brand.dark">
                        {question.questionText}
                      </Text>
                    </Box>

                    <VStack align="end" gap="2">
                      <Badge bg="#F3F4F6" color="#374151" borderRadius="full" px="3">
                        {questionTypeLabels[question.type]}
                      </Badge>
                      <Badge
                        bg={question.isRequired ? "#E6F7EC" : "#F9FAFB"}
                        color={question.isRequired ? "#166534" : "#6B7280"}
                        borderRadius="full"
                        px="3"
                      >
                        {question.isRequired ? "Required" : "Optional"}
                      </Badge>
                    </VStack>
                  </HStack>

                  <Box mt="4" bg="white" borderRadius="12px" px="4" py="3">
                    <Text fontSize="sm" color="brand.mutedText">
                      {toQuestionPreview(question)}
                    </Text>
                  </Box>
                </Box>
              ))}
            </VStack>
          )}
        </VStack>
      </DashboardCard>

      <HStack justify="space-between" flexWrap="wrap" gap="3">
        <Button
          variant="outline"
          borderColor="#D9E2F2"
          color="brand.dark"
          onClick={onBack}
        >
          <FiArrowLeft />
          Back
        </Button>

        <HStack gap="3" flexWrap="wrap">
          <Button
            variant="outline"
            borderColor="#D9E2F2"
            color="brand.dark"
            onClick={handleSaveDraft}
          >
            <FiSave />
            Save as Draft
          </Button>

          <Button
            bg="brand.primary"
            color="white"
            _hover={{ bg: "brand.primary" }}
            loading={isContinuing}
            onClick={handleContinue}
          >
            Continue to Target Audience
            <FiArrowRight />
          </Button>
        </HStack>
      </HStack>
    </VStack>
  );
}
