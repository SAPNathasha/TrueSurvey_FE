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
  Text,
} from "@chakra-ui/react";
import type { ComponentProps, ReactNode } from "react";
import { useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiCreditCard,
  FiDollarSign,
  FiSearch,
  FiTrendingUp,
} from "react-icons/fi";

import ParticipantSidebar from "@/components/pages/participant/dashboard/ParticipantSidebar";
import type {
  ParticipantWalletSortBy,
  ParticipantWalletStatus,
  WalletTransactionRow,
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
const DEFAULT_CURRENCY = "LKR";

const MOCK_TRANSACTIONS: WalletTransactionRow[] = [
  {
    id: "txn-1",
    surveyName: "Consumer Preferences Pulse",
    status: "COMPLETED",
    earnedMoney: 750,
    date: "2026-06-02T09:15:00.000Z",
    paymentMethod: "Survey Reward",
    action: "View",
    rowType: "SURVEY",
  },
  {
    id: "txn-2",
    surveyName: "Food Delivery Experience",
    status: "PENDING",
    earnedMoney: 450,
    date: "2026-06-01T14:20:00.000Z",
    paymentMethod: "Survey Reward",
    action: "Pending",
    rowType: "SURVEY",
  },
  {
    id: "txn-3",
    surveyName: "Weekly Wallet Withdrawal",
    status: "PAID",
    earnedMoney: 2500,
    date: "2026-05-30T11:45:00.000Z",
    paymentMethod: "Bank Transfer",
    action: "Receipt",
    rowType: "WITHDRAWAL",
  },
  {
    id: "txn-4",
    surveyName: "Streaming App Feedback",
    status: "COMPLETED",
    earnedMoney: 900,
    date: "2026-05-28T16:10:00.000Z",
    paymentMethod: "Survey Reward",
    action: "View",
    rowType: "SURVEY",
  },
  {
    id: "txn-5",
    surveyName: "Campus Lifestyle Check-in",
    status: "PAID",
    earnedMoney: 600,
    date: "2026-05-26T08:30:00.000Z",
    paymentMethod: "Survey Reward",
    action: "View",
    rowType: "SURVEY",
  },
  {
    id: "txn-6",
    surveyName: "Monthly Wallet Withdrawal",
    status: "COMPLETED",
    earnedMoney: 1800,
    date: "2026-05-24T10:00:00.000Z",
    paymentMethod: "Bank Transfer",
    action: "Receipt",
    rowType: "WITHDRAWAL",
  },
];

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
                No earnings entries match this filter.
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

                <Text color="brand.dark">{transaction.paymentMethod}</Text>

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
          placeholder="Search earnings..."
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

function sortRows(
  rows: WalletTransactionRow[],
  sortBy: ParticipantWalletSortBy
) {
  const sorted = [...rows];

  sorted.sort((left, right) => {
    if (sortBy === "AMOUNT_HIGH") {
      return right.earnedMoney - left.earnedMoney;
    }

    if (sortBy === "AMOUNT_LOW") {
      return left.earnedMoney - right.earnedMoney;
    }

    const leftTime = new Date(left.date).getTime();
    const rightTime = new Date(right.date).getTime();

    if (sortBy === "OLDEST") {
      return leftTime - rightTime;
    }

    return rightTime - leftTime;
  });

  return sorted;
}

export default function ParticipantEarningsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState<ParticipantWalletStatus>("ALL");
  const [sortBy, setSortBy] =
    useState<ParticipantWalletSortBy>("MOST_RECENT");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);

  const filteredRows = useMemo(() => {
    const search = searchInput.trim().toLowerCase();

    const rows = MOCK_TRANSACTIONS.filter((row) => {
      if (status !== "ALL" && row.status !== status) {
        return false;
      }

      if (!search) {
        return true;
      }

      return (
        row.surveyName.toLowerCase().includes(search) ||
        row.paymentMethod.toLowerCase().includes(search) ||
        row.status.toLowerCase().includes(search)
      );
    });

    return sortRows(rows, sortBy);
  }, [searchInput, sortBy, status]);

  const totalPages = Math.max(Math.ceil(filteredRows.length / limit), 1);
  const safePage = Math.min(page, totalPages);
  const paginatedRows = filteredRows.slice(
    (safePage - 1) * limit,
    safePage * limit
  );

  const totalEarned = filteredRows
    .filter((row) => row.rowType !== "WITHDRAWAL")
    .reduce((sum, row) => sum + row.earnedMoney, 0);
  const paidOut = filteredRows
    .filter((row) => row.rowType === "WITHDRAWAL")
    .reduce((sum, row) => sum + row.earnedMoney, 0);
  const pendingCount = filteredRows.filter((row) => row.status === "PENDING").length;

  return (
    <Flex minH="100vh" bg="white" color="brand.dark">
      <ParticipantSidebar activeItem="Earnings" />

      <Box flex="1" px={{ base: "4", lg: "7" }} py={{ base: "5", lg: "6" }}>
        <Box mb="6">
          <Text
            fontSize={{ base: "3xl", lg: "4xl" }}
            fontWeight="extrabold"
            color="brand.dark"
            lineHeight="1"
          >
            Earnings
          </Text>

          <Text fontSize="lg" color="brand.mutedText" mt="3">
            Review your survey rewards, payouts, and earnings activity in one place.
          </Text>
        </Box>

        <Grid
          templateColumns={{
            base: "1fr",
            md: "1fr 1fr",
            xl: "repeat(3, 1fr)",
          }}
          gap="4"
          mb="6"
        >
          <StatCard
            icon={<FiDollarSign />}
            title="Total Rewards"
            value={formatMoney(totalEarned, DEFAULT_CURRENCY)}
            helper="Survey rewards earned"
            bg="#DBEAFE"
            color="brand.primary"
          />

          <StatCard
            icon={<FiCheckCircle />}
            title="Paid Out"
            value={formatMoney(paidOut, DEFAULT_CURRENCY)}
            helper="Transferred to you"
            bg="#DCFCE7"
            color="green.600"
          />

          <StatCard
            icon={<FiTrendingUp />}
            title="Pending Items"
            value={String(pendingCount)}
            helper="Awaiting settlement"
            bg="#FEF3C7"
            color="#D97706"
          />
        </Grid>

        <TransactionsFilterBar
          searchInput={searchInput}
          onSearchChange={(value) => {
            setSearchInput(value);
            setPage(1);
          }}
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

        <TransactionsTable rows={paginatedRows} currency={DEFAULT_CURRENCY} />

        <HStack justify="space-between" mt="5" flexWrap="wrap" gap="4">
          <Text color="brand.mutedText">
            Showing {filteredRows.length === 0 ? 0 : (safePage - 1) * limit + 1} to{" "}
            {Math.min(safePage * limit, filteredRows.length)} of {filteredRows.length} earnings
            entries
          </Text>

          <Pagination
            page={safePage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </HStack>
      </Box>
    </Flex>
  );
}
