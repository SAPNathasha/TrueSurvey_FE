"use client";

import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  IconButton,
  SimpleGrid,
  NativeSelect,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import type { ComponentProps, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClipboard,
  FiCreditCard,
  FiDollarSign,
  FiTrendingUp,
} from "react-icons/fi";

import AuthenticatedShell from "@/components/layout/AuthenticatedShell";
import {
  getTransactionRecords,
  type TransactionRecordRow,
  type TransactionRecordsResponse,
} from "@/services/participantTransactionService";

type StatCardProps = {
  icon: ReactNode;
  title: string;
  value: string;
  helper: string;
  bg: string;
  color: string;
};

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

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

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getStatusStyle(status: TransactionRecordRow["status"]) {
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

  if (status === "FAILED" || status === "REJECTED") {
    return {
      label: formatLabel(status),
      bg: "#FEE2E2",
      color: "#B91C1C",
    };
  }

  return {
    label: formatLabel(status),
    bg: "#EEF2FF",
    color: "brand.primary",
  };
}

function getTransactionVisual(row: TransactionRecordRow) {
  if (row.type === "WITHDRAWAL") {
    return {
      icon: <FiCreditCard />,
      iconBg: "#DCFCE7",
      iconColor: "green.600",
    };
  }

  if (row.type === "ADJUSTMENT") {
    return {
      icon: <FiTrendingUp />,
      iconBg: "#FEF3C7",
      iconColor: "#D97706",
    };
  }

  return {
    icon: <FiDollarSign />,
    iconBg: "#DBEAFE",
    iconColor: "brand.primary",
  };
}

function TransactionsTable({
  rows,
  currency,
}: {
  rows: TransactionRecordRow[];
  currency: string;
}) {
  return (
    <>
      <Stack display={{ base: "flex", md: "none" }} gap="3">
        {rows.length === 0 && (
          <DashboardCard p="5">
            <Text color="brand.mutedText" fontSize="sm">
              No transactions found for this page.
            </Text>
          </DashboardCard>
        )}

        {rows.map((transaction) => {
          const statusStyle = getStatusStyle(transaction.status);
          const visual = getTransactionVisual(transaction);

          return (
            <DashboardCard key={transaction.id} p="4">
              <HStack align="start" gap="3">
                <Box
                  w="40px"
                  h="40px"
                  borderRadius="10px"
                  bg={visual.iconBg}
                  color={visual.iconColor}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink="0"
                >
                  {visual.icon}
                </Box>

                <Box minW={0} flex="1">
                  <Text fontWeight="bold" color="brand.dark" wordBreak="break-word">
                    {transaction.description || formatLabel(transaction.type)}
                  </Text>

                  <HStack mt="2" gap="2" flexWrap="wrap">
                    <Text fontSize="sm" color="brand.mutedText">
                      {formatLabel(transaction.type)}
                    </Text>
                    <Box
                      px="2.5"
                      py="1"
                      borderRadius="8px"
                      bg={statusStyle.bg}
                      color={statusStyle.color}
                      fontSize="xs"
                      fontWeight="bold"
                    >
                      {statusStyle.label}
                    </Box>
                  </HStack>

                  <SimpleGrid columns={2} gap="3" mt="4">
                    <Box>
                      <Text fontSize="xs" color="brand.mutedText" fontWeight="semibold">
                        Amount
                      </Text>
                      <Text fontWeight="bold" color="brand.dark">
                        {formatMoney(transaction.amount, currency)}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="xs" color="brand.mutedText" fontWeight="semibold">
                        Date
                      </Text>
                      <Text color="brand.dark">{formatDate(transaction.date)}</Text>
                    </Box>
                  </SimpleGrid>
                </Box>
              </HStack>
            </DashboardCard>
          );
        })}
      </Stack>

      <DashboardCard p="0" overflow="hidden" display={{ base: "none", md: "block" }}>
        <Box overflowX="auto" w="100%">
        <Box minW="980px">
          <Grid
            templateColumns="2fr 1fr 1fr 1fr 1fr 0.8fr"
            px="5"
            py="4"
            bg="#FBFCFF"
            borderBottomWidth="1px"
            borderColor="brand.border"
            fontSize="sm"
            fontWeight="bold"
            color="brand.dark"
          >
            <Text>Description</Text>
            <Text>Type</Text>
            <Text>Status</Text>
            <Text>Amount</Text>
            <Text>Date</Text>
            <Text>Time</Text>
          </Grid>

          {rows.length === 0 && (
            <Box px="5" py="6">
              <Text color="brand.mutedText" fontSize="sm">
                No transactions found for this page.
              </Text>
            </Box>
          )}

          {rows.map((transaction) => {
            const statusStyle = getStatusStyle(transaction.status);
            const visual = getTransactionVisual(transaction);

            return (
              <Grid
                key={transaction.id}
                templateColumns="2fr 1fr 1fr 1fr 1fr 0.8fr"
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
                    {transaction.description || formatLabel(transaction.type)}
                  </Text>
                </HStack>

                <Text color="brand.dark">{formatLabel(transaction.type)}</Text>

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
                  {formatMoney(transaction.amount, currency)}
                </Text>

                <Text color="brand.dark">{formatDate(transaction.date)}</Text>

                <Text color="brand.dark">{formatTime(transaction.date)}</Text>
              </Grid>
            );
          })}
        </Box>
        </Box>
      </DashboardCard>
    </>
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

export default function ParticipantEarningsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TransactionRecordsResponse | null>(null);

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getTransactionRecords({
          page,
          limit,
        });

        if (!isMounted) {
          return;
        }

        setData(response);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Could not load transaction records.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [page, limit]);

  const currency = data?.summary.currency || "LKR";
  const pageSummary = useMemo(() => {
    if (!data) {
      return "Loading transactions...";
    }

    if (data.pagination.total === 0) {
      return "Showing 0 transactions";
    }

    return `Showing ${data.pagination.showingFrom} to ${data.pagination.showingTo} of ${data.pagination.total} transactions`;
  }, [data]);

  if (isLoading && !data) {
    return (
      <AuthenticatedShell activeItem="Transactions">
        <Flex flex="1" align="center" justify="center" gap="3">
          <Spinner color="brand.primary" />
          <Text color="brand.mutedText">Loading transactions...</Text>
        </Flex>
      </AuthenticatedShell>
    );
  }

  if (error || !data) {
    return (
      <AuthenticatedShell activeItem="Transactions">
        <Flex flex="1" align="center" justify="center" p="6">
          <DashboardCard p="6" maxW="560px">
            <Text fontWeight="bold" color="brand.dark">
              We could not load transactions.
            </Text>
            <Text color="brand.mutedText" mt="2">
              {error || "Please try again later."}
            </Text>
          </DashboardCard>
        </Flex>
      </AuthenticatedShell>
    );
  }

  return (
    <AuthenticatedShell activeItem="Transactions">
      <Box minW={0}>
        <Box mb="6">
          <Text
            fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
            fontWeight="bold"
            color="brand.dark"
            lineHeight="1"
            wordBreak="break-word"
          >
            Transactions
          </Text>

          <Text fontSize={{ base: "sm", md: "lg" }} color="brand.mutedText" mt="3">
            Review your transaction activity, payouts, and reward movements in
            one place.
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} gap="4" mb="6">
          <StatCard
            icon={<FiDollarSign />}
            title="Total Rewards Earned"
            value={formatMoney(data.summary.totalRewardsEarned, currency)}
            helper="All earned rewards"
            bg="#DBEAFE"
            color="brand.primary"
          />

          <StatCard
            icon={<FiCheckCircle />}
            title="Paid Out"
            value={formatMoney(data.summary.paidOutAmount, currency)}
            helper="Transferred out successfully"
            bg="#DCFCE7"
            color="green.600"
          />

          <StatCard
            icon={<FiTrendingUp />}
            title="Top Ups"
            value={formatMoney(data.summary.totalTopupAmount, currency)}
            helper="Completed adjustment credits"
            bg="#FEF3C7"
            color="#D97706"
          />

          <StatCard
            icon={<FiClipboard />}
            title="Pending Items"
            value={String(data.summary.totalPendingItems)}
            helper="Awaiting settlement"
            bg="#EEF2FF"
            color="brand.primary"
          />
        </SimpleGrid>

        <DashboardCard p="0" overflow="hidden">
          <Box
            px={{ base: "4", md: "5" }}
            py="4"
            borderBottomWidth="1px"
            borderColor="brand.border"
            display="flex"
            alignItems={{ base: "stretch", md: "center" }}
            justifyContent="space-between"
            flexDirection={{ base: "column", md: "row" }}
            gap="4"
          >
            <Box>
              <Text fontWeight="bold" color="brand.dark">
                Transaction Records
              </Text>
              <Text fontSize="sm" color="brand.mutedText" mt="1">
                {data.user.username} ({data.user.role})
              </Text>
            </Box>

            <Box w={{ base: "100%", md: "160px" }} flexShrink={0}>
              <Text fontSize="sm" fontWeight="semibold" mb="2">
                Per Page
              </Text>

              <NativeSelect.Root>
                <NativeSelect.Field
                  value={String(limit)}
                  onChange={(event) => {
                    setLimit(Number(event.target.value));
                    setPage(1);
                  }}
                  h="44px"
                  w="full"
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
            </Box>
          </Box>

          <TransactionsTable rows={data.transactions} currency={currency} />
        </DashboardCard>

        <Stack
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "stretch", md: "center" }}
          mt="5"
          gap="4"
        >
          <Text color="brand.mutedText">{pageSummary}</Text>

          <Pagination
            page={data.pagination.page}
            totalPages={Math.max(data.pagination.totalPages, 1)}
            onPageChange={setPage}
          />
        </Stack>
      </Box>
    </AuthenticatedShell>
  );
}
