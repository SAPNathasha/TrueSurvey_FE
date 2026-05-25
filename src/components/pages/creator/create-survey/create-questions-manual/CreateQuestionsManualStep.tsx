"use client";

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
import { useState } from "react";
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

import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";

type QuestionType = "multiple-choice" | "single-choice" | "short-answer" | "rating-scale";

type ManualQuestion = {
  id: string;
  questionText: string;
  questionType: QuestionType;
  options: string[];
  required: boolean;
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
  },
];

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
  const [sectionTitle, setSectionTitle] = useState("Survey Basic Information");
  const [sectionDescription, setSectionDescription] = useState(
    "Create your survey questions manually. Add question types, options, and required fields."
  );
  const [questions, setQuestions] =
    useState<ManualQuestion[]>(initialQuestions);

  const updateQuestion = (
    questionId: string,
    changes: Partial<ManualQuestion>
  ) => {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question) =>
        question.id === questionId ? { ...question, ...changes } : question
      )
    );
  };


  const duplicateQuestion = (questionId: string) => {
    const questionToDuplicate = questions.find(
      (question) => question.id === questionId
    );

    if (!questionToDuplicate) return;

    setQuestions((currentQuestions) => [
      ...currentQuestions,
      {
        ...questionToDuplicate,
        id: crypto.randomUUID(),
        questionText: `${questionToDuplicate.questionText} Copy`,
      },
    ]);
  };

  const deleteQuestion = (questionId: string) => {
    if (questions.length === 1) return;

    setQuestions((currentQuestions) =>
      currentQuestions.filter((question) => question.id !== questionId)
    );
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
    setQuestions((currentQuestions) =>
      currentQuestions.map((question) =>
        question.id === questionId
          ? { ...question, options: [...question.options, ""] }
          : question
      )
    );
  };

  const updateOption = (
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((option, index) =>
                index === optionIndex ? value : option
              ),
            }
          : question
      )
    );
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.filter(
                (_, index) => index !== optionIndex
              ),
            }
          : question
      )
    );
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
            onDelete={() => deleteQuestion(question.id)}
            onToggleRequired={() =>
              updateQuestion(question.id, { required: !question.required })
            }
          />
        ))}
      </VStack>


      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr 1fr" }} gap="4" mt="5">
        <Button h="46px" variant="outline" onClick={onBack}>
          <FiArrowLeft />
          Back to Select Method
        </Button>

        <Button h="46px" variant="outline">
          <FiFileText />
          Save as Draft
        </Button>

        <Button h="46px" color="white" onClick={onNext}>
          Continue to Target Audience
          <FiArrowRight />
        </Button>
      </Grid>
    </Box>
  );
}