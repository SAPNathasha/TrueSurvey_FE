"use client";

import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { ComponentProps, ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiChevronDown,
  FiCreditCard,
  FiDollarSign,
  FiDownload,
  FiInfo,
  FiTrendingUp,
} from "react-icons/fi";

import AuthenticatedShell from "@/components/layout/AuthenticatedShell";
import {
  type EarningsBreakdownMap,
  getParticipantWallet,
  type EarningsBreakdownRow,
  type ParticipantWalletResponse,
} from "@/services/participantWalletService";

type StatCardProps = {
  icon: ReactNode;
  title: string;
  value: string;
  helper: string;
  bg: string;
  color: string;
};

function DashboardCard({ children, ...props }: ComponentProps<typeof Box>) {
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
          w="56px"
          h="56px"
          borderRadius="full"
          bg={bg}
          color={color}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="28px"
          flexShrink="0"
        >
          {icon}
        </Box>

        <Box>
          <Text fontSize="sm" fontWeight="bold" color="brand.dark">
            {title}
          </Text>

          <Text fontSize="2xl" fontWeight="extrabold" color={color} mt="1">
            {value}
          </Text>

          <Text fontSize="sm" color="brand.mutedText">
            {helper}
          </Text>
        </Box>
      </HStack>
    </DashboardCard>
  );
}

function formatMoney(value: number, currency: string) {
  return `${currency} ${value.toLocaleString()}`;
}

function formatDate(value: string) {
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

function toTitleCase(value: string) {
  return value
    .toLowerCase()
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeBreakdownRows(
  rows: EarningsBreakdownRow[] | EarningsBreakdownMap,
  currency: string
) {
  if (Array.isArray(rows)) {
    return rows;
  }

  return Object.entries(rows).map(([label, rawValue]) => {
    if (typeof rawValue === "number") {
      return {
        label: toTitleCase(label),
        value: rawValue,
        currency,
      };
    }

    if (typeof rawValue === "string") {
      const parsedValue = Number(rawValue.replace(/[^\d.-]/g, ""));

      return {
        label: toTitleCase(label),
        value: Number.isFinite(parsedValue) ? parsedValue : 0,
        currency,
      };
    }

    return {
      label: toTitleCase(label),
      value: rawValue.value ?? rawValue.amount ?? 0,
      currency: rawValue.currency || currency,
    };
  });
}

function WalletBalanceCard({
  data,
  currency,
}: {
  data: ParticipantWalletResponse;
  currency: string;
}) {
  const trend = data.earningsTrend.length
    ? data.earningsTrend.map((item, index) => ({
        label:
          item.label ||
          item.day ||
          ["Apr 20", "Apr 27", "May 04", "May 11", "May 18"][
            Math.min(index, 4)
          ] ||
          "",
        value: item.amount ?? item.value ?? item.totalEarned ?? 0,
      }))
    : [
        { label: "Apr 20", value: 0 },
        { label: "Apr 27", value: 0 },
        { label: "May 04", value: 0 },
        { label: "May 11", value: 0 },
        { label: "May 18", value: 0 },
      ];

  const maxValue = Math.max(...trend.map((item) => item.value), 1);
  const pointGap = trend.length > 1 ? 620 / (trend.length - 1) : 0;
  const linePoints = trend
    .map((item, index) => {
      const x = index * pointGap;
      const y = 120 - (item.value / maxValue) * 92;

      return `${x},${y}`;
    })
    .join(" ");
  const areaPath = linePoints
    ? `M${linePoints.replaceAll(" ", " L")} L620,140 L0,140 Z`
    : "M0,140 L620,140 L620,140 L0,140 Z";

  return (
    <DashboardCard p={{ base: "5", lg: "6" }}>
      <Grid templateColumns={{ base: "1fr", lg: "0.9fr 1.4fr" }} gap="7">
        <Box>
          <Text fontSize="lg" fontWeight="bold" color="brand.dark">
            Your Wallet Balance
          </Text>

          <Text
            fontSize={{ base: "4xl", lg: "5xl" }}
            fontWeight="extrabold"
            color="brand.primary"
            mt="8"
            lineHeight="1"
          >
            {formatMoney(data.walletBalance.amount, currency)}
          </Text>

          <Box
            mt="5"
            px="4"
            py="2"
            borderRadius="999px"
            bg="#DCFCE7"
            color="green.700"
            fontSize="sm"
            fontWeight="bold"
            w="fit-content"
          >
            {data.walletBalance.growthPercentage}% growth
          </Box>
        </Box>

        <Box>
          <HStack justify="space-between" align="start" mb="5">
            <Box>
              <Text fontSize="lg" fontWeight="bold" color="brand.dark">
                Earnings Trend
              </Text>

              <Text as="span" fontSize="sm" color="brand.mutedText">
                Recent rewards history
              </Text>
            </Box>
          </HStack>

          <Box h="170px" position="relative">
            <svg
              width="100%"
              height="150"
              viewBox="0 0 620 150"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="walletAreaGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#0015D6" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#0015D6" stopOpacity="0" />
                </linearGradient>
              </defs>

              <line x1="0" y1="120" x2="620" y2="120" stroke="#E5E7EB" />
              <line x1="0" y1="90" x2="620" y2="90" stroke="#F1F5F9" />
              <line x1="0" y1="60" x2="620" y2="60" stroke="#F1F5F9" />
              <line x1="0" y1="30" x2="620" y2="30" stroke="#F1F5F9" />

              <path d={areaPath} fill="url(#walletAreaGradient)" />

              <polyline
                points={linePoints}
                fill="none"
                stroke="#0015D6"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <HStack
              justify="space-between"
              color="brand.mutedText"
              fontSize="xs"
              mt="-1"
            >
              <Text>{formatMoney(0, currency)}</Text>
              {trend.slice(0, 5).map((item) => (
                <Text key={item.label}>{item.label}</Text>
              ))}
            </HStack>
          </Box>
        </Box>
      </Grid>

      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="4" mt="6">
        <Button h="48px" color="white">
          Withdraw
          <FiArrowRight />
        </Button>

        <Button h="48px" variant="outline">
          <FiDownload />
          Withdraw Requests
        </Button>
      </Grid>
    </DashboardCard>
  );
}

function getWithdrawalStatusStyle(status: string) {
  if (status.toLowerCase() === "completed") {
    return {
      bg: "#DCFCE7",
      color: "green.700",
      label: "Completed",
    };
  }

  if (status.toLowerCase() === "pending") {
    return {
      bg: "#FEF3C7",
      color: "#B45309",
      label: "Pending",
    };
  }

  return {
    bg: "#EEF2FF",
    color: "brand.primary",
    label: status,
  };
}

function RecentWithdrawalsCard({
  data,
}: {
  data: ParticipantWalletResponse;
}) {
  return (
    <DashboardCard p="5">
      <HStack justify="space-between" mb="5">
        <Text fontSize="lg" fontWeight="bold" color="brand.dark">
          Recent Withdrawals
        </Text>

        <Text fontSize="sm" color="brand.primary" fontWeight="bold">
          View all
        </Text>
      </HStack>

      <VStack align="stretch" gap="4">
        {data.recentWithdrawals.length === 0 && (
          <Text color="brand.mutedText" fontSize="sm">
            No withdrawals yet.
          </Text>
        )}

        {data.recentWithdrawals.map((withdrawal) => {
          const statusStyle = getWithdrawalStatusStyle(withdrawal.status);

          return (
            <HStack key={withdrawal.id} justify="space-between" gap="3">
              <HStack gap="3">
                <Box
                  w="42px"
                  h="42px"
                  borderRadius="10px"
                  bg="#DBEAFE"
                  color="brand.primary"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="18px"
                  flexShrink="0"
                >
                  <FiDownload />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="bold" color="brand.dark">
                    {formatMoney(withdrawal.amount, withdrawal.currency)}
                  </Text>

                  <Text fontSize="xs" color="brand.mutedText">
                    {withdrawal.method}
                  </Text>
                </Box>
              </HStack>

              <Box textAlign="right">
                <Box
                  px="3"
                  py="1"
                  borderRadius="999px"
                  bg={statusStyle.bg}
                  color={statusStyle.color}
                  fontSize="xs"
                  fontWeight="bold"
                >
                  {statusStyle.label}
                </Box>

                <Text fontSize="xs" color="brand.dark" mt="1">
                  {formatDate(withdrawal.createdAt)}
                </Text>
              </Box>
            </HStack>
          );
        })}
      </VStack>

      <Button w="100%" h="42px" mt="5" variant="outline">
        View All Withdrawals
      </Button>
    </DashboardCard>
  );
}

function EarningsBreakdownCard({
  rows,
  currency,
}: {
  rows: EarningsBreakdownRow[] | EarningsBreakdownMap;
  currency: string;
}) {
  const normalizedRows = normalizeBreakdownRows(rows, currency);
  const totalEarnedRow = normalizedRows.find(
    (row) => row.label.toLowerCase() === "total earned"
  );
  const visibleRows = totalEarnedRow
    ? normalizedRows.filter((row) => row !== totalEarnedRow)
    : normalizedRows;

  return (
    <DashboardCard p="5">
      <HStack justify="space-between" mb="5">
        <Text fontSize="lg" fontWeight="bold" color="brand.dark">
          Earnings Breakdown
        </Text>

        <Button size="sm" variant="outline">
          This month
          <FiChevronDown />
        </Button>
      </HStack>

      <VStack align="stretch" gap="4">
        {visibleRows.map((row, index) => (
          <HStack key={row.label} justify="space-between">
            <HStack gap="3">
              <Box
                w="10px"
                h="10px"
                borderRadius="full"
                bg={
                  ["brand.primary", "#EAB308", "#7C3AED", "green.600"][
                    index % 4
                  ]
                }
              />
              <Text fontSize="sm" color="brand.dark">
                {row.label}
              </Text>
            </HStack>

            <Text fontSize="sm" fontWeight="bold" color="brand.dark">
              {formatMoney(row.value, row.currency || currency)}
            </Text>
          </HStack>
        ))}
      </VStack>

      <HStack
        justify="space-between"
        mt="5"
        pt="5"
        borderTopWidth="1px"
        borderColor="brand.border"
      >
        <Text fontSize="sm" fontWeight="bold" color="brand.dark">
          Total Earned
        </Text>

        <Text fontSize="xl" fontWeight="extrabold" color="brand.dark">
          {formatMoney(
            totalEarnedRow?.value ?? 0,
            totalEarnedRow?.currency || currency
          )}
        </Text>
      </HStack>
    </DashboardCard>
  );
}

function WithdrawalMethodCard({
  data,
}: {
  data: ParticipantWalletResponse;
}) {
  return (
    <DashboardCard p="5">
      <HStack justify="space-between" mb="5">
        <Text fontSize="lg" fontWeight="bold" color="brand.dark">
          Withdrawal Method
        </Text>

        <Text fontSize="sm" color="brand.primary" fontWeight="bold">
          Manage
        </Text>
      </HStack>

      <HStack justify="space-between">
        <HStack gap="3">
          <Box
            w="42px"
            h="42px"
            borderRadius="10px"
            bg="#DBEAFE"
            color="brand.primary"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="22px"
          >
            <FiCreditCard />
          </Box>

          <Box>
            <Text fontSize="sm" fontWeight="bold" color="brand.dark">
              {data.withdrawalMethod.name}
            </Text>

            <Text fontSize="xs" color="brand.mutedText">
              {data.withdrawalMethod.description}
            </Text>
          </Box>
        </HStack>

        <HStack>
          {data.withdrawalMethod.isDefault && (
            <Box
              px="3"
              py="1"
              borderRadius="999px"
              bg="#DCFCE7"
              color="green.700"
              fontSize="xs"
              fontWeight="bold"
            >
              Default
            </Box>
          )}

          <Text color="brand.mutedText">→</Text>
        </HStack>
      </HStack>
    </DashboardCard>
  );
}

function WalletTipsCard({ tips }: { tips: string[] }) {
  return (
    <DashboardCard p="5">
      <Text fontSize="lg" fontWeight="bold" color="brand.dark" mb="5">
        Wallet Tips
      </Text>

      <VStack align="stretch" gap="3">
        {tips.map((tip) => (
          <HStack key={tip} gap="3" align="start">
            <Box color="green.600" pt="1">
              <FiCheckCircle />
            </Box>

            <Text fontSize="sm" color="brand.dark">
              {tip}
            </Text>
          </HStack>
        ))}
      </VStack>
    </DashboardCard>
  );
}

function RightPanel({
  data,
  currency,
}: {
  data: ParticipantWalletResponse;
  currency: string;
}) {
  return (
    <VStack align="stretch" gap="5">
      {/* <RecentWithdrawalsCard data={data} />
      <EarningsBreakdownCard
        rows={data.earningsBreakdown}
        currency={currency}
      />
      <WithdrawalMethodCard data={data} /> */}

      <Box
        bg="#FFF7D6"
        borderWidth="1px"
        borderColor="#F3D77A"
        borderRadius="16px"
        p="5"
      >
        <HStack gap="3" align="start">
          <Box color="#D97706" pt="1">
            <FiInfo />
          </Box>

          <Box>
            <Text fontSize="sm" color="brand.dark">
              Minimum withdrawal amount is{" "}
              <Text as="span" fontWeight="bold">
                {formatMoney(300, currency)}
              </Text>
              .
            </Text>

            <Text fontSize="sm" color="brand.dark" mt="2">
              Withdrawals are processed within{" "}
              <Text as="span" fontWeight="bold">
                1-3 business days
              </Text>
              .
            </Text>
          </Box>
        </HStack>
      </Box>

      <WalletTipsCard tips={data.walletTips} />
    </VStack>
  );
}

export default function ParticipantWalletPage() {
  const [data, setData] = useState<ParticipantWalletResponse | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getParticipantWallet({})
      .then((response) => {
        if (isMounted) {
          setData(response);
          setError("");
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Failed to load wallet"
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
  }, []);

  if (isLoading) {
    return (
      <AuthenticatedShell activeItem="Wallet">
        <Flex flex="1" align="center" justify="center" gap="3">
          <Spinner color="brand.primary" />
          <Text color="brand.mutedText">Loading wallet...</Text>
        </Flex>
      </AuthenticatedShell>
    );
  }

  if ((!data && error) || !data) {
    return (
      <AuthenticatedShell activeItem="Wallet">
        <Flex flex="1" align="center" justify="center" p="6">
          <DashboardCard p="6" maxW="560px">
            <Text fontWeight="bold" color="brand.dark">
              We could not load your wallet.
            </Text>
            <Text color="brand.mutedText" mt="2">
              {error || "Please try again later."}
            </Text>
          </DashboardCard>
        </Flex>
      </AuthenticatedShell>
    );
  }

  const currency = data.summaryCards.currency;

  return (
    <AuthenticatedShell activeItem="Wallet">
      <Grid templateColumns={{ base: "1fr" }} gap="6">
        <Box minW={0}>
            <Box mb="6">
              <Text
                fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                fontWeight="bold"
                color="brand.dark"
                lineHeight="1"
                wordBreak="break-word"
              >
                Wallet
              </Text>

              <Text fontSize={{ base: "sm", md: "lg" }} color="brand.mutedText" mt="3">
                {data.participant.username}, track your balance, rewards, and
                withdrawals here.
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} gap="4" mb="6">
              <StatCard
                icon={<FiCreditCard />}
                title="Current Wallet Balance"
                value={formatMoney(
                  data.summaryCards.currentWalletBalance,
                  currency
                )}
                helper="Available to withdraw"
                bg="#DBEAFE"
                color="brand.primary"
              />

              <StatCard
                icon={<FiTrendingUp />}
                title="Pending Earnings"
                value={formatMoney(data.summaryCards.pendingEarnings, currency)}
                helper="Awaiting approval"
                bg="#FEF3C7"
                color="#D97706"
              />

              <StatCard
                icon={<FiDollarSign />}
                title="Total Earned"
                value={formatMoney(data.summaryCards.totalEarned, currency)}
                helper="All time earnings"
                bg="#F3E8FF"
                color="#7C3AED"
              />

              <StatCard
                icon={<FiDownload />}
                title="Total Withdrawn"
                value={formatMoney(data.summaryCards.totalWithdrawn, currency)}
                helper="All time withdrawals"
                bg="#DCFCE7"
                color="green.600"
              />
            </SimpleGrid>

            <WalletBalanceCard data={data} currency={currency} />
        </Box>

        <RightPanel data={data} currency={currency} />
      </Grid>
    </AuthenticatedShell>
  );
}
