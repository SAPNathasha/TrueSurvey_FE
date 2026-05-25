"use client";

import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiFileText,
  FiInfo,
  FiRadio,
} from "react-icons/fi";

import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";
import type { SurveyMethodId } from "../select-method/selectMethodTypes";

type PublishOption = "now" | "later" | "draft";

type PreviewSubmitRightPanelProps = {
  selectedMethod: SurveyMethodId;
};

function ChecklistItem({ label }: { label: string }) {
  return (
    <HStack gap="3">
      <Box color="green.600">
        <FiCheckCircle />
      </Box>

      <Text fontSize="sm" color="brand.dark">
        {label}
      </Text>
    </HStack>
  );
}

function PublishOptionCard({
  value,
  selected,
  title,
  description,
  children,
  onSelect,
}: {
  value: PublishOption;
  selected: PublishOption;
  title: string;
  description: string;
  children?: React.ReactNode;
  onSelect: (value: PublishOption) => void;
}) {
  const isSelected = value === selected;

  return (
    <Box
      as="button"
      onClick={() => onSelect(value)}
      textAlign="left"
      w="100%"
    >
      <HStack align="start" gap="3">
        <Box
          w="18px"
          h="18px"
          borderRadius="full"
          borderWidth="2px"
          borderColor={isSelected ? "brand.primary" : "brand.border"}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink="0"
          mt="1"
        >
          {isSelected && (
            <Box w="8px" h="8px" borderRadius="full" bg="brand.primary" />
          )}
        </Box>

        <Box flex="1">
          <Text fontSize="sm" fontWeight="bold" color="brand.dark">
            {title}
          </Text>

          <Text fontSize="sm" color="brand.mutedText" mt="1">
            {description}
          </Text>

          {children}
        </Box>
      </HStack>
    </Box>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <HStack
      justify="space-between"
      borderBottomWidth="1px"
      borderColor="brand.border"
      pb="2"
      gap="4"
    >
      <Text fontSize="sm" color="brand.mutedText">
        {label}
      </Text>

      <Text fontSize="sm" color="brand.dark" fontWeight="semibold" textAlign="right">
        {value}
      </Text>
    </HStack>
  );
}

export default function PreviewSubmitRightPanel({
  selectedMethod,
}: PreviewSubmitRightPanelProps) {
  const [publishOption, setPublishOption] = useState<PublishOption>("now");

  return (
    <VStack align="stretch" gap="5">
      <DashboardCard>
        <HStack justify="space-between" mb="4">
          <Text fontWeight="bold" color="brand.dark">
            Readiness Checklist
          </Text>

          <Box
            px="3"
            py="1"
            borderRadius="8px"
            bg="#DCFCE7"
            color="green.700"
            fontSize="xs"
            fontWeight="bold"
          >
            Ready to Publish
          </Box>
        </HStack>

        <VStack align="stretch" gap="3">
          <ChecklistItem label="Basic details completed" />
          <ChecklistItem label="Survey method selected" />
          <ChecklistItem label="Questions added successfully" />
          <ChecklistItem label="Target audience defined" />
          <ChecklistItem label="Budget configured" />
          <ChecklistItem label="Reward per participant calculated" />
        </VStack>
      </DashboardCard>

      <DashboardCard>
        <Text fontWeight="bold" color="brand.dark" mb="5">
          Publishing Options
        </Text>

        <VStack align="stretch" gap="5">
          <PublishOptionCard
            value="now"
            selected={publishOption}
            title="Publish now"
            description="Make your survey live immediately."
            onSelect={setPublishOption}
          />

          <PublishOptionCard
            value="later"
            selected={publishOption}
            title="Schedule for later"
            description="Choose a date and time to publish."
            onSelect={setPublishOption}
          >
            <HStack mt="3" gap="3" flexWrap="wrap">
              <Button size="sm" variant="outline">
                <FiCalendar />
                May 20, 2025
              </Button>

              <Button size="sm" variant="outline">
                <FiRadio />
                10:00 AM
              </Button>
            </HStack>
          </PublishOptionCard>

          <PublishOptionCard
            value="draft"
            selected={publishOption}
            title="Save as draft"
            description="Save your survey and publish later."
            onSelect={setPublishOption}
          />
        </VStack>

        <Box
          mt="5"
          px="4"
          py="3"
          borderRadius="10px"
          bg="brand.lightBlue"
          color="brand.mutedText"
          fontSize="sm"
        >
          <HStack gap="2" align="start">
            <Box color="brand.primary" pt="1">
              <FiInfo />
            </Box>

            <Text>
              Once published, your survey will be available to matched
              participants.
            </Text>
          </HStack>
        </Box>
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

        <VStack align="stretch" gap="3">
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
          <SummaryItem label="Questions Added" value="4" />
          <SummaryItem label="Required Responses" value="500" />
          <SummaryItem label="Total Budget" value="LKR 100,000" />
          <SummaryItem label="Reward per Participant" value="LKR 170" />
        </VStack>

        <Button w="100%" mt="5" color="white">
          <FiRadio />
          Publish Survey
        </Button>
      </DashboardCard>
    </VStack>
  );
}