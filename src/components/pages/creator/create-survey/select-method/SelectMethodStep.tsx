"use client";

import { Box, Button, Grid, HStack, Text } from "@chakra-ui/react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiFileText,
  FiInfo,
  FiShield,
} from "react-icons/fi";

import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";
import MethodOptionCard from "./MethodOptionCard";
import { surveyMethods } from "./selectMethodData";
import type { SurveyMethodId } from "./selectMethodTypes";

type SelectMethodStepProps = {
  selectedMethod: SurveyMethodId;
  onMethodChange: (method: SurveyMethodId) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function SelectMethodStep({
  selectedMethod,
  onMethodChange,
  onBack,
  onNext,
}: SelectMethodStepProps) {
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
            Choose a survey creation method. Both options allow you to review,
            edit, add, and refine questions and answers before submitting the
            survey.
          </Text>
        </HStack>
      </Box>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="5">
        {surveyMethods.map((method) => (
          <MethodOptionCard
            key={method.id}
            method={method}
            selected={selectedMethod === method.id}
            onSelect={() => onMethodChange(method.id)}
          />
        ))}
      </Grid>

      <Box
        bg="brand.lightBlue"
        borderWidth="1px"
        borderColor="#D7E3FF"
        borderRadius="12px"
        px="5"
        py="4"
        mt="5"
      >
        <HStack gap="3" align="start">
          <Box color="brand.primary" pt="1">
            <FiShield />
          </Box>

          <Text fontSize="sm" color="brand.mutedText">
            Both methods continue to the question-building stage and support
            full editing before you preview and submit your survey.
          </Text>
        </HStack>
      </Box>

      <DashboardCard mt="5" p="0">
        <Box px={{ base: "5", lg: "7" }} py="5">
          <HStack justify="space-between" flexWrap="wrap" gap="4">
            <Button variant="outline" onClick={onBack} py={3} px={5}>
              <FiArrowLeft />
              Back to Basic Details
            </Button>

            <HStack gap="4" flexWrap="wrap" >
              <Button variant="outline" py={3} px={5}>
                <FiFileText />
                Save as Draft
              </Button>

              <Button onClick={onNext} py={3} px={5}>
                Continue <FiArrowRight />
              </Button>
            </HStack>
          </HStack>
        </Box>
      </DashboardCard>
    </Box>
  );
}