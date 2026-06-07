"use client";

import NextLink from "next/link";
import {
  Badge,
  Box,
  Button,
  Grid,
  HStack,
  Input,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  RadialLinearScale,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Bar, Doughnut, Line, Radar } from "react-chartjs-2";
import {
  FiArrowLeft,
  FiBarChart2,
  FiSearch,
  FiTrendingUp,
} from "react-icons/fi";

import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";
import ParticipantSidebar from "@/components/pages/participant/dashboard/ParticipantSidebar";
import StatusBadge from "@/components/pages/creator/dashboard/StatusBadge";
import {
  getSurveyAnalytics,
  type GetSurveyAnalyticsResponse,
  type SurveyAnalyticsAnswer,
  type SurveyAnalyticsQuestion,
  type SurveyQuestionType,
} from "@/services/creatorSurveyService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend,
);

type CreatorSurveyAnalyticsPageProps = {
  surveyId: string;
};

const chartPalette = [
  "#0015D6",
  "#4F46E5",
  "#7C3AED",
  "#0EA5E9",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
];

const barBaseOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        color: "#EEF2F7",
      },
      ticks: {
        color: "#6B7280",
      },
    },
    y: {
      grid: {
        color: "#EEF2F7",
      },
      ticks: {
        color: "#6B7280",
      },
    },
  },
};

const lineOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        color: "#EEF2F7",
      },
      ticks: {
        color: "#6B7280",
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "#EEF2F7",
      },
      ticks: {
        color: "#6B7280",
        precision: 0,
      },
    },
  },
};

const doughnutOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        color: "#374151",
        usePointStyle: true,
      },
    },
  },
};

const radarOptions: ChartOptions<"radar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    r: {
      angleLines: {
        color: "#E5E7EB",
      },
      grid: {
        color: "#EEF2F7",
      },
      pointLabels: {
        color: "#374151",
      },
      ticks: {
        color: "#6B7280",
        backdropColor: "transparent",
        stepSize: 1,
      },
      min: 0,
      max: 5,
    },
  },
};

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

function formatShortDate(dateValue: string | null) {
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
  });
}

function formatQuestionType(questionType: SurveyQuestionType) {
  return questionType
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function truncateLabel(label: string, maxLength = 32) {
  if (label.length <= maxLength) {
    return label;
  }

  return `${label.slice(0, maxLength - 1)}…`;
}

function toPercentage(count: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Number(((count / total) * 100).toFixed(1));
}

function getTooltipLabel(rawCount: number, total: number, label: string) {
  const percentage = toPercentage(rawCount, total);
  return `${label}: ${rawCount} (${percentage}%)`;
}

function uniqueSubmissionTrend(questions: SurveyAnalyticsQuestion[]) {
  const submissionMap = new Map<string, string>();

  questions.forEach((question) => {
    question.answers.forEach((answer) => {
      if (answer.submissionId && answer.submittedAt) {
        submissionMap.set(answer.submissionId, answer.submittedAt);
      }
    });
  });

  const countsByDate = new Map<string, number>();

  Array.from(submissionMap.values())
    .sort((left, right) => new Date(left).getTime() - new Date(right).getTime())
    .forEach((submittedAt) => {
      const dateLabel = formatShortDate(submittedAt);
      countsByDate.set(dateLabel, (countsByDate.get(dateLabel) ?? 0) + 1);
    });

  return {
    labels: Array.from(countsByDate.keys()),
    values: Array.from(countsByDate.values()),
  };
}

function buildKeywordFrequency(answers: SurveyAnalyticsAnswer[]) {
  const stopWords = new Set([
    "the",
    "and",
    "for",
    "with",
    "this",
    "that",
    "have",
    "from",
    "your",
    "they",
    "them",
    "was",
    "are",
    "but",
    "not",
    "too",
    "very",
    "our",
    "you",
    "all",
    "can",
    "has",
    "had",
    "about",
    "would",
    "could",
    "should",
  ]);

  const normalizedThemeMap: Record<string, string> = {
    price: "Pricing",
    pricing: "Pricing",
    cost: "Pricing",
    expensive: "Pricing",
    cheap: "Pricing",
    support: "Support",
    service: "Support",
    help: "Support",
    design: "Design",
    interface: "Design",
    ui: "Design",
    ux: "Design",
    bug: "Bug",
    bugs: "Bug",
    error: "Bug",
    slow: "Performance",
    speed: "Performance",
    performance: "Performance",
    feature: "Feature",
    features: "Feature",
    request: "Feature Request",
    easy: "Ease of Use",
    simple: "Ease of Use",
    difficult: "Difficulty",
  };

  const counts = new Map<string, number>();

  answers.forEach((answer) => {
    const tokens = (answer.answerText ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((token) => token && !stopWords.has(token));

    tokens.forEach((token) => {
      const label =
        normalizedThemeMap[token] ??
        token.charAt(0).toUpperCase() + token.slice(1);
      counts.set(label, (counts.get(label) ?? 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 8);
}

function classifyLongAnswer(answerText: string) {
  const value = answerText.toLowerCase();

  if (/(bug|broken|error|issue|crash|fail|problem)/.test(value)) {
    return "Bug report";
  }

  if (/(request|would like|please add|feature|missing)/.test(value)) {
    return "Feature request";
  }

  if (/(bad|poor|terrible|awful|frustrating|hate|disappointed)/.test(value)) {
    return "Negative";
  }

  if (/(good|great|excellent|love|helpful|easy|smooth)/.test(value)) {
    return "Positive";
  }

  if (/(complain|complaint|annoying|unhappy|upset)/.test(value)) {
    return "Complaint";
  }

  if (/(thanks|amazing|awesome|well done|appreciate)/.test(value)) {
    return "Praise";
  }

  if (/(okay|average|fine|normal|neutral)/.test(value)) {
    return "Neutral";
  }

  return "Other";
}

function buildLongAnswerThemes(answers: SurveyAnalyticsAnswer[]) {
  const counts = new Map<string, number>();

  answers.forEach((answer) => {
    const theme = classifyLongAnswer(answer.answerText ?? "");
    counts.set(theme, (counts.get(theme) ?? 0) + 1);
  });

  const preferredOrder = [
    "Positive",
    "Negative",
    "Neutral",
    "Feature request",
    "Complaint",
    "Bug report",
    "Praise",
    "Other",
  ];

  return preferredOrder
    .map((label) => ({ label, count: counts.get(label) ?? 0 }))
    .filter((item) => item.count > 0);
}

function buildRatingDistribution(question: SurveyAnalyticsQuestion) {
  const ratings = [1, 2, 3, 4, 5];
  const counts = new Map<number, number>();

  ratings.forEach((rating) => counts.set(rating, 0));

  question.answers.forEach((answer) => {
    if (typeof answer.ratingValue === "number" && counts.has(answer.ratingValue)) {
      counts.set(
        answer.ratingValue,
        (counts.get(answer.ratingValue) ?? 0) + 1,
      );
    }
  });

  const values = ratings.map((rating) => counts.get(rating) ?? 0);
  const total = values.reduce((sum, value) => sum + value, 0);
  const weightedSum = ratings.reduce(
    (sum, rating, index) => sum + rating * values[index],
    0,
  );

  return {
    labels: ratings.map(String),
    values,
    total,
    average: total > 0 ? Number((weightedSum / total).toFixed(1)) : 0,
  };
}

function buildRatingComparison(questions: SurveyAnalyticsQuestion[]) {
  const ratingQuestions = questions.filter(
    (question) => question.questionType === "RATING_SCALE",
  );

  return ratingQuestions.map((question) => {
    const distribution = buildRatingDistribution(question);

    return {
      label: truncateLabel(`Q${question.order}: ${question.question}`, 28),
      average: distribution.average,
    };
  });
}

function MultipleChoiceQuestionChart({
  question,
}: {
  question: SurveyAnalyticsQuestion;
}) {
  const labels = question.options.map((option) => option.optionText);
  const counts = question.options.map((option) => option.selectionCount);

  const data: ChartData<"bar"> = {
    labels,
    datasets: [
      {
        label: "Selections",
        data: counts,
        backgroundColor: chartPalette[0],
        borderRadius: 8,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    ...barBaseOptions,
    indexAxis: "y",
    plugins: {
      ...barBaseOptions.plugins,
      tooltip: {
        callbacks: {
          label(context) {
            return getTooltipLabel(
              Number(context.raw ?? 0),
              question.totalAnswers,
              String(context.label ?? ""),
            );
          },
        },
      },
    },
  };

  return (
    <>
      <ChartPanel>
        <Bar data={data} options={options} />
      </ChartPanel>
      <OptionBreakdownTable question={question} />
    </>
  );
}

function SingleChoiceQuestionChart({
  question,
}: {
  question: SurveyAnalyticsQuestion;
}) {
  const labels = question.options.map((option) => option.optionText);
  const counts = question.options.map((option) => option.selectionCount);

  const data: ChartData<"bar"> = {
    labels,
    datasets: [
      {
        label: "Responses",
        data: counts,
        backgroundColor: chartPalette.map(
          (_, index) => chartPalette[index % chartPalette.length],
        ),
        borderRadius: 8,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    ...barBaseOptions,
    plugins: {
      ...barBaseOptions.plugins,
      tooltip: {
        callbacks: {
          label(context) {
            return getTooltipLabel(
              Number(context.raw ?? 0),
              question.totalAnswers,
              String(context.label ?? ""),
            );
          },
        },
      },
    },
  };

  return (
    <>
      <ChartPanel>
        <Bar data={data} options={options} />
      </ChartPanel>
      <OptionBreakdownTable question={question} />
    </>
  );
}

function YesNoQuestionChart({
  question,
}: {
  question: SurveyAnalyticsQuestion;
}) {
  const yesCount = question.answers.filter(
    (answer) => answer.booleanValue === true,
  ).length;
  const noCount = question.answers.filter(
    (answer) => answer.booleanValue === false,
  ).length;

  const data: ChartData<"doughnut"> = {
    labels: ["Yes", "No"],
    datasets: [
      {
        data: [yesCount, noCount],
        backgroundColor: ["#0015D6", "#D7DEE8"],
        borderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    ...doughnutOptions,
    plugins: {
      ...doughnutOptions.plugins,
      tooltip: {
        callbacks: {
          label(context) {
            return getTooltipLabel(
              Number(context.raw ?? 0),
              question.totalAnswers,
              String(context.label ?? ""),
            );
          },
        },
      },
    },
  };

  return (
    <>
      <ChartPanel height="280px">
        <Doughnut data={data} options={options} />
      </ChartPanel>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="3">
        <MetricBox
          label="Yes"
          value={`${yesCount} (${toPercentage(yesCount, question.totalAnswers)}%)`}
        />
        <MetricBox
          label="No"
          value={`${noCount} (${toPercentage(noCount, question.totalAnswers)}%)`}
        />
      </Grid>
    </>
  );
}

function RatingQuestionChart({
  question,
}: {
  question: SurveyAnalyticsQuestion;
}) {
  const distribution = buildRatingDistribution(question);

  const data: ChartData<"bar"> = {
    labels: distribution.labels,
    datasets: [
      {
        label: "Responses",
        data: distribution.values,
        backgroundColor: "#0015D6",
        borderRadius: 8,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    ...barBaseOptions,
    scales: {
      ...barBaseOptions.scales,
      y: {
        ...barBaseOptions.scales?.y,
        beginAtZero: true,
        ticks: {
          color: "#6B7280",
          precision: 0,
        },
      },
    },
    plugins: {
      ...barBaseOptions.plugins,
      tooltip: {
        callbacks: {
          label(context) {
            return getTooltipLabel(
              Number(context.raw ?? 0),
              distribution.total,
              `Rating ${String(context.label ?? "")}`,
            );
          },
        },
      },
    },
  };

  return (
    <>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap="3">
        <MetricBox label="Average rating" value={distribution.average.toFixed(1)} />
        <MetricBox label="Total responses" value={String(distribution.total)} />
        <MetricBox
          label="Top rating share"
          value={`${toPercentage(distribution.values[4], distribution.total)}%`}
        />
      </Grid>
      <ChartPanel>
        <Bar data={data} options={options} />
      </ChartPanel>
      <Grid templateColumns={{ base: "1fr", md: "repeat(5, 1fr)" }} gap="3">
        {distribution.labels.map((label, index) => (
          <MetricBox
            key={label}
            label={`Rating ${label}`}
            value={`${distribution.values[index]} (${toPercentage(
              distribution.values[index],
              distribution.total,
            )}%)`}
          />
        ))}
      </Grid>
    </>
  );
}

function ShortAnswerQuestionChart({
  question,
}: {
  question: SurveyAnalyticsQuestion;
}) {
  const themes = buildKeywordFrequency(question.answers);

  const data: ChartData<"bar"> = {
    labels: themes.map((theme) => theme.label),
    datasets: [
      {
        label: "Keyword frequency",
        data: themes.map((theme) => theme.count),
        backgroundColor: "#0015D6",
        borderRadius: 8,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    ...barBaseOptions,
    plugins: {
      ...barBaseOptions.plugins,
      tooltip: {
        callbacks: {
          label(context) {
            return `${context.label}: ${Number(context.raw ?? 0)} mentions`;
          },
        },
      },
    },
  };

  return (
    <>
      <ChartPanel>
        <Bar data={data} options={options} />
      </ChartPanel>
      <RawAnswerTable answers={question.answers} />
    </>
  );
}

function LongAnswerQuestionChart({
  question,
}: {
  question: SurveyAnalyticsQuestion;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const themes = buildLongAnswerThemes(question.answers);
  const filteredAnswers = useMemo(
    () =>
      question.answers.filter((answer) =>
        (answer.answerText ?? "")
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase()),
      ),
    [question.answers, searchTerm],
  );

  const data: ChartData<"bar"> = {
    labels: themes.map((theme) => theme.label),
    datasets: [
      {
        label: "Theme frequency",
        data: themes.map((theme) => theme.count),
        backgroundColor: chartPalette.slice(0, themes.length),
        borderRadius: 8,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    ...barBaseOptions,
    plugins: {
      ...barBaseOptions.plugins,
      tooltip: {
        callbacks: {
          label(context) {
            return `${context.label}: ${Number(context.raw ?? 0)} responses`;
          },
        },
      },
    },
  };

  return (
    <>
      <ChartPanel>
        <Bar data={data} options={options} />
      </ChartPanel>
      <Box>
        <HStack gap="3" mb="3">
          <FiSearch />
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search long responses"
            borderColor="brand.border"
            maxW="360px"
          />
        </HStack>
        <RawAnswerTable answers={filteredAnswers} showTheme />
      </Box>
    </>
  );
}

function OptionBreakdownTable({
  question,
}: {
  question: SurveyAnalyticsQuestion;
}) {
  return (
    <Box borderWidth="1px" borderColor="brand.border" borderRadius="16px" overflow="hidden">
      <Table.Root size="sm">
        <Table.Header bg="#FAFBFF">
          <Table.Row>
            <Table.ColumnHeader>Option</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Count</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Percentage</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {question.options.map((option) => (
            <Table.Row key={option.id}>
              <Table.Cell>{option.optionText}</Table.Cell>
              <Table.Cell textAlign="end">{option.selectionCount}</Table.Cell>
              <Table.Cell textAlign="end">
                {toPercentage(option.selectionCount, question.totalAnswers)}%
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}

function RawAnswerTable({
  answers,
  showTheme = false,
}: {
  answers: SurveyAnalyticsAnswer[];
  showTheme?: boolean;
}) {
  return (
    <Box borderWidth="1px" borderColor="brand.border" borderRadius="16px" overflow="hidden">
      <Table.Root size="sm">
        <Table.Header bg="#FAFBFF">
          <Table.Row>
            <Table.ColumnHeader>Submitted At</Table.ColumnHeader>
            {showTheme ? <Table.ColumnHeader>Theme</Table.ColumnHeader> : null}
            <Table.ColumnHeader>Response</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {answers.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={showTheme ? 3 : 2}>
                <Text color="brand.mutedText">No text responses to show.</Text>
              </Table.Cell>
            </Table.Row>
          ) : (
            answers.map((answer) => (
              <Table.Row key={answer.answerId}>
                <Table.Cell>{formatDateTime(answer.submittedAt)}</Table.Cell>
                {showTheme ? (
                  <Table.Cell>{classifyLongAnswer(answer.answerText ?? "")}</Table.Cell>
                ) : null}
                <Table.Cell>{answer.answerText?.trim() || "-"}</Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}

function ChartPanel({
  children,
  height = "340px",
}: {
  children: React.ReactNode;
  height?: string;
}) {
  return (
    <Box h={height} borderWidth="1px" borderColor="brand.border" borderRadius="16px" p="4">
      {children}
    </Box>
  );
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <Box borderWidth="1px" borderColor="brand.border" borderRadius="14px" p="4">
      <Text fontSize="xs" fontWeight="bold" color="brand.mutedText">
        {label}
      </Text>
      <Text mt="2" fontWeight="bold" color="brand.dark">
        {value}
      </Text>
    </Box>
  );
}

function AnalyticsQuestionSection({
  question,
}: {
  question: SurveyAnalyticsQuestion;
}) {
  return (
    <DashboardCard p="0" overflow="hidden">
      <Box p={{ base: "5", lg: "6" }}>
        <HStack justify="space-between" align="start" gap="4" flexWrap="wrap">
          <Box>
            <Text fontSize="xs" fontWeight="bold" color="brand.mutedText">
              Question {question.order}
            </Text>
            <Text mt="2" fontSize="lg" fontWeight="bold" color="brand.dark">
              {question.question}
            </Text>
            <HStack mt="2" gap="2" flexWrap="wrap">
              <Badge bg="#EEF2FF" color="brand.primary" borderRadius="pill">
                {formatQuestionType(question.questionType)}
              </Badge>
              <Badge
                bg={question.isRequired ? "#E8F8F2" : "#FFF7E6"}
                color={question.isRequired ? "brand.success" : "#B7791F"}
                borderRadius="pill"
              >
                {question.isRequired ? "Required" : "Optional"}
              </Badge>
            </HStack>
          </Box>

          <MetricBox
            label="Total responses"
            value={String(question.totalAnswers)}
          />
        </HStack>

        <VStack align="stretch" gap="5" mt="5">
          {question.questionType === "MULTIPLE_CHOICE" ? (
            <MultipleChoiceQuestionChart question={question} />
          ) : null}
          {question.questionType === "SINGLE_SELECT" ? (
            <SingleChoiceQuestionChart question={question} />
          ) : null}
          {question.questionType === "YES_NO" ? (
            <YesNoQuestionChart question={question} />
          ) : null}
          {question.questionType === "RATING_SCALE" ? (
            <RatingQuestionChart question={question} />
          ) : null}
          {question.questionType === "SHORT_ANSWER" ? (
            <ShortAnswerQuestionChart question={question} />
          ) : null}
          {question.questionType === "LONG_ANSWER" ? (
            <LongAnswerQuestionChart question={question} />
          ) : null}
        </VStack>
      </Box>
    </DashboardCard>
  );
}

export default function CreatorSurveyAnalyticsPage({
  surveyId,
}: CreatorSurveyAnalyticsPageProps) {
  const [data, setData] = useState<GetSurveyAnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getSurveyAnalytics(surveyId);

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
            : "Could not load survey analytics.",
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
  }, [surveyId]);

  const submissionTrend = useMemo(
    () => (data ? uniqueSubmissionTrend(data.questions) : { labels: [], values: [] }),
    [data],
  );

  const trendChartData: ChartData<"line"> = useMemo(
    () => ({
      labels: submissionTrend.labels,
      datasets: [
        {
          label: "Responses",
          data: submissionTrend.values,
          borderColor: "#0015D6",
          backgroundColor: "rgba(0, 21, 214, 0.16)",
          fill: true,
          tension: 0.35,
          pointRadius: 3,
        },
      ],
    }),
    [submissionTrend],
  );

  const ratingComparison = useMemo(
    () => (data ? buildRatingComparison(data.questions) : []),
    [data],
  );

  const radarData: ChartData<"radar"> = useMemo(
    () => ({
      labels: ratingComparison.map((item) => item.label),
      datasets: [
        {
          label: "Average rating",
          data: ratingComparison.map((item) => item.average),
          backgroundColor: "rgba(0, 21, 214, 0.14)",
          borderColor: "#0015D6",
          pointBackgroundColor: "#0015D6",
          borderWidth: 2,
        },
      ],
    }),
    [ratingComparison],
  );

  const requiredQuestionsCount =
    data?.questions.filter((question) => question.isRequired).length ?? 0;

  const surveyStatusLabel =
    data?.survey.status === "ACTIVE"
      ? "Active"
      : data?.survey.status === "CLOSED"
        ? "Closed"
        : "Draft";

  return (
    <Box minH="100vh" bg="white" color="brand.dark" display="flex">
      <ParticipantSidebar />

      <Box flex="1" p={{ base: "4", lg: "6" }} overflow="hidden">
        <Box maxW="1500px" mx="auto">
          <VStack align="stretch" gap="5">
            <DashboardCard>
              <HStack justify="space-between" align="start" flexWrap="wrap" gap="4">
                <Box>
                  <HStack gap="3" mb="3">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      h="34px"
                      px="3.5"
                    >
                      <NextLink href="/creator/surveys">
                        <FiArrowLeft />
                        Back to Surveys
                      </NextLink>
                    </Button>
                  </HStack>

                  <Text fontSize="2xl" fontWeight="bold" color="brand.dark">
                    Survey Analytics
                  </Text>

                  <Text mt="1" color="brand.mutedText">
                    {data?.survey.description ||
                      "Response breakdowns, trends, and answer-level insights for this survey."}
                  </Text>
                </Box>

                {data ? <StatusBadge status={surveyStatusLabel as "Active" | "Draft" | "Closed"} /> : null}
              </HStack>

              {isLoading ? (
                <Box mt="5">
                  <Text color="brand.mutedText">Loading analytics...</Text>
                </Box>
              ) : null}

              {!isLoading && error ? (
                <Box mt="5">
                  <Text color="red.500" fontWeight="medium">
                    {error}
                  </Text>
                </Box>
              ) : null}

              {!isLoading && data ? (
                <>
                  <Text mt="4" fontSize="xl" fontWeight="bold" color="brand.dark">
                    {data.survey.title}
                  </Text>

                  <Grid
                    mt="5"
                    templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", xl: "repeat(4, 1fr)" }}
                    gap="4"
                  >
                    <MetricBox
                      label="Completed submissions"
                      value={String(data.survey.totalCompletedSubmissions)}
                    />
                    <MetricBox
                      label="Questions analyzed"
                      value={String(data.questions.length)}
                    />
                    <MetricBox
                      label="Required questions"
                      value={String(requiredQuestionsCount)}
                    />
                    <MetricBox
                      label="Survey status"
                      value={surveyStatusLabel}
                    />
                  </Grid>
                </>
              ) : null}
            </DashboardCard>

            {!isLoading && !error && data ? (
              <>
                <DashboardCard>
                  <HStack justify="space-between" align="start" flexWrap="wrap" gap="4">
                    <Box>
                      <HStack gap="2">
                        <FiTrendingUp />
                        <Text fontSize="lg" fontWeight="bold" color="brand.dark">
                          Submission Trend
                        </Text>
                      </HStack>
                      <Text mt="1" color="brand.mutedText">
                        Track how completed responses came in over time.
                      </Text>
                    </Box>

                    <MetricBox
                      label="Total dates tracked"
                      value={String(submissionTrend.labels.length)}
                    />
                  </HStack>

                  <Box mt="5">
                    <ChartPanel height="320px">
                      <Line data={trendChartData} options={lineOptions} />
                    </ChartPanel>
                  </Box>
                </DashboardCard>

                {ratingComparison.length > 1 ? (
                  <DashboardCard>
                    <HStack gap="2">
                      <FiBarChart2 />
                      <Text fontSize="lg" fontWeight="bold" color="brand.dark">
                        Rating Comparison
                      </Text>
                    </HStack>
                    <Text mt="1" color="brand.mutedText">
                      Compare average ratings across all rating-scale questions.
                    </Text>
                    <Box mt="5">
                      <ChartPanel height="340px">
                        <Radar data={radarData} options={radarOptions} />
                      </ChartPanel>
                    </Box>
                  </DashboardCard>
                ) : null}

                {data.questions
                  .slice()
                  .sort((left, right) => left.order - right.order)
                  .map((question) => (
                    <AnalyticsQuestionSection
                      key={question.questionId}
                      question={question}
                    />
                  ))}
              </>
            ) : null}
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}
