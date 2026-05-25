"use client";

import {
  Box,
  Button,
  Grid,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  FiArrowLeft,
  FiCheckSquare,
  FiClock,
  FiEdit2,
  FiFileText,
  FiGift,
  FiGlobe,
  FiInfo,
  FiMonitor,
  FiSave,
  FiSmartphone,
  FiTag,
  FiUsers,
} from "react-icons/fi";

import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";

type PreviewSubmitStepProps = {
  onBack: () => void;
};

type PreviewMode = "desktop" | "mobile";

type DetailItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

type QuestionOverviewItemProps = {
  questionNumber: string;
  question: string;
  type: string;
  tagBg: string;
  tagColor: string;
};

function DetailItem({ icon, label, value }: DetailItemProps) {
  return (
    <HStack
      gap="3"
      align="center"
      borderRightWidth={{ base: "0", md: "1px" }}
      borderBottomWidth={{ base: "1px", md: "0" }}
      borderColor="brand.border"
      p="4"
      minH="82px"
    >
      <Box color="brand.primary" fontSize="24px" flexShrink="0">
        {icon}
      </Box>

      <Box>
        <Text fontSize="xs" color="brand.mutedText" fontWeight="semibold">
          {label}
        </Text>

        <Text fontSize="sm" color="brand.dark" fontWeight="bold" mt="1">
          {value}
        </Text>
      </Box>
    </HStack>
  );
}

function QuestionOverviewItem({
  questionNumber,
  question,
  type,
  tagBg,
  tagColor,
}: QuestionOverviewItemProps) {
  return (
    <HStack
      justify="space-between"
      gap="4"
      borderBottomWidth="1px"
      borderColor="brand.border"
      py="3"
    >
      <HStack gap="4">
        <Text color="brand.primary" fontWeight="bold" fontSize="sm">
          {questionNumber}
        </Text>

        <Text fontSize="sm" color="brand.dark" fontWeight="medium">
          {question}
        </Text>
      </HStack>

      <Box
        px="3"
        py="1"
        borderRadius="8px"
        bg={tagBg}
        color={tagColor}
        fontSize="xs"
        fontWeight="bold"
        whiteSpace="nowrap"
      >
        {type}
      </Box>
    </HStack>
  );
}

export default function PreviewSubmitStep({ onBack }: PreviewSubmitStepProps) {
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");

  return (
    <Box>
      <Box
        bg="brand.lightBlue"
        borderWidth="1px"
        borderColor="#D7E3FF"
        borderRadius="12px"
        px="5"
        py="4"
        mb="5"
      >
        <HStack gap="3" align="start">
          <Box color="brand.primary" pt="1">
            <FiInfo />
          </Box>

          <Text fontSize="sm" color="brand.mutedText">
            Review your survey details, preview how it will look to respondents,
            and publish when you are ready.
          </Text>
        </HStack>
      </Box>

      <DashboardCard p="0" overflow="hidden">
        <Box px={{ base: "5", lg: "6" }} py="4">
          <HStack justify="space-between" flexWrap="wrap" gap="4">
            <Text fontSize="xl" fontWeight="bold" color="brand.dark">
              Survey Preview
            </Text>

            <HStack
              borderWidth="1px"
              borderColor="brand.border"
              borderRadius="10px"
              overflow="hidden"
              bg="white"
            >
              <Button
                size="sm"
                borderRadius="0"
                variant={previewMode === "desktop" ? "solid" : "ghost"}
                color={previewMode === "desktop" ? "white" : "brand.mutedText"}
                onClick={() => setPreviewMode("desktop")}
                px={3}
                py={3}
              >
                <FiMonitor />
                Desktop Preview
              </Button>

              <Button
                size="sm"
                borderRadius="0"
                variant={previewMode === "mobile" ? "solid" : "ghost"}
                color={previewMode === "mobile" ? "white" : "brand.mutedText"}
                onClick={() => setPreviewMode("mobile")}
                px={3}
                py={3}
              >
                <FiSmartphone />
                Mobile Preview
              </Button>
            </HStack>
          </HStack>
        </Box>

        <Box
          mx={{ base: "5", lg: "6" }}
          mb="5"
          borderWidth="1px"
          borderColor="brand.border"
          borderRadius="12px"
          bg="#FBFCFF"
          p={{ base: "5", lg: "7" }}
        >
          <Box
            maxW={previewMode === "mobile" ? "430px" : "100%"}
            mx="auto"
            bg="white"
            borderRadius="14px"
            borderWidth="1px"
            borderColor="brand.border"
            p={{ base: "5", lg: "6" }}
            transition="0.2s"
          >
            <VStack align="stretch" gap="5">
              <Box textAlign="center">
                <Box
                  w="48px"
                  h="48px"
                  borderRadius="full"
                  bg="brand.lightBlue"
                  color="brand.primary"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mx="auto"
                  mb="3"
                  fontSize="24px"
                >
                  <FiFileText />
                </Box>

                <Text fontSize={{ base: "xl", lg: "2xl" }} fontWeight="bold">
                  Customer Satisfaction Survey
                </Text>

                <Text fontSize="sm" color="brand.mutedText" mt="2">
                  We value your feedback! Please take a few minutes to share
                  your experience with our services.
                </Text>

                <HStack justify="center" gap="4" mt="4">
                  <Text fontSize="xs" color="brand.mutedText">
                    Question 1 of 4
                  </Text>

                  <Box w="260px" h="5px" bg="#E5E7EB" borderRadius="999px">
                    <Box
                      w="25%"
                      h="full"
                      bg="brand.primary"
                      borderRadius="999px"
                    />
                  </Box>
                </HStack>
              </Box>

              <Box
                borderWidth="1px"
                borderColor="brand.border"
                borderRadius="12px"
                p="5"
              >
                <HStack align="start" gap="4">
                  <Box
                    w="28px"
                    h="28px"
                    borderRadius="6px"
                    bg="brand.primary"
                    color="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="sm"
                    fontWeight="bold"
                    flexShrink="0"
                  >
                    1
                  </Box>

                  <Box flex="1">
                    <Text fontWeight="bold" color="brand.dark">
                      How satisfied are you with your overall service?
                    </Text>

                    <Text fontSize="sm" color="brand.mutedText" mt="2">
                      Please rate your experience on a scale of 1 to 5.
                    </Text>

                    <HStack justify="space-between" mt="5" maxW="620px">
                      {[1, 2, 3, 4, 5].map((number) => (
                        <Box
                          key={number}
                          w="48px"
                          h="48px"
                          borderRadius="full"
                          borderWidth="1px"
                          borderColor="#BFD0FF"
                          color="brand.primary"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontWeight="bold"
                        >
                          {number}
                        </Box>
                      ))}
                    </HStack>

                    <HStack justify="space-between" mt="2" maxW="620px">
                      <Text fontSize="xs" color="brand.mutedText">
                        Very Dissatisfied
                      </Text>

                      <Text fontSize="xs" color="brand.mutedText">
                        Very Satisfied
                      </Text>
                    </HStack>
                  </Box>
                </HStack>
              </Box>

              <Box
                borderWidth="1px"
                borderColor="brand.border"
                borderRadius="12px"
                p="5"
              >
                <HStack align="start" gap="4">
                  <Box
                    w="28px"
                    h="28px"
                    borderRadius="6px"
                    bg="brand.primary"
                    color="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="sm"
                    fontWeight="bold"
                    flexShrink="0"
                  >
                    2
                  </Box>

                  <Box flex="1">
                    <Text fontWeight="bold" color="brand.dark">
                      Which of the following areas do you value most?
                    </Text>

                    <Text fontSize="sm" color="brand.mutedText" mt="2">
                      Please select one option that matters most to you.
                    </Text>

                    <HStack gap="3" mt="4">
                      <Box
                        w="18px"
                        h="18px"
                        borderRadius="full"
                        borderWidth="1px"
                        borderColor="brand.mutedText"
                      />
                      <Text fontSize="sm" color="brand.dark">
                        Quality of Service
                      </Text>
                    </HStack>
                  </Box>
                </HStack>
              </Box>
            </VStack>
          </Box>
        </Box>

        <HStack
          px={{ base: "5", lg: "6" }}
          py="4"
          borderTopWidth="1px"
          borderColor="brand.border"
          gap="5"
          flexWrap="wrap"
          color="brand.mutedText"
          fontSize="sm"
        >
          <HStack>
            <FiClock />
            <Text>Estimated completion time: ~2 minutes</Text>
          </HStack>

          <Box h="20px" w="1px" bg="brand.border" />

          <Text>4 questions</Text>

          <Box h="20px" w="1px" bg="brand.border" />

          <Text>Thank you for your valuable feedback!</Text>
        </HStack>
      </DashboardCard>

      <Grid templateColumns={{ base: "1fr", xl: "1fr 0.9fr" }} gap="5" mt="5">
        <DashboardCard p="0" overflow="hidden">
          <Box px="5" py="4">
            <Text fontSize="lg" fontWeight="bold" color="brand.dark">
              Survey Details
            </Text>

            <Text fontSize="sm" color="brand.mutedText">
              Launch Summary
            </Text>
          </Box>

          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }}>
            <DetailItem
              icon={<FiTag />}
              label="Category"
              value="Customer Feedback"
            />

            <DetailItem
              icon={<FiFileText />}
              label="Questions Added"
              value="4"
            />

            <DetailItem
              icon={<FiCheckSquare />}
              label="Platform Commission"
              value="15%"
            />

            <DetailItem icon={<FiEdit2 />} label="Method" value="Manual" />

            <DetailItem
              icon={<FiUsers />}
              label="Required Responses"
              value="500"
            />

            <DetailItem
              icon={<FiGift />}
              label="Reward per Participant"
              value="LKR 170"
            />

            <DetailItem
              icon={<FiUsers />}
              label="Audience"
              value="Colombo, Age 18–45, Verified users"
            />

            <DetailItem
              icon={<FiSave />}
              label="Total Budget"
              value="LKR 100,000"
            />

            <DetailItem
              icon={<FiGlobe />}
              label="Estimated Reach"
              value="500 respondents"
            />
          </Grid>
        </DashboardCard>

        <DashboardCard p="0">
          <Box px="5" py="4">
            <HStack justify="space-between">
              <Text fontSize="lg" fontWeight="bold" color="brand.dark">
                Questions Overview
              </Text>

              <Button variant="ghost" color="brand.primary" size="sm">
                <FiEdit2 />
                Edit Questions
              </Button>
            </HStack>
          </Box>

          <Box px="5" pb="4">
            <QuestionOverviewItem
              questionNumber="Q1"
              question="How satisfied are you with our overall service?"
              type="Linear Scale"
              tagBg="#EAF2FF"
              tagColor="brand.primary"
            />

            <QuestionOverviewItem
              questionNumber="Q2"
              question="Which of the following areas do you value most?"
              type="Multiple Choice"
              tagBg="#F3E8FF"
              tagColor="#6D28D9"
            />

            <QuestionOverviewItem
              questionNumber="Q3"
              question="What could we improve to better serve you?"
              type="Paragraph"
              tagBg="#E7FBEF"
              tagColor="#087A35"
            />

            <QuestionOverviewItem
              questionNumber="Q4"
              question="Which channels have you used to contact us?"
              type="Checkboxes"
              tagBg="#FFF7ED"
              tagColor="#C2410C"
            />
          </Box>
        </DashboardCard>
      </Grid>

      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 1fr 1fr 1.45fr" }}
        gap="4"
        mt="5"
      >
        <Button h="48px" variant="outline" onClick={onBack}>
          <FiArrowLeft />
          Back
        </Button>

        <Button h="48px" variant="outline">
          <FiSave />
          Save as Draft
        </Button>

        <Button h="48px" variant="outline">
          <FiEdit2 />
          Edit Survey
        </Button>

        <Button h="48px" color="white">
          <FiMonitor />
          Publish Survey
        </Button>
      </Grid>
    </Box>
  );
}