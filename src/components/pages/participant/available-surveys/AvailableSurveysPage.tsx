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
import { useState } from "react";
import {
  FiBookmark,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiFilter,
  FiGift,
  FiLock,
  FiSearch,
  FiSmartphone,
  FiStar,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { FaHamburger } from "react-icons/fa";

import ParticipantSidebar from "@/components/pages/participant/dashboard/ParticipantSidebar";

type SurveyStatus = "available" | "locked";

type SurveyCardData = {
  id: number;
  title: string;
  description: string;
  reward: string;
  time: string;
  questions: string;
  completed?: string;
  progress?: number;
  badge?: string;
  status: SurveyStatus;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
};

type FilterChipProps = {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
};

const surveys: SurveyCardData[] = [
  {
    id: 1,
    title: "Shopping Habits & Preferences",
    description: "Share your shopping preferences and help brands improve their products and services.",
    reward: "LKR 250.00",
    time: "15 min",
    questions: "120 Questions",
    completed: "1,256 / 2,000 completed",
    progress: 63,
    badge: "High Paying",
    status: "available",
    icon: <FiGift />,
    iconBg: "#F3E8FF",
    iconColor: "#7C3AED",
  },
  {
    id: 2,
    title: "Food & Beverages Feedback",
    description: "Help restaurant chains improve their menu and customer experience.",
    reward: "LKR 180.00",
    time: "10 min",
    questions: "80 Questions",
    completed: "845 / 1,500 completed",
    progress: 56,
    badge: "New",
    status: "available",
    icon: <FaHamburger />,
    iconBg: "#FEF3C7",
    iconColor: "#D97706",
  },
  {
    id: 3,
    title: "Technology Usage Survey",
    description: "Tell us about the tech products and apps you use in your daily life.",
    reward: "LKR 300.00",
    time: "20 min",
    questions: "25 Questions",
    completed: "2,340 / 3,000 completed",
    progress: 78,
    status: "available",
    icon: <FiSmartphone />,
    iconBg: "#EAF2FF",
    iconColor: "brand.primary",
  },
  {
    id: 4,
    title: "Financial Services Experience",
    description: "This survey is only available for verified users to ensure data quality.",
    reward: "Locked Survey",
    time: "25 min",
    questions: "30 Questions",
    status: "locked",
    icon: <FiLock />,
    iconBg: "#F3E8FF",
    iconColor: "#7C3AED",
  },
];

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

function FilterChip({ label, icon, active }: FilterChipProps) {
  return (
    <Button
      h="42px"
      px="6"
      borderRadius="999px"
      variant={active ? "solid" : "outline"}
      color={active ? "white" : "brand.dark"}
      fontWeight={active ? "bold" : "medium"}
      bg={active ? "brand.primary" : "white"}
      borderColor={active ? "brand.primary" : "brand.border"}
      _hover={{
        bg: active ? "brand.primary" : "brand.lightBlue",
        color: active ? "white" : "brand.primary",
      }}
    >
      {icon}
      {label}
    </Button>
  );
}

function SurveyMetaTag({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <HStack
      gap="1"
      px="3"
      py="1"
      borderRadius="8px"
      borderWidth="1px"
      borderColor="brand.border"
      color="brand.dark"
      fontSize="sm"
      fontWeight="medium"
      w="fit-content"
    >
      {icon}
      <Text>{label}</Text>
    </HStack>
  );
}

function AvailableSurveyCard({ survey }: { survey: SurveyCardData }) {
  if (survey.status === "locked") {
    return <LockedSurveyCard survey={survey} />;
  }

  return (
    <DashboardCard p={{ base: "5", lg: "7" }}>
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "90px minmax(260px, 1fr) 230px 260px 40px",
        }}
        gap="6"
        alignItems="center"
      >
        <Box
          w="86px"
          h="86px"
          borderRadius="14px"
          bg={survey.iconBg}
          color={survey.iconColor}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="36px"
        >
          {survey.icon}
        </Box>

        <Box>
          {survey.badge && (
            <Box
              mb="2"
              px="3"
              py="1"
              borderRadius="999px"
              bg={survey.badge === "High Paying" ? "#DCFCE7" : "#EEF2FF"}
              color={survey.badge === "High Paying" ? "#166534" : "brand.primary"}
              fontSize="xs"
              fontWeight="bold"
              w="fit-content"
            >
              {survey.badge}
            </Box>
          )}

          <Text
            fontSize={{ base: "lg", lg: "2xl" }}
            fontWeight="extrabold"
            color="brand.dark"
            lineHeight="1.2"
          >
            {survey.title}
          </Text>

          <Text color="brand.mutedText" mt="2" maxW="520px">
            {survey.description}
          </Text>

          <HStack gap="3" mt="4" flexWrap="wrap">
            <SurveyMetaTag icon={<FiClock />} label={survey.time} />
            <SurveyMetaTag label={survey.questions} icon={<FiUsers />} />
          </HStack>
        </Box>

        <Box
          bg="#ECFDF3"
          borderRadius="12px"
          py="5"
          textAlign="center"
        >
          <Text fontSize="sm" color="green.700" fontWeight="bold">
            Reward
          </Text>

          <Text
            fontSize={{ base: "xl", lg: "2xl" }}
            fontWeight="extrabold"
            color="brand.dark"
            mt="1"
          >
            {survey.reward}
          </Text>
        </Box>

        <Box>
          <Button w="100%" h="48px" color="white" fontWeight="bold">
            Start Survey
            <FiChevronRight />
          </Button>

          <HStack mt="4" gap="2" color="brand.mutedText">
            <FiUsers />
            <Text fontSize="sm">{survey.completed}</Text>
          </HStack>

          <HStack gap="3" mt="2">
            <Box flex="1" h="6px" bg="#E5E7EB" borderRadius="999px">
              <Box
                h="full"
                w={`${survey.progress}%`}
                bg="brand.primary"
                borderRadius="999px"
              />
            </Box>

            <Text fontSize="sm" color="brand.dark">
              {survey.progress}%
            </Text>
          </HStack>
        </Box>

        <IconButton
          aria-label="Save survey"
          variant="ghost"
          color="brand.mutedText"
          fontSize="22px"
        >
          <FiBookmark />
        </IconButton>
      </Grid>
    </DashboardCard>
  );
}

function LockedSurveyCard({ survey }: { survey: SurveyCardData }) {
  return (
    <DashboardCard
      p={{ base: "5", lg: "7" }}
      borderStyle="dashed"
      borderColor="#CBD5E1"
      bg="#FBFCFF"
    >
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "90px minmax(260px, 1fr) 250px 230px 40px",
        }}
        gap="6"
        alignItems="center"
      >
        <Box
          w="86px"
          h="86px"
          borderRadius="14px"
          bg={survey.iconBg}
          color={survey.iconColor}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="34px"
          opacity="0.75"
        >
          {survey.icon}
        </Box>

        <Box>
          <Text
            fontSize={{ base: "lg", lg: "2xl" }}
            fontWeight="extrabold"
            color="brand.dark"
            opacity="0.75"
          >
            {survey.title}
          </Text>

          <Text color="brand.mutedText" mt="2" maxW="500px">
            {survey.description}
          </Text>

          <HStack gap="3" mt="4" flexWrap="wrap">
            <SurveyMetaTag icon={<FiClock />} label={survey.time} />
            <SurveyMetaTag icon={<FiUsers />} label={survey.questions} />
          </HStack>
        </Box>

        <Box
          bg="#F3E8FF"
          borderRadius="12px"
          py="5"
          textAlign="center"
          color="#7C3AED"
        >
          <Box fontSize="28px" display="flex" justifyContent="center">
            <FiLock />
          </Box>

          <Text fontWeight="bold" mt="2">
            Locked Survey
          </Text>

          <Text fontSize="sm" color="brand.mutedText" mt="1">
            Verify your identity to unlock this survey.
          </Text>
        </Box>

        <Button h="48px" variant="outline" color="brand.primary">
          Verify Now
        </Button>

        <IconButton
          aria-label="Save survey"
          variant="ghost"
          color="brand.mutedText"
          fontSize="22px"
        >
          <FiBookmark />
        </IconButton>
      </Grid>
    </DashboardCard>
  );
}

function Pagination() {
  return (
    <HStack justify="flex-end" mt="8" gap="3">
      <IconButton aria-label="Previous page" variant="outline">
        <FiChevronLeft />
      </IconButton>

      {[1, 2, 3].map((page) => (
        <Button
          key={page}
          variant={page === 1 ? "solid" : "outline"}
          color={page === 1 ? "white" : "brand.dark"}
          w="44px"
        >
          {page}
        </Button>
      ))}

      <Text fontWeight="bold" color="brand.dark">
        ...
      </Text>

      <Button variant="outline" w="44px">
        6
      </Button>

      <IconButton aria-label="Next page" variant="outline">
        <FiChevronRight />
      </IconButton>
    </HStack>
  );
}

export default function AvailableSurveysPage() {
  const [search, setSearch] = useState("");

  return (
    <Flex minH="100vh" bg="white" color="brand.dark">
      <ParticipantSidebar activeItem="Available Surveys" />

      <Box flex="1" px={{ base: "4", lg: "8" }} py={{ base: "5", lg: "7" }}>
        <HStack justify="space-between" align="start" gap="5" flexWrap="wrap">
          <Box>
            <Text
              fontSize={{ base: "3xl", lg: "4xl" }}
              fontWeight="extrabold"
              color="brand.dark"
              lineHeight="1.1"
            >
              Available Surveys
            </Text>

            <Text color="brand.mutedText" mt="2" fontSize="lg">
              Complete surveys and earn rewards
            </Text>
          </Box>

          <HStack gap="4" flex="1" justify="flex-end" minW={{ base: "100%", xl: "600px" }}>
            <InputGroup
              maxW="460px"
              startElement={
                <Box color="brand.mutedText">
                  <FiSearch />
                </Box>
              }
            >
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search surveys..."
                h="52px"
                borderColor="brand.border"
                borderRadius="10px"
                bg="white"
                _focus={{
                  borderColor: "brand.primary",
                  boxShadow: "0 0 0 1px #0015D6",
                }}
              />
            </InputGroup>

            <Button h="52px" px="7" variant="outline">
              <FiFilter />
              Filters
            </Button>
          </HStack>
        </HStack>

        <HStack justify="space-between" mt="8" mb="6" flexWrap="wrap" gap="4">
          <HStack gap="4" flexWrap="wrap">
            <FilterChip label="All Surveys" active />
            <FilterChip label="High Paying" icon={<FiStar color="#EAB308" />} />
            <FilterChip label="Short Surveys" icon={<FiClock color="#2563EB" />} />
            <FilterChip label="Trending" icon={<FiTrendingUp color="#F97316" />} />
            <FilterChip label="New" />
          </HStack>

          <HStack gap="3">
            <Text fontSize="sm" color="brand.mutedText">
              Sort by:
            </Text>

            <Button h="42px" variant="outline" fontWeight="medium">
              Most Relevant
              <FiChevronDown />
            </Button>
          </HStack>
        </HStack>

        <VStack align="stretch" gap="5">
          {surveys.map((survey) => (
            <AvailableSurveyCard key={survey.id} survey={survey} />
          ))}
        </VStack>

        <HStack justify="space-between" mt="8" flexWrap="wrap" gap="4">
          <Text color="brand.mutedText">
            Showing 1 to 4 of 24 surveys
          </Text>

          <Pagination />
        </HStack>
      </Box>
    </Flex>
  );
}