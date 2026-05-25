"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { IconType } from "react-icons";
import {
  FiArrowRight,
  FiAward,
  FiBarChart2,
  FiBell,
  FiCalendar,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiClipboard,
  FiDownload,
  FiFileText,
  FiGrid,
  FiLayout,
  FiMoreHorizontal,
  FiPlus,
  FiPlusCircle,
  FiSettings,
  FiTrendingUp,
  FiUser,
  FiUsers,
} from "react-icons/fi";

type MenuItem = {
  label: string;
  href: string;
  icon: IconType;
  badge?: number;
};

type SurveyStatus = "Active" | "Draft" | "Closed";

const menuItems: MenuItem[] = [
  { label: "Dashboard", href: "/creator/dashboard", icon: FiGrid },
  { label: "Create Survey", href: "/creator/surveys/create", icon: FiPlusCircle },
  { label: "My Surveys", href: "/creator/surveys", icon: FiFileText },
  { label: "Analytics", href: "/creator/analytics", icon: FiBarChart2 },
  { label: "Responses", href: "/creator/responses", icon: FiUsers },
  { label: "Notifications", href: "/creator/notifications", icon: FiBell, badge: 3 },
  { label: "Profile", href: "/creator/profile", icon: FiUser },
  { label: "Settings", href: "/creator/settings", icon: FiSettings },
];

const surveys = [
  {
    name: "Product Feedback 2025",
    description: "Get feedback on our new product features",
    status: "Active" as SurveyStatus,
    audience: "Customers",
    responses: "893",
    updated: "May 14, 2025",
  },
  {
    name: "Customer Satisfaction Q1",
    description: "Quarterly customer satisfaction survey",
    status: "Active" as SurveyStatus,
    audience: "Customers",
    responses: "742",
    updated: "May 12, 2025",
  },
  {
    name: "Website Experience Survey",
    description: "Help us improve your website experience",
    status: "Draft" as SurveyStatus,
    audience: "Visitors",
    responses: "-",
    updated: "May 10, 2025",
  },
  {
    name: "Employee Engagement 2025",
    description: "Annual employee engagement survey",
    status: "Closed" as SurveyStatus,
    audience: "Employees",
    responses: "1,118",
    updated: "May 5, 2025",
  },
];

const notifications = [
  {
    icon: FiBarChart2,
    title: 'Your survey "Product Feedback 2025" received 57 new responses.',
    time: "2m ago",
    color: "brand.primary",
  },
  {
    icon: FiFileText,
    title: 'Survey "Customer Satisfaction Q1" has a completion rate of 78%.',
    time: "1h ago",
    color: "brand.warning",
  },
  {
    icon: FiDownload,
    title: "Your scheduled report is ready to download.",
    time: "3h ago",
    color: "#8B5CF6",
  },
];

const progressItems = [
  { label: "Add profile picture", done: true },
  { label: "Verify email address", done: true },
  { label: "Create your first survey", done: true },
  { label: "Get 10 responses", done: true },
  { label: "Invite team members", done: false },
];

export default function CreatorDashboardPage() {
  return (
    <Flex minH="100vh" bg="white" color="brand.dark">
      <Sidebar />

      <Box flex="1" p={{ base: "4", lg: "6" }} overflow="hidden">
        <Grid
          templateColumns={{ base: "1fr", xl: "1fr 330px" }}
          gap="5"
          maxW="1500px"
          mx="auto"
        >
          <Box minW="0">
            <Hero />

            <SimpleGrid columns={{ base: 1, md: 3 }} gap="4" mt="5">
              <StatCard
                title="Total Surveys"
                value="24"
                growth="12%"
                icon={FiClipboard}
                active
              />
              <StatCard
                title="Active Surveys"
                value="4"
                growth="33%"
                icon={FiTrendingUp}
                iconBg="#E8F8F2"
                iconColor="brand.success"
              />
              <StatCard
                title="Total Responses"
                value="2,753"
                growth="18%"
                icon={FiUsers}
                iconBg="#F0E7FF"
                iconColor="#8B5CF6"
              />
            </SimpleGrid>

            <Grid templateColumns={{ base: "1fr", lg: "1.35fr 0.95fr" }} gap="4" mt="4">
              <ResponseGrowthCard />
              <SurveyStatusCard />
            </Grid>

            <MySurveysTable />
          </Box>

          <RightPanel />
        </Grid>
      </Box>
    </Flex>
  );
}

function Sidebar() {
  return (
    <Box
      w={{ base: "82px", lg: "270px" }}
      bg="white"
      borderRightWidth="1px"
      borderColor="brand.border"
      p="4"
      display="flex"
      flexDirection="column"
      gap="5"
      position="sticky"
      top="0"
      h="100vh"
    >
      <VStack align="stretch" gap="2">
        {menuItems.map((item) => (
          <SidebarItem key={item.label} item={item} />
        ))}
      </VStack>

      <Box flex="1" />

      <Box
        display={{ base: "none", lg: "block" }}
        bg="white"
        borderWidth="1px"
        borderColor="brand.border"
        borderRadius="card"
        p="5"
        textAlign="center"
        boxShadow="softCard"
      >
        <Box fontSize="54px" mb="3">
          🏆
        </Box>
        <Text fontWeight="bold" color="brand.dark">
          You&apos;re a Pro Creator! 🎉
        </Text>
        <Text textStyle="smallText" mt="1">
          Keep up the amazing work.
        </Text>
        <Button variant="ghost" size="sm" mt="2">
          View Creator Stats <FiArrowRight />
        </Button>
      </Box>

      <Box
        display={{ base: "none", lg: "block" }}
        bg="white"
        borderWidth="1px"
        borderColor="brand.border"
        borderRadius="card"
        p="5"
        boxShadow="softCard"
      >
        <HStack justify="space-between">
          <HStack>
            <Icon as={FiAward} color="brand.warning" />
            <Text fontWeight="bold">Creator Plan</Text>
          </HStack>
          <Badge bg="brand.lightBlue" color="brand.primary" borderRadius="pill">
            Pro
          </Badge>
        </HStack>

        <Text textStyle="smallText" mt="3">
          Renews on Apr 24, 2025
        </Text>

        <HStack mt="5" justify="space-between">
          <Text fontWeight="bold" fontSize="sm">
            8,245
          </Text>
          <Text textStyle="smallText">/ 10,000 responses used</Text>
        </HStack>

        <Box h="6px" bg="gray.subtle" borderRadius="pill" mt="2" overflow="hidden">
          <Box h="full" w="82%" bg="brand.primary" borderRadius="pill" />
        </Box>

        <Button variant="ghost" w="full" mt="5">
          Upgrade Plan
        </Button>
      </Box>
    </Box>
  );
}

function SidebarItem({ item }: { item: MenuItem }) {
  const pathname = usePathname();

  const active =
    pathname === item.href ||
    (item.href !== "/creator/dashboard" && pathname.startsWith(item.href));

  return (
    <NextLink href={item.href} style={{ textDecoration: "none" }}>
      <HStack
        px={{ base: "3", lg: "4" }}
        py="3"
        borderRadius="12px"
        gap="4"
        bg={active ? "brand.cardSelected" : "transparent"}
        color={active ? "brand.primary" : "brand.dark"}
        fontWeight={active ? "bold" : "medium"}
        _hover={{ bg: "brand.cardHover", color: "brand.primary" }}
        justify={{ base: "center", lg: "flex-start" }}
      >
        <Icon as={item.icon} boxSize="5" />
        <Text display={{ base: "none", lg: "block" }} fontSize="sm">
          {item.label}
        </Text>

        {item.badge && (
          <Box
            ml="auto"
            display={{ base: "none", lg: "grid" }}
            placeItems="center"
            w="22px"
            h="22px"
            bg="brand.primary"
            color="white"
            borderRadius="full"
            fontSize="xs"
            fontWeight="bold"
          >
            {item.badge}
          </Box>
        )}
      </HStack>
    </NextLink>
  );
}

function Hero() {
  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="#CBD7F0"
      borderRadius="18px"
      minH="210px"
      overflow="hidden"
      position="relative"
      px={{ base: "5", lg: "9" }}
      py={{ base: "7", lg: "8" }}
      boxShadow="0px 18px 45px rgba(0, 9, 87, 0.06)"
    >
      <Grid templateColumns={{ base: "1fr", lg: "1fr 420px" }} alignItems="center">
        <Box>
          <Heading fontSize={{ base: "2xl", md: "3xl" }} color="brand.dark">
            Welcome back, Sarah! 👋
          </Heading>
          <Text mt="3" color="brand.mutedText">
            You have 4 active surveys and 2,753 total responses.
          </Text>

          <HStack mt="6" gap="3" flexWrap="wrap">
            <Button asChild>
              <NextLink href="/creator/surveys/create">
                <FiPlus />
                Create New Survey
              </NextLink>
            </Button>

            <Button variant="outline" asChild>
              <NextLink href="/creator/analytics">
                <FiBarChart2 />
                View Analytics
              </NextLink>
            </Button>
          </HStack>
        </Box>

        <HeroIllustration />
      </Grid>
    </Box>
  );
}

function HeroIllustration() {
  return (
    <Box
      display={{ base: "none", lg: "block" }}
      position="relative"
      h="170px"
    >
      <Box
        position="absolute"
        left="10px"
        top="10px"
        w="150px"
        h="100px"
        bg="white"
        borderRadius="14px"
        boxShadow="softCard"
        p="4"
      >
        <HStack gap="2" mb="4">
          <Box w="42px" h="4px" bg="brand.lightBlue" borderRadius="pill" />
          <Box w="65px" h="4px" bg="brand.lightBlue" borderRadius="pill" />
        </HStack>
        <HStack align="end" h="50px" gap="2">
          <Box w="16px" h="20px" bg="brand.lightBlue" borderRadius="4px" />
          <Box w="16px" h="34px" bg="brand.primary" borderRadius="4px" />
          <Box w="16px" h="46px" bg="brand.primaryHover" borderRadius="4px" />
          <Box w="16px" h="28px" bg="brand.lightBlue" borderRadius="4px" />
        </HStack>
      </Box>

      <Box
        position="absolute"
        right="42px"
        top="10px"
        w="58px"
        h="58px"
        bg="white"
        borderRadius="full"
        boxShadow="softCard"
        display="grid"
        placeItems="center"
      >
        <Icon as={FiBarChart2} color="brand.primary" boxSize="7" />
      </Box>

      <Box
        position="absolute"
        left="165px"
        bottom="10px"
        w="230px"
        h="115px"
        bg="brand.lightBlue"
        borderRadius="60px 60px 16px 16px"
        opacity="0.85"
      />

      <Box
        position="absolute"
        left="230px"
        top="35px"
        w="92px"
        h="92px"
        bg="brand.primary"
        borderRadius="full"
      />

      <Box
        position="absolute"
        left="250px"
        top="24px"
        w="82px"
        h="120px"
        bg="brand.primary"
        borderRadius="44px 44px 18px 18px"
      />

      <Box
        position="absolute"
        left="198px"
        bottom="8px"
        w="120px"
        h="70px"
        bg="brand.dark"
        borderRadius="10px"
        transform="skewX(8deg)"
        display="grid"
        placeItems="center"
      >
        <Box
          w="24px"
          h="24px"
          bg="brand.primary"
          borderRadius="full"
          display="grid"
          placeItems="center"
          color="white"
        >
          <FiCheck />
        </Box>
      </Box>

      <Box
        position="absolute"
        left="285px"
        top="28px"
        w="18px"
        h="18px"
        bg="#F7B267"
        borderRadius="full"
      />

      <Box
        position="absolute"
        right="8px"
        bottom="8px"
        w="48px"
        h="90px"
        borderBottomWidth="3px"
        borderColor="brand.primary"
      >
        <Box position="absolute" left="20px" bottom="0" w="5px" h="72px" bg="brand.primary" />
        <Box position="absolute" left="4px" top="26px" w="24px" h="12px" bg="brand.lightBlue" borderRadius="full" transform="rotate(35deg)" />
        <Box position="absolute" right="0" top="44px" w="24px" h="12px" bg="brand.lightBlue" borderRadius="full" transform="rotate(-35deg)" />
        <Box position="absolute" left="0" top="58px" w="24px" h="12px" bg="brand.lightBlue" borderRadius="full" transform="rotate(35deg)" />
      </Box>
    </Box>
  );
}

function StatCard({
  title,
  value,
  growth,
  icon,
  active,
  iconBg = "whiteAlpha.300",
  iconColor = "white",
}: {
  title: string;
  value: string;
  growth: string;
  icon: IconType;
  active?: boolean;
  iconBg?: string;
  iconColor?: string;
}) {
  return (
    <Box
      bg={active ? "brand.primary" : "white"}
      color={active ? "white" : "brand.dark"}
      borderWidth="1px"
      borderColor={active ? "brand.primary" : "brand.border"}
      borderRadius="card"
      p="6"
      boxShadow="softCard"
      minH="148px"
    >
      <HStack justify="space-between">
        <HStack gap="4">
          <Box
            w="46px"
            h="46px"
            bg={active ? "whiteAlpha.300" : iconBg}
            color={active ? "white" : iconColor}
            borderRadius="14px"
            display="grid"
            placeItems="center"
          >
            <Icon as={icon} boxSize="5" />
          </Box>
          <Text fontWeight="medium">{title}</Text>
        </HStack>
      </HStack>

      <Text fontSize="3xl" fontWeight="bold" mt="4">
        {value}
      </Text>

      <HStack mt="2" fontSize="sm">
        <Text color={active ? "white" : "brand.success"}>↑ {growth}</Text>
        <Text color={active ? "whiteAlpha.800" : "brand.mutedText"}>from last month</Text>
      </HStack>
    </Box>
  );
}

function ResponseGrowthCard() {
  return (
    <DashboardCard>
      <HStack justify="space-between" mb="5">
        <Heading fontSize="md">Response Growth</Heading>
        <Button variant="outline" size="sm" h="32px">
          Last 30 Days
        </Button>
      </HStack>

      <Box h="220px" position="relative">
        <Box position="absolute" inset="0">
          {[0, 1, 2, 3].map((line) => (
            <Box
              key={line}
              position="absolute"
              left="42px"
              right="8px"
              top={`${line * 25}%`}
              borderTopWidth="1px"
              borderStyle="dashed"
              borderColor="gray.border"
            />
          ))}

          <VStack
            position="absolute"
            left="0"
            top="-2px"
            h="170px"
            justify="space-between"
            align="start"
          >
            {["1K", "750", "500", "250", "0"].map((item) => (
              <Text key={item} fontSize="xs" color="brand.mutedText">
                {item}
              </Text>
            ))}
          </VStack>

          <svg
            width="100%"
            height="180"
            viewBox="0 0 620 180"
            preserveAspectRatio="none"
            style={{ position: "absolute", left: 35, right: 0, top: 0, width: "calc(100% - 35px)" }}
          >
            <defs>
              <linearGradient id="responseArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#0015D6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0015D6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,136 L38,150 L76,120 L114,78 L152,88 L190,72 L228,112 L266,108 L304,48 L342,65 L380,86 L418,122 L456,104 L494,58 L532,54 L570,32 L620,16 L620,180 L0,180 Z"
              fill="url(#responseArea)"
            />
            <polyline
              points="0,136 38,150 76,120 114,78 152,88 190,72 228,112 266,108 304,48 342,65 380,86 418,122 456,104 494,58 532,54 570,32 620,16"
              fill="none"
              stroke="#0015D6"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {[
              [0, 136],
              [38, 150],
              [76, 120],
              [114, 78],
              [152, 88],
              [190, 72],
              [228, 112],
              [266, 108],
              [304, 48],
              [342, 65],
              [380, 86],
              [418, 122],
              [456, 104],
              [494, 58],
              [532, 54],
              [570, 32],
              [620, 16],
            ].map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#0015D6" />
            ))}
          </svg>

          <Box
            position="absolute"
            right="54px"
            top="14px"
            bg="white"
            borderWidth="1px"
            borderColor="brand.border"
            boxShadow="softCard"
            borderRadius="8px"
            px="3"
            py="2"
          >
            <Text fontSize="xs" fontWeight="bold">
              May 14, 2025
            </Text>
            <Text fontSize="xs" color="brand.primary" fontWeight="bold">
              893 responses
            </Text>
          </Box>
        </Box>
      </Box>

      <HStack justify="space-between" mt="-2">
        <Box>
          <Text textStyle="smallText">Total Responses</Text>
          <Text fontSize="xl" fontWeight="bold">
            2,753
          </Text>
        </Box>
        <Text fontSize="sm" color="brand.success">
          ↑ 18% vs Apr 14 – May 13
        </Text>
      </HStack>
    </DashboardCard>
  );
}

function SurveyStatusCard() {
  const statuses = [
    { label: "Active", value: "4 (17%)", color: "#16B364" },
    { label: "Draft", value: "8 (33%)", color: "#0015D6" },
    { label: "Closed", value: "7 (29%)", color: "#8B5CF6" },
    { label: "Archived", value: "5 (21%)", color: "#CBD5E1" },
  ];

  return (
    <DashboardCard>
      <Heading fontSize="md" mb="6">
        Survey Status
      </Heading>

      <Grid templateColumns="1fr 1fr" alignItems="center" gap="5">
        <Box
          w="160px"
          h="160px"
          mx="auto"
          borderRadius="full"
          bg="conic-gradient(#16B364 0 17%, #0015D6 17% 50%, #8B5CF6 50% 79%, #CBD5E1 79% 100%)"
          position="relative"
        >
          <Box
            position="absolute"
            inset="28px"
            bg="white"
            borderRadius="full"
            display="grid"
            placeItems="center"
          >
            <Box textAlign="center">
              <Text fontSize="2xl" fontWeight="bold">
                24
              </Text>
              <Text textStyle="smallText">Total</Text>
            </Box>
          </Box>
        </Box>

        <VStack align="stretch" gap="4">
          {statuses.map((status) => (
            <HStack key={status.label} justify="space-between">
              <HStack>
                <Box w="8px" h="8px" bg={status.color} borderRadius="full" />
                <Text fontSize="sm">{status.label}</Text>
              </HStack>
              <Text fontSize="sm">{status.value}</Text>
            </HStack>
          ))}
        </VStack>
      </Grid>

      <Box borderTopWidth="1px" borderColor="brand.border" mt="8" pt="4" textAlign="center">
        <Button variant="ghost" size="sm" asChild>
          <NextLink href="/creator/surveys">
            View all surveys <FiArrowRight />
          </NextLink>
        </Button>
      </Box>
    </DashboardCard>
  );
}

function MySurveysTable() {
  return (
    <DashboardCard mt="4" p="0" overflow="hidden">
      <HStack justify="space-between" p="5" pb="3">
        <Heading fontSize="md">My Surveys</Heading>
        <Button variant="ghost" size="sm" asChild>
          <NextLink href="/creator/surveys">
            View all surveys <FiArrowRight />
          </NextLink>
        </Button>
      </HStack>

      <Box overflowX="auto">
        <Box minW="760px">
          <Grid
            templateColumns="2.2fr 0.8fr 1fr 0.8fr 1fr 0.5fr"
            px="5"
            py="3"
            bg="#FAFBFF"
            borderTopWidth="1px"
            borderBottomWidth="1px"
            borderColor="brand.border"
            color="brand.dark"
            fontSize="xs"
            fontWeight="bold"
          >
            <Text>Survey Name</Text>
            <Text>Status</Text>
            <Text>Audience</Text>
            <Text>Responses</Text>
            <Text>Last Updated</Text>
            <Text>Actions</Text>
          </Grid>

          {surveys.map((survey) => (
            <Grid
              key={survey.name}
              templateColumns="2.2fr 0.8fr 1fr 0.8fr 1fr 0.5fr"
              px="5"
              py="3"
              alignItems="center"
              borderBottomWidth="1px"
              borderColor="brand.border"
              _hover={{ bg: "brand.cardHover" }}
            >
              <HStack>
                <Box
                  w="32px"
                  h="32px"
                  bg={survey.status === "Closed" ? "#E8F8F2" : "brand.lightBlue"}
                  color={survey.status === "Closed" ? "brand.success" : "brand.primary"}
                  borderRadius="8px"
                  display="grid"
                  placeItems="center"
                >
                  <Icon as={survey.status === "Closed" ? FiGrid : FiFileText} />
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="sm">
                    {survey.name}
                  </Text>
                  <Text textStyle="smallText">{survey.description}</Text>
                </Box>
              </HStack>

              <StatusBadge status={survey.status} />

              <Text fontSize="sm" color="brand.dark">
                {survey.audience}
              </Text>

              <Text fontSize="sm" color="brand.dark">
                {survey.responses}
              </Text>

              <Text fontSize="sm" color="brand.dark">
                {survey.updated}
              </Text>

              <Button variant="ghost" size="sm">
                <FiMoreHorizontal />
              </Button>
            </Grid>
          ))}
        </Box>
      </Box>

      <HStack justify="space-between" p="5">
        <Text textStyle="smallText">Showing 1 to 4 of 24 surveys</Text>

        <HStack>
          <Button variant="outline" size="sm" w="34px" h="34px">
            <FiChevronLeft />
          </Button>
          {["1", "2", "3", "...", "6"].map((page) => (
            <Button
              key={page}
              variant={page === "1" ? "solid" : "ghost"}
              size="sm"
              w="34px"
              h="34px"
            >
              {page}
            </Button>
          ))}
          <Button variant="outline" size="sm" w="34px" h="34px">
            <FiChevronRight />
          </Button>
        </HStack>
      </HStack>
    </DashboardCard>
  );
}

function RightPanel() {
  return (
    <VStack align="stretch" gap="4">
      <DashboardCard>
        <HStack justify="space-between" mb="4">
          <Heading fontSize="md">Notifications</Heading>
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </HStack>

        <VStack align="stretch" gap="4">
          {notifications.map((item) => (
            <HStack key={item.title} align="start" gap="3">
              <Box
                w="38px"
                h="38px"
                bg={item.color}
                color="white"
                borderRadius="full"
                display="grid"
                placeItems="center"
                flexShrink="0"
              >
                <Icon as={item.icon} />
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="medium">
                  {item.title}
                </Text>
                <Text textStyle="smallText" mt="1">
                  {item.time}
                </Text>
              </Box>
            </HStack>
          ))}
        </VStack>
      </DashboardCard>

      <DashboardCard>
        <Heading fontSize="md" mb="5">
          Creator Progress
        </Heading>

        <HStack gap="5" align="center">
          <Box
            w="78px"
            h="78px"
            borderRadius="full"
            bg="conic-gradient(#0015D6 0 75%, #E5E7EB 75% 100%)"
            position="relative"
            flexShrink="0"
          >
            <Box
              position="absolute"
              inset="8px"
              bg="white"
              borderRadius="full"
              display="grid"
              placeItems="center"
              fontWeight="bold"
            >
              75%
            </Box>
          </Box>

          <Box>
            <Text fontWeight="bold">Profile Complete</Text>
            <Text textStyle="smallText">You&apos;re doing great!</Text>
          </Box>
        </HStack>

        <VStack align="stretch" gap="3" mt="5">
          {progressItems.map((item) => (
            <HStack key={item.label}>
              <Box
                w="16px"
                h="16px"
                borderRadius="full"
                bg={item.done ? "brand.success" : "white"}
                borderWidth="1px"
                borderColor={item.done ? "brand.success" : "brand.mutedText"}
                color="white"
                display="grid"
                placeItems="center"
                fontSize="10px"
              >
                {item.done && <FiCheck />}
              </Box>
              <Text fontSize="sm" color={item.done ? "brand.dark" : "brand.mutedText"}>
                {item.label}
              </Text>
            </HStack>
          ))}
        </VStack>

        <Button variant="ghost" w="full" mt="5" asChild>
          <NextLink href="/creator/profile">
            Complete Profile <FiArrowRight />
          </NextLink>
        </Button>
      </DashboardCard>

      <DashboardCard>
        <Heading fontSize="md" mb="4">
          Quick Actions
        </Heading>

        <SimpleGrid columns={2} gap="3">
          <QuickAction icon={FiPlusCircle} label="Create Survey" href="/creator/surveys/create" />
          <QuickAction icon={FiLayout} label="Survey Templates" href="/creator/templates" />
          <QuickAction icon={FiDownload} label="Export Results" href="/creator/exports" />
          <QuickAction icon={FiCalendar} label="Schedule Survey" href="/creator/schedule" />
        </SimpleGrid>
      </DashboardCard>
    </VStack>
  );
}

function QuickAction({
  icon,
  label,
  href,
}: {
  icon: IconType;
  label: string;
  href: string;
}) {
  return (
    <Button
      asChild
      variant="outline"
      h="76px"
      borderColor="brand.border"
      color="brand.dark"
      _hover={{ bg: "brand.cardHover", color: "brand.primary", borderColor: "brand.primary" }}
    >
      <NextLink href={href}>
        <VStack gap="2">
          <Icon as={icon} boxSize="6" color="brand.primary" />
          <Text fontSize="sm">{label}</Text>
        </VStack>
      </NextLink>
    </Button>
  );
}

function StatusBadge({ status }: { status: SurveyStatus }) {
  const styles = {
    Active: {
      bg: "#E8F8F2",
      color: "brand.success",
      borderColor: "#BFEADB",
    },
    Draft: {
      bg: "#FFF7E6",
      color: "#B7791F",
      borderColor: "#FBD38D",
    },
    Closed: {
      bg: "#F2EAFE",
      color: "#7C3AED",
      borderColor: "#DDD6FE",
    },
  };

  return (
    <Badge
      w="fit-content"
      px="3"
      py="1"
      borderRadius="pill"
      borderWidth="1px"
      fontSize="xs"
      {...styles[status]}
    >
      {status}
    </Badge>
  );
}

function DashboardCard({
  children,
  p = "5",
  mt,
  overflow,
}: {
  children: React.ReactNode;
  p?: string;
  mt?: string;
  overflow?: string;
}) {
  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="brand.border"
      borderRadius="card"
      p={p}
      mt={mt}
      overflow={overflow}
      boxShadow="0px 10px 30px rgba(0, 9, 87, 0.06)"
    >
      {children}
    </Box>
  );
}