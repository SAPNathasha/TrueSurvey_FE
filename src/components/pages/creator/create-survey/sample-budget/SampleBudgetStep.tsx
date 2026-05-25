"use client";

import {
  Box,
  Button,
  Grid,
  HStack,
  Input,
  NativeSelect,
  Text,
  Textarea,
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
  FiStar,
  FiUsers,
} from "react-icons/fi";
import type { ReactNode } from "react";

import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";

type SampleBudgetStepProps = {
  onBack: () => void;
  onNext: () => void;
};

function parseNumber(value: string) {
  const cleanedValue = value.replace(/,/g, "");
  const numberValue = Number(cleanedValue);

  if (Number.isNaN(numberValue)) {
    return 0;
  }

  return numberValue;
}

function formatLKR(value: number) {
  return value.toLocaleString("en-LK");
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
  const [requiredResponses, setRequiredResponses] = useState("500");
  const [totalBudget, setTotalBudget] = useState("100,000");
  const [commissionRate, setCommissionRate] = useState("15");
  const [rewardDistribution, setRewardDistribution] = useState(
    "Equal reward per participant"
  );
  const [budgetNotes, setBudgetNotes] = useState("");

  const calculations = useMemo(() => {
    const responses = parseNumber(requiredResponses);
    const budget = parseNumber(totalBudget);
    const commissionPercentage = parseNumber(commissionRate);

    const commissionAmount = Math.round((budget * commissionPercentage) / 100);
    const participantRewardBudget = Math.max(budget - commissionAmount, 0);
    const rewardPerParticipant =
      responses > 0 ? Math.floor(participantRewardBudget / responses) : 0;

    const participantRewardPercent = Math.max(100 - commissionPercentage, 0);

    return {
      responses,
      budget,
      commissionPercentage,
      commissionAmount,
      participantRewardBudget,
      rewardPerParticipant,
      participantRewardPercent,
    };
  }, [requiredResponses, totalBudget, commissionRate]);

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
            Define the number of required responses, total budget, and platform
            commission to estimate participant rewards before launching your
            survey.
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
                  Required Number of Responses
                </Text>

                <Input
                  type="number"
                  value={requiredResponses}
                  onChange={(event) => setRequiredResponses(event.target.value)}
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
                  Total Budget (LKR)
                </Text>

                <Input
                  value={totalBudget}
                  onChange={(event) => setTotalBudget(event.target.value)}
                  h="46px"
                  borderColor="brand.border"
                  px="4"
                  _focus={{
                    borderColor: "brand.primary",
                    boxShadow: "0 0 0 1px #0015D6",
                  }}
                />

                <Text fontSize="sm" color="brand.mutedText" mt="2">
                  The total amount you plan to spend for this survey.
                </Text>
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="semibold" mb="2">
                  Platform Commission (%)
                </Text>

                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={commissionRate}
                    onChange={(event) => setCommissionRate(event.target.value)}
                    h="46px"
                    borderColor="brand.border"
                    px={3}
                  >
                    <option value="10">10%</option>
                    <option value="15">15%</option>
                    <option value="20">20%</option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>

                <Text fontSize="sm" color="brand.mutedText" mt="2">
                  Commission retained by the platform before participant rewards
                  are allocated.
                </Text>
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="semibold" mb="2">
                  Reward Distribution
                </Text>

                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={rewardDistribution}
                    onChange={(event) =>
                      setRewardDistribution(event.target.value)
                    }
                    h="46px"
                    borderColor="brand.border"
                    px={3}
                  >
                    <option value="Equal reward per participant">
                      Equal reward per participant
                    </option>
                    <option value="Higher reward for verified users">
                      Higher reward for verified users
                    </option>
                    <option value="Manual reward allocation">
                      Manual reward allocation
                    </option>
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>

                <Text fontSize="sm" color="brand.mutedText" mt="2">
                  How rewards will be distributed among participants.
                </Text>
              </Box>

              <Box>
                <HStack justify="space-between" mb="2">
                  <Text fontSize="sm" fontWeight="semibold">
                    Budget Notes{" "}
                    <Text as="span" color="brand.mutedText" fontWeight="normal">
                      Optional
                    </Text>
                  </Text>

                  <Text fontSize="xs" color="brand.mutedText">
                    {budgetNotes.length} / 250
                  </Text>
                </HStack>

                <Textarea
                  value={budgetNotes}
                  px={3}
                  py={3}
                  onChange={(event) => {
                    if (event.target.value.length <= 250) {
                      setBudgetNotes(event.target.value);
                    }
                  }}
                  placeholder="Add any notes about your budget or campaign..."
                  minH="74px"
                  resize="none"
                  borderColor="brand.border"
                  _focus={{
                    borderColor: "brand.primary",
                    boxShadow: "0 0 0 1px #0015D6",
                  }}
                />
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
                value={`LKR ${formatLKR(calculations.budget)}`}
              />

              <BudgetCalculatorCard
                icon={<FiShield />}
                label="Platform Commission"
                value={`${calculations.commissionPercentage}%`}
              />

              <BudgetCalculatorCard
                icon={<FiFileText />}
                label="Commission Amount"
                value={`LKR ${formatLKR(calculations.commissionAmount)}`}
              />

              <BudgetCalculatorCard
                icon={<FiGift />}
                label="Budget for Participant Rewards"
                value={`LKR ${formatLKR(
                  calculations.participantRewardBudget
                )}`}
              />

              <BudgetCalculatorCard
                icon={<FiUsers />}
                label="Required Responses"
                value={formatLKR(calculations.responses)}
              />

              <BudgetCalculatorCard
                icon={<FiGift />}
                label="Reward per Participant"
                value={`LKR ${formatLKR(
                  calculations.rewardPerParticipant
                )}`}
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
              (Total Budget - Commission Amount) / Required Responses = Reward
              per Participant
            </Box>

            <Box mt="5">
              <HStack justify="space-between" mb="2">
                <Box>
                  <Text fontSize="sm" fontWeight="bold" color="brand.dark">
                    Participant Rewards
                  </Text>

                  <Text fontSize="sm" color="green.600" fontWeight="bold" >
                    {calculations.participantRewardPercent}% (LKR{" "}
                    {formatLKR(calculations.participantRewardBudget)})
                  </Text>
                </Box>

                <Box textAlign="right">
                  <Text fontSize="sm" fontWeight="bold" color="brand.dark" >
                    Platform Commission
                  </Text>

                  <Text fontSize="sm" color="purple.600" fontWeight="bold" >
                    {calculations.commissionPercentage}% (LKR{" "}
                    {formatLKR(calculations.commissionAmount)})
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
              amount={`LKR ${formatLKR(calculations.participantRewardBudget)}`}
              color="green.500"
            />

            <BudgetBreakdownCard
              icon={<FiShield />}
              title="Platform Commission"
              percent={`${calculations.commissionPercentage}%`}
              amount={`LKR ${formatLKR(calculations.commissionAmount)}`}
              color="purple.500"
            />

            <BudgetBreakdownCard
              icon={<FiGlobe />}
              title="Estimated Reach"
              percent={formatLKR(calculations.responses)}
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
          <Box
            w="48px"
            h="48px"
            borderRadius="full"
            bg="#EEF2FF"
            color="brand.primary"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="24px"
            flexShrink="0"
          >
            <FiStar />
          </Box>

          <Box>
            <Text fontWeight="bold" color="brand.dark">
              Campaign Recommendation
            </Text>

            <Text fontSize="sm" color="brand.mutedText" mt="1">
              Your current budget offers an estimated reward of{" "}
              <Text as="span" color="brand.primary" fontWeight="bold">
                LKR {formatLKR(calculations.rewardPerParticipant)}
              </Text>{" "}
              per participant for{" "}
              <Text as="span" color="brand.primary" fontWeight="bold">
                {formatLKR(calculations.responses)} responses
              </Text>
              .
            </Text>

            <Text fontSize="sm" color="brand.mutedText" mt="1">
              This appears competitive for general customer feedback surveys.
            </Text>
          </Box>
        </HStack>
      </Box>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr 1fr" }} gap="4" mt="5">
        <Button h="46px" variant="outline" onClick={onBack}>
          <FiArrowLeft />
          Back to Target Audience
        </Button>

        <Button h="46px" variant="outline">
          <FiSave />
          Save as Draft
        </Button>

        <Button h="46px" color="white" onClick={onNext}>
          Continue
          <FiArrowRight />
        </Button>
      </Grid>
    </Box>
  );
}