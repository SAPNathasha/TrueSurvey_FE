"use client";

import {
  Box,
  Button,
  Grid,
  HStack,
  Input,
  NativeSelect,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiFileText,
  FiGift,
  FiGlobe,
  FiInfo,
  FiSave,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import type { ReactNode } from "react";

import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";
import { toaster } from "@/components/ui/toaster";
import {
  setSampleBudget,
  type BudgetBreakdown,
  type SetSampleBudgetPayload,
} from "@/services/creatorSurveyService";

type SampleBudgetStepProps = {
  onBack: () => void;
  onNext: () => void;
};

type BudgetInputMode = "TOTAL_BUDGET" | "PER_PARTICIPANT";

type SampleBudgetFormValues = {
  inputMode: BudgetInputMode;
  requiredResponses: string;
  totalBudget: string;
  rewardPerParticipant: string;
};

const sampleBudgetStorageKey = "creatorSampleBudget";
const PLATFORM_COMMISSION_PERCENTAGE = 10;
const MINIMUM_REWARD_PER_PARTICIPANT = 10;

const initialValues: SampleBudgetFormValues = {
  inputMode: "TOTAL_BUDGET",
  requiredResponses: "500",
  totalBudget: "100000",
  rewardPerParticipant: "180",
};

function getStoredDraftId() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("creatorSurveyDraftId");
}

function getStoredSampleBudget(surveyId: string | null) {
  if (typeof window === "undefined" || !surveyId) {
    return null;
  }

  const stored = window.localStorage.getItem(
    `${sampleBudgetStorageKey}:${surveyId}`
  );

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as SampleBudgetFormValues & {
      budgetBreakdown?: BudgetBreakdown;
    };
  } catch {
    return null;
  }
}

function persistSampleBudget(
  surveyId: string | null,
  values: SampleBudgetFormValues,
  budgetBreakdown?: BudgetBreakdown
) {
  if (typeof window === "undefined" || !surveyId) {
    return;
  }

  window.localStorage.setItem(
    `${sampleBudgetStorageKey}:${surveyId}`,
    JSON.stringify({
      ...values,
      budgetBreakdown,
    })
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

function parseNumber(value: string) {
  const cleanedValue = value.replace(/,/g, "").trim();
  const numberValue = Number(cleanedValue);

  if (Number.isNaN(numberValue)) {
    return 0;
  }

  return numberValue;
}

function formatCurrency(value: number) {
  return value.toLocaleString("en-LK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function BudgetCalculatorCard({
  icon,
  label,
  value,
  highlighted,
  helper,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  highlighted?: boolean;
  helper?: string;
}) {
  return (
    <Box
      borderWidth="1px"
      borderColor={highlighted ? "brand.primary" : "brand.border"}
      borderRadius="12px"
      bg={highlighted ? "#F7F9FF" : "white"}
      p="5"
    >
      <HStack gap="4" align="center">
        <Box
          w="48px"
          h="48px"
          borderRadius="full"
          bg={highlighted ? "#EEF2FF" : "brand.lightBlue"}
          color="brand.primary"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="24px"
          flexShrink="0"
        >
          {icon}
        </Box>

        <Box>
          <Text fontSize="sm" color="brand.mutedText" fontWeight="medium">
            {label}
          </Text>

          <Text
            fontSize={highlighted ? "2xl" : "xl"}
            fontWeight="extrabold"
            color={highlighted ? "brand.primary" : "brand.dark"}
            lineHeight="1.2"
            mt="1"
          >
            {value}
          </Text>

          {helper && (
            <Text fontSize="xs" color="brand.mutedText" mt="1">
              {helper}
            </Text>
          )}
        </Box>
      </HStack>
    </Box>
  );
}

function BudgetBreakdownCard({
  icon,
  title,
  percent,
  amount,
  color,
}: {
  icon: ReactNode;
  title: string;
  percent: string;
  amount: string;
  color: string;
}) {
  return (
    <Box
      borderWidth="1px"
      borderColor="brand.border"
      borderRadius="12px"
      p="5"
      bg="white"
    >
      <HStack gap="4">
        <Box
          w="56px"
          h="56px"
          borderRadius="full"
          bg="brand.lightBlue"
          color={color}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="26px"
          flexShrink="0"
        >
          {icon}
        </Box>

        <Box>
          <Text fontSize="sm" fontWeight="semibold" color="brand.dark">
            {title}
          </Text>

          <Text fontSize="2xl" fontWeight="extrabold" color="brand.dark">
            {percent}
          </Text>

          <Text fontSize="sm" color="brand.mutedText">
            {amount}
          </Text>
        </Box>
      </HStack>
    </Box>
  );
}

export default function SampleBudgetStep({
  onBack,
  onNext,
}: SampleBudgetStepProps) {
  const surveyId = getStoredDraftId();
  const storedSampleBudget = getStoredSampleBudget(surveyId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<SampleBudgetFormValues>(
    storedSampleBudget
      ? {
          inputMode: storedSampleBudget.inputMode || initialValues.inputMode,
          requiredResponses:
            storedSampleBudget.requiredResponses || initialValues.requiredResponses,
          totalBudget: storedSampleBudget.totalBudget || initialValues.totalBudget,
          rewardPerParticipant:
            storedSampleBudget.rewardPerParticipant ||
            initialValues.rewardPerParticipant,
        }
      : initialValues
  );
  const [serverBreakdown, setServerBreakdown] = useState<BudgetBreakdown | null>(
    storedSampleBudget?.budgetBreakdown ?? null
  );

  const calculations = useMemo(() => {
    if (serverBreakdown !== null) {
      return {
        inputMode: formValues.inputMode,
        responses: serverBreakdown.requiredResponses,
        budget: serverBreakdown.totalBudget,
        commissionPercentage: serverBreakdown.platformCommissionPercentage,
        commissionAmount: serverBreakdown.platformCommissionAmount,
        participantRewardBudget: serverBreakdown.participantRewardBudget,
        rewardPerParticipant: serverBreakdown.rewardPerParticipant,
        participantRewardPercent: Math.max(
          100 - serverBreakdown.platformCommissionPercentage,
          0
        ),
      };
    }

    const responses = parseNumber(formValues.requiredResponses);
    const commissionPercentage = PLATFORM_COMMISSION_PERCENTAGE;

    let budget = parseNumber(formValues.totalBudget);
    let participantRewardBudget = 0;
    let rewardPerParticipant = 0;

    if (formValues.inputMode === "PER_PARTICIPANT") {
      rewardPerParticipant = parseNumber(formValues.rewardPerParticipant);
      participantRewardBudget = responses > 0 ? responses * rewardPerParticipant : 0;
      budget =
        participantRewardBudget > 0
          ? participantRewardBudget / (1 - commissionPercentage / 100)
          : 0;
    } else {
      const commissionAmountFromBudget = (budget * commissionPercentage) / 100;
      participantRewardBudget = Math.max(budget - commissionAmountFromBudget, 0);
      rewardPerParticipant =
        responses > 0 ? participantRewardBudget / responses : 0;
    }

    const commissionAmount = Math.max(budget - participantRewardBudget, 0);

    const participantRewardPercent = Math.max(100 - commissionPercentage, 0);

    return {
      inputMode: formValues.inputMode,
      responses,
      budget,
      commissionPercentage,
      commissionAmount,
      participantRewardBudget,
      rewardPerParticipant,
      participantRewardPercent,
    };
  }, [formValues, serverBreakdown]);

  const minimumRewardError =
    calculations.responses > 0 &&
    calculations.rewardPerParticipant > 0 &&
    calculations.rewardPerParticipant < MINIMUM_REWARD_PER_PARTICIPANT
      ? `Minimum reward per participant is Rs ${MINIMUM_REWARD_PER_PARTICIPANT}.`
      : null;

  const setFieldValue = <K extends keyof SampleBudgetFormValues>(
    field: K,
    value: SampleBudgetFormValues[K]
  ) => {
    setServerBreakdown(null);
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const buildPayload = (): SetSampleBudgetPayload | string => {
    if (!surveyId) {
      return "Survey draft was not found. Please complete the previous steps first.";
    }

    const requiredResponses = Number(formValues.requiredResponses.trim());
    const totalBudget = calculations.budget;

    if (!Number.isFinite(requiredResponses) || requiredResponses <= 0) {
      return "Required responses must be greater than 0.";
    }

    if (!Number.isFinite(totalBudget) || totalBudget <= 0) {
      return "Total budget must be greater than 0.";
    }

    if (
      !Number.isFinite(calculations.rewardPerParticipant) ||
      calculations.rewardPerParticipant < MINIMUM_REWARD_PER_PARTICIPANT
    ) {
      return `Minimum reward per participant is Rs ${MINIMUM_REWARD_PER_PARTICIPANT}.`;
    }

    const payload: SetSampleBudgetPayload = {
      surveyId,
      requiredResponses,
      totalBudget,
      platformCommissionPercentage: PLATFORM_COMMISSION_PERCENTAGE,
      currency: "LKR",
    };

    return payload;
  };

  const submitSampleBudget = async (advanceToNextStep: boolean) => {
    const payload = buildPayload();

    if (typeof payload === "string") {
      toaster.create({
        type: "error",
        title: "Sample budget is incomplete",
        description: payload,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await setSampleBudget(payload);
      setServerBreakdown(response.budgetBreakdown);
      persistSampleBudget(payload.surveyId, formValues, response.budgetBreakdown);
      updateStoredDraftStep(payload.surveyId, response.survey.currentStep);

      toaster.create({
        type: "success",
        title: advanceToNextStep ? "Sample budget saved" : "Draft updated",
        description: response.message,
      });

      if (advanceToNextStep) {
        onNext();
      }
    } catch (error) {
      toaster.create({
        type: "error",
        title: "Could not save sample budget",
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
            <FiInfo />
          </Box>

          <Text fontSize="sm" color="brand.mutedText">
            Define the required responses and budget approach to estimate
            participant rewards before launching your survey. Platform
            commission is fixed at 10%.
          </Text>
        </HStack>
      </Box>

      <DashboardCard p="0">
        <Grid templateColumns={{ base: "1fr", xl: "0.85fr 1fr" }}>
          <Box
            p={{ base: "5", lg: "6" }}
            borderRightWidth={{ base: "0", xl: "1px" }}
            borderBottomWidth={{ base: "1px", xl: "0" }}
            borderColor="brand.border"
          >
            <Text fontSize="xl" fontWeight="bold" color="brand.dark" mb="5">
              Sample Size & Budget
            </Text>

            <VStack align="stretch" gap="5">
              <Box>
                <Text fontSize="sm" fontWeight="semibold" mb="2">
                  Budget Calculation Method
                </Text>

                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={formValues.inputMode}
                    onChange={(event) =>
                      setFieldValue(
                        "inputMode",
                        event.target.value as BudgetInputMode
                      )
                    }
                    h="46px"
                    borderColor="brand.border"
                    px={3}
                  >
                    <option value="TOTAL_BUDGET">Total budget</option>
                    <option value="PER_PARTICIPANT">
                      Amount per participant
                    </option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>

                <Text fontSize="sm" color="brand.mutedText" mt="2">
                  Choose whether you want to calculate from the full campaign
                  budget or from the participant payout amount.
                </Text>
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="semibold" mb="2">
                  Required Number of Responses
                </Text>

                <Input
                  type="number"
                  value={formValues.requiredResponses}
                  onChange={(event) =>
                    setFieldValue("requiredResponses", event.target.value)
                  }
                  h="46px"
                  borderColor="brand.border"
                  px="4"
                  _focus={{
                    borderColor: "brand.primary",
                    boxShadow: "0 0 0 1px #0015D6",
                  }}
                />

                <Text fontSize="sm" color="brand.mutedText" mt="2">
                  How many completed responses do you want to collect?
                </Text>
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="semibold" mb="2">
                  {formValues.inputMode === "TOTAL_BUDGET"
                    ? "Total Budget (LKR)"
                    : "Amount per Participant (LKR)"}
                </Text>

                <Input
                  value={
                    formValues.inputMode === "TOTAL_BUDGET"
                      ? formValues.totalBudget
                      : formValues.rewardPerParticipant
                  }
                  onChange={(event) =>
                    setFieldValue(
                      formValues.inputMode === "TOTAL_BUDGET"
                        ? "totalBudget"
                        : "rewardPerParticipant",
                      event.target.value
                    )
                  }
                  h="46px"
                  borderColor="brand.border"
                  px="4"
                  _focus={{
                    borderColor: "brand.primary",
                    boxShadow: "0 0 0 1px #0015D6",
                  }}
                />

                <Text fontSize="sm" color="brand.mutedText" mt="2">
                  {formValues.inputMode === "TOTAL_BUDGET"
                    ? "The total amount you plan to spend for this survey."
                    : "The amount each participant should receive after platform commission is excluded."}
                </Text>

                {minimumRewardError && (
                  <Text fontSize="sm" color="red.500" mt="2" fontWeight="medium">
                    {minimumRewardError}
                  </Text>
                )}
              </Box>
            </VStack>
          </Box>

          <Box p={{ base: "5", lg: "6" }}>
            <Text fontSize="lg" fontWeight="bold" color="brand.dark" mb="5">
              Budget Calculator
            </Text>

            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="4">
              <BudgetCalculatorCard
                icon={<FiUsers />}
                label="Total Budget"
                value={`LKR ${formatCurrency(calculations.budget)}`}
              />

              <BudgetCalculatorCard
                icon={<FiShield />}
                label="Platform Commission"
                value={`${calculations.commissionPercentage}%`}
              />

              <BudgetCalculatorCard
                icon={<FiFileText />}
                label="Commission Amount"
                value={`LKR ${formatCurrency(calculations.commissionAmount)}`}
              />

              <BudgetCalculatorCard
                icon={<FiGift />}
                label="Budget for Participant Rewards"
                value={`LKR ${formatCurrency(calculations.participantRewardBudget)}`}
              />

              <BudgetCalculatorCard
                icon={<FiUsers />}
                label="Required Responses"
                value={formatCurrency(calculations.responses)}
              />

              <BudgetCalculatorCard
                icon={<FiGift />}
                label="Reward per Participant"
                value={`LKR ${formatCurrency(calculations.rewardPerParticipant)}`}
                highlighted
              />
            </Grid>

            <Box
              mt="4"
              px="4"
              py="3"
              borderRadius="10px"
              bg="brand.lightBlue"
              color="brand.primary"
              fontSize="sm"
              fontWeight="semibold"
              textAlign="center"
            >
              {formValues.inputMode === "TOTAL_BUDGET"
                ? "(Total Budget - Commission Amount) / Required Responses = Reward per Participant"
                : "(Required Responses x Amount per Participant) + 10% platform commission = Total Budget"}
            </Box>

            <Box mt="5">
              <HStack justify="space-between" mb="2">
                <Box>
                  <Text fontSize="sm" fontWeight="bold" color="brand.dark">
                    Participant Rewards
                  </Text>

                  <Text fontSize="sm" color="green.600" fontWeight="bold">
                    {calculations.participantRewardPercent}% (LKR{" "}
                    {formatCurrency(calculations.participantRewardBudget)})
                  </Text>
                </Box>

                <Box textAlign="right">
                  <Text fontSize="sm" fontWeight="bold" color="brand.dark">
                    Platform Commission
                  </Text>

                  <Text fontSize="sm" color="purple.600" fontWeight="bold">
                    {calculations.commissionPercentage}% (LKR{" "}
                    {formatCurrency(calculations.commissionAmount)})
                  </Text>
                </Box>
              </HStack>

              <HStack gap="0" h="9px" borderRadius="999px" overflow="hidden">
                <Box
                  h="full"
                  w={`${calculations.participantRewardPercent}%`}
                  bg="green.500"
                />
                <Box
                  h="full"
                  w={`${calculations.commissionPercentage}%`}
                  bg="purple.500"
                />
              </HStack>
            </Box>
          </Box>
        </Grid>
      </DashboardCard>

      <DashboardCard mt="5" p="0">
        <Box p={{ base: "5", lg: "6" }}>
          <Text fontSize="lg" fontWeight="bold" color="brand.dark" mb="4">
            Budget Breakdown
          </Text>

          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr 1fr" }} gap="5">
            <BudgetBreakdownCard
              icon={<FiUsers />}
              title="Participant Rewards"
              percent={`${calculations.participantRewardPercent}%`}
              amount={`LKR ${formatCurrency(calculations.participantRewardBudget)}`}
              color="green.500"
            />

            <BudgetBreakdownCard
              icon={<FiShield />}
              title="Platform Commission"
              percent={`${calculations.commissionPercentage}%`}
              amount={`LKR ${formatCurrency(calculations.commissionAmount)}`}
              color="purple.500"
            />

            <BudgetBreakdownCard
              icon={<FiGlobe />}
              title="Required Responses"
              percent={formatCurrency(calculations.responses)}
              amount="respondents"
              color="brand.primary"
            />
          </Grid>
        </Box>
      </DashboardCard>

      <Box
        mt="5"
        borderWidth="1px"
        borderColor="#D7E3FF"
        bg="brand.lightBlue"
        borderRadius="12px"
        px="5"
        py="4"
      >
        <HStack gap="4" align="start">
          <Box>
            <Text fontWeight="bold" color="brand.dark">
              Campaign Recommendation
            </Text>

            <Text fontSize="sm" color="brand.mutedText" mt="1">
              Your current budget offers an estimated reward of{" "}
              <Text as="span" color="brand.primary" fontWeight="bold">
                LKR {formatCurrency(calculations.rewardPerParticipant)}
              </Text>{" "}
              per participant for{" "}
              <Text as="span" color="brand.primary" fontWeight="bold">
                {formatCurrency(calculations.responses)} responses
              </Text>
              .
            </Text>

            <Text fontSize="sm" color="brand.mutedText" mt="1">
              Platform commission is fixed at{" "}
              <Text as="span" color="brand.primary" fontWeight="bold">
                {PLATFORM_COMMISSION_PERCENTAGE}%
              </Text>{" "}
              and each participant must receive at least{" "}
              <Text as="span" color="brand.primary" fontWeight="bold">
                Rs {MINIMUM_REWARD_PER_PARTICIPANT}
              </Text>
              .
            </Text>
          </Box>
        </HStack>
      </Box>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr 1fr" }} gap="4" mt="5">
        <Button h="46px" variant="outline" onClick={onBack}>
          <FiArrowLeft />
          Back to Target Audience
        </Button>

        <Button
          h="46px"
          variant="outline"
          onClick={() => {
            void submitSampleBudget(false);
          }}
          loading={isSubmitting}
        >
          <FiSave />
          Save as Draft
        </Button>

        <Button
          h="46px"
          color="white"
          onClick={() => {
            void submitSampleBudget(true);
          }}
          loading={isSubmitting}
        >
          Continue
          <FiArrowRight />
        </Button>
      </Grid>
    </Box>
  );
}
