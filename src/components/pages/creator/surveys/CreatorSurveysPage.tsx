"use client";

import NextLink from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Grid,
  HStack,
  Icon,
  NativeSelect,
  Text,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import {
  FiChevronLeft,
  FiEdit2,
  FiFileText,
  FiFilter,
  FiGrid,
  FiList,
  FiPlusCircle,
  FiTrash2,
  FiBarChart2,
} from "react-icons/fi";

import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";
import ParticipantSidebar from "@/components/pages/participant/dashboard/ParticipantSidebar";
import StatusBadge from "@/components/pages/creator/dashboard/StatusBadge";
import { toaster } from "@/components/ui/toaster";
import { getStoredCreatorId } from "@/lib/creatorIdentity";
import {
  deleteCreatorSurvey,
  getCreatorSurveys,
  type CreatorSurveyListItem,
  type CreatorSurveyStatus,
  type SurveyDraft,
} from "@/services/creatorSurveyService";

type StatusFilter = "ALL" | CreatorSurveyStatus;
type LimitOption = 5 | 10 | 20 | 50;

const statusOptions: Array<{ label: string; value: StatusFilter }> = [
  { label: "All surveys", value: "ALL" },
  { label: "Draft", value: "DRAFT" },
  { label: "Active", value: "ACTIVE" },
  { label: "Closed", value: "CLOSED" },
];

const limitOptions: LimitOption[] = [5, 10, 20, 50];
const creatorWizardStepKey = "creatorCurrentStep";

function formatDate(dateValue: string | null) {
  if (!dateValue) {
    return "-";
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-LK", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDisplayStatus(status: CreatorSurveyStatus) {
  if (status === "ACTIVE") {
    return "Active";
  }

  if (status === "CLOSED") {
    return "Closed";
  }

  return "Draft";
}

function getWizardStepFromCurrentStep(currentStep?: string | null) {
  if (currentStep === "SELECT_METHOD") {
    return 2;
  }

  if (currentStep === "CREATE_QUESTIONS") {
    return 3;
  }

  if (currentStep === "TARGET_AUDIENCE") {
    return 4;
  }

  if (currentStep === "SAMPLE_BUDGET") {
    return 5;
  }

  if (currentStep === "PREVIEW_SUBMIT" || currentStep === "COMPLETED") {
    return 6;
  }

  return 1;
}

function toSurveyDraft(survey: CreatorSurveyListItem, creatorId: string): SurveyDraft {
  return {
    id: survey.id,
    creatorId,
    title: survey.title,
    description: survey.description,
    category: survey.category ?? "",
    audience: survey.audience,
    estimatedCompletionDays: survey.estimatedCompletionDays ?? 0,
    status: survey.status,
    currentStep: survey.currentStep ?? "SELECT_METHOD",
    creationMethod: survey.creationMethod,
    createdAt: survey.createdAt ?? new Date().toISOString(),
    updatedAt: survey.updatedAt ?? new Date().toISOString(),
  };
}

function persistSurveySelection(
  survey: CreatorSurveyListItem,
  creatorId: string,
  wizardStep: number
) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem("creatorSurveyDraftId", survey.id);
  window.localStorage.setItem(
    "creatorSurveyDraft",
    JSON.stringify(toSurveyDraft(survey, creatorId))
  );
  window.localStorage.setItem(creatorWizardStepKey, String(wizardStep));
}

export default function CreatorSurveysPage() {
  const router = useRouter();
  const creatorId = getStoredCreatorId();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [limit, setLimit] = useState<LimitOption>(10);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [surveys, setSurveys] = useState<CreatorSurveyListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const effectiveError = creatorId
    ? error
    : "Creator id was not found. Please log in again.";

  useEffect(() => {
    if (!creatorId) {
      return;
    }

    let isMounted = true;

    void (async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getCreatorSurveys({
          creatorId,
          status: statusFilter,
          limit,
        });

        if (!isMounted) {
          return;
        }

        setSurveys(response.surveys);
        setTotal(response.total);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setSurveys([]);
        setTotal(0);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Could not load your surveys."
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
  }, [creatorId, statusFilter, limit]);

  const paginationText = useMemo(() => {
    if (total === 0) {
      return "Showing 0 surveys";
    }

    return `Showing ${total} surveys`;
  }, [total]);

  const handleEdit = (survey: CreatorSurveyListItem) => {
    if (!creatorId) {
      return;
    }

    persistSurveySelection(
      survey,
      creatorId,
      getWizardStepFromCurrentStep(survey.currentStep)
    );
    router.push("/creator/surveys/create");
  };

  const handleDelete = async (survey: CreatorSurveyListItem) => {
    if (!creatorId) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${survey.title}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(survey.id);
      const response = await deleteCreatorSurvey(creatorId, survey.id);

      setSurveys((current) => current.filter((item) => item.id !== survey.id));
      setTotal((current) => Math.max(current - 1, 0));

      toaster.create({
        type: "success",
        title: "Survey deleted",
        description: response.message,
      });
    } catch (requestError) {
      toaster.create({
        type: "error",
        title: "Could not delete survey",
        description:
          requestError instanceof Error
            ? requestError.message
            : "Please try again in a moment.",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <Box minH="100vh" bg="white" color="brand.dark" display="flex">
      <ParticipantSidebar area="creator" />

      <Box flex="1" p={{ base: "4", lg: "6" }} overflow="hidden">
        <Box maxW="1500px" mx="auto">
          <DashboardCard p="0" overflow="hidden">
            <Box p={{ base: "5", lg: "6" }}>
              <HStack justify="space-between" align="start" flexWrap="wrap" gap="4">
                <Box>
                  <Text fontSize="2xl" fontWeight="bold" color="brand.dark">
                    My Surveys
                  </Text>

                  <Text mt="1" color="brand.mutedText">
                    Review draft, active, and closed surveys, then jump back
                    into the same builder flow to preview or edit them.
                  </Text>
                </Box>

                <Button asChild color="white" h="44px" px="5">
                  <NextLink href="/creator/create-survey">
                    <FiPlusCircle />
                    Create Survey
                  </NextLink>
                </Button>
              </HStack>

              <Grid
                templateColumns={{ base: "1fr", md: "1fr 180px 160px" }}
                gap="4"
                mt="5"
              >
                <Box
                  borderWidth="1px"
                  borderColor="brand.border"
                  borderRadius="12px"
                  px="4"
                  py="3"
                  display="flex"
                  alignItems="center"
                  gap="3"
                  color="brand.mutedText"
                >
                  <FiFilter />
                  <Text fontSize="sm">
                    Filter surveys by status and control how many appear on each
                    page.
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="semibold" mb="2">
                    Status
                  </Text>

                  <NativeSelect.Root>
                    <NativeSelect.Field
                      value={statusFilter}
                      onChange={(event) => {
                        setStatusFilter(event.target.value as StatusFilter);
                      }}
                      h="44px"
                      borderColor="brand.border"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="semibold" mb="2">
                    Per Page
                  </Text>

                  <NativeSelect.Root>
                    <NativeSelect.Field
                      value={String(limit)}
                      onChange={(event) => {
                        setLimit(Number(event.target.value) as LimitOption);
                      }}
                      h="44px"
                      borderColor="brand.border"
                    >
                      {limitOptions.map((option) => (
                        <option key={option} value={option}>
                          {option} surveys
                        </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Box>
              </Grid>
            </Box>

            <Box overflowX="auto">
              <Box minW="980px">
                <Grid
                  templateColumns="2.1fr 0.8fr 1fr 0.8fr 1fr 2.4fr"
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
                  <Text>Survey</Text>
                  <Text>Status</Text>
                  <Text>Audience</Text>
                  <Text>Responses</Text>
                  <Text>Last Updated</Text>
                  <Text>Actions</Text>
                </Grid>

                {isLoading && (
                  <Box px="5" py="10">
                    <Text color="brand.mutedText">Loading surveys...</Text>
                  </Box>
                )}

                {!isLoading && effectiveError && (
                  <Box px="5" py="10">
                    <Text color="red.500" fontWeight="medium">
                      {effectiveError}
                    </Text>
                  </Box>
                )}

                {!isLoading && !effectiveError && surveys.length === 0 && (
                  <Box px="5" py="10">
                    <Text color="brand.mutedText">
                      No surveys found for the selected filter.
                    </Text>
                  </Box>
                )}

                {!isLoading &&
                  !effectiveError &&
                  surveys.map((survey) => (
                    <Grid
                      key={survey.id}
                      templateColumns="2.1fr 0.8fr 1fr 0.8fr 1fr 2.4fr"
                      px="5"
                      py="3"
                      alignItems="center"
                      borderBottomWidth="1px"
                      borderColor="brand.border"
                      _hover={{ bg: "brand.cardHover" }}
                    >
                      <HStack align="start" gap="3">
                        <Box
                          w="34px"
                          h="34px"
                          bg={
                            survey.status === "CLOSED"
                              ? "#E8F8F2"
                              : "brand.lightBlue"
                          }
                          color={
                            survey.status === "CLOSED"
                              ? "brand.success"
                              : "brand.primary"
                          }
                          borderRadius="8px"
                          display="grid"
                          placeItems="center"
                          flexShrink="0"
                        >
                          <Icon
                            as={survey.status === "CLOSED" ? FiGrid : FiFileText}
                          />
                        </Box>

                        <Box minW="0">
                          <Text fontWeight="bold" fontSize="sm" truncate>
                            {survey.title}
                          </Text>

                          <Text textStyle="smallText" lineClamp="2">
                            {survey.description || "No description provided."}
                          </Text>
                        </Box>
                      </HStack>

                      <StatusBadge status={getDisplayStatus(survey.status)} />

                      <Text fontSize="sm" color="brand.dark">
                        {survey.audience || "-"}
                      </Text>

                      <Text fontSize="sm" color="brand.dark">
                        {survey.responseCount.toLocaleString("en-LK")}
                      </Text>

                      <Text fontSize="sm" color="brand.dark">
                        {formatDate(survey.updatedAt)}
                      </Text>

                      <HStack gap="2">
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          h="34px"
                        >
                          <NextLink href={`/creator/surveys/${survey.id}/analytics`}>
                            <FiBarChart2 />
                            Analytics
                          </NextLink>
                        </Button>

                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          h="34px"
                        >
                          <NextLink href={`/creator/surveys/${survey.id}/submissions`}>
                            <FiList />
                            Submissions
                          </NextLink>
                        </Button>

                        {survey.status === "DRAFT" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            h="34px"
                            onClick={() => handleEdit(survey)}
                          >
                            <FiEdit2 />
                            Edit
                          </Button>
                        ) : null}

                        <Button
                          size="sm"
                          variant="ghost"
                          h="34px"
                          color="red.500"
                          loading={isDeleting === survey.id}
                          onClick={() => {
                            void handleDelete(survey);
                          }}
                        >
                          <FiTrash2 />
                          Delete
                        </Button>
                      </HStack>
                    </Grid>
                  ))}
              </Box>
            </Box>

            <HStack justify="space-between" p="5" flexWrap="wrap" gap="4">
              <Text textStyle="smallText">{paginationText}</Text>

              <Button variant="outline" size="sm" h="34px" disabled>
                <FiChevronLeft />
                Latest {limit}
              </Button>
            </HStack>
          </DashboardCard>
        </Box>
      </Box>
    </Box>
  );
}
