import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import { FiCheck } from "react-icons/fi";

import { surveySteps } from "./createSurveySteps";

type CreateSurveyStepperProps = {
  currentStep: number;
};

export default function CreateSurveyStepper({
  currentStep,
}: CreateSurveyStepperProps) {
  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="brand.border"
      borderRadius="card"
      px={{ base: "4", lg: "7" }}
      py="5"
      boxShadow="softCard"
      overflowX="auto"
    >
      <Flex minW="980px" align="center">
        {surveySteps.map((step, index) => {
          const active = step.number === currentStep;
          const completed = step.number < currentStep;

          return (
            <HStack key={step.number} flex="1" gap="4">
              <HStack
                gap="3"
                color={
                  active || completed ? "brand.primary" : "brand.mutedText"
                }
                fontWeight={active ? "bold" : "medium"}
              >
                <Box
                  w="34px"
                  h="34px"
                  borderRadius="full"
                  display="grid"
                  placeItems="center"
                  bg={active || completed ? "brand.primary" : "gray.500"}
                  color="white"
                  fontWeight="bold"
                  fontSize="sm"
                >
                  {completed ? <FiCheck /> : step.number}
                </Box>

                <Text fontSize="sm" whiteSpace="nowrap">
                  {step.label}
                </Text>
              </HStack>

              {index !== surveySteps.length - 1 && (
                <Box
                  flex="1"
                  h="1px"
                  borderTopWidth="1px"
                  borderStyle="dashed"
                  borderColor="brand.border"
                />
              )}
            </HStack>
          );
        })}
      </Flex>

      <Box
        mt="3"
        ml={`${(currentStep - 1) * 16.6}%`}
        h="3px"
        w={{ base: "120px", lg: "150px" }}
        bg="brand.primary"
        borderRadius="pill"
      />
    </Box>
  );
}