"use client";

import { Box, Flex, Grid } from "@chakra-ui/react";
import { useState } from "react";

import Sidebar from "@/components/pages/creator/dashboard/Sidebar";
import CreateSurveyStepper from "./shared/CreateSurveyStepper";

import BasicDetailsForm, {
  type BasicDetailsFormValues,
} from "./basic-details/BasicDetailsForm";
import BasicDetailsRightPanel from "./basic-details/CreateSurveyRightPanel";

import SelectMethodStep from "./select-method/SelectMethodStep";
import SelectMethodRightPanel from "./select-method/SelectMethodRightPanel";

import CreateQuestionsAIStep from "./create-questions-ai/CreateQuestionsAIStep";
import CreateQuestionsAIRightPanel from "./create-questions-ai/CreateQuestionsAIRightPanel";

import CreateQuestionsManualStep from "./create-questions-manual/CreateQuestionsManualStep";
import CreateQuestionsManualRightPanel from "./create-questions-manual/CreateQuestionsManualRightPanel";

import TargetAudienceStep from "./target-audience/TargetAudienceStep";
import TargetAudienceRightPanel from "./target-audience/TargetAudienceRightPanel";

import SampleBudgetStep from "./sample-budget/SampleBudgetStep";
import SampleBudgetRightPanel from "./sample-budget/SampleBudgetRightPanel";

import PreviewSubmitStep from "./preview-submit/PreviewSubmitStep";
import PreviewSubmitRightPanel from "./preview-submit/PreviewSubmitRightPanel";

import type { SurveyMethodId } from "./select-method/selectMethodTypes";
import type { SurveyDraft } from "@/services/creatorSurveyService";

const initialBasicDetailsValues: BasicDetailsFormValues = {
  surveyTitle: "",
  description: "",
  category: "",
  completionDays: "7",
};

export default function CreateSurvey() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState<SurveyMethodId>("ai");
  const [basicDetails, setBasicDetails] = useState<BasicDetailsFormValues>(
    initialBasicDetailsValues
  );
  const [createdDraftId, setCreatedDraftId] = useState<string | null>(null);

  const handleDraftCreated = (survey: SurveyDraft) => {
    setCreatedDraftId(survey.id);

    if (typeof window !== "undefined") {
      window.localStorage.setItem("creatorSurveyDraftId", survey.id);
      window.localStorage.setItem("creatorSurveyDraft", JSON.stringify(survey));
    }
  };

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <BasicDetailsForm
          values={basicDetails}
          onChange={setBasicDetails}
          onDraftCreated={handleDraftCreated}
          existingDraftId={createdDraftId}
          onNext={() => setCurrentStep(2)}
        />
      );
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

    if (currentStep === 3 && selectedMethod === "ai") {
      return (
        <CreateQuestionsAIStep
          onBack={() => setCurrentStep(2)}
          onNext={() => setCurrentStep(4)}
        />
      );
    }

    if (currentStep === 3 && selectedMethod === "manual") {
      return (
        <CreateQuestionsManualStep
          onBack={() => setCurrentStep(2)}
          onNext={() => setCurrentStep(4)}
        />
      );
    }

    if (currentStep === 4) {
      return (
        <TargetAudienceStep
          onBack={() => setCurrentStep(3)}
          onNext={() => setCurrentStep(5)}
        />
      );
    }

    if (currentStep === 5) {
      return (
        <SampleBudgetStep
          onBack={() => setCurrentStep(4)}
          onNext={() => setCurrentStep(6)}
        />
      );
    }

    if (currentStep === 6) {
      return <PreviewSubmitStep onBack={() => setCurrentStep(5)} />;
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

    if (currentStep === 3 && selectedMethod === "ai") {
      return <CreateQuestionsAIRightPanel />;
    }

    if (currentStep === 3 && selectedMethod === "manual") {
      return <CreateQuestionsManualRightPanel />;
    }

    if (currentStep === 4) {
      return <TargetAudienceRightPanel selectedMethod={selectedMethod} />;
    }

    if (currentStep === 5) {
      return <SampleBudgetRightPanel selectedMethod={selectedMethod} />;
    }

    if (currentStep === 6) {
      return <PreviewSubmitRightPanel selectedMethod={selectedMethod} />;
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
