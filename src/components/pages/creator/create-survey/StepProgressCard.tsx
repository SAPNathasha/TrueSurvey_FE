import { Box, HStack, Text } from "@chakra-ui/react";

import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";

type StepProgressCardProps = {
  currentStep: number;
  totalSteps: number;
};

export default function StepProgressCard({
  currentStep,
  totalSteps,
}: StepProgressCardProps) {
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <DashboardCard>
      <HStack justify="space-between" mb="4">
        <Text fontWeight="bold">Step Progress</Text>
        <Text fontSize="sm" color="brand.dark">
          Step {currentStep} of {totalSteps}
        </Text>
      </HStack>

      <HStack gap="4">
        <Box flex="1" h="6px" bg="gray.subtle" borderRadius="pill">
          <Box
            h="full"
            w={`${progress}%`}
            bg="brand.primary"
            borderRadius="pill"
          />
        </Box>

        <Text textStyle="smallText">{progress}%</Text>
      </HStack>
    </DashboardCard>
  );
}