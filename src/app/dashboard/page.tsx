"use client";

import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  FiHome,
  FiPlus,
  FiClipboard,
  FiBarChart2,
  FiBell,
  FiUser,
  FiSettings,
  FiSearch,
  FiChevronDown,
  FiChevronRight,
  FiMoreVertical,
  FiUsers,
} from "react-icons/fi";
import { FaWallet } from "react-icons/fa";
import { BsClipboardCheck } from "react-icons/bs";
import { LuTrendingUp } from "react-icons/lu";

const colors = {
  primary: "#0015D6",
  primaryDark: "#0011AD",
  navy: "#000957",
  yellow: "#FFEB00",
};

const menuItems = [
  { label: "Dashboard", icon: FiHome, active: true },
  { label: "Create Survey", icon: FiPlus },
  { label: "My Surveys", icon: FiClipboard },
  { label: "Analytics", icon: FiBarChart2 },
  { label: "Wallet Balance", icon: FaWallet },
];

const bottomItems = [
  { label: "Notifications", icon: FiBell },
  { label: "Profile", icon: FiUser },
  { label: "Settings", icon: FiSettings },
];

const stats = [
  {
    value: "08",
    label: "Total Surveys Created",
    icon: BsClipboardCheck,
  },
  {
    value: "10",
    label: "Active Surveys",
    icon: LuTrendingUp,
  },
  {
    value: "03",
    label: "Total Responses Collected",
    icon: FiUsers,
  },
  {
    value: "$120",
    label: "Total Budget Spent",
    icon: FaWallet,
  },
];

const surveys = [
  {
    tag: "Retail Store",
    title: "Customer Satisfaction Survey",
    progress: 24,
  },
  {
    tag: "Product Feedback Survey",
    title: "New Mobile App Feature Feedback",
    progress: 79,
  },
  {
    tag: "Public Opinion Survey",
    title: "Public Opinion on Public Transportation",
    progress: 36,
  },
];

export default function CreatorDashboardPage() {
  return (
    <Flex minH="100vh" bg="#F8FAFF" color="#0B1028">
      <Sidebar />

      <Box flex="1" ml={{ base: "0", lg: "280px" }}>
        <Topbar />

        <Box px={{ base: 4, md: 8 }} py={6}>
          <Flex justify="flex-end" mb={6}>
            <Button
              bg={colors.primary}
              color="white"
              h="48px"
              px={8}
              borderRadius="10px"
              fontWeight="700"
              _hover={{ bg: colors.primaryDark }}
            >
              <Icon as={FiPlus} boxSize={5} />
              Create a New Survey
            </Button>
          </Flex>

          <Grid
            templateColumns={{ base: "1fr", xl: "2fr 1fr" }}
            gap={8}
            alignItems="start"
          >
            <VStack gap={6} align="stretch">
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={5}>
                {stats.map((item) => (
                  <StatCard key={item.label} {...item} />
                ))}
              </Grid>

              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={5}>
                <SurveyStatusCard />
                <ParticipantsCard />
              </Grid>
            </VStack>

            <ActiveSurveyList />
          </Grid>
        </Box>
      </Box>
    </Flex>
  );
}

function Sidebar() {
  return (
    <Box
      display={{ base: "none", lg: "block" }}
      position="fixed"
      left="0"
      top="0"
      h="100vh"
      w="280px"
      bg={colors.navy}
      color="white"
      boxShadow="xl"
    >
      <Flex
        h="94px"
        align="center"
        px={8}
        bg="white"
        borderRight="1px solid"
        borderColor="gray.100"
      >
        <HStack gap={3}>
          <Box
            w="42px"
            h="42px"
            bg={colors.primary}
            borderRadius="8px"
            position="relative"
          >
            <Box
              position="absolute"
              left="12px"
              top="8px"
              w="18px"
              h="26px"
              borderRight="3px solid white"
              borderBottom="3px solid white"
              transform="rotate(40deg)"
            />
          </Box>

          <Heading size="lg" color="#1B1D2A" letterSpacing="-0.5px">
            True
            <Box as="span" color={colors.primary}>
              Survey
            </Box>
          </Heading>
        </HStack>
      </Flex>

      <VStack align="stretch" gap={2} px={4} pt={6}>
        {menuItems.map((item) => (
          <SidebarItem key={item.label} {...item} />
        ))}
      </VStack>

      <Box h="1px" bg="whiteAlpha.300" mx={4} my={6} />

      <VStack align="stretch" gap={2} px={4}>
        {bottomItems.map((item) => (
          <SidebarItem key={item.label} {...item} />
        ))}
      </VStack>

      <Box position="absolute" bottom="24px" left="16px" right="16px">
        <HStack
          p={4}
          border="1px solid"
          borderColor="whiteAlpha.200"
          borderRadius="14px"
          bg="whiteAlpha.100"
          justify="space-between"
        >
          <HStack gap={3}>
            <AvatarCircle />

            <Box>
              <Text fontWeight="700">John Doe</Text>
              <Text fontSize="sm" color="whiteAlpha.800">
                Super Admin
              </Text>
            </Box>
          </HStack>

          <Icon as={FiChevronDown} />
        </HStack>
      </Box>
    </Box>
  );
}

function SidebarItem({
  label,
  icon,
  active,
}: {
  label: string;
  icon: React.ElementType;
  active?: boolean;
}) {
  return (
    <HStack
      h="50px"
      px={4}
      borderRadius="10px"
      gap={4}
      bg={active ? colors.primary : "transparent"}
      color={active ? "white" : "whiteAlpha.900"}
      fontWeight="700"
      cursor="pointer"
      _hover={{
        bg: active ? colors.primary : "whiteAlpha.100",
      }}
    >
      <Icon as={icon} boxSize={5} />
      <Text>{label}</Text>
    </HStack>
  );
}

function Topbar() {
  return (
    <Flex
      h="94px"
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.100"
      align="center"
      justify="space-between"
      px={{ base: 4, md: 10 }}
      boxShadow="sm"
    >
      <Box />

      <HStack
        display={{ base: "none", md: "flex" }}
        w="460px"
        h="50px"
        px={5}
        border="1px solid"
        borderColor="gray.200"
        borderRadius="full"
        color="gray.500"
      >
        <Icon as={FiSearch} boxSize={5} />
        <Text>Search here</Text>
      </HStack>

      <HStack gap={6}>
        <Box position="relative">
          <Icon as={FiBell} boxSize={7} color={colors.navy} />
          <Flex
            position="absolute"
            top="-12px"
            right="-12px"
            w="28px"
            h="28px"
            bg={colors.yellow}
            color="#111"
            borderRadius="full"
            align="center"
            justify="center"
            fontSize="sm"
            fontWeight="800"
          >
            4
          </Flex>
        </Box>

        <Box h="44px" w="1px" bg="gray.200" />

        <HStack gap={3}>
          <AvatarCircle />

          <Box display={{ base: "none", md: "block" }}>
            <Text fontWeight="800">John Doe</Text>
            <Text fontSize="sm" color="gray.500">
              Super Admin
            </Text>
          </Box>

          <Icon as={FiChevronDown} color={colors.navy} />
        </HStack>
      </HStack>
    </Flex>
  );
}

function AvatarCircle() {
  return (
    <Flex
      w="52px"
      h="52px"
      bg="#F4F6FF"
      borderRadius="full"
      align="center"
      justify="center"
      border="1px solid"
      borderColor="gray.100"
    >
      <Icon as={FiUser} boxSize={7} color={colors.primary} />
    </Flex>
  );
}

function StatCard({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: React.ElementType;
}) {
  return (
    <Flex
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="14px"
      p={8}
      minH="140px"
      justify="space-between"
      align="center"
      boxShadow="0 8px 24px rgba(0, 9, 87, 0.04)"
    >
      <Box>
        <Text
          fontSize={{ base: "4xl", md: "5xl" }}
          lineHeight="1"
          fontWeight="800"
          color={colors.primary}
          letterSpacing="1px"
        >
          {value}
        </Text>

        <Text mt={3} fontSize="lg" fontWeight="800">
          {label}
        </Text>
      </Box>

      <Flex
        w="62px"
        h="62px"
        borderRadius="16px"
        bg="#F2F5FF"
        align="center"
        justify="center"
      >
        <Icon as={icon} boxSize={8} color={colors.primary} />
      </Flex>
    </Flex>
  );
}

function SurveyStatusCard() {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="14px"
      p={7}
      minH="310px"
      boxShadow="0 8px 24px rgba(0, 9, 87, 0.04)"
    >
      <CardHeader title="Survey Status" />

      <Flex direction="column" align="center" justify="center" mt={6}>
        <Box
          w="180px"
          h="180px"
          borderRadius="full"
          bg={`conic-gradient(${colors.primary} 0deg 216deg, #17BDE5 216deg 288deg, #EEF2FF 288deg 360deg)`}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Flex
            w="120px"
            h="120px"
            bg="white"
            borderRadius="full"
            align="center"
            justify="center"
          >
            <Text fontSize="4xl" fontWeight="900" color="#0B1028">
              60%
            </Text>
          </Flex>
        </Box>

        <Text mt={5} color="gray.500" fontWeight="700">
          100 Participants / Weekly
        </Text>
      </Flex>
    </Box>
  );
}

function ParticipantsCard() {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="14px"
      p={7}
      minH="310px"
      boxShadow="0 8px 24px rgba(0, 9, 87, 0.04)"
      overflow="hidden"
    >
      <CardHeader title="New Participants" />

      <Box position="relative" mt={8} h="210px">
        <Box
          position="absolute"
          right="8%"
          top="0"
          bg="white"
          px={6}
          py={4}
          borderRadius="10px"
          boxShadow="0 10px 24px rgba(0,0,0,0.12)"
          zIndex="2"
        >
          <Text fontWeight="800" fontSize="lg">
            567 person
          </Text>
          <Text color="gray.500">April 5th, 2020</Text>
        </Box>

        <svg
          width="100%"
          height="180"
          viewBox="0 0 400 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", bottom: 0 }}
        >
          <path
            d="M20 135 C70 125 80 95 125 100 C165 105 180 96 210 88 C250 78 265 45 315 42 C350 40 365 55 385 48"
            stroke={colors.primary}
            strokeWidth="3"
            fill="none"
          />

          {[20, 125, 210, 315].map((x, index) => (
            <g key={x}>
              <line
                x1={x}
                y1={
                  index === 3 ? 42 : index === 2 ? 88 : index === 1 ? 100 : 135
                }
                x2={x}
                y2="175"
                stroke="#D8DCE8"
                strokeDasharray="3 3"
              />
              <circle
                cx={x}
                cy={
                  index === 3 ? 42 : index === 2 ? 88 : index === 1 ? 100 : 135
                }
                r={index === 3 ? 8 : 4}
                fill={colors.primary}
              />
            </g>
          ))}
        </svg>

        <HStack
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          justify="space-between"
          color="gray.600"
          fontWeight="700"
        >
          <Text>Jan</Text>
          <Text>Feb</Text>
          <Text>Mar</Text>
          <Text>Apr</Text>
        </HStack>
      </Box>
    </Box>
  );
}

function CardHeader({ title }: { title: string }) {
  return (
    <HStack justify="space-between">
      <Heading size="md">{title}</Heading>
      <Icon as={FiMoreVertical} color="gray.500" />
    </HStack>
  );
}

function ActiveSurveyList() {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="14px"
      overflow="hidden"
      boxShadow="0 8px 24px rgba(0, 9, 87, 0.04)"
    >
      <HStack
        justify="space-between"
        px={6}
        py={5}
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        <Heading size="md">Active Survey List</Heading>

        <Flex
          w="40px"
          h="40px"
          bg={colors.primary}
          color="white"
          borderRadius="full"
          align="center"
          justify="center"
        >
          <Icon as={BsClipboardCheck} />
        </Flex>
      </HStack>

      <VStack align="stretch" gap={0} px={6}>
        {surveys.map((survey, index) => (
          <Box
            key={survey.title}
            py={5}
            borderBottom={index === surveys.length - 1 ? "none" : "1px solid"}
            borderColor="gray.200"
          >
            <Text
              display="inline-block"
              bg={colors.primary}
              color="white"
              px={4}
              py={1.5}
              borderRadius="4px"
              fontSize="sm"
              fontWeight="700"
            >
              {survey.tag}
            </Text>

            <Text mt={3} fontSize="lg" fontWeight="800" lineHeight="1.4">
              {survey.title}
            </Text>

            <HStack justify="space-between" mt={5} mb={2}>
              <Text color="gray.500" fontWeight="700">
                Progress
              </Text>
              <Text fontWeight="900">{survey.progress}%</Text>
            </HStack>

            <Box h="8px" bg="gray.200" borderRadius="full" overflow="hidden">
              <Box
                h="100%"
                w={`${survey.progress}%`}
                bg={colors.yellow}
                borderRadius="full"
              />
            </Box>
          </Box>
        ))}

        <Button
          mb={5}
          h="52px"
          bg={colors.navy}
          color="white"
          borderRadius="10px"
          fontWeight="800"
          _hover={{ bg: colors.primaryDark }}
        >
          26 Surveys More
          <Icon as={FiChevronRight} />
        </Button>
      </VStack>
    </Box>
  );
}
