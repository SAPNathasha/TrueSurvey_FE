import { Box, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { FiFileText } from "react-icons/fi";

import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";

export default function SurveySummaryCard() {
  return (
    <DashboardCard>
      <HStack mb="6" gap="4">
        <Box
          w="46px"
          h="46px"
          borderRadius="12px"
          bg="#FFF6D8"
          color="#D99A00"
          display="grid"
          placeItems="center"
        >
          <FiFileText />
        </Box>

        <Heading fontSize="md">Survey Summary</Heading>
      </HStack>

      <VStack align="stretch" gap="5">
        <SummaryItem
          label="Survey Title"
          value="Customer Satisfaction Survey"
        />

        <SummaryItem label="Category" value="Customer Feedback" />

        <SummaryItem
          label="Estimated Completion Time"
          value="7 Days"
          last
        />
      </VStack>
    </DashboardCard>
  );
}

function SummaryItem({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <Box
      borderBottomWidth={last ? "0" : "1px"}
      borderStyle="dashed"
      borderColor="brand.border"
      pb={last ? "0" : "4"}
    >
      <Text fontSize="sm" color="brand.mutedText" mb="1">
        {label}
      </Text>

      <Text fontSize="sm" color="brand.dark" fontWeight="medium">
        {value}
      </Text>
    </Box>
  );
}