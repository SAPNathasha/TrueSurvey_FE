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
  FiArrowLeft,
  FiArrowRight,
  FiCopy,
  FiEdit2,
  FiFileText,
  FiMoreVertical,
  FiPlus,
  FiRefreshCw,
  FiTrash2,
  FiZap,
} from "react-icons/fi";

import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";

type QuestionType = "rating" | "multiple" | "single" | "short";

type GeneratedQuestion = {
  id: string;
  code: string;
  title: string;
  type: QuestionType;
  options?: string[];
};

type CreateQuestionsAIStepProps = {
  onBack: () => void;
  onNext: () => void;
};

const focusOptions = [
  "Customer Experience",
  "Delivery",
  "Support",
  "Product Quality",
  "Pricing",
];

const initialQuestions: GeneratedQuestion[] = [
  {
    id: "1",
    code: "Q1",
    title: "How satisfied are you with your overall shopping experience?",
    type: "rating",
  },
  {
    id: "2",
    code: "Q2",
    title: "Which part of our service are you most satisfied with?",
    type: "multiple",
    options: [
      "Product Quality",
      "Delivery Speed",
      "Customer Support",
      "Pricing",
      "Website Experience",
    ],
  },
  {
    id: "3",
    code: "Q3",
    title: "How likely are you to recommend our service to others?",
    type: "single",
  },
  {
    id: "4",
    code: "Q4",
    title: "What could we improve to better serve you?",
    type: "short",
  },
];

function getQuestionTypeStyle(type: QuestionType) {
  if (type === "rating") {
    return {
      label: "Rating Scale",
      bg: "#EAF2FF",
      color: "#0015D6",
    };
  }

  if (type === "multiple") {
    return {
      label: "Multiple Choice",
      bg: "#EEF0FF",
      color: "#0015D6",
    };
  }

  if (type === "single") {
    return {
      label: "Single Select",
      bg: "#FFF3C4",
      color: "#9A6B00",
    };
  }

  return {
    label: "Short Answer",
    bg: "#DDFBEA",
    color: "#0A7A3D",
  };
}

function AnswerPreview({ question }: { question: GeneratedQuestion }) {
  if (question.type === "rating") {
    return (
      <Box>
        <HStack gap="7" color="brand.dark" fontSize="sm" fontWeight="semibold">
          {[1, 2, 3, 4, 5].map((item) => (
            <Text key={item}>{item}</Text>
          ))}
        </HStack>

        <HStack justify="space-between" mt="1" maxW="260px">
          <Text fontSize="xs" color="brand.mutedText">
            Very Dissatisfied
          </Text>
          <Text fontSize="xs" color="brand.mutedText">
            Very Satisfied
          </Text>
        </HStack>
      </Box>
    );
  }

  if (question.type === "multiple") {
    return (
      <Text fontSize="sm" color="brand.dark" lineHeight="1.5">
        {question.options?.join(", ")}
      </Text>
    );
  }

  if (question.type === "single") {
    return (
      <Box>
        <HStack gap="5" color="brand.dark" fontSize="sm" fontWeight="semibold">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
            <Text key={item}>{item}</Text>
          ))}
        </HStack>

        <HStack justify="space-between" mt="1" maxW="310px">
          <Text fontSize="xs" color="brand.mutedText">
            Not at all likely
          </Text>
          <Text fontSize="xs" color="brand.mutedText">
            Extremely likely
          </Text>
        </HStack>
      </Box>
    );
  }

  return (
    <Box
      h="36px"
      maxW="340px"
      borderRadius="8px"
      borderWidth="1px"
      borderStyle="dashed"
      borderColor="brand.border"
      bg="#F8FAFC"
      display="flex"
      alignItems="center"
      px="4"
    >
      <Text fontSize="sm" color="brand.mutedText">
        Text response
      </Text>
    </Box>
  );
}

function QuestionRow({ question }: { question: GeneratedQuestion }) {
  const typeStyle = getQuestionTypeStyle(question.type);

  return (
    <Grid
      templateColumns={{
        base: "1fr",
        lg: "28px 54px minmax(260px, 1fr) 130px minmax(260px, 340px) 120px",
      }}
      gap="3"
      alignItems="center"
      px="4"
      py="3"
      borderBottomWidth="1px"
      borderColor="brand.border"
    >
      <Box display={{ base: "none", lg: "block" }} color="brand.mutedText">
        <FiMoreVertical />
      </Box>

      <Box
        w="42px"
        h="30px"
        borderRadius="8px"
        bg="#EEF2FF"
        color="brand.primary"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize="sm"
        fontWeight="bold"
      >
        {question.code}
      </Box>

      <Text fontSize="sm" fontWeight="semibold" color="brand.dark">
        {question.title}
      </Text>

      <Box
        w="fit-content"
        px="3"
        py="1"
        borderRadius="999px"
        bg={typeStyle.bg}
        color={typeStyle.color}
        fontSize="xs"
        fontWeight="bold"
      >
        {typeStyle.label}
      </Box>

      <AnswerPreview question={question} />

      <HStack justify={{ base: "flex-start", lg: "flex-end" }} gap="2">
        <IconButton aria-label="Edit question" variant="outline" size="sm">
          <FiEdit2 />
        </IconButton>

        <IconButton aria-label="Duplicate question" variant="outline" size="sm">
          <FiCopy />
        </IconButton>

        <IconButton
          aria-label="Delete question"
          variant="outline"
          size="sm"
          color="red.500"
        >
          <FiTrash2 />
        </IconButton>
      </HStack>
    </Grid>
  );
}

export default function CreateQuestionsAIStep({
  onBack,
  onNext,
}: CreateQuestionsAIStepProps) {
  const [surveyTitle, setSurveyTitle] = useState("Customer Satisfaction Survey");
  const [description, setDescription] = useState(
    "Generate questions to measure customer satisfaction with our online shopping experience, delivery quality, and support service."
  );
  const [selectedFocus, setSelectedFocus] = useState<string[]>([
    "Customer Experience",
    "Delivery",
    "Support",
    "Product Quality",
  ]);
  const [questionCount, setQuestionCount] = useState("10");
  const [answerStyle, setAnswerStyle] = useState("Multiple Choice");
  const [tone, setTone] = useState("Professional & Friendly");
  const [instructions, setInstructions] = useState(
    "Include a mix of rating-scale and multiple-choice questions."
  );
  const [questions] = useState<GeneratedQuestion[]>(initialQuestions);

  const toggleFocus = (option: string) => {
    setSelectedFocus((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option]
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
            <FiZap />
          </Box>

          <Text fontSize="sm" color="brand.mutedText">
            Describe the survey you want to create, and AI will generate a first
            draft of questions and answer choices. You can review and edit
            everything before submitting.
          </Text>
        </HStack>
      </Box>

      <DashboardCard p="0">
        <Box p={{ base: "5", lg: "6" }}>
          <VStack align="stretch" gap="5">
            <Box>
              <HStack gap="2" mb="1">
                <Box color="brand.primary">
                  <FiZap />
                </Box>
                <Text fontSize="xl" fontWeight="bold" color="brand.dark">
                  AI Question Generator
                </Text>
              </HStack>

              <Text fontSize="sm" color="brand.mutedText">
                Provide a few details so AI can draft relevant survey questions
                and answer options.
              </Text>
            </Box>

            <Grid templateColumns={{ base: "1fr", lg: "1fr 1.35fr" }} gap="4">
              <Box>
                <Text fontSize="sm" fontWeight="semibold" mb="2">
                  Survey Title
                </Text>

                <Input
                  value={surveyTitle}
                  onChange={(event) => setSurveyTitle(event.target.value)}
                  h="46px"
                  borderColor="brand.border"
                  px="4"
                  _focus={{
                    borderColor: "brand.primary",
                    boxShadow: "0 0 0 1px #0015D6",
                  }}
                />
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="semibold" mb="2">
                  Survey Goal / Description
                </Text>

                <Textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  minH="78px"
                  resize="none"
                  borderColor="brand.border"
                  px="4"
                  py="3"
                  _focus={{
                    borderColor: "brand.primary",
                    boxShadow: "0 0 0 1px #0015D6",
                  }}
                />
              </Box>
            </Grid>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb="2">
                What should the AI focus on?{" "}
                <Text as="span" color="brand.mutedText" fontWeight="normal">
                  Select all that apply
                </Text>
              </Text>

              <HStack gap="3" flexWrap="wrap">
                {focusOptions.map((option) => {
                  const selected = selectedFocus.includes(option);

                  return (
                    <Button
                      key={option}
                      size="sm"
                      variant="outline"
                      borderRadius="999px"
                      bg={selected ? "#EEF2FF" : "white"}
                      borderColor={selected ? "#C7D2FE" : "brand.border"}
                      color={selected ? "brand.primary" : "brand.mutedText"}
                      onClick={() => toggleFocus(option)}
                    >
                      {selected && <FiZap />}
                      {option}
                    </Button>
                  );
                })}
              </HStack>
            </Box>

            <Grid templateColumns={{ base: "1fr", lg: "0.8fr 0.8fr 1.1fr" }} gap="4">
              <Box>
                <Text fontSize="sm" fontWeight="semibold" mb="2">
                  Number of Questions
                </Text>

                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={questionCount}
                    onChange={(event) => setQuestionCount(event.target.value)}
                    h="46px"
                    borderColor="brand.border"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="semibold" mb="2">
                  Preferred Answer Style
                </Text>

                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={answerStyle}
                    onChange={(event) => setAnswerStyle(event.target.value)}
                    h="46px"
                    borderColor="brand.border"
                  >
                    <option value="Multiple Choice">Multiple Choice</option>
                    <option value="Rating Scale">Rating Scale</option>
                    <option value="Short Answer">Short Answer</option>
                    <option value="Mixed">Mixed</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="semibold" mb="2">
                  Tone / Style
                </Text>

                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={tone}
                    onChange={(event) => setTone(event.target.value)}
                    h="46px"
                    borderColor="brand.border"
                  >
                    <option value="Professional & Friendly">
                      Professional & Friendly
                    </option>
                    <option value="Formal">Formal</option>
                    <option value="Simple & Clear">Simple & Clear</option>
                    <option value="Friendly">Friendly</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Box>
            </Grid>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb="2">
                Additional Instructions{" "}
                <Text as="span" color="brand.mutedText" fontWeight="normal">
                  Optional
                </Text>
              </Text>

              <Input
                value={instructions}
                onChange={(event) => setInstructions(event.target.value)}
                h="46px"
                borderColor="brand.border"
                px="4"
                _focus={{
                  borderColor: "brand.primary",
                  boxShadow: "0 0 0 1px #0015D6",
                }}
              />
            </Box>

            <Grid templateColumns={{ base: "1fr", lg: "1fr 0.52fr" }} gap="4">
              <Button h="46px" color="white">
                <FiZap />
                Generate Questions with AI
              </Button>

              <Button h="46px" variant="outline">
                <FiFileText />
                Save as Draft
              </Button>
            </Grid>
          </VStack>
        </Box>
      </DashboardCard>

      <DashboardCard mt="5" p="0" overflow="hidden">
        <Box px={{ base: "5", lg: "6" }} py="4">
          <HStack justify="space-between" flexWrap="wrap" gap="3">
            <Box>
              <Text fontSize="xl" fontWeight="bold" color="brand.dark">
                Generated Questions
              </Text>

              <Text fontSize="sm" color="brand.mutedText">
                Review, edit, reorder, or remove any question before continuing.
              </Text>
            </Box>

            <Box
              px="4"
              py="2"
              borderRadius="999px"
              bg="#E7FBEF"
              color="#087A35"
              fontSize="sm"
              fontWeight="bold"
            >
              AI Draft Ready
            </Box>
          </HStack>
        </Box>

        <Box borderTopWidth="1px" borderColor="brand.border">
          {questions.map((question) => (
            <QuestionRow key={question.id} question={question} />
          ))}
        </Box>

        <Grid
          templateColumns={{ base: "1fr", lg: "1fr 1fr 1fr" }}
          gap="4"
          p={{ base: "5", lg: "4" }}
        >
          <Button variant="outline">
            <FiPlus />
            Add New Question
          </Button>

          <Button variant="outline">
            <FiRefreshCw />
            Regenerate Draft
          </Button>

          <Button variant="outline">
            <FiEdit2 />
            Edit AI Prompt
          </Button>
        </Grid>
      </DashboardCard>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr 1fr" }} gap="4" mt="5">
        <Button h="46px" variant="outline" justifyContent="center" onClick={onBack}>
          <FiArrowLeft />
          Back to Select Method
        </Button>

        <Button h="46px" variant="outline" justifyContent="center">
          <FiFileText />
          Save as Draft
        </Button>

        <Button h="46px" color="white" justifyContent="center" onClick={onNext}>
          Continue to Target Audience
          <FiArrowRight />
        </Button>
      </Grid>
    </Box>
  );
}