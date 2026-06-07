"use client";

import { useRouter } from "next/navigation";
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
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  FiBookmark,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiGift,
  FiLock,
  FiSearch,
  FiSmartphone,
  FiStar,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

import AuthenticatedShell from "@/components/layout/AuthenticatedShell";
import {
  getAvailableSurveys,
  type AvailableSurvey,
  type AvailableSurveyStatus,
  type AvailableSurveysResponse,
  type AvailableSurveySortBy,
  type AvailableSurveyTab,
} from "@/services/participantSurveyService";

type FilterChipProps = {
  label: string;
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
};

const TAB_OPTIONS: {
  label: string;
  value: AvailableSurveyTab;
  icon?: ReactNode;
}[] = [
  { label: "All Surveys", value: "ALL" },
  { label: "High Paying", value: "HIGH_PAYING", icon: <FiStar color="#EAB308" /> },
  { label: "Short Surveys", value: "SHORT_SURVEYS", icon: <FiClock color="#2563EB" /> },
  { label: "Trending", value: "TRENDING", icon: <FiTrendingUp color="#F97316" /> },
  { label: "New", value: "NEW" },
];

const SORT_OPTIONS: { label: string; value: AvailableSurveySortBy }[] = [
  { label: "Most Relevant", value: "MOST_RELEVANT" },
  { label: "Highest Reward", value: "REWARD_HIGH" },
  { label: "Lowest Reward", value: "REWARD_LOW" },
  { label: "Newest", value: "NEWEST" },
  { label: "Shortest", value: "SHORTEST" },
];

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50];

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

function FilterChip({ label, icon, active, onClick }: FilterChipProps) {
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
      onClick={onClick}
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
  icon: ReactNode;
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

function formatMoney(amount: number, currency: string) {
  return `${currency} ${amount.toLocaleString()}`;
}

function getBadge(tags: string[]) {
  if (tags.includes("HIGH_PAYING")) {
    return {
      label: "High Paying",
      bg: "#DCFCE7",
      color: "#166534",
    };
  }

  if (tags.includes("NEW")) {
    return {
      label: "New",
      bg: "#EEF2FF",
      color: "#0015D6",
    };
  }

  if (tags.includes("TRENDING")) {
    return {
      label: "Trending",
      bg: "#FFF7ED",
      color: "#C2410C",
    };
  }

  return null;
}

function getSurveyStatus(survey: AvailableSurvey): AvailableSurveyStatus {
  if (survey.status) {
    return survey.status;
  }

  if (survey.isLocked) {
    return "LOCKED";
  }

  return "AVAILABLE";
}

function getSurveyActionCopy(status: AvailableSurveyStatus) {
  if (status === "LOCKED") {
    return {
      label: "Verify Now",
      helper: "Unlock this survey by completing verification.",
    };
  }

  if (status === "IN_PROGRESS") {
    return {
      label: "Submit Response",
      helper: "Continue where you left off and complete your response.",
    };
  }

  if (status === "COMPLETED") {
    return {
      label: "Submitted",
      helper: "You already completed this survey.",
    };
  }

  return {
    label: "Participate",
    helper: "Start this survey and submit your response.",
  };
}

function getSurveyVisual(index: number) {
  const visuals = [
    {
      icon: <FiGift />,
      iconBg: "#F3E8FF",
      iconColor: "#7C3AED",
    },
    {
      icon: <FiBookmark />,
      iconBg: "#FEF3C7",
      iconColor: "#D97706",
    },
    {
      icon: <FiSmartphone />,
      iconBg: "#EAF2FF",
      iconColor: "#0015D6",
    },
  ];

  return visuals[index % visuals.length];
}

function SurveyCard({
  survey,
  index,
  onAction,
}: {
  survey: AvailableSurvey;
  index: number;
  onAction: (survey: AvailableSurvey) => void;
}) {
  const badge = getBadge(survey.tags);
  const visual = getSurveyVisual(index);
  const status = getSurveyStatus(survey);
  const actionCopy = getSurveyActionCopy(status);

  if (status === "LOCKED") {
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
            bg={visual.iconBg}
            color={visual.iconColor}
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="34px"
            opacity="0.75"
          >
            <FiLock />
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
              <SurveyMetaTag icon={<FiClock />} label={survey.estimatedTime} />
              <SurveyMetaTag
                icon={<FiUsers />}
                label={`${survey.questionCount} Questions`}
              />
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

            <Text fontSize="sm" color="brand.mutedText" mt="1" px="4">
              {survey.lockedReason || "Verify your identity to unlock this survey."}
            </Text>
          </Box>

          <Button
            h="48px"
            variant="outline"
            color="brand.primary"
            onClick={() => onAction(survey)}
          >
            {actionCopy.label}
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
          bg={visual.iconBg}
          color={visual.iconColor}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="36px"
        >
          {visual.icon}
        </Box>

        <Box>
          {badge && (
            <Box
              mb="2"
              px="3"
              py="1"
              borderRadius="999px"
              bg={badge.bg}
              color={badge.color}
              fontSize="xs"
              fontWeight="bold"
              w="fit-content"
            >
              {badge.label}
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
            <SurveyMetaTag icon={<FiClock />} label={survey.estimatedTime} />
            <SurveyMetaTag
              icon={<FiUsers />}
              label={`${survey.questionCount} Questions`}
            />
          </HStack>
        </Box>

        <Box bg="#ECFDF3" borderRadius="12px" py="5" textAlign="center">
          <Text fontSize="sm" color="green.700" fontWeight="bold">
            Reward
          </Text>

          <Text
            fontSize={{ base: "xl", lg: "2xl" }}
            fontWeight="extrabold"
            color="brand.dark"
            mt="1"
          >
            {formatMoney(survey.rewardAmount, survey.currency)}
          </Text>
        </Box>

        <Box>
          <Button
            w="100%"
            h="48px"
            color="white"
            fontWeight="bold"
            onClick={() => onAction(survey)}
            disabled={status === "COMPLETED"}
          >
            {actionCopy.label}
            <FiChevronRight />
          </Button>

          <Text fontSize="sm" color="brand.mutedText" mt="3">
            {actionCopy.helper}
          </Text>

          <HStack mt="4" gap="2" color="brand.mutedText">
            <FiUsers />
            <Text fontSize="sm">
              {survey.completedResponses} / {survey.requiredResponses} completed
            </Text>
          </HStack>

          <HStack gap="3" mt="2">
            <Box flex="1" h="6px" bg="#E5E7EB" borderRadius="999px">
              <Box
                h="full"
                w={`${survey.completionPercentage}%`}
                bg="brand.primary"
                borderRadius="999px"
              />
            </Box>

            <Text fontSize="sm" color="brand.dark">
              {survey.completionPercentage}%
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
    <HStack justify="flex-end" mt="8" gap="3">
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
          w="44px"
          onClick={() => onPageChange(currentPage)}
        >
          {currentPage}
        </Button>
      ))}

      {endPage < totalPages && (
        <>
          <Text fontWeight="bold" color="brand.dark">
            ...
          </Text>

          <Button
            variant="outline"
            w="44px"
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

function SortSelect({
  value,
  onChange,
}: {
  value: AvailableSurveySortBy;
  onChange: (nextValue: AvailableSurveySortBy) => void;
}) {
  return (
    <NativeSelect.Root minW="180px">
      <NativeSelect.Field
        value={value}
        onChange={(event) =>
          onChange(event.target.value as AvailableSurveySortBy)
        }
        h="42px"
        borderColor="brand.border"
        borderRadius="10px"
        fontWeight="medium"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
}

function PageSizeSelect({
  value,
  onChange,
}: {
  value: number;
  onChange: (nextValue: number) => void;
}) {
  return (
    <NativeSelect.Root minW="110px">
      <NativeSelect.Field
        value={String(value)}
        onChange={(event) => onChange(Number(event.target.value))}
        h="52px"
        borderColor="brand.border"
        borderRadius="10px"
        bg="white"
      >
        {PAGE_SIZE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option} / page
          </option>
        ))}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
}

export default function AvailableSurveysPage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<AvailableSurveyTab>("ALL");
  const [sortBy, setSortBy] = useState<AvailableSurveySortBy>("MOST_RELEVANT");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [data, setData] = useState<AvailableSurveysResponse | null>(null);
  const [lastCompletedQueryKey, setLastCompletedQueryKey] = useState("");
  const [error, setError] = useState("");

  const queryKey = JSON.stringify({
    search,
    tab,
    sortBy,
    page,
    limit,
  });
  const isLoading = queryKey !== lastCompletedQueryKey;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    let isMounted = true;

    getAvailableSurveys({
      search,
      tab,
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
              : "Failed to load available surveys"
          );
          setLastCompletedQueryKey(queryKey);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [limit, page, queryKey, search, sortBy, tab]);

  const handleSurveyAction = (survey: AvailableSurvey) => {
    const status = getSurveyStatus(survey);

    if (status === "LOCKED") {
      router.push("/participant/settings");
      return;
    }

    if (status === "COMPLETED") {
      return;
    }

    router.push(`/participant/available-surveys/${survey.id}`);
  };

  if (isLoading && !data) {
    return (
      <AuthenticatedShell activeItem="Available Surveys">
        <Flex flex="1" align="center" justify="center" gap="3">
          <Spinner color="brand.primary" />
          <Text color="brand.mutedText">Loading available surveys...</Text>
        </Flex>
      </AuthenticatedShell>
    );
  }

  if ((!data && error) || !data) {
    return (
      <AuthenticatedShell activeItem="Available Surveys">
        <Flex flex="1" align="center" justify="center" p="6">
          <DashboardCard p="6" maxW="560px">
            <Text fontWeight="bold" color="brand.dark">
              We could not load available surveys.
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
    <AuthenticatedShell activeItem="Available Surveys" contentProps={{ px: { base: "4", md: "6", lg: "8" }, py: { base: "4", md: "5", lg: "7" } }}>
      <Box minW={0}>
        <Box>
          <Text
            fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
            fontWeight="bold"
            color="brand.dark"
            lineHeight="1.1"
            wordBreak="break-word"
          >
            Available Surveys
          </Text>

          <Text color="brand.mutedText" mt="2" fontSize={{ base: "sm", md: "lg" }}>
            {data.participant.username}, here are the surveys that currently
            match your profile.
          </Text>
        </Box>

        <Flex
          mt="8"
          mb="6"
          gap="4"
          direction={{ base: "column", md: "row" }}
          align={{ base: "stretch", md: "start" }}
          w="100%"
        >
          <InputGroup
            w={{ base: "100%", md: "500px" }}
            startElement={
              <Box pl="10px" color="brand.mutedText">
                <FiSearch />
              </Box>
            }
          >
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search surveys..."
              h="52px"
              bg="white"
              borderColor="brand.border"
              borderRadius="10px"
              _hover={{ borderColor: "gray.border" }}
              _focus={{
                borderColor: "brand.primary",
                boxShadow: "0 0 0 1px #0015D6",
              }}
            />
          </InputGroup>

          <Box w={{ base: "100%", md: "160px" }} flexShrink={0}>
            <PageSizeSelect
              value={limit}
              onChange={(nextValue) => {
                setLimit(nextValue);
                setPage(1);
              }}
            />
          </Box>
        </Flex>

        <DashboardCard p="5">
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            gap="4"
          >
            <Box>
              <Text fontSize="sm" color="brand.mutedText">
                Available
              </Text>
              <Text fontSize="2xl" fontWeight="extrabold" color="brand.dark">
                {data.summary.availableCount}
              </Text>
            </Box>

            <Box>
              <Text fontSize="sm" color="brand.mutedText">
                Locked
              </Text>
              <Text fontSize="2xl" fontWeight="extrabold" color="brand.dark">
                {data.summary.lockedCount}
              </Text>
            </Box>

            <Box>
              <Text fontSize="sm" color="brand.mutedText">
                Total Matching
              </Text>
              <Text fontSize="2xl" fontWeight="extrabold" color="brand.dark">
                {data.summary.totalCount}
              </Text>
            </Box>
          </Grid>
        </DashboardCard>

        <HStack justify="space-between" mt="8" mb="6" flexWrap="wrap" gap="4">
          <HStack gap="4" flexWrap="wrap">
            {TAB_OPTIONS.map((option) => (
              <FilterChip
                key={option.value}
                label={option.label}
                icon={option.icon}
                active={tab === option.value}
                onClick={() => {
                  setTab(option.value);
                  setPage(1);
                }}
              />
            ))}
          </HStack>

          <HStack gap="3" flexWrap="wrap">
            <Text fontSize="sm" color="brand.mutedText">
              Sort by:
            </Text>

            <SortSelect
              value={sortBy}
              onChange={(nextValue) => {
                setSortBy(nextValue);
                setPage(1);
              }}
            />
          </HStack>
        </HStack>

        {isLoading && (
          <HStack mb="4" color="brand.mutedText">
            <Spinner size="sm" color="brand.primary" />
            <Text fontSize="sm">Refreshing surveys...</Text>
          </HStack>
        )}

        <VStack align="stretch" gap="5">
          {data.surveys.length === 0 && (
            <DashboardCard p="6">
              <Text fontWeight="bold" color="brand.dark">
                No surveys found for this filter.
              </Text>
              <Text color="brand.mutedText" mt="2">
                Try a different tab, sort option, or search phrase.
              </Text>
            </DashboardCard>
          )}

          {data.surveys.map((survey, index) => (
            <SurveyCard
              key={survey.id}
              survey={survey}
              index={index}
              onAction={handleSurveyAction}
            />
          ))}
        </VStack>

        <HStack justify="space-between" mt="8" flexWrap="wrap" gap="4">
          <Text color="brand.mutedText">
            Showing {data.pagination.showingFrom} to {data.pagination.showingTo}{" "}
            of {data.pagination.total} surveys
          </Text>

          <Pagination
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onPageChange={setPage}
          />
        </HStack>
      </Box>
    </AuthenticatedShell>
  );
}
