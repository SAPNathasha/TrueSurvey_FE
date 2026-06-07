"use client";

import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";
import { toaster } from "@/components/ui/toaster";
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
  Field,
  Grid,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiRefreshCw, FiSave } from "react-icons/fi";
import { useFormik } from "formik";
import * as Yup from "yup";

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

type AiQuestionFormValues = {
  surveyTitle: string;
  description: string;
  questionCount: string;
};

const aiQuestionSchema = Yup.object({
  surveyTitle: Yup.string()
    .trim()
    .max(150, "Survey title must be 150 characters or fewer.")
    .required("Survey title is required."),
  description: Yup.string()
    .trim()
    .max(1000, "Description must be 1000 characters or fewer.")
    .required("Description is required."),
  questionCount: Yup.string()
    .required("Max number of questions is required.")
    .test(
      "question-count",
      "Choose a question count between 1 and 50.",
      (value) => {
        const numericValue = Number(value);
        return Number.isInteger(numericValue) && numericValue >= 1 && numericValue <= 50;
      }
    ),
});

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
  const surveyId = getStoredDraftId();
  const [questions, setQuestions] = useState<GenerateAiQuestionItem[]>(
    storedAiDraft?.questions ?? []
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false);
  const submitActionRef = useRef<"generate" | "continue">("generate");
  const formik = useFormik<AiQuestionFormValues>({
    initialValues: {
      surveyTitle: storedAiDraft?.surveyTitle || defaultTitle,
      description: storedAiDraft?.description || defaultDescription,
      questionCount: String(
        storedAiDraft?.maxNumberOfQuestions ?? defaultQuestionCount
      ),
    },
    validationSchema: aiQuestionSchema,
    onSubmit: async (values) => {
      if (submitActionRef.current === "generate") {
        await generateQuestions(values);
        return;
      }

      await continueToTargetAudience(values);
    },
  });

  const shouldShowError = (field: keyof AiQuestionFormValues) =>
    Boolean(formik.errors[field] && (formik.touched[field] || formik.submitCount > 0));

  const persistCurrentDraft = (values: AiQuestionFormValues = formik.values) => {
    const parsedQuestionCount = Number(values.questionCount);

    persistAiQuestionDraft({
      surveyTitle: values.surveyTitle.trim(),
      description: values.description.trim(),
      maxNumberOfQuestions: Number.isFinite(parsedQuestionCount)
        ? parsedQuestionCount
        : defaultQuestionCount,
      questions,
    });
  };

  const generateQuestions = async (values: AiQuestionFormValues) => {
    if (!surveyId) {
      toaster.create({
        type: "error",
        title: "Survey draft not found",
        description: "Please save the survey basics first and try again.",
      });
      return;
    }

    const trimmedTitle = values.surveyTitle.trim();
    const trimmedDescription = values.description.trim();
    const parsedQuestionCount = Number(values.questionCount);

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

      setQuestions(nextQuestions);

      persistAiQuestionDraft({
        surveyTitle: response.surveyTitle || trimmedTitle,
        description: trimmedDescription,
        maxNumberOfQuestions: parsedQuestionCount,
        questions: nextQuestions,
      });
      formik.setFieldValue("surveyTitle", response.surveyTitle || trimmedTitle, false);

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
    persistCurrentDraft(formik.values);

    toaster.create({
      type: "success",
      title: "Draft saved locally",
      description: "Your AI question draft is ready when you come back.",
    });
  };

  const continueToTargetAudience = async (values: AiQuestionFormValues) => {
    if (!surveyId) {
      toaster.create({
        type: "error",
        title: "Survey draft not ready",
        description: "Please reopen this survey draft and try again.",
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
      persistCurrentDraft(values);

      const response = await completeQuestionStep(surveyId);
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

  const handleGenerateQuestions = async () => {
    submitActionRef.current = "generate";
    await formik.submitForm();
  };

  const handleContinue = async () => {
    submitActionRef.current = "continue";
    await formik.submitForm();
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
            <Field.Root invalid={shouldShowError("surveyTitle")}>
              <Field.Label mb="2" fontSize="sm" fontWeight="semibold" color="brand.dark">
                Survey Title
              </Field.Label>
              <Input
                name="surveyTitle"
                value={formik.values.surveyTitle}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Customer Satisfaction Survey"
                borderColor="#D9E2F2"
                bg="white"
              />
              <Field.ErrorText>{formik.errors.surveyTitle}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={shouldShowError("questionCount")}>
              <Field.Label mb="2" fontSize="sm" fontWeight="semibold" color="brand.dark">
                Max Number of Questions
              </Field.Label>
              <Input
                name="questionCount"
                type="number"
                min={1}
                max={50}
                value={formik.values.questionCount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                borderColor="#D9E2F2"
                bg="white"
              />
              <Field.ErrorText>{formik.errors.questionCount}</Field.ErrorText>
            </Field.Root>
          </Grid>

          <Field.Root invalid={shouldShowError("description")}>
            <Field.Label mb="2" fontSize="sm" fontWeight="semibold" color="brand.dark">
              Survey Description
            </Field.Label>
            <Textarea
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Describe the purpose of this survey and what you want to learn."
              minH="140px"
              resize="vertical"
              borderColor="#D9E2F2"
              bg="white"
            />
            <Field.ErrorText>{formik.errors.description}</Field.ErrorText>
          </Field.Root>

          <HStack justify="space-between" flexWrap="wrap" gap="3">
            <Text fontSize="sm" color="brand.mutedText">
              Generated questions: {questions.length}
            </Text>

            <Button
              bg="brand.primary"
              color="white"
              _hover={{ bg: "brand.primary" }}
              loading={isGenerating}
              onClick={() => {
                void handleGenerateQuestions();
              }}
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
            onClick={() => {
              void handleContinue();
            }}
          >
            Continue to Target Audience
            <FiArrowRight />
          </Button>
        </HStack>
      </HStack>
    </VStack>
  );
}
