"use client";

import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
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
  FaUtensils,
} from "react-icons/fa";
import { MdOutlineSlowMotionVideo } from "react-icons/md";

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

type NotificationItemProps = {
  icon: React.ReactNode;
  title: string;
  time: string;
  bg: string;
  color: string;
};

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

function RecentActivity() {
  const activities = [
    {
      name: "Customer Shopping Experience Survey",
      reward: "LKR 120",
      date: "May 14, 2025",
    },
    {
      name: "Mobile Banking Usability Survey",
      reward: "LKR 180",
      date: "May 12, 2025",
    },
  ];

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

          {activities.map((activity) => (
            <Grid
              key={activity.name}
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
                  {activity.name}
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
                {activity.reward}
              </Text>

              <Text color="brand.mutedText">{activity.date}</Text>

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

function EarningsChart() {
  const bars = [
    { day: "Mon", value: 180 },
    { day: "Tue", value: 90 },
    { day: "Wed", value: 130 },
    { day: "Thu", value: 260 },
    { day: "Fri", value: 80 },
    { day: "Sat", value: 170 },
    { day: "Sun", value: 60 },
  ];

  const maxValue = Math.max(...bars.map((bar) => bar.value));

  return (
    <DashboardCard p="5">
      <HStack justify="space-between" mb="5">
        <Box>
          <Text fontWeight="bold" color="brand.dark">
            Your Earnings This Week
          </Text>

          <Text fontSize="3xl" fontWeight="extrabold" color="brand.dark" mt="4">
            LKR 1,020
          </Text>

          <Text fontSize="sm" color="green.600" fontWeight="bold">
            ↑ 24% vs last week
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
              {bar.day === "Thu" && (
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
                  LKR 260
                </Box>
              )}

              <Box
                w="100%"
                maxW="28px"
                h={`${height}px`}
                bg={bar.day === "Thu" ? "brand.primary" : "#BFD0FF"}
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

function VerificationProgress() {
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
          1 of 3 completed
        </Text>

        <Text fontSize="sm" color="brand.mutedText">
          40%
        </Text>
      </HStack>

      <Box h="6px" bg="#E5E7EB" borderRadius="999px" mt="2">
        <Box h="full" w="40%" bg="brand.primary" borderRadius="999px" />
      </Box>

      <VStack align="stretch" gap="3" mt="5">
        <HStack>
          <FiCheckCircle color="#16A34A" />
          <Text fontSize="sm" color="brand.dark">
            Upload NIC or Driving License
          </Text>
        </HStack>

        <HStack>
          <Box w="16px" h="16px" borderRadius="full" borderWidth="1px" />
          <Text fontSize="sm" color="brand.dark">
            Add Selfie Verification
          </Text>
        </HStack>

        <HStack>
          <Box w="16px" h="16px" borderRadius="full" borderWidth="1px" />
          <Text fontSize="sm" color="brand.dark">
            Complete Profile Review
          </Text>
        </HStack>
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

function RightPanel() {
  return (
    <VStack align="stretch" gap="5">
      <DashboardCard p="5">
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
            LKR 3,240
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
            LKR 1,250
          </Text>
        </HStack>

        <HStack justify="space-between" mt="3">
          <Text fontSize="sm" color="brand.mutedText">
            Total Withdrawn
          </Text>
          <Text fontSize="sm" fontWeight="bold">
            LKR 14,210
          </Text>
        </HStack>
      </DashboardCard>

      <VerificationProgress />

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
          <NotificationItem
            icon={<FiUser />}
            title="You earned LKR 180 from Customer Feedback Survey."
            time="1h ago"
            bg="#DCFCE7"
            color="green.600"
          />

          <NotificationItem
            icon={<FiLock />}
            title="A new verified-only survey is available."
            time="3h ago"
            bg="#F3E8FF"
            color="#7C3AED"
          />

          <NotificationItem
            icon={<FiShield />}
            title="Complete verification to unlock premium surveys."
            time="1d ago"
            bg="#FEF3C7"
            color="#D97706"
          />
        </VStack>
      </DashboardCard>

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
  return (
    <Flex minH="100vh" bg="white" color="brand.dark">
      <ParticipantSidebar />

      <Box flex="1" p={{ base: "4", lg: "6" }} overflow="hidden">
        <Grid templateColumns={{ base: "1fr", xl: "1fr 370px" }} gap="6">
          <Box minW="0">
            <DashboardCard overflow="hidden" mb="5">
              <Grid templateColumns={{ base: "1fr", lg: "1.2fr 1fr" }}>
                <Box p={{ base: "5", lg: "8" }}>
                  <Text fontSize={{ base: "2xl", lg: "3xl" }} fontWeight="extrabold">
                    Welcome back, Nadeesha! 👋
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
                value="18"
                helper="New surveys for you"
                bg="#DBEAFE"
                color="brand.primary"
              />

              <StatCard
                icon={<FiCheckCircle />}
                title="Completed Surveys"
                value="42"
                helper="Total completed"
                bg="#DCFCE7"
                color="green.600"
              />

              <StatCard
                icon={<FiUser />}
                title="Total Earned"
                value="LKR 18,450"
                helper="All time earnings"
                bg="#F3E8FF"
                color="#7C3AED"
              />

              <StatCard
                icon={<FiUser />}
                title="Wallet Balance"
                value="LKR 3,240"
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

            <Grid py={5} templateColumns={{ base: "1fr", md: "1fr 1fr", xl: "repeat(5, 1fr)" }} gap="0" mb="5">
              <SurveyCard
                icon={<FiShoppingBag />}
                title="Customer Shopping Experience Survey"
                category="Retail"
                time="5–8 min"
                reward="LKR 120"
                iconBg="#EAF2FF"
                iconColor="brand.primary"
              />

              <SurveyCard
                icon={<FaUniversity />}
                title="Mobile Banking Usability Survey"
                category="Finance"
                time="8–12 min"
                reward="LKR 180"
                badge="High Reward"
                iconBg="#EAF2FF"
                iconColor="brand.primary"
              />

              <SurveyCard
                icon={<MdOutlineSlowMotionVideo />}
                title="Streaming App Preferences Survey"
                category="Entertainment"
                time="7–10 min"
                reward="LKR 200"
                badge="New"
                iconBg="#F3E8FF"
                iconColor="#7C3AED"
              />

              <SurveyCard
                icon={<FaCar />}
                title="Ride-Hailing Experience Survey"
                category="Transport"
                time="6–9 min"
                reward="LKR 160"
                iconBg="#EAF2FF"
                iconColor="brand.primary"
              />
            </Grid>

            <Text fontSize="xl" fontWeight="bold" color="brand.dark">
              More Earning Opportunities
            </Text>

            <Text color="brand.mutedText" fontSize="sm" mb="4">
              Verify your account to unlock these high-paying surveys.
            </Text>

            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", xl: "1fr 1fr 1fr 1.2fr" }} gap="4" mb="5">
              <LockedSurveyCard
                title="Insurance Awareness Survey"
                time="15–20 min"
                reward="LKR 350"
              />

              <LockedSurveyCard
                title="Investment Preferences Study"
                time="18–22 min"
                reward="LKR 450"
              />

              <LockedSurveyCard
                title="Vehicle Ownership Research"
                time="20–25 min"
                reward="LKR 500"
              />

              <DashboardCard
                p="5"
                borderStyle="dashed"
                borderColor="#BFD0FF"
                bg="#FBFCFF"
              >
                <Text fontWeight="bold" color="brand.dark">
                  Unlock higher rewards!
                </Text>

                <Text fontSize="sm" color="brand.mutedText" mt="2">
                  Verify your account with NIC or driving license and selfie to
                  access premium surveys.
                </Text>

                <Text color="brand.primary" fontSize="sm" fontWeight="bold" mt="5">
                  Learn more about verification →
                </Text>
              </DashboardCard>
            </Grid>

            <Grid templateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap="5">
              <RecentActivity />
              <EarningsChart />
            </Grid>
          </Box>

          <RightPanel />
        </Grid>
      </Box>
    </Flex>
  );
}