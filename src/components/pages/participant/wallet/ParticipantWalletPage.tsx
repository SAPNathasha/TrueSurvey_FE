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
  Text,
  VStack,
} from "@chakra-ui/react";
import type { ComponentProps, ReactNode } from "react";
import {
  FiArrowRight,
  FiCalendar,
  FiCheckCircle,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiCreditCard,
  FiDollarSign,
  FiDownload,
  FiFilter,
  FiInfo,
  FiSearch,
  FiTrendingUp,
} from "react-icons/fi";

import ParticipantSidebar from "@/components/pages/participant/dashboard/ParticipantSidebar";

type StatCardProps = {
  icon: ReactNode;
  title: string;
  value: string;
  helper: string;
  bg: string;
  color: string;
};

type Transaction = {
  id: number;
  surveyName: string;
  status: "Completed" | "Pending" | "Paid" | "Processing";
  earnedMoney: string;
  date: string;
  time: string;
  paymentMethod: "Wallet Balance" | "Bank Transfer";
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
};

type Withdrawal = {
  method: string;
  amount: string;
  status: string;
  date: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
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

function WalletBalanceCard() {
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
            LKR 3,240
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
            ↑ 12.5% vs last month
          </Box>
        </Box>

        <Box>
          <HStack justify="space-between" align="start" mb="5">
            <Box>
              <Text fontSize="lg" fontWeight="bold" color="brand.dark">
                Earnings Trend
              </Text>

              <Text as="span" fontSize="sm" color="brand.mutedText">
                Last 30 days
              </Text>
            </Box>

            <Button size="sm" variant="outline">
              Last 30 Days
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

              <path
                d="M0,120 L30,88 L65,84 L95,82 L125,58 L160,72 L190,54 L225,65 L255,75 L285,55 L320,70 L350,84 L380,58 L415,66 L450,72 L480,52 L515,66 L545,48 L580,45 L605,28 L620,35 L620,140 L0,140 Z"
                fill="url(#walletAreaGradient)"
              />

              <polyline
                points="0,120 30,88 65,84 95,82 125,58 160,72 190,54 225,65 255,75 285,55 320,70 350,84 380,58 415,66 450,72 480,52 515,66 545,48 580,45 605,28 620,35"
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
              <Text>LKR 0</Text>
              <Text>Apr 20</Text>
              <Text>Apr 27</Text>
              <Text>May 04</Text>
              <Text>May 11</Text>
              <Text>May 18</Text>
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

const transactions: Transaction[] = [
  {
    id: 1,
    surveyName: "Shopping Habits & Preferences",
    status: "Completed",
    earnedMoney: "LKR 250.00",
    date: "May 18, 2025",
    time: "09:15 AM",
    paymentMethod: "Wallet Balance",
    icon: <FiSearch />,
    iconBg: "#F3E8FF",
    iconColor: "#7C3AED",
  },
  {
    id: 2,
    surveyName: "Food & Beverages Feedback",
    status: "Pending",
    earnedMoney: "LKR 180.00",
    date: "May 18, 2025",
    time: "08:40 AM",
    paymentMethod: "Wallet Balance",
    icon: <FiInfo />,
    iconBg: "#FEF3C7",
    iconColor: "#D97706",
  },
  {
    id: 3,
    surveyName: "Technology Usage Survey",
    status: "Completed",
    earnedMoney: "LKR 300.00",
    date: "May 17, 2025",
    time: "07:30 PM",
    paymentMethod: "Wallet Balance",
    icon: <FiCreditCard />,
    iconBg: "#EAF2FF",
    iconColor: "brand.primary",
  },
  {
    id: 4,
    surveyName: "Customer Service Experience",
    status: "Paid",
    earnedMoney: "LKR 120.00",
    date: "May 16, 2025",
    time: "04:20 PM",
    paymentMethod: "Bank Transfer",
    icon: <FiDollarSign />,
    iconBg: "#DCFCE7",
    iconColor: "green.600",
  },
  {
    id: 5,
    surveyName: "Mobile Banking Usability",
    status: "Completed",
    earnedMoney: "LKR 180.00",
    date: "May 18, 2025",
    time: "11:05 AM",
    paymentMethod: "Wallet Balance",
    icon: <FiSearch />,
    iconBg: "#EEF2FF",
    iconColor: "brand.primary",
  },
  {
    id: 6,
    surveyName: "Streaming App Preferences",
    status: "Processing",
    earnedMoney: "LKR 200.00",
    date: "May 15, 2025",
    time: "06:45 PM",
    paymentMethod: "Wallet Balance",
    icon: <FiCreditCard />,
    iconBg: "#F3E8FF",
    iconColor: "#7C3AED",
  },
  {
    id: 7,
    surveyName: "Ride-hailing Experience",
    status: "Paid",
    earnedMoney: "LKR 160.00",
    date: "May 14, 2025",
    time: "10:30 AM",
    paymentMethod: "Bank Transfer",
    icon: <FiSearch />,
    iconBg: "#EAF2FF",
    iconColor: "brand.primary",
  },
  {
    id: 8,
    surveyName: "Insurance Awareness Survey",
    status: "Pending",
    earnedMoney: "LKR 350.00",
    date: "May 14, 2025",
    time: "09:10 AM",
    paymentMethod: "Wallet Balance",
    icon: <FiCheckCircle />,
    iconBg: "#DCFCE7",
    iconColor: "green.600",
  },
];

function getStatusStyle(status: Transaction["status"]) {
  if (status === "Completed") {
    return {
      bg: "#DCFCE7",
      color: "green.700",
    };
  }

  if (status === "Pending") {
    return {
      bg: "#FEF3C7",
      color: "#B45309",
    };
  }

  if (status === "Paid") {
    return {
      bg: "#DBEAFE",
      color: "brand.primary",
    };
  }

  return {
    bg: "#EEF2FF",
    color: "brand.primary",
  };
}

function TransactionsTable() {
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

          {transactions.map((transaction) => {
            const statusStyle = getStatusStyle(transaction.status);

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
                    bg={transaction.iconBg}
                    color={transaction.iconColor}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink="0"
                  >
                    {transaction.icon}
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
                  {transaction.status}
                </Box>

                <Text fontWeight="bold" color="brand.dark">
                  {transaction.earnedMoney}
                </Text>

                <Text color="brand.dark">{transaction.date}</Text>

                <Text color="brand.dark">{transaction.time}</Text>

                <HStack color="brand.dark">
                  {transaction.paymentMethod === "Bank Transfer" ? (
                    <FiSearch />
                  ) : (
                    <FiSearch />
                  )}

                  <Text>{transaction.paymentMethod}</Text>
                </HStack>

                <Button variant="ghost" size="sm" color="brand.primary">
                  View details
                </Button>
              </Grid>
            );
          })}
        </Box>
      </Box>
    </DashboardCard>
  );
}

function TransactionsFilterBar() {
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
        {["All", "Completed", "Pending", "Paid", "Withdrawals"].map((item) => (
          <Button
            key={item}
            h="44px"
            borderRadius="999px"
            variant={item === "All" ? "solid" : "outline"}
            color={item === "All" ? "white" : "brand.dark"}
            bg={item === "All" ? "brand.primary" : "white"}
          >
            {item}
          </Button>
        ))}
      </HStack>

      <Button h="44px" variant="outline" ml={{ base: "0", xl: "auto" }}>
        <FiCalendar />
        May 1 - May 18, 2025
        <FiChevronDown />
      </Button>

      <Button h="44px" variant="outline">
        <FiFilter />
        Most Recent
        <FiChevronDown />
      </Button>
    </HStack>
  );
}

const withdrawals: Withdrawal[] = [
  {
    method: "Bank Transfer",
    amount: "LKR 2,500.00",
    status: "Completed",
    date: "May 12, 2025",
    icon: <FiSearch />,
    iconBg: "#DBEAFE",
    iconColor: "brand.primary",
  },
  {
    method: "Visa **4242",
    amount: "LKR 1,800.00",
    status: "Completed",
    date: "May 01, 2025",
    icon: <Text fontWeight="bold">VISA</Text>,
    iconBg: "#EEF2FF",
    iconColor: "brand.primary",
  },
  {
    method: "eZ Cash",
    amount: "LKR 1,000.00",
    status: "Completed",
    date: "Apr 20, 2025",
    icon: <Text fontWeight="bold">eZ</Text>,
    iconBg: "#F3E8FF",
    iconColor: "#7C3AED",
  },
];

function RecentWithdrawalsCard() {
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
        {withdrawals.map((withdrawal) => (
          <HStack key={withdrawal.method} justify="space-between" gap="3">
            <HStack gap="3">
              <Box
                w="42px"
                h="42px"
                borderRadius="10px"
                bg={withdrawal.iconBg}
                color={withdrawal.iconColor}
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="18px"
                flexShrink="0"
              >
                {withdrawal.icon}
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="bold" color="brand.dark">
                  {withdrawal.amount}
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
                bg="#DCFCE7"
                color="green.700"
                fontSize="xs"
                fontWeight="bold"
              >
                {withdrawal.status}
              </Box>

              <Text fontSize="xs" color="brand.dark" mt="1">
                {withdrawal.date}
              </Text>
            </Box>
          </HStack>
        ))}
      </VStack>

      <Button w="100%" h="42px" mt="5" variant="outline">
        View All Withdrawals
      </Button>
    </DashboardCard>
  );
}

function EarningsBreakdownCard() {
  const rows = [
    {
      label: "Completed",
      value: "LKR 1,240.00",
      color: "brand.primary",
    },
    {
      label: "Pending",
      value: "LKR 1,250.00",
      color: "#EAB308",
    },
    {
      label: "Processing",
      value: "LKR 200.00",
      color: "#7C3AED",
    },
    {
      label: "Withdrawn",
      value: "LKR 2,500.00",
      color: "green.600",
    },
  ];

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
        {rows.map((row) => (
          <HStack key={row.label} justify="space-between">
            <HStack gap="3">
              <Box w="10px" h="10px" borderRadius="full" bg={row.color} />
              <Text fontSize="sm" color="brand.dark">
                {row.label}
              </Text>
            </HStack>

            <Text fontSize="sm" fontWeight="bold" color="brand.dark">
              {row.value}
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
          LKR 5,190.00
        </Text>
      </HStack>
    </DashboardCard>
  );
}

function WithdrawalMethodCard() {
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
              Bank Account
            </Text>

            <Text fontSize="xs" color="brand.mutedText">
              Commercial Bank **** 1234
            </Text>
          </Box>
        </HStack>

        <HStack>
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

          <FiChevronRight />
        </HStack>
      </HStack>
    </DashboardCard>
  );
}

function WalletTipsCard() {
  const tips = [
    "Complete more surveys to increase your earnings.",
    "Verified users get access to higher paying surveys.",
    "Keep your profile updated for better matches.",
    "Withdrawals are processed within 1–3 business days.",
  ];

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

function RightPanel() {
  return (
    <VStack align="stretch" gap="5">
      <RecentWithdrawalsCard />
      <EarningsBreakdownCard />
      <WithdrawalMethodCard />

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
                LKR 300.00
              </Text>
              .
            </Text>

            <Text fontSize="sm" color="brand.dark" mt="2">
              Withdrawals are processed within{" "}
              <Text as="span" fontWeight="bold">
                1–3 business days
              </Text>
              .
            </Text>
          </Box>
        </HStack>
      </Box>

      <WalletTipsCard />
    </VStack>
  );
}

function Pagination() {
  return (
    <HStack justify="flex-end" mt="5" gap="3">
      <IconButton aria-label="Previous page" variant="outline">
        <FiChevronLeft />
      </IconButton>

      {[1, 2, 3].map((page) => (
        <Button
          key={page}
          variant={page === 1 ? "solid" : "outline"}
          color={page === 1 ? "white" : "brand.dark"}
          w="42px"
        >
          {page}
        </Button>
      ))}

      <Text fontWeight="bold">...</Text>

      <Button variant="outline" w="42px">
        4
      </Button>

      <IconButton aria-label="Next page" variant="outline">
        <FiChevronRight />
      </IconButton>
    </HStack>
  );
}

export default function ParticipantWalletPage() {
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
                Track your earnings, pending rewards, and withdrawals.
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
                value="LKR 3,240"
                helper="Available to withdraw"
                bg="#DBEAFE"
                color="brand.primary"
              />

              <StatCard
                icon={<FiTrendingUp />}
                title="Pending Earnings"
                value="LKR 1,250"
                helper="Awaiting approval"
                bg="#FEF3C7"
                color="#D97706"
              />

              <StatCard
                icon={<FiDollarSign />}
                title="Total Earned"
                value="LKR 18,450"
                helper="All time earnings"
                bg="#F3E8FF"
                color="#7C3AED"
              />

              <StatCard
                icon={<FiCreditCard />}
                title="Total Withdrawn"
                value="LKR 14,210"
                helper="All time withdrawals"
                bg="#DCFCE7"
                color="green.600"
              />
            </Grid>

            <WalletBalanceCard />

            <Box mt="6">
              <TransactionsFilterBar />
              <TransactionsTable />

              <HStack justify="space-between" mt="5" flexWrap="wrap" gap="4">
                <Text color="brand.mutedText">
                  Showing 1 to 8 of 32 transactions
                </Text>

                <Pagination />
              </HStack>
            </Box>
          </Box>

          <RightPanel />
        </Grid>
      </Box>
    </Flex>
  );
}
