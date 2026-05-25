"use client";

import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import {
  FiFileText,
  FiShield,
  FiUsers,
} from "react-icons/fi";

import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";
import type { SurveyMethodId } from "../select-method/selectMethodTypes";

type SampleBudgetRightPanelProps = {
  selectedMethod: SurveyMethodId;
};

export default function SampleBudgetRightPanel({
  selectedMethod,
}: SampleBudgetRightPanelProps) {
  return (
    <VStack align="stretch" gap="5">
      <DashboardCard>
        <HStack justify="space-between" mb="4">
          <Text fontWeight="bold" color="brand.dark">
            Step Progress
          </Text>

          <Text fontSize="sm" color="brand.mutedText">
            Step 5 of 6
          </Text>
        </HStack>

        <HStack gap="4">
          <Box flex="1" h="7px" borderRadius="999px" bg="#E5E7EB">
            <Box w="83%" h="full" borderRadius="999px" bg="brand.primary" />
          </Box>

          <Text fontSize="sm" color="brand.mutedText">
            83%
          </Text>
        </HStack>
      </DashboardCard>

      <DashboardCard>
        <Text fontWeight="bold" color="brand.dark" mb="5">
          Budget Tips
        </Text>

        <VStack align="stretch" gap="6">
          <TipItem
            icon={<FiUsers />}
            iconColor="green.600"
            iconBg="#DCFCE7"
            title="Offer fair rewards"
            description="Balanced incentives improve response rates."
          />

          <TipItem
            icon={<FiUsers />}
            iconColor="purple.600"
            iconBg="#F3E8FF"
            title="Match budget to sample size"
            description="More responses require more funding."
          />

          <TipItem
            icon={<FiShield />}
            iconColor="brand.primary"
            iconBg="#EEF2FF"
            title="Consider platform fees"
            description="Include commission when planning costs."
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
          <SummaryItem
            label="Audience"
            value="Colombo, Age 18–45, Verified users"
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
  iconColor,
  iconBg,
  title,
  description,
}: {
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
}) {
  return (
    <HStack gap="4" align="start">
      <Box
        w="48px"
        h="48px"
        borderRadius="full"
        bg={iconBg}
        color={iconColor}
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