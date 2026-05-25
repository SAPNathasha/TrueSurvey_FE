"use client";

import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { FiFileText, FiFilter, FiShield, FiTarget } from "react-icons/fi";

import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";
import type { SurveyMethodId } from "../select-method/selectMethodTypes";

type TargetAudienceRightPanelProps = {
  selectedMethod: SurveyMethodId;
};

export default function TargetAudienceRightPanel({
  selectedMethod,
}: TargetAudienceRightPanelProps) {
  return (
    <VStack align="stretch" gap="5">
      <DashboardCard>
        <HStack justify="space-between" mb="4">
          <Text fontWeight="bold" color="brand.dark">
            Step Progress
          </Text>

          <Text fontSize="sm" color="brand.mutedText">
            Step 4 of 6
          </Text>
        </HStack>

        <HStack gap="4">
          <Box flex="1" h="7px" borderRadius="999px" bg="#E5E7EB">
            <Box w="67%" h="full" borderRadius="999px" bg="brand.primary" />
          </Box>

          <Text fontSize="sm" color="brand.mutedText">
            67%
          </Text>
        </HStack>
      </DashboardCard>

      <DashboardCard>
        <Text fontWeight="bold" color="brand.dark" mb="5">
          Audience Tips
        </Text>

        <VStack align="stretch" gap="6">
          <TipItem
            icon={<FiTarget />}
            title="Keep your audience focused"
            description="Use relevant filters to reach the right people and improve results."
          />

          <TipItem
            icon={<FiFilter />}
            title="Use realistic filters"
            description="Overly narrow filters may limit responses and reduce insights."
          />

          <TipItem
            icon={<FiShield />}
            title="Verified users improve data quality"
            description="Verified users provide more accurate and reliable feedback."
          />
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
          <SummaryItem
            label="Method"
            value={selectedMethod === "ai" ? "AI-Assisted" : "Manual"}
          />
          <SummaryItem label="Estimated Completion Time" value="7 Days" />
          <SummaryItem label="Questions Added" value="4" />
        </VStack>
      </DashboardCard>
    </VStack>
  );
}

function TipItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <HStack gap="4" align="start">
      <Box
        w="48px"
        h="48px"
        borderRadius="full"
        bg="#EEF2FF"
        color="brand.primary"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize="24px"
        flexShrink="0"
      >
        {icon}
      </Box>

      <Box>
        <Text fontWeight="bold" fontSize="sm" color="brand.dark">
          {title}
        </Text>

        <Text fontSize="sm" color="brand.mutedText" mt="1">
          {description}
        </Text>
      </Box>
    </HStack>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <Box
      borderBottomWidth="1px"
      borderStyle="dashed"
      borderColor="#E8D89A"
      pb="3"
    >
      <Text fontSize="sm" color="brand.mutedText">
        {label}
      </Text>

      <Text fontSize="sm" fontWeight="semibold" color="brand.dark" mt="1">
        {value}
      </Text>
    </Box>
  );
}