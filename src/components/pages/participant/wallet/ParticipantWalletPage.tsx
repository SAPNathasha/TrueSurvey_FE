"use client";

import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  IconButton,
  Input,
  InputGroup,
  NativeSelect,
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
  FiChevronLeft,
  FiChevronRight,
  FiCreditCard,
  FiDollarSign,
  FiDownload,
  FiInfo,
  FiSearch,
  FiTrendingUp,
} from "react-icons/fi";

import ParticipantSidebar from "@/components/pages/participant/dashboard/ParticipantSidebar";
import { getStoredParticipantId } from "@/lib/participantIdentity";
import {
  type EarningsBreakdownMap,
  getParticipantWallet,
  type EarningsBreakdownRow,
  type ParticipantWalletResponse,
  type ParticipantWalletSortBy,
  type ParticipantWalletStatus,
  type WalletTransactionRow,
} from "@/services/participantWalletService";

type StatCardProps = {
  icon: ReactNode;
  title: string;
  value: string;
  helper: string;
  bg: string;
  color: string;
};

const STATUS_OPTIONS: { label: string; value: ParticipantWalletStatus }[] = [
  { label: "All", value: "ALL" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Pending", value: "PENDING" },
  { label: "Paid", value: "PAID" },
  { label: "Withdrawals", value: "WITHDRAWALS" },
];

const SORT_OPTIONS: { label: string; value: ParticipantWalletSortBy }[] = [
  { label: "Most Recent", value: "MOST_RECENT" },
  { label: "Oldest", value: "OLDEST" },
  { label: "Amount High", value: "AMOUNT_HIGH" },
  { label: "Amount Low", value: "AMOUNT_LOW" },
];

const PAGE_SIZE_OPTIONS = [8, 16, 24, 32, 50];

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

function formatTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
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

            <Button size="sm" variant="outline">
              This period
              <FiChevronDown />
            </Button>
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

function getStatusStyle(status: WalletTransactionRow["status"]) {
  if (status === "COMPLETED") {
    return {
      label: "Completed",
      bg: "#DCFCE7",
      color: "green.700",
    };
  }

  if (status === "PENDING") {
    return {
      label: "Pending",
      bg: "#FEF3C7",
      color: "#B45309",
    };
  }

  if (status === "PAID") {
    return {
      label: "Paid",
      bg: "#DBEAFE",
      color: "brand.primary",
    };
  }

  if (status === "FAILED") {
    return {
      label: "Failed",
      bg: "#FEE2E2",
      color: "#B91C1C",
    };
  }

  return {
    label: "Processing",
    bg: "#EEF2FF",
    color: "brand.primary",
  };
}

function getTransactionVisual(row: WalletTransactionRow) {
  if (row.rowType === "WITHDRAWAL") {
    return {
      icon: <FiDollarSign />,
      iconBg: "#DCFCE7",
      iconColor: "green.600",
    };
  }

  if (row.status === "PENDING") {
    return {
      icon: <FiTrendingUp />,
      iconBg: "#FEF3C7",
      iconColor: "#D97706",
    };
  }

  if (row.status === "PAID") {
    return {
      icon: <FiCreditCard />,
      iconBg: "#EAF2FF",
      iconColor: "brand.primary",
    };
  }

  return {
    icon: <FiSearch />,
    iconBg: "#F3E8FF",
    iconColor: "#7C3AED",
  };
}

function TransactionsTable({
  rows,
  currency,
}: {
  rows: WalletTransactionRow[];
  currency: string;
}) {
  return (
    <DashboardCard p="0" overflow="hidden">
      <Box overflowX="auto">
        <Box minW="1050px">
          <Grid
            templateColumns="1.8fr 0.8fr 0.9fr 0.9fr 0.8fr 1.1fr 0.8fr"
            px="5"
            py="4"
            bg="#FBFCFF"
            borderBottomWidth="1px"
            borderColor="brand.border"
            fontSize="sm"
            fontWeight="bold"
            color="brand.dark"
          >
            <Text>Survey Name</Text>
            <Text>Status</Text>
            <Text>Earned Money</Text>
            <Text>Date</Text>
            <Text>Time</Text>
            <Text>Payment Method</Text>
            <Text>Action</Text>
          </Grid>

          {rows.length === 0 && (
            <Box px="5" py="6">
              <Text color="brand.mutedText" fontSize="sm">
                No wallet transactions match this filter.
              </Text>
            </Box>
          )}

          {rows.map((transaction) => {
            const statusStyle = getStatusStyle(transaction.status);
            const visual = getTransactionVisual(transaction);

            return (
              <Grid
                key={transaction.id}
                templateColumns="1.8fr 0.8fr 0.9fr 0.9fr 0.8fr 1.1fr 0.8fr"
                px="5"
                py="4"
                borderBottomWidth="1px"
                borderColor="brand.border"
                alignItems="center"
                fontSize="sm"
              >
                <HStack gap="3">
                  <Box
                    w="32px"
                    h="32px"
                    borderRadius="8px"
                    bg={visual.iconBg}
                    color={visual.iconColor}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink="0"
                  >
                    {visual.icon}
                  </Box>

                  <Text fontWeight="bold" color="brand.dark">
                    {transaction.surveyName}
                  </Text>
                </HStack>

                <Box
                  w="fit-content"
                  px="3"
                  py="1"
                  borderRadius="8px"
                  bg={statusStyle.bg}
                  color={statusStyle.color}
                  fontSize="xs"
                  fontWeight="bold"
                >
                  {statusStyle.label}
                </Box>

                <Text fontWeight="bold" color="brand.dark">
                  {formatMoney(transaction.earnedMoney, currency)}
                </Text>

                <Text color="brand.dark">{formatDate(transaction.date)}</Text>

                <Text color="brand.dark">{formatTime(transaction.date)}</Text>

                <HStack color="brand.dark">
                  <FiSearch />
                  <Text>{transaction.paymentMethod}</Text>
                </HStack>

                <Button variant="ghost" size="sm" color="brand.primary">
                  {transaction.action}
                </Button>
              </Grid>
            );
          })}
        </Box>
      </Box>
    </DashboardCard>
  );
}

function TransactionsFilterBar({
  searchInput,
  onSearchChange,
  status,
  onStatusChange,
  sortBy,
  onSortByChange,
  limit,
  onLimitChange,
}: {
  searchInput: string;
  onSearchChange: (value: string) => void;
  status: ParticipantWalletStatus;
  onStatusChange: (value: ParticipantWalletStatus) => void;
  sortBy: ParticipantWalletSortBy;
  onSortByChange: (value: ParticipantWalletSortBy) => void;
  limit: number;
  onLimitChange: (value: number) => void;
}) {
  return (
    <HStack gap="4" flexWrap="wrap" mb="4">
      <InputGroup
        maxW={{ base: "100%", lg: "310px" }}
        startElement={
          <Box color="brand.mutedText">
            <FiSearch />
          </Box>
        }
      >
        <Input
          value={searchInput}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search transactions..."
          h="44px"
          borderColor="brand.border"
          borderRadius="10px"
          _focus={{
            borderColor: "brand.primary",
            boxShadow: "0 0 0 1px #0015D6",
          }}
        />
      </InputGroup>

      <HStack gap="3" flexWrap="wrap">
        {STATUS_OPTIONS.map((option) => (
          <Button
            key={option.value}
            h="44px"
            borderRadius="999px"
            variant={option.value === status ? "solid" : "outline"}
            color={option.value === status ? "white" : "brand.dark"}
            bg={option.value === status ? "brand.primary" : "white"}
            onClick={() => onStatusChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </HStack>

      <NativeSelect.Root minW="180px" ml={{ base: "0", xl: "auto" }}>
        <NativeSelect.Field
          value={sortBy}
          onChange={(event) =>
            onSortByChange(event.target.value as ParticipantWalletSortBy)
          }
          h="44px"
          borderColor="brand.border"
          borderRadius="10px"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>

      <NativeSelect.Root minW="120px">
        <NativeSelect.Field
          value={String(limit)}
          onChange={(event) => onLimitChange(Number(event.target.value))}
          h="44px"
          borderColor="brand.border"
          borderRadius="10px"
        >
          {PAGE_SIZE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option} / page
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </HStack>
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
            <FiSearch />
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

          <FiChevronRight />
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
      <RecentWithdrawalsCard data={data} />
      <EarningsBreakdownCard
        rows={data.earningsBreakdown}
        currency={currency}
      />
      <WithdrawalMethodCard data={data} />

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

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = [];
  const startPage = Math.max(1, page - 1);
  const endPage = Math.min(totalPages, startPage + 2);

  for (let currentPage = startPage; currentPage <= endPage; currentPage += 1) {
    pages.push(currentPage);
  }

  return (
    <HStack justify="flex-end" mt="5" gap="3">
      <IconButton
        aria-label="Previous page"
        variant="outline"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        <FiChevronLeft />
      </IconButton>

      {pages.map((currentPage) => (
        <Button
          key={currentPage}
          variant={currentPage === page ? "solid" : "outline"}
          color={currentPage === page ? "white" : "brand.dark"}
          w="42px"
          onClick={() => onPageChange(currentPage)}
        >
          {currentPage}
        </Button>
      ))}

      {endPage < totalPages && (
        <>
          <Text fontWeight="bold">...</Text>

          <Button
            variant="outline"
            w="42px"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      <IconButton
        aria-label="Next page"
        variant="outline"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        <FiChevronRight />
      </IconButton>
    </HStack>
  );
}

export default function ParticipantWalletPage() {
  const [participantId] = useState(() => getStoredParticipantId());
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ParticipantWalletStatus>("ALL");
  const [sortBy, setSortBy] =
    useState<ParticipantWalletSortBy>("MOST_RECENT");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [data, setData] = useState<ParticipantWalletResponse | null>(null);
  const [lastCompletedQueryKey, setLastCompletedQueryKey] = useState("");
  const [error, setError] = useState("");

  const queryKey = participantId
    ? JSON.stringify({
        participantId,
        search,
        status,
        sortBy,
        page,
        limit,
      })
    : "";
  const isLoading = Boolean(participantId) && queryKey !== lastCompletedQueryKey;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    let isMounted = true;

    if (!participantId) {
      return;
    }

    getParticipantWallet({
      participantId,
      search,
      status,
      sortBy,
      page,
      limit,
    })
      .then((response) => {
        if (isMounted) {
          setData(response);
          setError("");
          setLastCompletedQueryKey(queryKey);
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Failed to load wallet"
          );
          setLastCompletedQueryKey(queryKey);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [limit, page, participantId, queryKey, search, sortBy, status]);

  const missingParticipantIdError = participantId
    ? ""
    : "Participant id was not found. Please log in again.";

  if (isLoading && !data) {
    return (
      <Flex minH="100vh" bg="white" color="brand.dark">
        <ParticipantSidebar activeItem="Wallet" />
        <Flex flex="1" align="center" justify="center" gap="3">
          <Spinner color="brand.primary" />
          <Text color="brand.mutedText">Loading wallet...</Text>
        </Flex>
      </Flex>
    );
  }

  if (missingParticipantIdError || (!data && error) || !data) {
    return (
      <Flex minH="100vh" bg="white" color="brand.dark">
        <ParticipantSidebar activeItem="Wallet" />
        <Flex flex="1" align="center" justify="center" p="6">
          <DashboardCard p="6" maxW="560px">
            <Text fontWeight="bold" color="brand.dark">
              We could not load your wallet.
            </Text>
            <Text color="brand.mutedText" mt="2">
              {missingParticipantIdError || error || "Please try again later."}
            </Text>
          </DashboardCard>
        </Flex>
      </Flex>
    );
  }

  const currency = data.summaryCards.currency;

  return (
    <Flex minH="100vh" bg="white" color="brand.dark">
      <ParticipantSidebar activeItem="Wallet" />

      <Box flex="1" px={{ base: "4", lg: "7" }} py={{ base: "5", lg: "6" }}>
        <Grid templateColumns={{ base: "1fr", xl: "1fr 360px" }} gap="6">
          <Box minW="0">
            <Box mb="6">
              <Text
                fontSize={{ base: "3xl", lg: "4xl" }}
                fontWeight="extrabold"
                color="brand.dark"
                lineHeight="1"
              >
                Wallet
              </Text>

              <Text fontSize="lg" color="brand.mutedText" mt="3">
                {data.participant.username}, track your earnings, rewards, and
                withdrawals here.
              </Text>
            </Box>

            <Grid
              templateColumns={{
                base: "1fr",
                md: "1fr 1fr",
                xl: "repeat(4, 1fr)",
              }}
              gap="4"
              mb="6"
            >
              <StatCard
                icon={<FiSearch />}
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
                icon={<FiCreditCard />}
                title="Total Withdrawn"
                value={formatMoney(data.summaryCards.totalWithdrawn, currency)}
                helper="All time withdrawals"
                bg="#DCFCE7"
                color="green.600"
              />
            </Grid>

            <WalletBalanceCard data={data} currency={currency} />

            <Box mt="6">
              <TransactionsFilterBar
                searchInput={searchInput}
                onSearchChange={setSearchInput}
                status={status}
                onStatusChange={(nextStatus) => {
                  setStatus(nextStatus);
                  setPage(1);
                }}
                sortBy={sortBy}
                onSortByChange={(nextSortBy) => {
                  setSortBy(nextSortBy);
                  setPage(1);
                }}
                limit={limit}
                onLimitChange={(nextLimit) => {
                  setLimit(nextLimit);
                  setPage(1);
                }}
              />

              {isLoading && (
                <HStack mb="4" color="brand.mutedText">
                  <Spinner size="sm" color="brand.primary" />
                  <Text fontSize="sm">Refreshing wallet data...</Text>
                </HStack>
              )}

              <TransactionsTable
                rows={data.transactions.rows}
                currency={currency}
              />

              <HStack justify="space-between" mt="5" flexWrap="wrap" gap="4">
                <Text color="brand.mutedText">
                  Showing {data.transactions.pagination.showingFrom} to{" "}
                  {data.transactions.pagination.showingTo} of{" "}
                  {data.transactions.pagination.total} transactions
                </Text>

                <Pagination
                  page={data.transactions.pagination.page}
                  totalPages={data.transactions.pagination.totalPages}
                  onPageChange={setPage}
                />
              </HStack>
            </Box>
          </Box>

          <RightPanel data={data} currency={currency} />
        </Grid>
      </Box>
    </Flex>
  );
}
