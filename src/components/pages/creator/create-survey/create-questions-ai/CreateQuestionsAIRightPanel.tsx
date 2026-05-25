"use client";

import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { FiEdit3, FiFileText, FiHelpCircle, FiTarget } from "react-icons/fi";

import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";

export default function CreateQuestionsAIRightPanel() {
  return (
    <VStack align="stretch" gap="5">
      <DashboardCard>
        <HStack justify="space-between" mb="4">
          <Text fontWeight="bold" color="brand.dark">
            Step Progress
          </Text>

          <Text fontSize="sm" color="brand.mutedText">
            Step 3 of 6
          </Text>
        </HStack>

        <HStack gap="4">
          <Box flex="1" h="7px" borderRadius="999px" bg="#E5E7EB">
            <Box w="50%" h="full" borderRadius="999px" bg="brand.primary" />
          </Box>

          <Text fontSize="sm" color="brand.mutedText">
            50%
          </Text>
        </HStack>
      </DashboardCard>

      <DashboardCard>
        <HStack gap="2" mb="5">
          <Box color="brand.primary">
            <FiFileText />
          </Box>

          <Text fontWeight="bold" color="brand.dark">
            AI Tips
          </Text>
        </HStack>

        <VStack align="stretch" gap="6">
          <HStack gap="4" align="start">
            <Box
              w="42px"
              h="42px"
              borderRadius="full"
              bg="#EEF2FF"
              color="brand.primary"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink="0"
              fontSize="22px"
            >
              <FiTarget />
            </Box>

            <Box>
              <Text fontWeight="bold" fontSize="sm" color="brand.dark">
                Be specific about the survey goal
              </Text>

              <Text fontSize="sm" color="brand.mutedText" mt="1">
                Clear goals help AI generate more relevant questions.
              </Text>
            </Box>
          </HStack>

          <HStack gap="4" align="start">
            <Box
              w="42px"
              h="42px"
              borderRadius="full"
              bg="#EEF2FF"
              color="brand.primary"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink="0"
              fontSize="22px"
            >
              <FiHelpCircle />
            </Box>

            <Box>
              <Text fontWeight="bold" fontSize="sm" color="brand.dark">
                Choose the right number of questions
              </Text>

              <Text fontSize="sm" color="brand.mutedText" mt="1">
                Balance depth with completion time for better responses.
              </Text>
            </Box>
          </HStack>

          <HStack gap="4" align="start">
            <Box
              w="42px"
              h="42px"
              borderRadius="full"
              bg="#EEF2FF"
              color="brand.primary"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink="0"
              fontSize="22px"
            >
              <FiEdit3 />
            </Box>

            <Box>
              <Text fontWeight="bold" fontSize="sm" color="brand.dark">
                You can edit every generated question
              </Text>

              <Text fontSize="sm" color="brand.mutedText" mt="1">
                Tailor the draft to perfectly fit your audience and needs.
              </Text>
            </Box>
          </HStack>
        </VStack>
      </DashboardCard>

      <DashboardCard >
        <HStack gap="2" mb="5">
          <Box
            w="28px"
            h="28px"
            borderRadius="full"
            bg="#FFE999"
            color="#A66A00"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <FiFileText />
          </Box>

          <Text fontWeight="bold" color="brand.dark">
            Survey Summary
          </Text>
        </HStack>

        <VStack align="stretch" gap="4">
          <SummaryItem label="Survey Title" value="Customer Satisfaction Survey" />
          <SummaryItem label="Category" value="Customer Feedback" />
          <SummaryItem label="Method" value="AI-Assisted" />
          <SummaryItem label="Estimated Completion Time" value="7 Days" />
          <SummaryItem label="Planned Questions" value="10" />
        </VStack>
      </DashboardCard>
    </VStack>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <Box borderBottomWidth="1px" borderStyle="dashed" borderColor="#E8D89A" pb="3">
      <Text fontSize="sm" color="brand.mutedText">
        {label}
      </Text>

      <Text fontSize="sm" fontWeight="semibold" color="brand.dark" mt="1">
        {value}
      </Text>
    </Box>
  );
}