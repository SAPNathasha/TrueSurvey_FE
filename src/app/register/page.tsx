"use client";

import { Flex, Container, Box } from "@chakra-ui/react";

import { useSignupStore } from "@/store/useSignupStore";

import RegisterStepOnePage from "@/components/pages/signup/StepOne";
import RegisterStepTwoPage from "@/components/pages/signup/StepTwo";
import RegisterStepThreePage from "@/components/pages/signup/StepThree";

export default function RegisterPage() {
  const currentStep = useSignupStore(
    (state: { currentStep: unknown }) => state.currentStep,
  );

  return (
    <Box bg="white" minH="100vh" py="20">
      <Container maxW="1200px" mx="auto">
        <Flex gap="10" direction="row" alignItems="center">
          {currentStep === 1 && <RegisterStepOnePage />}
          {currentStep === 2 && <RegisterStepTwoPage />}
          {currentStep === 3 && <RegisterStepThreePage />}
        </Flex>
      </Container>
    </Box>
  );
}
