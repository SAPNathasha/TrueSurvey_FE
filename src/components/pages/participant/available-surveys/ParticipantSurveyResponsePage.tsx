"use client";

import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Input,
  Spinner,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiCheck,
  FiClock,
  FiGift,
  FiInfo,
  FiSend,
  FiShield,
  FiUsers,
} from "react-icons/fi";

import AuthenticatedShell from "@/components/layout/AuthenticatedShell";
import { toaster } from "@/components/ui/toaster";
import { getStoredParticipantId } from "@/lib/participantIdentity";
import {
  getParticipantSurveyDetail,
  submitParticipantSurveyResponse,
  type ParticipantSurveyDetail,
  type ParticipantSurveyQuestion,
  type ParticipantSurveyQuestionType,
  type SubmitParticipantSurveyResponsePayload,
} from "@/services/participantSurveyService";

type ParticipantSurveyResponsePageProps = {
  surveyId: string;
};

type AnswerValue = string | string[] | number | boolean | null;

function DashboardCard({
  children,
  ...props
}: React.ComponentProps<typeof Box>) {
  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="brand.border"
      borderRadius="16px"
      boxShadow="0 10px 30px rgba(15, 23, 42, 0.04)"
      {...props}
    >
      {children}
    </Box>
  );
}

function formatMoney(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString("en-LK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

function formatQuestionType(type: ParticipantSurveyQuestionType) {
  if (type === "MULTIPLE_CHOICE") {
    return "Multiple Choice";
  }

  if (type === "SINGLE_SELECT") {
    return "Single Choice";
  }

  if (type === "RATING_SCALE") {
    return "Rating Scale";
  }

  if (type === "LONG_ANSWER") {
    return "Long Answer";
  }

  if (type === "YES_NO") {
    return "Yes / No";
  }

  return "Short Answer";
}

function getInitialAnswers(
  survey: ParticipantSurveyDetail
) {
  const mapped = new Map<string, AnswerValue>();

  survey.questions.forEach((question) => {
    if (!mapped.has(question.id)) {
      if (question.type === "MULTIPLE_CHOICE") {
        mapped.set(question.id, []);
      } else {
        mapped.set(question.id, null);
      }
    }
  });

  return Object.fromEntries(mapped) as Record<string, AnswerValue>;
}

function QuestionHeader({
  question,
  index,
}: {
  question: ParticipantSurveyQuestion;
  index: number;
}) {
  return (
    <HStack justify="space-between" align="start" gap="4">
      <HStack align="start" gap="4">
        <Box
          w="30px"
          h="30px"
          borderRadius="8px"
          bg="brand.primary"
          color="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontWeight="bold"
          flexShrink="0"
        >
          {index + 1}
        </Box>

        <Box>
          <Text fontWeight="bold" color="brand.dark">
            {question.questionText}
          </Text>

          <Text fontSize="sm" color="brand.mutedText" mt="1">
            {formatQuestionType(question.type)}
            {question.isRequired ? " • Required" : " • Optional"}
          </Text>
        </Box>
      </HStack>
    </HStack>
  );
}

function OptionButton({
  label,
  selected,
  multiple,
  onClick,
}: {
  label: string;
  selected: boolean;
  multiple?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      justifyContent="flex-start"
      h="auto"
      minH="48px"
      px="4"
      py="3"
      variant="outline"
      borderColor={selected ? "brand.primary" : "brand.border"}
      bg={selected ? "#EEF2FF" : "white"}
      color={selected ? "brand.primary" : "brand.dark"}
      fontWeight={selected ? "bold" : "medium"}
      onClick={onClick}
    >
      <HStack w="100%" justify="space-between">
        <Text textAlign="left" whiteSpace="normal">
          {label}
        </Text>

        <Box
          w="18px"
          h="18px"
          borderRadius={multiple ? "4px" : "full"}
          borderWidth="1px"
          borderColor={selected ? "brand.primary" : "#CBD5E1"}
          bg={selected ? "brand.primary" : "white"}
          color="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink="0"
        >
          {selected && <FiCheck size={12} />}
        </Box>
      </HStack>
    </Button>
  );
}

function QuestionField({
  question,
  value,
  onChange,
}: {
  question: ParticipantSurveyQuestion;
  value: AnswerValue;
  onChange: (nextValue: AnswerValue) => void;
}) {
  if (question.type === "SHORT_ANSWER") {
    return (
      <Input
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Type your answer"
        h="48px"
        borderColor="brand.border"
        _focus={{
          borderColor: "brand.primary",
          boxShadow: "0 0 0 1px #0015D6",
        }}
      />
    );
  }

  if (question.type === "LONG_ANSWER") {
    return (
      <Textarea
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Share your detailed answer"
        minH="140px"
        resize="vertical"
        borderColor="brand.border"
        _focus={{
          borderColor: "brand.primary",
          boxShadow: "0 0 0 1px #0015D6",
        }}
      />
    );
  }

  if (question.type === "RATING_SCALE") {
    return (
      <HStack gap="3" flexWrap="wrap">
        {[1, 2, 3, 4, 5].map((rating) => {
          const selected = value === rating;

          return (
            <Button
              key={rating}
              w="48px"
              h="48px"
              borderRadius="full"
              variant="outline"
              borderColor={selected ? "brand.primary" : "brand.border"}
              bg={selected ? "brand.primary" : "white"}
              color={selected ? "white" : "brand.dark"}
              onClick={() => onChange(rating)}
            >
              {rating}
            </Button>
          );
        })}
      </HStack>
    );
  }

  if (question.type === "YES_NO") {
    return (
      <HStack gap="3">
        <Button
          flex="1"
          h="48px"
          variant="outline"
          borderColor={value === true ? "brand.primary" : "brand.border"}
          bg={value === true ? "#EEF2FF" : "white"}
          color={value === true ? "brand.primary" : "brand.dark"}
          onClick={() => onChange(true)}
        >
          Yes
        </Button>

        <Button
          flex="1"
          h="48px"
          variant="outline"
          borderColor={value === false ? "brand.primary" : "brand.border"}
          bg={value === false ? "#EEF2FF" : "white"}
          color={value === false ? "brand.primary" : "brand.dark"}
          onClick={() => onChange(false)}
        >
          No
        </Button>
      </HStack>
    );
  }

  if (question.type === "MULTIPLE_CHOICE") {
    const selectedValues = Array.isArray(value) ? value : [];

    return (
      <VStack align="stretch" gap="3">
        {question.options.map((option) => {
          const selected = selectedValues.includes(option.id);

          return (
            <OptionButton
              key={option.id}
              label={option.optionText}
              selected={selected}
              multiple
              onClick={() =>
                onChange(
                  selected
                    ? selectedValues.filter((item) => item !== option.id)
                    : [...selectedValues, option.id]
                )
              }
            />
          );
        })}
      </VStack>
    );
  }

  return (
    <VStack align="stretch" gap="3">
      {question.options.map((option) => (
        <OptionButton
          key={option.id}
          label={option.optionText}
          selected={value === option.id}
          onClick={() => onChange(option.id)}
        />
      ))}
    </VStack>
  );
}

function buildSubmissionAnswers(
  survey: ParticipantSurveyDetail,
  answers: Record<string, AnswerValue>
): SubmitParticipantSurveyResponsePayload[] {
  return survey.questions.map((question) => {
    const value = answers[question.id];
    const basePayload: SubmitParticipantSurveyResponsePayload = {
      questionId: question.id,
    };

    if (question.type === "MULTIPLE_CHOICE") {
      return {
        ...basePayload,
        selectedOptionIds: Array.isArray(value)
          ? value.filter((item): item is string => typeof item === "string")
          : [],
      };
    }

    if (question.type === "SINGLE_SELECT") {
      return {
        ...basePayload,
        selectedOptionId: typeof value === "string" ? value : undefined,
      };
    }

    if (question.type === "RATING_SCALE") {
      return {
        ...basePayload,
        ratingValue: typeof value === "number" ? value : undefined,
      };
    }

    if (question.type === "YES_NO") {
      return {
        ...basePayload,
        yesNoValue: typeof value === "boolean" ? value : undefined,
      };
    }

    return {
      ...basePayload,
      answerText: typeof value === "string" ? value.trim() : undefined,
    };
  });
}

function validateAnswers(
  survey: ParticipantSurveyDetail,
  answers: Record<string, AnswerValue>
) {
  for (const question of survey.questions) {
    if (!question.isRequired) {
      continue;
    }

    const value = answers[question.id];

    if (question.type === "MULTIPLE_CHOICE") {
      if (!Array.isArray(value) || value.length === 0) {
        return `Please answer question ${question.order}.`;
      }
      continue;
    }

    if (question.type === "YES_NO") {
      if (typeof value !== "boolean") {
        return `Please answer question ${question.order}.`;
      }
      continue;
    }

    if (question.type === "RATING_SCALE") {
      if (typeof value !== "number") {
        return `Please answer question ${question.order}.`;
      }
      continue;
    }

    if (typeof value !== "string" || value.trim().length === 0) {
      return `Please answer question ${question.order}.`;
    }
  }

  return "";
}

export default function ParticipantSurveyResponsePage({
  surveyId,
}: ParticipantSurveyResponsePageProps) {
  const router = useRouter();
  const [participantId] = useState(() => getStoredParticipantId());
  const [survey, setSurvey] = useState<ParticipantSurveyDetail | null>(null);
  const [participantName, setParticipantName] = useState("");
  const [canSubmit, setCanSubmit] = useState(true);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(participantId && surveyId));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!participantId || !surveyId) {
      return;
    }

    getParticipantSurveyDetail(participantId, surveyId)
      .then((response) => {
        if (!isMounted) {
          return;
        }

        setSurvey(response.survey);
        setParticipantName(response.participant.username);
        setCanSubmit(response.submission.canSubmit);
        setAnswers(getInitialAnswers(response.survey));
        setError("");
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Could not load this survey."
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
  }, [participantId, surveyId]);

  const missingParticipantIdError = participantId
    ? ""
    : "Participant id was not found. Please log in again.";

  const progress = useMemo(() => {
    if (!survey || survey.questions.length === 0) {
      return 0;
    }

    const answeredCount = survey.questions.filter((question) => {
      const value = answers[question.id];

      if (Array.isArray(value)) {
        return value.length > 0;
      }

      if (typeof value === "boolean") {
        return true;
      }

      if (typeof value === "number") {
        return true;
      }

      return typeof value === "string" && value.trim().length > 0;
    }).length;

    return Math.round((answeredCount / survey.questions.length) * 100);
  }, [answers, survey]);

  const handleSubmit = async () => {
    if (!participantId || !survey) {
      return;
    }

    if (!canSubmit) {
      toaster.create({
        type: "error",
        title: "Survey unavailable",
        description: "This survey is not currently accepting responses.",
      });
      return;
    }

    const validationError = validateAnswers(survey, answers);

    if (validationError) {
      toaster.create({
        type: "error",
        title: "Survey response is incomplete",
        description: validationError,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await submitParticipantSurveyResponse({
        participantId,
        surveyId: survey.id,
        answers: buildSubmissionAnswers(survey, answers),
      });

      toaster.create({
        type: "success",
        title: "Response submitted",
        description: response.message,
      });

      router.push("/participant/available-surveys");
    } catch (requestError) {
      toaster.create({
        type: "error",
        title: "Could not submit response",
        description:
          requestError instanceof Error
            ? requestError.message
            : "Please try again in a moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AuthenticatedShell activeItem="Available Surveys">
        <Flex flex="1" align="center" justify="center" gap="3">
          <Spinner color="brand.primary" />
          <Text color="brand.mutedText">Loading survey...</Text>
        </Flex>
      </AuthenticatedShell>
    );
  }

  if (missingParticipantIdError || error || !survey) {
    return (
      <AuthenticatedShell activeItem="Available Surveys">
        <Flex flex="1" align="center" justify="center" p="6">
          <DashboardCard p="6" maxW="560px">
            <Text fontWeight="bold" color="brand.dark">
              We could not load this survey.
            </Text>

            <Text color="brand.mutedText" mt="2">
              {missingParticipantIdError || error || "Please try again later."}
            </Text>
          </DashboardCard>
        </Flex>
      </AuthenticatedShell>
    );
  }

  return (
    <AuthenticatedShell
      activeItem="Available Surveys"
      contentProps={{ px: { base: "4", md: "6", lg: "8" }, py: { base: "4", md: "5", lg: "7" } }}
    >
      <Box minW={0}>
        <HStack justify="space-between" align="start" gap="5" flexWrap="wrap">
          <Box>
            <Button
              variant="ghost"
              px="0"
              mb="4"
              color="brand.primary"
              onClick={() => router.push("/participant/available-surveys")}
            >
              <FiArrowLeft />
              Back to surveys
            </Button>

            <Text
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              fontWeight="extrabold"
              color="brand.dark"
              lineHeight="1.1"
              wordBreak="break-word"
            >
              {survey.title}
            </Text>

            <Text color="brand.mutedText" mt="3" fontSize={{ base: "sm", md: "lg" }} maxW="840px">
              {survey.description}
            </Text>

            <Text color="brand.mutedText" mt="3" fontSize="sm">
              {participantName
                ? `${participantName}, review the questions below and submit your response when you're ready.`
                : "Review the questions below and submit your response when you're ready."}
            </Text>
          </Box>

          <DashboardCard p="5" minW={{ base: "100%", xl: "340px" }}>
            <HStack justify="space-between">
              <Text fontWeight="bold" color="brand.dark">
                Survey Progress
              </Text>

              <Text fontSize="sm" color="brand.primary" fontWeight="bold">
                {progress}%
              </Text>
            </HStack>

            <Box h="8px" bg="#E5E7EB" borderRadius="999px" mt="3">
              <Box h="full" w={`${progress}%`} bg="brand.primary" borderRadius="999px" />
            </Box>

            <Grid templateColumns="1fr 1fr" gap="4" mt="5">
              <Box>
                <HStack color="brand.mutedText" fontSize="sm">
                  <FiClock />
                  <Text>Estimated Time</Text>
                </HStack>
                <Text fontWeight="bold" color="brand.dark" mt="1">
                  {survey.estimatedTime}
                </Text>
              </Box>

              <Box>
                <HStack color="brand.mutedText" fontSize="sm">
                  <FiGift />
                  <Text>Reward</Text>
                </HStack>
                <Text fontWeight="bold" color="brand.dark" mt="1">
                  {formatMoney(survey.rewardAmount, survey.currency)}
                </Text>
              </Box>

              <Box>
                <HStack color="brand.mutedText" fontSize="sm">
                  <FiUsers />
                  <Text>Questions</Text>
                </HStack>
                <Text fontWeight="bold" color="brand.dark" mt="1">
                  {survey.questionCount}
                </Text>
              </Box>

              <Box>
                <HStack color="brand.mutedText" fontSize="sm">
                  <FiShield />
                  <Text>Status</Text>
                </HStack>
                <Text fontWeight="bold" color="brand.dark" mt="1">
                  {canSubmit ? "Ready" : "Unavailable"}
                </Text>
              </Box>
            </Grid>
          </DashboardCard>
        </HStack>

        <Box
          bg="brand.lightBlue"
          borderWidth="1px"
          borderColor="#D7E3FF"
          borderRadius="12px"
          px="5"
          py="4"
          mt="6"
          mb="6"
        >
          <HStack gap="3" align="start">
            <Box color="brand.primary" pt="1">
              <FiInfo />
            </Box>

            <Text fontSize="sm" color="brand.mutedText">
              Answer each question carefully. Required questions must be
              completed before you can submit your response.
            </Text>
          </HStack>
        </Box>

        <VStack align="stretch" gap="5">
          {survey.questions.map((question, index) => (
            <DashboardCard key={question.id} p={{ base: "5", lg: "6" }}>
              <QuestionHeader question={question} index={index} />

              <Box mt="5">
                <QuestionField
                  question={question}
                  value={answers[question.id] ?? null}
                  onChange={(nextValue) =>
                    setAnswers((current) => ({
                      ...current,
                      [question.id]: nextValue,
                    }))
                  }
                />
              </Box>
            </DashboardCard>
          ))}
        </VStack>

        <HStack justify="space-between" mt="8" gap="4" flexWrap="wrap">
          <Text color="brand.mutedText">
            {survey.questions.length} questions • reward{" "}
            {formatMoney(survey.rewardAmount, survey.currency)}
          </Text>

          <HStack gap="3">
            <Button
              variant="outline"
              h="48px"
              onClick={() => router.push("/participant/available-surveys")}
            >
              <FiArrowLeft />
              Cancel
            </Button>

            <Button
              h="48px"
              color="white"
              disabled={!canSubmit}
              loading={isSubmitting}
              onClick={() => {
                void handleSubmit();
              }}
            >
              <FiSend />
              Submit Response
            </Button>
          </HStack>
        </HStack>
      </Box>
    </AuthenticatedShell>
  );
}
