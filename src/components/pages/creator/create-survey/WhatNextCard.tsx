import {
  Box,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiFlag } from "react-icons/fi";

import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";
import { nextStepItems } from "./createSurveyData";

export default function WhatNextCard() {
  return (
    <DashboardCard>
      <HStack mb="5" gap="4">
        <Box
          w="46px"
          h="46px"
          borderRadius="12px"
          bg="#FFF6D8"
          color="#D99A00"
          display="grid"
          placeItems="center"
        >
          <FiFlag />
        </Box>

        <Heading fontSize="md">What happens next?</Heading>
      </HStack>

      <Text color="brand.mutedText" fontSize="sm" mb="4">
        After you complete this step, you&apos;ll be able to:
      </Text>

      <VStack align="stretch" gap="3">
        {nextStepItems.map((item, index) => (
          <HStack key={item.text} align="start" gap="4">
            <Text color="brand.mutedText" fontSize="sm" minW="16px">
              {index + 1}.
            </Text>

            <Text fontSize="sm" color="brand.dark">
              {item.text}
            </Text>
          </HStack>
        ))}
      </VStack>
    </DashboardCard>
  );
}