"use client";

import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  IconButton,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiLock,
  FiMoreHorizontal,
  FiSearch,
  FiShield,
  FiShoppingBag,
  FiUser,
} from "react-icons/fi";
import {
  FaCar,
  FaUniversity,
} from "react-icons/fa";
import { MdOutlineSlowMotionVideo } from "react-icons/md";

import { getStoredParticipantId } from "@/lib/participantIdentity";
import {
  getParticipantDashboard,
  type DashboardActivity,
  type DashboardNotification,
  type DashboardSurvey,
  type ParticipantDashboardData,
  type WeeklyEarning,
} from "@/services/participantDashboardService";
import ParticipantSidebar from "./ParticipantSidebar";

type StatCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  helper: string;
  bg: string;
  color: string;
};

type SurveyCardProps = {
  icon: React.ReactNode;
  title: string;
  category: string;
  time: string;
  reward: string;
  badge?: string;
  iconBg: string;
  iconColor: string;
};

type LockedSurveyCardProps = {
  title: string;
  time: string;
  reward: string;
};

type VerificationStep = {
  label: string;
  completed: boolean;
};

type NotificationItemProps = {
  icon: React.ReactNode;
  title: string;
  time: string;
  bg: string;
  color: string;
};

const DEFAULT_CURRENCY = "LKR";

function formatMoney(value?: number | string | null, currency = DEFAULT_CURRENCY) {
  const numberValue = Number(value ?? 0);

  return `${currency} ${Number.isFinite(numberValue) ? numberValue.toLocaleString() : "0"}`;
}

function formatDate(value?: string | null) {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelativeTime(value?: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.max(1, Math.floor(diffMs / 60000));

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  return `${Math.floor(hours / 24)}d ago`;
}

function formatSurveyTime(survey: DashboardSurvey) {
  if (survey.estimatedCompletionDays) {
    return `${survey.estimatedCompletionDays} day${survey.estimatedCompletionDays === 1 ? "" : "s"}`;
  }

  return "Time varies";
}

function getSurveyReward(survey: DashboardSurvey, currency = DEFAULT_CURRENCY) {
  const reward =
    survey.rewardAmount ??
    survey.reward ??
    survey.rewardPerParticipant ??
    survey.sampleBudget?.rewardPerParticipant ??
    0;

  return formatMoney(reward, survey.sampleBudget?.currency || currency);
}

function getStringField(source: unknown, keys: string[]) {
  if (!source || typeof source !== "object") {
    return null;
  }

  const record = source as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return null;
}

function getVerificationNumber(
  verification: Record<string, unknown>,
  keys: string[],
  fallback: number
) {
  for (const key of keys) {
    const value = verification[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }

  return fallback;
}

function getVerificationBoolean(verification: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = verification[key];

    if (typeof value === "boolean") {
      return value;
    }
  }

  return false;
}

function getVerificationSteps(verification: Record<string, unknown>): VerificationStep[] {
  const rawSteps = verification.steps;

  if (Array.isArray(rawSteps)) {
    return rawSteps
      .map((step) => {
        if (!step || typeof step !== "object") {
          return null;
        }

        const stepRecord = step as Record<string, unknown>;
        const label =
          getStringField(stepRecord, ["label", "title", "name"]) || "Verification step";

        return {
          label,
          completed: Boolean(stepRecord.completed || stepRecord.isCompleted),
        };
      })
      .filter((step): step is VerificationStep => Boolean(step));
  }

  return [
    {
      label: "Upload NIC or Driving License",
      completed: getVerificationBoolean(verification, [
        "hasNicOrDrivingLicense",
        "hasNic",
        "nicUploaded",
      ]),
    },
    {
      label: "Add Selfie Verification",
      completed: getVerificationBoolean(verification, ["hasSelfie", "selfieUploaded"]),
    },
    {
      label: "Complete Profile Review",
      completed: getVerificationBoolean(verification, ["isVerified", "profileReviewed"]),
    },
  ];
}

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

function StatCard({ icon, title, value, helper, bg, color }: StatCardProps) {
  return (
    <DashboardCard p="5">
      <HStack gap="4">
        <Box
          w="52px"
          h="52px"
          borderRadius="full"
          bg={bg}
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
          <Text fontSize="sm" color="brand.dark" fontWeight="bold">
            {title}
          </Text>

          <Text fontSize="2xl" color="brand.dark" fontWeight="extrabold" mt="1">
            {value}
          </Text>

          <Text fontSize="xs" color="brand.mutedText">
            {helper}
          </Text>
        </Box>
      </HStack>
    </DashboardCard>
  );
}

function SurveyCard({
  icon,
  title,
  category,
  time,
  reward,
  badge,
  iconBg,
  iconColor,
}: SurveyCardProps) {
  return (
    <DashboardCard p="5" position="relative">
      {badge && (
        <Box
          position="absolute"
          top="3"
          right="3"
          px="2"
          py="1"
          borderRadius="6px"
          bg={badge === "High Reward" ? "#FEF3C7" : "#DCFCE7"}
          color={badge === "High Reward" ? "#92400E" : "#166534"}
          fontSize="xs"
          fontWeight="bold"

        >
          {badge}
        </Box>
      )}

      <HStack align="start" gap="4" >
        <Box
          w="54px"
          h="54px"
          borderRadius="full"
          bg={iconBg}
          color={iconColor}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="26px"
          flexShrink="0"
        >
          {icon}
        </Box>

        <Box flex="1">
          <Text fontSize="sm" color="brand.dark" fontWeight="bold" lineHeight="1.3">
            {title}
          </Text>

          <Text fontSize="xs" color="brand.mutedText" mt="1">
            {category}
          </Text>
        </Box>
      </HStack>

      <HStack gap="1" color="brand.mutedText" mt="5">
        <FiClock />
        <Text fontSize="xs">{time}</Text>
      </HStack>

      <Text fontSize="2xl" fontWeight="extrabold" color="brand.dark" mt="2">
        {reward}
      </Text>

      <Box
        mt="2"
        bg="#DCFCE7"
        color="#166534"
        borderRadius="999px"
        py="1"
        textAlign="center"
        fontSize="xs"
        fontWeight="bold"
      >
        You match this survey
      </Box>

      <Button w="100%" h="40px" mt="3" color="white">
        Start Survey
      </Button>
    </DashboardCard>
  );
}

function LockedSurveyCard({ title, time, reward }: LockedSurveyCardProps) {
  return (
    <DashboardCard p="5" bg="#F8FAFC" opacity="0.88">
      <HStack justify="space-between" align="start">
        <Box>
          <Text fontSize="sm" fontWeight="bold" color="brand.dark">
            {title}
          </Text>

          <HStack gap="1" color="brand.mutedText" mt="4">
            <FiClock />
            <Text fontSize="xs">{time}</Text>
          </HStack>

          <Text fontSize="2xl" fontWeight="extrabold" color="brand.dark" mt="2">
            {reward}
          </Text>
        </Box>

        <Box
          w="54px"
          h="54px"
          borderRadius="full"
          bg="#E5E7EB"
          color="brand.mutedText"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="22px"
          borderWidth="1px"
          borderStyle="dashed"
          borderColor="#CBD5E1"
        >
          <FiLock />
        </Box>
      </HStack>

      <HStack justify="center" mt="4" color="brand.mutedText">
        <FiLock />
        <Text fontSize="sm" fontWeight="bold">
          Verified Users Only
        </Text>
      </HStack>
    </DashboardCard>
  );
}

function RecentActivity({
  activities,
  currency,
}: {
  activities: DashboardActivity[];
  currency: string;
}) {
  return (
    <DashboardCard p="0">
      <HStack justify="space-between" px="5" py="4">
        <Text fontWeight="bold" color="brand.dark">
          Recent Activity
        </Text>

        <Text fontSize="sm" color="brand.primary" fontWeight="bold">
          View all activity →
        </Text>
      </HStack>

      <Box overflowX="auto">
        <Box minW="620px">
          <Grid
            templateColumns="1.6fr 0.7fr 0.7fr 0.8fr 40px"
            px="5"
            py="3"
            borderTopWidth="1px"
            borderColor="brand.border"
            color="brand.dark"
            fontSize="xs"
            fontWeight="bold"
          >
            <Text>Survey Name</Text>
            <Text>Status</Text>
            <Text>Reward</Text>
            <Text>Completed On</Text>
            <Text />
          </Grid>

          {activities.length === 0 && (
            <Box px="5" py="6" borderTopWidth="1px" borderColor="brand.border">
              <Text color="brand.mutedText" fontSize="sm">
                Completed surveys will appear here.
              </Text>
            </Box>
          )}

          {activities.map((activity) => (
            <Grid
              key={activity.id}
              templateColumns="1.6fr 0.7fr 0.7fr 0.8fr 40px"
              px="5"
              py="3"
              borderTopWidth="1px"
              borderColor="brand.border"
              alignItems="center"
              fontSize="sm"
            >
              <HStack>
                <Box
                  w="34px"
                  h="34px"
                  borderRadius="10px"
                  bg="#DCFCE7"
                  color="green.600"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <FiShoppingBag />
                </Box>
                <Text fontWeight="medium" color="brand.dark">
                  {activity.surveyTitle}
                </Text>
              </HStack>

              <Box
                w="fit-content"
                px="3"
                py="1"
                borderRadius="8px"
                bg="#DCFCE7"
                color="green.700"
                fontSize="xs"
                fontWeight="bold"
              >
                Completed
              </Box>

              <Text color="brand.dark" fontWeight="bold">
                {formatMoney(activity.rewardAmount, currency)}
              </Text>

              <Text color="brand.mutedText">{formatDate(activity.completedAt)}</Text>

              <IconButton aria-label="More" size="sm" variant="ghost">
                <FiMoreHorizontal />
              </IconButton>
            </Grid>
          ))}
        </Box>
      </Box>
    </DashboardCard>
  );
}

function EarningsChart({
  earnings,
  currency,
}: {
  earnings: WeeklyEarning[];
  currency: string;
}) {
  const bars = earnings.length
    ? earnings.map((earning, index) => ({
        day:
          earning.day ||
          earning.label ||
          ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index] ||
          "",
        value: earning.amount ?? earning.earnings ?? earning.totalEarned ?? 0,
      }))
    : [
        { day: "Mon", value: 0 },
        { day: "Tue", value: 0 },
        { day: "Wed", value: 0 },
        { day: "Thu", value: 0 },
        { day: "Fri", value: 0 },
        { day: "Sat", value: 0 },
        { day: "Sun", value: 0 },
      ];

  const maxValue = Math.max(...bars.map((bar) => bar.value), 1);
  const total = bars.reduce((sum, bar) => sum + bar.value, 0);
  const highest = bars.reduce(
    (best, bar) => (bar.value > best.value ? bar : best),
    bars[0]
  );

  return (
    <DashboardCard p="5">
      <HStack justify="space-between" mb="5">
        <Box>
          <Text fontWeight="bold" color="brand.dark">
            Your Earnings This Week
          </Text>

          <Text fontSize="3xl" fontWeight="extrabold" color="brand.dark" mt="4">
            {formatMoney(total, currency)}
          </Text>

          <Text fontSize="sm" color="green.600" fontWeight="bold">
            Weekly completed survey earnings
          </Text>
        </Box>

        <Button size="sm" variant="outline">
          This Week
        </Button>
      </HStack>

      <HStack align="end" gap="4" h="150px">
        {bars.map((bar) => {
          const height = (bar.value / maxValue) * 120;

          return (
            <VStack key={bar.day} flex="1" gap="2" justify="end">
              {bar.day === highest.day && highest.value > 0 && (
                <Box
                  px="3"
                  py="1"
                  borderRadius="8px"
                  bg="white"
                  borderWidth="1px"
                  borderColor="brand.border"
                  fontSize="xs"
                  fontWeight="bold"
                  color="brand.dark"
                >
                  {formatMoney(bar.value, currency)}
                </Box>
              )}

              <Box
                w="100%"
                maxW="28px"
                h={`${height}px`}
                bg={bar.day === highest.day ? "brand.primary" : "#BFD0FF"}
                borderRadius="8px 8px 0 0"
              />

              <Text fontSize="xs" color="brand.mutedText">
                {bar.day}
              </Text>
            </VStack>
          );
        })}
      </HStack>
    </DashboardCard>
  );
}

function VerificationProgress({
  verification,
}: {
  verification: Record<string, unknown>;
}) {
  const steps = getVerificationSteps(verification);
  const fallbackCompleted = steps.filter((step) => step.completed).length;
  const completedSteps = getVerificationNumber(
    verification,
    ["completedSteps", "completed", "completedCount"],
    fallbackCompleted
  );
  const totalSteps = getVerificationNumber(
    verification,
    ["totalSteps", "total", "totalCount"],
    steps.length || 3
  );
  const fallbackPercentage = totalSteps ? Math.round((completedSteps / totalSteps) * 100) : 0;
  const percentage = Math.min(
    100,
    getVerificationNumber(
      verification,
      ["percentage", "progress", "progressPercentage"],
      fallbackPercentage
    )
  );

  return (
    <DashboardCard p="5">
      <HStack align="start" gap="4">
        <Box
          w="48px"
          h="48px"
          borderRadius="full"
          bg="#FEF3C7"
          color="#D97706"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="24px"
          flexShrink="0"
        >
          <FiShield />
        </Box>

        <Box flex="1">
          <Text fontWeight="bold" color="brand.dark">
            Get Verified & Earn More
          </Text>

          <Text fontSize="sm" color="brand.mutedText" mt="1">
            Verified users can access premium surveys with higher rewards.
          </Text>
        </Box>
      </HStack>

      <HStack justify="space-between" mt="5">
        <Text fontSize="sm" color="brand.primary" fontWeight="bold">
          {completedSteps} of {totalSteps} completed
        </Text>

        <Text fontSize="sm" color="brand.mutedText">
          {percentage}%
        </Text>
      </HStack>

      <Box h="6px" bg="#E5E7EB" borderRadius="999px" mt="2">
        <Box h="full" w={`${percentage}%`} bg="brand.primary" borderRadius="999px" />
      </Box>

      <VStack align="stretch" gap="3" mt="5">
        {steps.map((step) => (
          <HStack key={step.label}>
            {step.completed ? (
              <FiCheckCircle color="#16A34A" />
            ) : (
              <Box w="16px" h="16px" borderRadius="full" borderWidth="1px" />
            )}
            <Text fontSize="sm" color="brand.dark">
              {step.label}
            </Text>
          </HStack>
        ))}
      </VStack>

      <Button w="100%" h="42px" mt="5" color="white">
        Verify Now
      </Button>
    </DashboardCard>
  );
}

function NotificationItem({
  icon,
  title,
  time,
  bg,
  color,
}: NotificationItemProps) {
  return (
    <HStack gap="3" align="start">
      <Box
        w="36px"
        h="36px"
        borderRadius="full"
        bg={bg}
        color={color}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexShrink="0"
      >
        {icon}
      </Box>

      <Box flex="1">
        <Text fontSize="sm" color="brand.dark" fontWeight="medium">
          {title}
        </Text>
      </Box>

      <Text fontSize="xs" color="brand.mutedText">
        {time}
      </Text>
    </HStack>
  );
}

function getNotificationIcon(notification: DashboardNotification) {
  const type = notification.type.toLowerCase();

  if (type.includes("reward") || type.includes("earning")) {
    return {
      icon: <FiUser />,
      bg: "#DCFCE7",
      color: "green.600",
    };
  }

  if (type.includes("lock") || type.includes("survey")) {
    return {
      icon: <FiLock />,
      bg: "#F3E8FF",
      color: "#7C3AED",
    };
  }

  return {
    icon: <FiShield />,
    bg: "#FEF3C7",
    color: "#D97706",
  };
}

function RightPanel({ data }: { data: ParticipantDashboardData }) {
  const currency = data.wallet.currency || DEFAULT_CURRENCY;

  return (
    <VStack align="stretch" gap="5">
      {/* <DashboardCard p="5">
        <HStack justify="space-between" mb="3">
          <Text fontWeight="bold" color="brand.dark">
            Wallet
          </Text>

          <Text color="brand.primary" fontSize="sm" fontWeight="bold">
            View wallet →
          </Text>
        </HStack>

        <Text fontSize="sm" color="brand.mutedText">
          Current Balance
        </Text>

        <HStack justify="space-between" mt="1">
          <Text fontSize="2xl" fontWeight="extrabold" color="brand.primary">
            {formatMoney(data.wallet.currentBalance, currency)}
          </Text>

          <Button size="sm" color="white">
            Withdraw
          </Button>
        </HStack>

        <HStack justify="space-between" mt="5">
          <Text fontSize="sm" color="brand.mutedText">
            Pending Rewards
          </Text>
          <Text fontSize="sm" fontWeight="bold">
            {formatMoney(data.wallet.pendingRewards, currency)}
          </Text>
        </HStack>

        <HStack justify="space-between" mt="3">
          <Text fontSize="sm" color="brand.mutedText">
            Total Withdrawn
          </Text>
          <Text fontSize="sm" fontWeight="bold">
            {formatMoney(data.wallet.totalWithdrawn, currency)}
          </Text>
        </HStack>
      </DashboardCard> */}

      {/* <VerificationProgress verification={data.verification} />

      <DashboardCard p="5">
        <HStack justify="space-between" mb="5">
          <Text fontWeight="bold" color="brand.dark">
            Notifications
          </Text>

          <Text color="brand.primary" fontSize="sm" fontWeight="bold">
            View all
          </Text>
        </HStack>

        <VStack align="stretch" gap="5">
          {data.notifications.length === 0 && (
            <Text color="brand.mutedText" fontSize="sm">
              No notifications yet.
            </Text>
          )}

          {data.notifications.map((notification) => {
            const style = getNotificationIcon(notification);

            return (
              <NotificationItem
                key={notification.id}
                icon={style.icon}
                title={notification.title || notification.message}
                time={formatRelativeTime(notification.createdAt)}
                bg={style.bg}
                color={style.color}
              />
            );
          })}
        </VStack>
      </DashboardCard> */}

      <DashboardCard p="5">
        <Text fontWeight="bold" color="brand.dark" mb="4">
          Quick Actions
        </Text>

        <Grid templateColumns="repeat(4, 1fr)" gap="3">
          <QuickAction icon={<FiSearch />} label="Browse Surveys" bg="#EEF2FF" color="brand.primary" />
          <QuickAction icon={<FiUser />} label="Withdraw Earnings" bg="#DCFCE7" color="green.600" />
          <QuickAction icon={<FiShield />} label="Verify Account" bg="#FEF3C7" color="#D97706" />
          <QuickAction icon={<FiUser />} label="Edit Profile" bg="#F3E8FF" color="#7C3AED" />
        </Grid>
      </DashboardCard>
    </VStack>
  );
}

function QuickAction({
  icon,
  label,
  bg,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  bg: string;
  color: string;
}) {
  return (
    <VStack
      borderWidth="1px"
      borderColor="brand.border"
      borderRadius="12px"
      p="3"
      gap="2"
      cursor="pointer"
      _hover={{ borderColor: "brand.primary" }}
    >
      <Box
        w="42px"
        h="42px"
        borderRadius="14px"
        bg={bg}
        color={color}
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize="22px"
      >
        {icon}
      </Box>

      <Text fontSize="xs" textAlign="center" color="brand.dark" fontWeight="bold">
        {label}
      </Text>
    </VStack>
  );
}

export default function ParticipantDashboard() {
  const [participantId] = useState(() => getStoredParticipantId());
  const [data, setData] = useState<ParticipantDashboardData | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(Boolean(participantId));

  useEffect(() => {
    let isMounted = true;

    if (!participantId) {
      return;
    }

    getParticipantDashboard(participantId)
      .then((dashboardData) => {
        if (isMounted) {
          setData(dashboardData);
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Failed to load dashboard"
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
  }, [participantId]);

  const currency = data?.wallet.currency || DEFAULT_CURRENCY;
  const surveyVisuals = useMemo(
    () => [
      {
        icon: <FiShoppingBag />,
        iconBg: "#EAF2FF",
        iconColor: "brand.primary",
      },
      {
        icon: <FaUniversity />,
        iconBg: "#EAF2FF",
        iconColor: "brand.primary",
      },
      {
        icon: <MdOutlineSlowMotionVideo />,
        iconBg: "#F3E8FF",
        iconColor: "#7C3AED",
      },
      {
        icon: <FaCar />,
        iconBg: "#EAF2FF",
        iconColor: "brand.primary",
      },
    ],
    []
  );

  if (isLoading) {
    return (
      <Flex minH="100vh" bg="white" color="brand.dark">
        <ParticipantSidebar />
        <Flex flex="1" align="center" justify="center" gap="3">
          <Spinner color="brand.primary" />
          <Text color="brand.mutedText">Loading participant dashboard...</Text>
        </Flex>
      </Flex>
    );
  }

  const missingParticipantIdError = participantId
    ? ""
    : "Participant id was not found. Please log in again.";

  if (missingParticipantIdError || error || !data) {
    return (
      <Flex minH="100vh" bg="white" color="brand.dark">
        <ParticipantSidebar />
        <Flex flex="1" align="center" justify="center" p="6">
          <DashboardCard p="6" maxW="520px">
            <Text fontWeight="bold" color="brand.dark">
              We could not load your dashboard.
            </Text>
            <Text color="brand.mutedText" mt="2">
              {missingParticipantIdError || error || "Please try again later."}
            </Text>
          </DashboardCard>
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex minH="100vh" bg="white" color="brand.dark">
      <ParticipantSidebar />

      <Box flex="1" p={{ base: "4", lg: "6" }} overflow="hidden">
        <Grid templateColumns={{ base: "1fr", xl: "1fr" }} gap="6">
          <Box minW="0">
            <DashboardCard overflow="hidden" mb="5">
              <Grid templateColumns={{ base: "1fr", lg: "1.2fr 1fr" }}>
                <Box p={{ base: "5", lg: "8" }}>
                  <Text fontSize={{ base: "2xl", lg: "3xl" }} fontWeight="extrabold">
                    Welcome back, {data.welcome.username}!
                  </Text>

                  <Text color="brand.mutedText" mt="3">
                    Complete surveys, share your opinions, and earn rewards.
                  </Text>

                  <HStack mt="6" gap="4" flexWrap="wrap">
                    <Button color="white" px="7">
                      <FiSearch />
                      Browse Surveys
                    </Button>

                    <Button variant="outline" px="7">
                      <FiUser />
                      View Wallet
                    </Button>
                  </HStack>
                </Box>

                <Box
                  bg="brand.lightBlue"
                  display={{ base: "none", lg: "flex" }}
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  overflow="hidden"
                  minH="190px"
                >
                  <Box
                    w="160px"
                    h="110px"
                    borderRadius="18px"
                    bg="white"
                    boxShadow="lg"
                    position="absolute"
                    left="8"
                    top="8"
                    p="4"
                  >
                    {[1, 2, 3, 4].map((item) => (
                      <HStack key={item} mb="3">
                        <FiCheckCircle color="#0015D6" />
                        <Box h="6px" bg="#CBD5E1" borderRadius="full" flex="1" />
                      </HStack>
                    ))}
                  </Box>

                  <Box
                    w="170px"
                    h="120px"
                    borderRadius="24px"
                    bg="brand.primary"
                    color="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="54px"
                    position="absolute"
                    right="20"
                    bottom="-8"
                  >
                    <FiUser />
                  </Box>

                  <Box
                    w="64px"
                    h="64px"
                    borderRadius="full"
                    bg="#FFEB00"
                    color="brand.dark"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="extrabold"
                    position="absolute"
                    right="24"
                    top="10"
                  >
                    ₹
                  </Box>
                </Box>
              </Grid>
            </DashboardCard>

            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", xl: "repeat(4, 1fr)" }} gap="4" mb="5">
              <StatCard
                icon={<FiUser />}
                title="Available Surveys"
                value={String(data.summaryCards.availableSurveys)}
                helper="New surveys for you"
                bg="#DBEAFE"
                color="brand.primary"
              />

              <StatCard
                icon={<FiCheckCircle />}
                title="Completed Surveys"
                value={String(data.summaryCards.completedSurveys)}
                helper="Total completed"
                bg="#DCFCE7"
                color="green.600"
              />

              <StatCard
                icon={<FiUser />}
                title="Total Earned"
                value={formatMoney(data.summaryCards.totalEarned, currency)}
                helper="All time earnings"
                bg="#F3E8FF"
                color="#7C3AED"
              />

              <StatCard
                icon={<FiUser />}
                title="Wallet Balance"
                value={formatMoney(data.summaryCards.walletBalance, currency)}
                helper="Available to withdraw"
                bg="#FEF3C7"
                color="#D97706"
              />
            </Grid>

            <HStack justify="space-between" mb="3">
              <Text fontSize="xl" fontWeight="bold" color="brand.dark">
                Available Surveys for You
              </Text>

              <Text color="brand.primary" fontSize="sm" fontWeight="bold">
                View all available →
              </Text>
            </HStack>

            <Grid py={5} templateColumns={{ base: "1fr", md: "1fr 1fr", xl: "repeat(5, 1fr)" }} gap="4" mb="5">
              {data.availableSurveys.length === 0 && (
                <DashboardCard p="5">
                  <Text color="brand.mutedText" fontSize="sm">
                    No matching surveys are available right now.
                  </Text>
                </DashboardCard>
              )}

              {data.availableSurveys.map((survey, index) => {
                const visual = surveyVisuals[index % surveyVisuals.length];

                return (
                  <SurveyCard
                    key={survey.id}
                    icon={visual.icon}
                    title={survey.title}
                    category={survey.category || "Survey"}
                    time={formatSurveyTime(survey)}
                    reward={getSurveyReward(survey, currency)}
                    badge={index === 0 ? "New" : undefined}
                    iconBg={visual.iconBg}
                    iconColor={visual.iconColor}
                  />
                );
              })}
            </Grid>

            <Text fontSize="xl" fontWeight="bold" color="brand.dark">
              More Earning Opportunities
            </Text>

            <Text color="brand.mutedText" fontSize="sm" mb="4">
              Verify your account to unlock these high-paying surveys.
            </Text>

            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", xl: "1fr 1fr 1fr 1.2fr" }} gap="4" mb="5">
              {data.lockedSurveys.length === 0 && (
                <DashboardCard p="5">
                  <Text color="brand.mutedText" fontSize="sm">
                    You have no locked surveys right now.
                  </Text>
                </DashboardCard>
              )}

              {data.lockedSurveys.map((survey) => (
                <LockedSurveyCard
                  key={survey.id}
                  title={survey.title}
                  time={formatSurveyTime(survey)}
                  reward={getSurveyReward(survey, currency)}
                />
              ))}
            </Grid>

            <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap="5">
              <RecentActivity
                activities={data.recentActivity}
                currency={currency}
              />
              <EarningsChart
                earnings={data.earningsThisWeek}
                currency={currency}
              />
            </Grid>
          </Box>

          <RightPanel data={data} />
        </Grid>
      </Box>
    </Flex>
  );
}
