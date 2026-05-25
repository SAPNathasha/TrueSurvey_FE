"use client";

import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import {
  FiCheckCircle,
  FiEdit3,
  FiFileText,
  FiList,
  FiPlusCircle,
} from "react-icons/fi";

import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";

export default function CreateQuestionsManualRightPanel() {
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
            <FiEdit3 />
          </Box>

          <Text fontWeight="bold" color="brand.dark">
            Manual Builder Tips
          </Text>
        </HStack>

        <VStack align="stretch" gap="6">
          <TipItem
            icon={<FiPlusCircle />}
            title="Add questions one by one"
            description="Create custom questions based on your exact survey goal."
          />

          <TipItem
            icon={<FiList />}
            title="Choose the correct answer type"
            description="Use multiple choice, single choice, rating scale, or short answer based on the data you need."
          />

          <TipItem
            icon={<FiCheckCircle />}
            title="Mark important questions as required"
            description="Required questions help you collect complete and useful responses."
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
          <SummaryItem label="Method" value="Manual Creation" />
          <SummaryItem label="Estimated Completion Time" value="7 Days" />
          <SummaryItem label="Current Step" value="Create Questions" />
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