"use client";

import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import type { ComponentProps, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiTrash2,
} from "react-icons/fi";

import AuthenticatedShell from "@/components/layout/AuthenticatedShell";
import { toaster } from "@/components/ui/toaster";
import {
  deleteParticipantSubmission,
  getParticipantSubmissions,
  type ParticipantSubmissionRewardStatus,
  type ParticipantSubmissionRow,
  type ParticipantSubmissionsResponse,
} from "@/services/participantSubmissionService";

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

function StatCard({
  icon,
  title,
  value,
  helper,
  bg,
  color,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  helper: string;
  bg: string;
  color: string;
}) {
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

function formatMoney(value: number, currency = "LKR") {
  return `${currency} ${value.toLocaleString("en-LK")}`;
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-LK", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
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

function getRewardStatusStyle(status: ParticipantSubmissionRewardStatus) {
  if (status === "RELEASED") {
    return {
      label: "Released",
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

  if (status === "REJECTED") {
    return {
      label: "Rejected",
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

function SubmissionTable({
  rows,
  deletingSubmissionId,
  onDelete,
}: {
  rows: ParticipantSubmissionRow[];
  deletingSubmissionId: string | null;
  onDelete: (submissionId: string) => Promise<void>;
}) {
  return (
    <>
      <Stack display={{ base: "flex", md: "none" }} gap="3">
        {rows.length === 0 && (
          <DashboardCard p="5">
            <Text color="brand.mutedText" fontSize="sm">
              No submitted surveys found yet.
            </Text>
          </DashboardCard>
        )}

        {rows.map((submission) => {
          const statusStyle = getRewardStatusStyle(submission.rewardStatus);
          const canDelete = submission.rewardStatus === "PENDING";
          const isDeleting = deletingSubmissionId === submission.submissionId;

          return (
            <DashboardCard key={submission.submissionId} p="4">
              <Stack gap="4">
                <Box>
                  <Text fontWeight="bold" color="brand.dark" wordBreak="break-word">
                    {submission.surveyTitle}
                  </Text>
                </Box>

                <SimpleGrid columns={2} gap="3">
                  <Box>
                    <Text fontSize="xs" color="brand.mutedText" fontWeight="semibold">
                      Amount
                    </Text>
                    <Text fontWeight="bold" color="brand.dark">
                      {formatMoney(submission.amount)}
                    </Text>
                  </Box>

                  <Box>
                    <Text fontSize="xs" color="brand.mutedText" fontWeight="semibold">
                      Submitted
                    </Text>
                    <Text color="brand.dark">
                      {formatDateTime(submission.submittedAt)}
                    </Text>
                  </Box>
                </SimpleGrid>

                <HStack justify="space-between" gap="3" align="center">
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

                  {canDelete ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      loading={isDeleting}
                      disabled={Boolean(deletingSubmissionId) && !isDeleting}
                      onClick={() => {
                        void onDelete(submission.submissionId);
                      }}
                    >
                      <FiTrash2 />
                      Delete
                    </Button>
                  ) : (
                    <Box />
                  )}
                </HStack>
              </Stack>
            </DashboardCard>
          );
        })}
      </Stack>

      <DashboardCard p="0" overflow="hidden" display={{ base: "none", md: "block" }}>
        <Box overflowX="auto" w="100%">
          <Box minW="980px">
          <Grid
            templateColumns="2.2fr 1fr 1fr 1.3fr 0.9fr"
            px="5"
            py="4"
            bg="#FBFCFF"
            borderBottomWidth="1px"
            borderColor="brand.border"
            fontSize="sm"
            fontWeight="bold"
            color="brand.dark"
          >
            <Text>Survey Title</Text>
            <Text>Amount</Text>
            <Text>Reward Status</Text>
            <Text>Submitted Date</Text>
            <Text>Actions</Text>
          </Grid>

          {rows.length === 0 && (
            <Box px="5" py="6">
              <Text color="brand.mutedText" fontSize="sm">
                No submitted surveys found yet.
              </Text>
            </Box>
          )}

          {rows.map((submission) => {
            const statusStyle = getRewardStatusStyle(submission.rewardStatus);
            const canDelete = submission.rewardStatus === "PENDING";
            const isDeleting = deletingSubmissionId === submission.submissionId;

            return (
              <Grid
                key={submission.submissionId}
                templateColumns="2.2fr 1fr 1fr 1.3fr 0.9fr"
                px="5"
                py="4"
                borderBottomWidth="1px"
                borderColor="brand.border"
                alignItems="center"
                fontSize="sm"
              >
                <HStack gap="3">
                  <Box
                    w="34px"
                    h="34px"
                    borderRadius="8px"
                    bg="brand.lightBlue"
                    color="brand.primary"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink="0"
                  >
                    <FiFileText />
                  </Box>

                  <Text fontWeight="bold" color="brand.dark">
                    {submission.surveyTitle}
                  </Text>
                </HStack>

                <Text fontWeight="bold" color="brand.dark">
                  {formatMoney(submission.amount)}
                </Text>

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

                <Text color="brand.dark">
                  {formatDateTime(submission.submittedAt)}
                </Text>

                {canDelete ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    color="red.500"
                    loading={isDeleting}
                    disabled={Boolean(deletingSubmissionId) && !isDeleting}
                    onClick={() => {
                      void onDelete(submission.submissionId);
                    }}
                  >
                    <FiTrash2 />
                    Delete
                  </Button>
                ) : (
                  <Box />
                )}
              </Grid>
            );
          })}
          </Box>
        </Box>
      </DashboardCard>
    </>
  );
}

export default function ParticipantSubmissionsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ParticipantSubmissionsResponse | null>(null);
  const [deletingSubmissionId, setDeletingSubmissionId] = useState<string | null>(
    null,
  );

  const loadSubmissions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getParticipantSubmissions();
      setData(response);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not load survey submissions.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      try {
        const response = await getParticipantSubmissions();

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
  }, []);

  const handleDeleteSubmission = async (submissionId: string) => {
    try {
      setDeletingSubmissionId(submissionId);
      const response = await deleteParticipantSubmission(submissionId);

      toaster.create({
        type: "success",
        title: "Submission deleted",
        description: response.message,
      });

      await loadSubmissions();
    } catch (requestError) {
      toaster.create({
        type: "error",
        title: "Could not delete submission",
        description:
          requestError instanceof Error
            ? requestError.message
            : "Please try again in a moment.",
      });
    } finally {
      setDeletingSubmissionId(null);
    }
  };

  const summary = useMemo(() => {
    if (!data) {
      return {
        totalSubmissions: 0,
        pendingCount: 0,
        releasedCount: 0,
        totalRewardAmount: 0,
      };
    }

    const pendingCount = data.submissions.filter(
      (submission) => submission.rewardStatus === "PENDING",
    ).length;
    const releasedCount = data.submissions.filter(
      (submission) => submission.rewardStatus === "RELEASED",
    ).length;
    const totalRewardAmount = data.submissions.reduce(
      (sum, submission) => sum + submission.amount,
      0,
    );

    return {
      totalSubmissions: data.total,
      pendingCount,
      releasedCount,
      totalRewardAmount,
    };
  }, [data]);

  if (isLoading && !data) {
    return (
      <AuthenticatedShell activeItem="My Surveys">
        <Flex flex="1" align="center" justify="center">
          <Text color="brand.mutedText">Loading submitted surveys...</Text>
        </Flex>
      </AuthenticatedShell>
    );
  }

  if (error || !data) {
    return (
      <AuthenticatedShell activeItem="My Surveys">
        <Flex flex="1" align="center" justify="center" p="6">
          <DashboardCard p="6" maxW="560px">
            <Text fontWeight="bold" color="brand.dark">
              We could not load your submitted surveys.
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
    <AuthenticatedShell activeItem="My Surveys">
      <Box minW={0}>
        <Box mb="6">
          <Text
            fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
            fontWeight="extrabold"
            color="brand.dark"
            lineHeight="1"
            wordBreak="break-word"
          >
            My Surveys
          </Text>

          <Text fontSize={{ base: "sm", md: "lg" }} color="brand.mutedText" mt="3">
            Review the surveys you have already submitted and track their reward
            progress.
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} gap="4" mb="6">
          <StatCard
            icon={<FiFileText />}
            title="Total Submissions"
            value={String(summary.totalSubmissions)}
            helper="Completed survey submissions"
            bg="#DBEAFE"
            color="brand.primary"
          />

          <StatCard
            icon={<FiClock />}
            title="Pending Rewards"
            value={String(summary.pendingCount)}
            helper="Still awaiting review or release"
            bg="#FEF3C7"
            color="#D97706"
          />

          <StatCard
            icon={<FiCheckCircle />}
            title="Released Rewards"
            value={String(summary.releasedCount)}
            helper="Rewards already released"
            bg="#DCFCE7"
            color="green.600"
          />

          <StatCard
            icon={<FiDollarSign />}
            title="Total Reward Amount"
            value={formatMoney(summary.totalRewardAmount)}
            helper={`${data.participant.username}'s submitted reward value`}
            bg="#EEF2FF"
            color="brand.primary"
          />
        </SimpleGrid>

        <DashboardCard p="0" overflow="hidden">
          <Box
            px="5"
            py="4"
            borderBottomWidth="1px"
            borderColor="brand.border"
          >
            <Text fontWeight="bold" color="brand.dark">
              Submitted Survey Records
            </Text>
            <Text fontSize="sm" color="brand.mutedText" mt="1">
              {data.participant.username} has submitted {data.total} survey
              {data.total === 1 ? "" : "s"}.
            </Text>
          </Box>

          <SubmissionTable
            rows={data.submissions}
            deletingSubmissionId={deletingSubmissionId}
            onDelete={handleDeleteSubmission}
          />
        </DashboardCard>
      </Box>
    </AuthenticatedShell>
  );
}
