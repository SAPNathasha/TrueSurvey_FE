"use client";

import { toaster } from "@/components/ui/toaster";
import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";
import { getStoredCreatorId } from "@/lib/creatorIdentity";
import {
  completeQuestionStep,
  deleteSurveyQuestion,
  getSurveyQuestions,
  createManualQuestion,
  updateManualQuestion,
  type CreateManualQuestionPayload,
  type SurveyQuestion,
  type SurveyQuestionType,
} from "@/services/creatorSurveyService";
import {
  Box,
  Button,
  Grid,
  HStack,
  IconButton,
  Input,
  NativeSelect,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  FiAlignLeft,
  FiArrowLeft,
  FiArrowRight,
  FiBold,
  FiCheckCircle,
  FiCopy,
  FiFileText,
  FiImage,
  FiItalic,
  FiLink,
  FiList,
  FiPlus,
  FiTrash2,
  FiType,
  FiUnderline,
} from "react-icons/fi";

type QuestionType = "multiple-choice" | "single-choice" | "short-answer" | "rating-scale";

type ManualQuestion = {
  id: string;
  savedQuestionId?: string | null;
  questionText: string;
  questionType: QuestionType;
  options: string[];
  required: boolean;
  isSaved: boolean;
  hasChanges: boolean;
};

type CreateQuestionsManualStepProps = {
  onBack: () => void;
  onNext: () => void;
};

const questionTypeLabels: Record<QuestionType, string> = {
  "multiple-choice": "Multiple Choice",
  "single-choice": "Single Choice",
  "short-answer": "Short Answer",
  "rating-scale": "Rating Scale",
};

const initialQuestions: ManualQuestion[] = [
  {
    id: crypto.randomUUID(),
    questionText: "",
    questionType: "multiple-choice",
    options: ["", ""],
    required: false,
    isSaved: false,
    hasChanges: true,
  },
];

const manualQuestionsStoragePrefix = "creatorManualQuestions";

function getStoredDraftId() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("creatorSurveyDraftId");
}

function getStoredManualQuestions(surveyId: string | null) {
  if (typeof window === "undefined" || !surveyId) {
    return null;
  }

  const stored = window.localStorage.getItem(
    `${manualQuestionsStoragePrefix}:${surveyId}`
  );

  if (!stored) {
    return null;
  }

  try {
    const parsedQuestions = JSON.parse(stored) as Partial<ManualQuestion>[];

    return parsedQuestions.map((question) => {
      const inferredSavedQuestionId =
        typeof question.savedQuestionId === "string" && question.savedQuestionId
          ? question.savedQuestionId
          : typeof question.id === "string" && question.id.startsWith("saved-")
            ? question.id.replace(/^saved-/, "")
            : null;

      const isSaved = Boolean(
        question.isSaved || inferredSavedQuestionId
      );

      return {
        id:
          typeof question.id === "string" && question.id
            ? question.id
            : crypto.randomUUID(),
        savedQuestionId: inferredSavedQuestionId,
        questionText:
          typeof question.questionText === "string" ? question.questionText : "",
        questionType:
          question.questionType === "single-choice" ||
          question.questionType === "short-answer" ||
          question.questionType === "rating-scale"
            ? question.questionType
            : "multiple-choice",
        options: Array.isArray(question.options)
          ? question.options.filter(
              (option): option is string => typeof option === "string"
            )
          : [],
        required: Boolean(question.required),
        isSaved,
        hasChanges: Boolean(question.hasChanges) && !isSaved ? true : Boolean(question.hasChanges),
      } satisfies ManualQuestion;
    });
  } catch {
    return null;
  }
}

function persistManualQuestions(surveyId: string | null, questions: ManualQuestion[]) {
  if (typeof window === "undefined" || !surveyId) {
    return;
  }

  window.localStorage.setItem(
    `${manualQuestionsStoragePrefix}:${surveyId}`,
    JSON.stringify(questions)
  );
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

function toSurveyQuestionType(questionType: QuestionType): SurveyQuestionType {
  if (questionType === "multiple-choice") {
    return "MULTIPLE_CHOICE";
  }

  if (questionType === "single-choice") {
    return "SINGLE_SELECT";
  }

  if (questionType === "short-answer") {
    return "SHORT_ANSWER";
  }

  return "RATING_SCALE";
}

function toManualQuestionType(questionType: SurveyQuestionType): QuestionType {
  if (questionType === "MULTIPLE_CHOICE") {
    return "multiple-choice";
  }

  if (questionType === "SINGLE_SELECT") {
    return "single-choice";
  }

  if (questionType === "SHORT_ANSWER" || questionType === "LONG_ANSWER") {
    return "short-answer";
  }

  return "rating-scale";
}

function toManualQuestion(question: SurveyQuestion): ManualQuestion {
  return {
    id: `saved-${question.id}`,
    savedQuestionId: question.id,
    questionText: question.questionText,
    questionType: toManualQuestionType(question.type),
    options: question.options.map((option) => option.optionText),
    required: question.isRequired,
    isSaved: true,
    hasChanges: false,
  };
}

function validateQuestion(question: ManualQuestion) {
  if (!question.questionText.trim()) {
    return "Each question needs question text.";
  }

  const isOptionBased =
    question.questionType === "multiple-choice" ||
    question.questionType === "single-choice";

  if (!isOptionBased) {
    return null;
  }

  const trimmedOptions = question.options.map((option) => option.trim());

  if (trimmedOptions.length < 2) {
    return "Choice questions need at least two options.";
  }

  if (trimmedOptions.some((option) => !option)) {
    return "Choice question options cannot be empty.";
  }

  if (trimmedOptions.length > 20) {
    return "A question can have at most 20 options.";
  }

  return null;
}

function ToolbarButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <IconButton
      aria-label={label}
      variant="ghost"
      size="sm"
      color="brand.dark"
      _hover={{ bg: "brand.lightBlue", color: "brand.primary" }}
    >
      {children}
    </IconButton>
  );
}

function RequiredToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <HStack gap="2">
      <Text fontSize="sm" fontWeight="medium" color="brand.dark">
        Required
      </Text>

      <Box
        as="button"
        onClick={onChange}
        w="42px"
        h="22px"
        borderRadius="999px"
        bg={checked ? "brand.primary" : "#D7DEE8"}
        position="relative"
        transition="0.2s"
      >
        <Box
          w="18px"
          h="18px"
          borderRadius="full"
          bg="white"
          position="absolute"
          top="2px"
          left={checked ? "22px" : "2px"}
          transition="0.2s"
          boxShadow="sm"
        />
      </Box>
    </HStack>
  );
}

function ManualQuestionCard({
  question,
  questionIndex,
  onChangeQuestionText,
  onChangeQuestionType,
  onChangeOption,
  onAddOption,
  onRemoveOption,
  onDuplicate,
  onDelete,
  onToggleRequired,
}: {
  question: ManualQuestion;
  questionIndex: number;
  onChangeQuestionText: (value: string) => void;
  onChangeQuestionType: (value: QuestionType) => void;
  onChangeOption: (optionIndex: number, value: string) => void;
  onAddOption: () => void;
  onRemoveOption: (optionIndex: number) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleRequired: () => void;
}) {
  const isOptionBased =
    question.questionType === "multiple-choice" ||
    question.questionType === "single-choice";

  return (
    <DashboardCard p="0" overflow="hidden">
      <Box h="5px" bg="brand.primary" />

      <Box p={{ base: "5", lg: "6" }}>
        <HStack justify="space-between" mb="4" flexWrap="wrap" gap="3">
          <HStack gap="3">
            <Box
              w="42px"
              h="42px"
              borderRadius="12px"
              bg="brand.lightBlue"
              color="brand.primary"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontWeight="bold"
            >
              Q{questionIndex + 1}
            </Box>

            <Box>
              <Text fontWeight="bold" color="brand.dark">
                Question {questionIndex + 1}
              </Text>

              <Text fontSize="sm" color="brand.mutedText">
                Add your question and answer format.
              </Text>
            </Box>
          </HStack>

          <Box minW={{ base: "100%", md: "260px" }}>
            <NativeSelect.Root>
              <NativeSelect.Field
                value={question.questionType}
                onChange={(event) =>
                  onChangeQuestionType(event.target.value as QuestionType)
                }
                h="44px"
                borderColor="brand.border"
                bg="brand.lightBlue"
                color="brand.dark"
                fontWeight="medium"
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="single-choice">Single Choice</option>
                <option value="short-answer">Short Answer</option>
                <option value="rating-scale">Rating Scale</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Box>
        </HStack>

        <Box
          borderWidth="1px"
          borderColor="brand.border"
          borderRadius="14px"
          bg="#FBFCFF"
          p="4"
        >
          <HStack gap="1" mb="4" flexWrap="wrap">
            <ToolbarButton label="Bold">
              <FiBold />
            </ToolbarButton>

            <ToolbarButton label="Italic">
              <FiItalic />
            </ToolbarButton>

            <ToolbarButton label="Underline">
              <FiUnderline />
            </ToolbarButton>

            <ToolbarButton label="Text">
              <FiType />
            </ToolbarButton>

            <ToolbarButton label="Link">
              <FiLink />
            </ToolbarButton>

            <ToolbarButton label="Image">
              <FiImage />
            </ToolbarButton>

            <ToolbarButton label="List">
              <FiList />
            </ToolbarButton>

            <ToolbarButton label="Align">
              <FiAlignLeft />
            </ToolbarButton>
          </HStack>

          <Input
            value={question.questionText}
            onChange={(event) => onChangeQuestionText(event.target.value)}
            placeholder="Add Question"
            h="54px"
            bg="white"
            borderColor="brand.border"
            borderRadius="12px"
            px="5"
            fontWeight="medium"
            _focus={{
              borderColor: "brand.primary",
              boxShadow: "0 0 0 1px #0015D6",
            }}
          />

          {isOptionBased && (
            <VStack align="stretch" gap="3" mt="4">
              {question.options.map((option, optionIndex) => (
                <HStack key={optionIndex} gap="3">
                  <Box
                    w="18px"
                    h="18px"
                    borderRadius={
                      question.questionType === "multiple-choice"
                        ? "4px"
                        : "full"
                    }
                    borderWidth="2px"
                    borderColor="brand.primary"
                    bg="brand.lightBlue"
                    flexShrink="0"
                  />

                  <Input
                    value={option}
                    onChange={(event) =>
                      onChangeOption(optionIndex, event.target.value)
                    }
                    placeholder={`Add Option ${optionIndex + 1}`}
                    h="48px"
                    bg="white"
                    borderColor="brand.border"
                    borderRadius="12px"
                    px="5"
                    _focus={{
                      borderColor: "brand.primary",
                      boxShadow: "0 0 0 1px #0015D6",
                    }}
                  />

                  {question.options.length > 2 && (
                    <IconButton
                      aria-label="Remove option"
                      variant="ghost"
                      color="red.500"
                      onClick={() => onRemoveOption(optionIndex)}
                    >
                      <FiTrash2 />
                    </IconButton>
                  )}
                </HStack>
              ))}

              <Button
                variant="ghost"
                justifyContent="flex-start"
                w="fit-content"
                color="brand.primary"
                onClick={onAddOption}
              >
                <FiPlus />
                Add Option
              </Button>
            </VStack>
          )}

          {question.questionType === "short-answer" && (
            <Textarea
              mt="4"
              placeholder="Participant will type a short answer here"
              minH="90px"
              resize="none"
              borderColor="brand.border"
              borderRadius="12px"
              bg="white"
              readOnly
            />
          )}

          {question.questionType === "rating-scale" && (
            <Box mt="4">
              <Text fontSize="sm" fontWeight="semibold" mb="3">
                Rating Preview
              </Text>

              <HStack gap="4" flexWrap="wrap">
                {[1, 2, 3, 4, 5].map((rate) => (
                  <Box
                    key={rate}
                    w="44px"
                    h="44px"
                    borderRadius="full"
                    borderWidth="1px"
                    borderColor="brand.border"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="bold"
                    color="brand.primary"
                    bg="white"
                  >
                    {rate}
                  </Box>
                ))}
              </HStack>
            </Box>
          )}
        </Box>

        <HStack justify="flex-end" mt="5" gap="3" flexWrap="wrap">
          <RequiredToggle
            checked={question.required}
            onChange={onToggleRequired}
          />

          <IconButton
            aria-label="Duplicate question"
            variant="outline"
            onClick={onDuplicate}
          >
            <FiCopy />
          </IconButton>

          <IconButton
            aria-label="Delete question"
            variant="outline"
            color="red.500"
            onClick={onDelete}
          >
            <FiTrash2 />
          </IconButton>
        </HStack>
      </Box>
    </DashboardCard>
  );
}

export default function CreateQuestionsManualStep({
  onBack,
  onNext,
}: CreateQuestionsManualStepProps) {
  const creatorId = getStoredCreatorId();
  const surveyId = getStoredDraftId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("Survey Basic Information");
  const [sectionDescription, setSectionDescription] = useState(
    "Create your survey questions manually. Add question types, options, and required fields."
  );
  const [questions, setQuestions] = useState<ManualQuestion[]>(
    () => getStoredManualQuestions(surveyId) || initialQuestions
  );

  useEffect(() => {
    if (!creatorId || !surveyId) {
      return;
    }

    let isMounted = true;

    const loadSurveyQuestions = async () => {
      try {
        setIsLoadingQuestions(true);
        const response = await getSurveyQuestions(creatorId, surveyId);

        if (!isMounted) {
          return;
        }

        const savedQuestions = response.questions.map(toManualQuestion);

        setQuestions((currentQuestions) => {
          const unsavedQuestions = currentQuestions.filter(
            (question) => !question.isSaved && !question.savedQuestionId
          );
          const nextQuestions =
            savedQuestions.length > 0
              ? [...savedQuestions, ...unsavedQuestions]
              : unsavedQuestions.length > 0
                ? unsavedQuestions
                : initialQuestions;

          persistManualQuestions(surveyId, nextQuestions);
          return nextQuestions;
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        toaster.create({
          type: "error",
          title: "Could not load survey questions",
          description:
            error instanceof Error ? error.message : "Please try again in a moment.",
        });
      } finally {
        if (isMounted) {
          setIsLoadingQuestions(false);
        }
      }
    };

    void loadSurveyQuestions();

    return () => {
      isMounted = false;
    };
  }, [creatorId, surveyId]);

  const updateQuestion = (
    questionId: string,
    changes: Partial<ManualQuestion>
  ) => {
    setQuestions((currentQuestions) => {
      const nextQuestions = currentQuestions.map((question) =>
        question.id === questionId
          ? question.isSaved
            ? { ...question, ...changes, hasChanges: true }
            : {
                ...question,
                ...changes,
                isSaved: false,
                savedQuestionId: null,
                hasChanges: true,
              }
          : question
      );
      persistManualQuestions(surveyId, nextQuestions);
      return nextQuestions;
    });
  };

  const duplicateQuestion = (questionId: string) => {
    const questionToDuplicate = questions.find(
      (question) => question.id === questionId
    );

    if (!questionToDuplicate) return;

    setQuestions((currentQuestions) => {
      const nextQuestions = [
        ...currentQuestions,
        {
          ...questionToDuplicate,
          id: crypto.randomUUID(),
          savedQuestionId: null,
          questionText: `${questionToDuplicate.questionText} Copy`,
          isSaved: false,
          hasChanges: true,
        },
      ];
      persistManualQuestions(surveyId, nextQuestions);
      return nextQuestions;
    });
  };

  const deleteQuestion = async (questionId: string) => {
    const question = questions.find((item) => item.id === questionId);

    if (!question) {
      return;
    }

    if (!question.isSaved) {
      setQuestions((currentQuestions) => {
        const nextQuestions = currentQuestions.filter(
          (currentQuestion) => currentQuestion.id !== questionId
        );
        persistManualQuestions(surveyId, nextQuestions);
        return nextQuestions;
      });
      return;
    }

    if (!creatorId) {
      toaster.create({
        type: "error",
        title: "Creator not found",
        description: "Please log in again to continue editing your survey.",
      });
      return;
    }

    if (!surveyId || !question.savedQuestionId) {
      toaster.create({
        type: "error",
        title: "Question could not be deleted",
        description: "The saved question reference is missing.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await deleteSurveyQuestion(
        creatorId,
        surveyId,
        question.savedQuestionId
      );

      setQuestions((currentQuestions) => {
        const nextQuestions = currentQuestions.filter(
          (currentQuestion) => currentQuestion.id !== questionId
        );
        persistManualQuestions(surveyId, nextQuestions);
        return nextQuestions;
      });

      toaster.create({
        type: "success",
        title: "Question deleted",
        description: response.message,
      });
    } catch (error) {
      toaster.create({
        type: "error",
        title: "Could not delete question",
        description:
          error instanceof Error ? error.message : "Please try again in a moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const changeQuestionType = (
    questionId: string,
    questionType: QuestionType
  ) => {
    updateQuestion(questionId, {
      questionType,
      options:
        questionType === "multiple-choice" || questionType === "single-choice"
          ? ["", ""]
          : [],
    });
  };

  const addOption = (questionId: string) => {
    setQuestions((currentQuestions) => {
      const nextQuestions = currentQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: [...question.options, ""],
              isSaved: question.isSaved,
              savedQuestionId: question.savedQuestionId ?? null,
              hasChanges: true,
            }
          : question
      );
      persistManualQuestions(surveyId, nextQuestions);
      return nextQuestions;
    });
  };

  const updateOption = (
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    setQuestions((currentQuestions) => {
      const nextQuestions = currentQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((option, index) =>
                index === optionIndex ? value : option
              ),
              isSaved: question.isSaved,
              savedQuestionId: question.savedQuestionId ?? null,
              hasChanges: true,
            }
          : question
      );
      persistManualQuestions(surveyId, nextQuestions);
      return nextQuestions;
    });
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    setQuestions((currentQuestions) => {
      const nextQuestions = currentQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.filter(
                (_, index) => index !== optionIndex
              ),
              isSaved: question.isSaved,
              savedQuestionId: question.savedQuestionId ?? null,
              hasChanges: true,
            }
          : question
      );
      persistManualQuestions(surveyId, nextQuestions);
      return nextQuestions;
    });
  };

  const addQuestion = () => {
    setQuestions((currentQuestions) => {
      const nextQuestion: ManualQuestion = {
        id: crypto.randomUUID(),
        savedQuestionId: null,
        questionText: "",
        questionType: "multiple-choice",
        options: ["", ""],
        required: true,
        isSaved: false,
        hasChanges: true,
      };

      const nextQuestions: ManualQuestion[] = [
        ...currentQuestions,
        nextQuestion,
      ];
      persistManualQuestions(surveyId, nextQuestions);
      return nextQuestions;
    });
  };

  const saveQuestions = async (advanceToNextStep: boolean) => {
    if (!creatorId) {
      toaster.create({
        type: "error",
        title: "Creator not found",
        description: "Please log in again to continue editing your survey.",
      });
      return;
    }

    if (!surveyId) {
      toaster.create({
        type: "error",
        title: "Survey draft missing",
        description: "Create and save the survey draft before adding questions.",
      });
      return;
    }

    const unsavedQuestions = questions.filter((question) => !question.isSaved);
    const changedSavedQuestions = questions.filter(
      (question) =>
        question.isSaved && question.hasChanges && Boolean(question.savedQuestionId)
    );

    for (const question of [...unsavedQuestions, ...changedSavedQuestions]) {
      const validationMessage = validateQuestion(question);

      if (validationMessage) {
        toaster.create({
          type: "error",
          title: `${questionTypeLabels[question.questionType]} is incomplete`,
          description: validationMessage,
        });
        return;
      }
    }

    if (unsavedQuestions.length === 0 && changedSavedQuestions.length === 0) {
      if (advanceToNextStep) {
        try {
          setIsSubmitting(true);
          const response = await completeQuestionStep(creatorId, surveyId);
          updateStoredDraftStep(surveyId, response.survey.currentStep);

          toaster.create({
            type: "success",
            title: "Question step completed",
            description: response.message,
          });

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
          setIsSubmitting(false);
        }
      } else {
        toaster.create({
          type: "info",
          title: "No new questions to save",
        });
      }

      return;
    }

    try {
      setIsSubmitting(true);

      const savedQuestionIds = new Map<string, string>();

      for (const question of unsavedQuestions) {
        const payload: CreateManualQuestionPayload = {
          creatorId,
          surveyId,
          questionText: question.questionText.trim(),
          type: toSurveyQuestionType(question.questionType),
          isRequired: question.required,
        };

        const isOptionBased =
          question.questionType === "multiple-choice" ||
          question.questionType === "single-choice";

        if (isOptionBased) {
          payload.options = question.options.map((option) => ({
            optionText: option.trim(),
          }));
        }

        const response = await createManualQuestion(payload);
        savedQuestionIds.set(question.id, response.question.id);
      }

      for (const question of changedSavedQuestions) {
        const isOptionBased =
          question.questionType === "multiple-choice" ||
          question.questionType === "single-choice";

        await updateManualQuestion({
          creatorId,
          surveyId,
          questionId: question.savedQuestionId as string,
          questionText: question.questionText.trim(),
          type: toSurveyQuestionType(question.questionType),
          isRequired: question.required,
          options: isOptionBased
            ? question.options.map((option) => ({
                optionText: option.trim(),
              }))
            : [],
        });
      }

      const latestQuestionsResponse = await getSurveyQuestions(creatorId, surveyId);
      const refreshedSavedQuestions = latestQuestionsResponse.questions.map(
        toManualQuestion
      );

      setQuestions((currentQuestions) => {
        const unsavedQuestionsAfterSave = currentQuestions.filter(
          (question) =>
            !question.isSaved &&
            !savedQuestionIds.has(question.id) &&
            !question.savedQuestionId
        );
        const nextQuestions =
          refreshedSavedQuestions.length > 0
            ? [...refreshedSavedQuestions, ...unsavedQuestionsAfterSave]
            : unsavedQuestionsAfterSave.length > 0
              ? unsavedQuestionsAfterSave
              : initialQuestions;
        persistManualQuestions(surveyId, nextQuestions);
        return nextQuestions;
      });

      toaster.create({
        type: "success",
        title: advanceToNextStep ? "Questions saved" : "Draft updated",
        description:
          changedSavedQuestions.length > 0
            ? "Manual questions updated successfully"
            : "Manual questions saved successfully",
      });

      if (advanceToNextStep) {
        const completionResponse = await completeQuestionStep(creatorId, surveyId);
        updateStoredDraftStep(surveyId, completionResponse.survey.currentStep);

        toaster.create({
          type: "success",
          title: "Question step completed",
          description: completionResponse.message,
        });

        onNext();
      }
    } catch (error) {
      toaster.create({
        type: "error",
        title: "Could not save questions",
        description:
          error instanceof Error ? error.message : "Please try again in a moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <FiCheckCircle />
          </Box>

          <Text fontSize="sm" color="brand.mutedText">
            Create your survey questions manually. You can add different
            question types, answer options, required fields, and edit each
            question before moving to the target audience step.
          </Text>
        </HStack>
      </Box>

      <DashboardCard p="0" overflow="hidden" >
        <Box h="5px" bg="brand.primary" />

        <Box p={{ base: "5", lg: "7" }}>
          <VStack align="stretch" gap="4">
            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb="2" >
                Section Title
              </Text>

              <Input
                value={sectionTitle}
                onChange={(event) => setSectionTitle(event.target.value)}
                h="50px"
                borderColor="brand.border"
                borderRadius="12px"
                fontSize="lg"
                fontWeight="bold"
                textAlign="center"
                _focus={{
                  borderColor: "brand.primary",
                  boxShadow: "0 0 0 1px #0015D6",
                }}
              />
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb="2">
                Section Description
              </Text>

              <Textarea
                value={sectionDescription}
                onChange={(event) => setSectionDescription(event.target.value)}
                minH="80px"
                resize="none"
                borderColor="brand.border"
                borderRadius="12px"
                px={5}
                py={3}
                _focus={{
                  borderColor: "brand.primary",
                  boxShadow: "0 0 0 1px #0015D6",
                }}
              />
            </Box>
          </VStack>
        </Box>
      </DashboardCard>

      <VStack align="stretch" gap="5">
        {questions.map((question, index) => (
          <ManualQuestionCard
            key={question.id}
            question={question}
            questionIndex={index}
            onChangeQuestionText={(value) =>
              updateQuestion(question.id, { questionText: value })
            }
            onChangeQuestionType={(value) =>
              changeQuestionType(question.id, value)
            }
            onChangeOption={(optionIndex, value) =>
              updateOption(question.id, optionIndex, value)
            }
            onAddOption={() => addOption(question.id)}
            onRemoveOption={(optionIndex) =>
              removeOption(question.id, optionIndex)
            }
            onDuplicate={() => duplicateQuestion(question.id)}
            onDelete={() => {
              void deleteQuestion(question.id);
            }}
            onToggleRequired={() =>
              updateQuestion(question.id, { required: !question.required })
            }
          />
        ))}
      </VStack>

      <Button
        mt="5"
        variant="outline"
        onClick={addQuestion}
        borderStyle="dashed"
      >
        <FiPlus />
        Add Another Question
      </Button>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr 1fr" }} gap="4" mt="5">
        <Button h="46px" variant="outline" onClick={onBack}>
          <FiArrowLeft />
          Back to Select Method
        </Button>

        <Button
          h="46px"
          variant="outline"
          onClick={() => {
            void saveQuestions(false);
          }}
          loading={isSubmitting || isLoadingQuestions}
        >
          <FiFileText />
          Save as Draft
        </Button>

        <Button
          h="46px"
          color="white"
          onClick={() => {
            void saveQuestions(true);
          }}
          loading={isSubmitting || isLoadingQuestions}
        >
          Continue to Target Audience
          <FiArrowRight />
        </Button>
      </Grid>
    </Box>
  );
}
