"use client";

import { Box, Flex, Grid } from "@chakra-ui/react";
import { useState } from "react";

import Sidebar from "@/components/pages/creator/dashboard/Sidebar";
import CreateSurveyStepper from "./shared/CreateSurveyStepper";

import BasicDetailsForm from "./basic-details/BasicDetailsForm";
import BasicDetailsRightPanel from "./basic-details/CreateSurveyRightPanel";

import SelectMethodStep from "./select-method/SelectMethodStep";
import SelectMethodRightPanel from "./select-method/SelectMethodRightPanel";

import type { SurveyMethodId } from "./select-method/selectMethodTypes";

export default function CreateSurvey() {
  const [currentStep, setCurrentStep] = useState(3);
  const [selectedMethod, setSelectedMethod] = useState<SurveyMethodId>("ai");

  const renderStepContent = () => {
    if (currentStep === 1) {
      return <BasicDetailsForm onNext={() => setCurrentStep(2)} />;
    }

    if (currentStep === 2) {
      return (
        <SelectMethodStep
          selectedMethod={selectedMethod}
          onMethodChange={setSelectedMethod}
          onBack={() => setCurrentStep(1)}
          onNext={() => setCurrentStep(3)}
        />
      );
    }

    return null;
  };

  const renderRightPanel = () => {
    if (currentStep === 1) {
      return <BasicDetailsRightPanel />;
    }

    if (currentStep === 2) {
      return <SelectMethodRightPanel />;
    }

    return null;
  };

  return (
    <Flex minH="100vh" bg="white" color="brand.dark">
      <Sidebar />

      <Box flex="1" p={{ base: "4", lg: "6" }} overflow="hidden">
        <Box maxW="1500px" mx="auto">
          <CreateSurveyStepper currentStep={currentStep} />

          <Grid
            templateColumns={{ base: "1fr", xl: "1fr 430px" }}
            gap="5"
            mt="5"
            alignItems="start"
          >
            {renderStepContent()}

            {renderRightPanel()}
          </Grid>
        </Box>
      </Box>
    </Flex>
  );
}