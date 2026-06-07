"use client";

import NextLink from "next/link";
import {
  Box,
  Button,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  Grid,
  HStack,
  NativeSelect,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiFileText,
  FiInfo,
  FiX,
} from "react-icons/fi";

import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";
import ParticipantSidebar from "@/components/pages/participant/dashboard/ParticipantSidebar";
import { toaster } from "@/components/ui/toaster";
import {
  acceptCreatorSubmission,
  getCreatorSingleSubmission,
  getCreatorSurveySubmissions,
  rejectCreatorSubmission,
  RewardStatus,
  type CreatorSubmissionAnswer,
  type CreatorSurveySubmissionRow,
  type GetCreatorSingleSubmissionResponse,
  type GetCreatorSurveySubmissionsResponse,
} from "@/services/creatorSurveyService";

type CreatorSurveySubmissionsPageProps = {
  surveyId: string;
};

type LimitOption = 5 | 10 | 20 | 50;

const limitOptions: LimitOption[] = [5, 10, 20, 50];

function formatDateTime(dateValue: string | null) {
  if (!dateValue) {
    return "-";
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleString("en-LK", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getSubmissionStatusLabel(row: CreatorSurveySubmissionRow) {
  return row.status
    .toLowerCase()
    .split("_")
    .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getSubmissionStatusStyles(row: CreatorSurveySubmissionRow) {
  if (row.status === RewardStatus.RELEASED) {
    return {
      bg: "#E8F8F2",
      color: "brand.success",
      borderColor: "#BFEADB",
    };
  }

  if (row.status === RewardStatus.PENDING) {
    return {
      bg: "#dfd51c",
      color: "brand.warning",
      borderColor: "#dfd51c",
    };
  }

  if (row.status === RewardStatus.WITHDRAWN) {
    return {
      bg: "#FEE2E2",
      color: "#B91C1C",
      borderColor: "#FECACA",
    };
  }

  return {
    bg: "#EEF2FF",
    color: "brand.primary",
    borderColor: "#C7D2FE",
  };
}

function getAnswerDisplayValue(answer: CreatorSubmissionAnswer) {
  if (answer.questionType === "MULTIPLE_CHOICE") {
    const selectedIds = answer.answer.selectedOptionIds ?? [];
    const selectedOptions = answer.options
      .filter((option) => selectedIds.includes(option.id))
      .map((option) => option.optionText);

    return selectedOptions.length > 0 ? selectedOptions.join(", ") : "-";
  }

  if (answer.questionType === "SINGLE_SELECT") {
    const selectedOption = answer.options.find(
      (option) => option.id === answer.answer.selectedOptionId,
    );

    return selectedOption?.optionText ?? "-";
  }

  if (
    answer.questionType === "SHORT_ANSWER" ||
    answer.questionType === "LONG_ANSWER"
  ) {
    return answer.answer.answerText?.trim() || "-";
  }

  if (answer.questionType === "RATING_SCALE") {
    return answer.answer.ratingValue !== null &&
      answer.answer.ratingValue !== undefined
      ? String(answer.answer.ratingValue)
      : "-";
  }

  if (answer.questionType === "YES_NO") {
    if (answer.answer.booleanValue === true) {
      return "Yes";
    }

    if (answer.answer.booleanValue === false) {
      return "No";
    }
  }

  return "-";
}

export default function CreatorSurveySubmissionsPage({
  surveyId,
}: CreatorSurveySubmissionsPageProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<LimitOption>(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GetCreatorSurveySubmissionsResponse | null>(
    null,
  );
  const [selectedSubmission, setSelectedSubmission] =
    useState<GetCreatorSingleSubmissionResponse | null>(null);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [isLoadingSubmission, setIsLoadingSubmission] = useState(false);
  const [submissionActionState, setSubmissionActionState] = useState<{
    submissionId: string;
    action: "accept" | "reject";
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getCreatorSurveySubmissions(
          surveyId,
          page,
          limit,
        );

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
            : "Could not load survey submissions.",
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
  }, [surveyId, page, limit]);

  const paginationText = useMemo(() => {
    if (!data) {
      return "Loading submissions...";
    }

    if (data.pagination.total === 0) {
      return "Showing 0 submissions";
    }

    return `Showing ${data.pagination.showingFrom} to ${data.pagination.showingTo} of ${data.pagination.total} submissions`;
  }, [data]);

  const updateSubmissionRowStatus = (
    submissionId: string,
    nextStatus: CreatorSurveySubmissionRow["status"],
  ) => {
    setData((current) =>
      current
        ? {
            ...current,
            submissions: current.submissions.map((row) =>
              row.submissionId === submissionId
                ? {
                    ...row,
                    status: nextStatus,
                  }
                : row,
            ),
          }
        : current,
    );
  };

  const handlePendingAction = async (
    action: "accept" | "reject",
    row: CreatorSurveySubmissionRow,
  ) => {
    try {
      setSubmissionActionState({
        submissionId: row.submissionId,
        action,
      });

      const response =
        action === "accept"
          ? await acceptCreatorSubmission(surveyId, row.submissionId)
          : await rejectCreatorSubmission(surveyId, row.submissionId);

      updateSubmissionRowStatus(
        row.submissionId,
        action === "accept" ? RewardStatus.RELEASED : RewardStatus.REJECTED,
      );

      setSelectedSubmission((current) =>
        current && current.submission.id === row.submissionId
          ? {
              ...current,
              submission: {
                ...current.submission,
                status: response.submission.rewardStatus,
                isAccepted: action === "accept" ? true : false,
                submittedAt:
                  response.submission.completedAt ?? current.submission.submittedAt,
              },
            }
          : current,
      );

      toaster.create({
        type: "success",
        title:
          action === "accept" ? "Submission accepted" : "Submission rejected",
        description: response.message,
      });
    } catch (requestError) {
      toaster.create({
        type: "error",
        title:
          action === "accept"
            ? "Could not accept submission"
            : "Could not reject submission",
        description:
          requestError instanceof Error
            ? requestError.message
            : "Please try again in a moment.",
      });
    } finally {
      setSubmissionActionState(null);
    }
  };

  const handleViewSubmission = async (submissionId: string) => {
    try {
      setIsLoadingSubmission(true);
      setIsSubmissionModalOpen(true);

      const response = await getCreatorSingleSubmission(surveyId, submissionId);
      setSelectedSubmission(response);
    } catch (requestError) {
      setIsSubmissionModalOpen(false);
      toaster.create({
        type: "error",
        title: "Could not load submission",
        description:
          requestError instanceof Error
            ? requestError.message
            : "Please try again in a moment.",
      });
    } finally {
      setIsLoadingSubmission(false);
    }
  };

  return (
    <Box minH="100vh" bg="white" color="brand.dark" display="flex">
      <ParticipantSidebar />

      <Box flex="1" p={{ base: "4", lg: "6" }} overflow="hidden">
        <Box maxW="1500px" mx="auto">
          <DashboardCard p="0" overflow="hidden">
            <Box p={{ base: "5", lg: "6" }}>
              <HStack
                justify="space-between"
                align="start"
                flexWrap="wrap"
                gap="4"
              >
                <Box>
                  <HStack gap="3" mb="3">
                    <Button asChild variant="outline" size="sm" h="34px">
                      <NextLink href="/creator/surveys">
                        <FiArrowLeft />
                        Back to Surveys
                      </NextLink>
                    </Button>
                  </HStack>

                  <Text fontSize="2xl" fontWeight="bold" color="brand.dark">
                    Survey Submissions
                  </Text>

                  <Text mt="1" color="brand.mutedText">
                    {data?.survey.title ||
                      "Review responses submitted for this survey."}
                  </Text>
                </Box>

                <Box minW={{ base: "100%", md: "180px" }}>
                  <Text fontSize="sm" fontWeight="semibold" mb="2">
                    Per Page
                  </Text>

                  <NativeSelect.Root>
                    <NativeSelect.Field
                      value={String(limit)}
                      onChange={(event) => {
                        setPage(1);
                        setLimit(Number(event.target.value) as LimitOption);
                      }}
                      h="44px"
                      borderColor="brand.border"
                    >
                      {limitOptions.map((option) => (
                        <option key={option} value={option}>
                          {option} submissions
                        </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Box>
              </HStack>

              <Box
                mt="5"
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
                <FiInfo />
                <Text fontSize="sm">
                  Review submission timing and status here. Acceptance,
                  rejection, and full submission detail actions can be layered
                  on top of this list next.
                </Text>
              </Box>
            </Box>

            <Box overflowX="auto">
              <Box minW="980px">
                <Grid
                  templateColumns="0.8fr 1.2fr 1fr 1.8fr"
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
                  <Text>Submission No.</Text>
                  <Text>Submitted At</Text>
                  <Text>Current Status</Text>
                  <Text>Actions</Text>
                </Grid>

                {isLoading && (
                  <Box px="5" py="10">
                    <Text color="brand.mutedText">Loading submissions...</Text>
                  </Box>
                )}

                {!isLoading && error && (
                  <Box px="5" py="10">
                    <Text color="red.500" fontWeight="medium">
                      {error}
                    </Text>
                  </Box>
                )}

                {!isLoading &&
                  !error &&
                  data &&
                  data.submissions.length === 0 && (
                    <Box px="5" py="10">
                      <Text color="brand.mutedText">
                        No submissions found for this survey yet.
                      </Text>
                    </Box>
                  )}

                {!isLoading &&
                  !error &&
                  data?.submissions.map((row) => {
                    const statusStyles = getSubmissionStatusStyles(row);
                    const isPendingReview = row.status === RewardStatus.PENDING;
                    const isAccepting =
                      submissionActionState?.submissionId === row.submissionId &&
                      submissionActionState.action === "accept";
                    const isRejecting =
                      submissionActionState?.submissionId === row.submissionId &&
                      submissionActionState.action === "reject";

                    return (
                      <Grid
                        key={row.submissionId}
                        templateColumns="0.8fr 1.2fr 1fr 1.8fr"
                        px="5"
                        py="3"
                        alignItems="center"
                        borderBottomWidth="1px"
                        borderColor="brand.border"
                        _hover={{ bg: "brand.cardHover" }}
                      >
                        <HStack gap="3">
                          <Box
                            w="34px"
                            h="34px"
                            bg="brand.lightBlue"
                            color="brand.primary"
                            borderRadius="8px"
                            display="grid"
                            placeItems="center"
                            flexShrink="0"
                          >
                            <FiFileText />
                          </Box>

                          <Text fontWeight="bold" fontSize="sm">
                            #{row.submissionNumber}
                          </Text>
                        </HStack>

                        <Text fontSize="sm" color="brand.dark">
                          {formatDateTime(row.submittedAt)}
                        </Text>

                        <Box
                          w="fit-content"
                          px="3"
                          py="1"
                          borderRadius="999px"
                          borderWidth="1px"
                          fontSize="xs"
                          fontWeight="bold"
                          {...statusStyles}
                        >
                          {getSubmissionStatusLabel(row)}
                        </Box>

                        <HStack gap="2" flexWrap="wrap">
                          {isPendingReview ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                h="34px"
                                loading={isAccepting}
                                disabled={Boolean(submissionActionState)}
                                onClick={() => {
                                  void handlePendingAction("accept", row);
                                }}
                              >
                                <FiCheck />
                                Accept
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                h="34px"
                                colorPalette="red"
                                loading={isRejecting}
                                disabled={Boolean(submissionActionState)}
                                onClick={() => {
                                  void handlePendingAction("reject", row);
                                }}
                              >
                                <FiX />
                                Reject
                              </Button>
                            </>
                          ) : null}

                          <Button
                            size="sm"
                            variant="ghost"
                            h="34px"
                            disabled={Boolean(submissionActionState)}
                            onClick={() => {
                              void handleViewSubmission(row.submissionId);
                            }}
                          >
                            <FiEye />
                            View Submission
                          </Button>
                        </HStack>
                      </Grid>
                    );
                  })}
              </Box>
            </Box>

            <HStack justify="space-between" p="5" flexWrap="wrap" gap="4">
              <Text textStyle="smallText">{paginationText}</Text>

              <HStack gap="2">
                <Button
                  variant="outline"
                  size="sm"
                  h="34px"
                  disabled={isLoading || !data || data.pagination.page <= 1}
                  onClick={() => setPage((current) => Math.max(current - 1, 1))}
                >
                  <FiChevronLeft />
                  Previous
                </Button>

                <Text fontSize="sm" color="brand.mutedText">
                  Page {data?.pagination.page ?? page} of{" "}
                  {data?.pagination.totalPages ?? 1}
                </Text>

                <Button
                  variant="outline"
                  size="sm"
                  h="34px"
                  disabled={
                    isLoading ||
                    !data ||
                    data.pagination.page >= data.pagination.totalPages
                  }
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                  <FiChevronRight />
                </Button>
              </HStack>
            </HStack>
          </DashboardCard>
        </Box>
      </Box>

      <DialogRoot
        open={isSubmissionModalOpen}
        onOpenChange={(details) => {
          setIsSubmissionModalOpen(details.open);

          if (!details.open) {
            setSelectedSubmission(null);
          }
        }}
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent maxW="820px" bg="white" borderRadius="20px">
            <DialogHeader pb="0">
              <DialogTitle>
                {selectedSubmission?.survey.title || "Submission Details"}
              </DialogTitle>
            </DialogHeader>
            <DialogCloseTrigger />
            <DialogBody pb="6">
              {isLoadingSubmission ? (
                <Box py="8">
                  <Text color="brand.mutedText">Loading submission...</Text>
                </Box>
              ) : selectedSubmission ? (
                <VStack align="stretch" gap="5">
                  <Grid
                    templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                    gap="4"
                  >
                    <DashboardCard p="4">
                      <Text fontSize="xs" fontWeight="bold" color="brand.mutedText">
                        Participant
                      </Text>
                      <Text mt="2" fontWeight="bold" color="brand.dark">
                        {selectedSubmission.participant.username || "-"}
                      </Text>
                      <Text fontSize="sm" color="brand.mutedText" mt="1">
                        {selectedSubmission.participant.email || "-"}
                      </Text>
                    </DashboardCard>

                    <DashboardCard p="4">
                      <Text fontSize="xs" fontWeight="bold" color="brand.mutedText">
                        Submitted At
                      </Text>
                      <Text mt="2" fontWeight="bold" color="brand.dark">
                        {formatDateTime(selectedSubmission.submission.submittedAt)}
                      </Text>
                    </DashboardCard>

                    <DashboardCard p="4">
                      <Text fontSize="xs" fontWeight="bold" color="brand.mutedText">
                        Verification
                      </Text>
                      <Text mt="2" fontWeight="bold" color="brand.dark">
                        {selectedSubmission.participant.verificationStatus ===
                        "VERIFIED"
                          ? "Verified"
                          : "Not Verified"}
                      </Text>
                    </DashboardCard>
                  </Grid>

                  <DashboardCard p="0" overflow="hidden">
                    <Box
                      px="5"
                      py="3"
                      bg="#FAFBFF"
                      borderBottomWidth="1px"
                      borderColor="brand.border"
                    >
                      <Text fontWeight="bold" color="brand.dark">
                        Submitted Answers
                      </Text>
                    </Box>

                    <VStack align="stretch" gap="0">
                      {selectedSubmission.answers
                        .slice()
                        .sort((left, right) => left.questionOrder - right.questionOrder)
                        .map((answer) => (
                          <Box
                            key={answer.answerId}
                            px="5"
                            py="4"
                            borderBottomWidth="1px"
                            borderColor="brand.border"
                          >
                            <HStack justify="space-between" align="start" gap="4">
                              <Box flex="1">
                                <Text
                                  fontSize="xs"
                                  fontWeight="bold"
                                  color="brand.mutedText"
                                  mb="2"
                                >
                                  Question {answer.questionOrder}
                                </Text>
                                <Text fontWeight="bold" color="brand.dark">
                                  {answer.questionText}
                                </Text>
                                <Text fontSize="sm" color="brand.mutedText" mt="1">
                                  {answer.questionType
                                    .toLowerCase()
                                    .split("_")
                                    .map((part) =>
                                      part.charAt(0).toUpperCase() + part.slice(1),
                                    )
                                    .join(" ")}
                                </Text>
                              </Box>

                              <Box
                                minW={{ base: "100%", md: "240px" }}
                                bg="brand.lightBlue"
                                borderRadius="12px"
                                px="4"
                                py="3"
                              >
                                <Text
                                  fontSize="xs"
                                  fontWeight="bold"
                                  color="brand.mutedText"
                                  mb="1"
                                >
                                  Submitted Answer
                                </Text>
                                <Text color="brand.dark">
                                  {getAnswerDisplayValue(answer)}
                                </Text>
                              </Box>
                            </HStack>
                          </Box>
                        ))}
                    </VStack>
                  </DashboardCard>

                  <HStack justify="end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsSubmissionModalOpen(false);
                        setSelectedSubmission(null);
                      }}
                    >
                      Close
                    </Button>
                  </HStack>
                </VStack>
              ) : (
                <Box py="8">
                  <Text color="brand.mutedText">
                    Submission details are not available right now.
                  </Text>
                </Box>
              )}
            </DialogBody>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </Box>
  );
}
