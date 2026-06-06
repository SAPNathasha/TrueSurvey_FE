"use client";

import { Box, Flex, Grid } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import Sidebar from "@/components/pages/creator/dashboard/Sidebar";
import CreateSurveyStepper from "./shared/CreateSurveyStepper";
import { getStoredCreatorId } from "@/lib/creatorIdentity";
import { toaster } from "@/components/ui/toaster";

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
import {
  selectSurveyMethod,
  type SurveyCreationMethod,
  type SurveyDraft,
} from "@/services/creatorSurveyService";

const initialBasicDetailsValues: BasicDetailsFormValues = {
  surveyTitle: "",
  description: "",
  category: "",
  completionDays: "7",
};
const creatorWizardStepKey = "creatorCurrentStep";

function getStepFromSurveyCreationStep(currentStep?: string | null) {
  if (currentStep === "SELECT_METHOD") {
    return 2;
  }

  if (currentStep === "CREATE_QUESTIONS") {
    return 3;
  }

  if (currentStep === "TARGET_AUDIENCE") {
    return 4;
  }

  if (currentStep === "SAMPLE_BUDGET") {
    return 5;
  }

  if (currentStep === "PREVIEW_SUBMIT" || currentStep === "COMPLETED") {
    return 6;
  }

  return 1;
}

function getStoredDraft() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedDraft = window.localStorage.getItem("creatorSurveyDraft");

  if (!storedDraft) {
    return null;
  }

  try {
    return JSON.parse(storedDraft) as SurveyDraft;
  } catch {
    return null;
  }
}

function getStoredWizardStep() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedStep = window.localStorage.getItem(creatorWizardStepKey);
  const parsedStep = storedStep ? Number(storedStep) : NaN;

  if (!Number.isInteger(parsedStep) || parsedStep < 1 || parsedStep > 6) {
    return null;
  }

  return parsedStep;
}

type CreateSurveyProps = {
  resumeDraft?: boolean;
};

function clearStoredDraftState() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem("creatorSurveyDraftId");
  window.localStorage.removeItem("creatorSurveyDraft");
  window.localStorage.removeItem(creatorWizardStepKey);
}

export default function CreateSurvey({
  resumeDraft = false,
}: CreateSurveyProps) {
  const creatorId = getStoredCreatorId();
  const initialDraft = resumeDraft ? getStoredDraft() : null;
  const storedWizardStep = resumeDraft ? getStoredWizardStep() : null;
  const [currentStep, setCurrentStep] = useState(() =>
    Math.max(
      getStepFromSurveyCreationStep(initialDraft?.currentStep),
      storedWizardStep ?? 1
    )
  );
  const [selectedMethod, setSelectedMethod] = useState<SurveyMethodId>(() => {
    if (initialDraft?.creationMethod === "MANUAL") {
      return "manual";
    }

    return "ai";
  });
  const [basicDetails, setBasicDetails] = useState<BasicDetailsFormValues>(
    () =>
      initialDraft
        ? {
            surveyTitle: initialDraft.title || "",
            description: initialDraft.description || "",
            category: initialDraft.category || "",
            completionDays: initialDraft.estimatedCompletionDays
              ? String(initialDraft.estimatedCompletionDays)
              : "7",
          }
        : initialBasicDetailsValues
  );
  const [createdDraftId, setCreatedDraftId] = useState<string | null>(
    initialDraft?.id || null
  );
  const [isSavingMethod, setIsSavingMethod] = useState(false);

  useEffect(() => {
    if (!resumeDraft) {
      clearStoredDraftState();
    }
  }, [resumeDraft]);

  const goToStep = (step: number) => {
    setCurrentStep(step);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(creatorWizardStepKey, String(step));
    }
  };

  const handleDraftCreated = (survey: SurveyDraft) => {
    setCreatedDraftId(survey.id);
    goToStep(1);

    if (typeof window !== "undefined") {
      window.localStorage.setItem("creatorSurveyDraftId", survey.id);
      window.localStorage.setItem("creatorSurveyDraft", JSON.stringify(survey));
    }
  };

  const persistDraft = (survey: SurveyDraft) => {
    setCreatedDraftId(survey.id);

    if (typeof window !== "undefined") {
      window.localStorage.setItem("creatorSurveyDraftId", survey.id);
      window.localStorage.setItem("creatorSurveyDraft", JSON.stringify(survey));
    }
  };

  const toCreationMethod = (
    method: SurveyMethodId
  ): SurveyCreationMethod => {
    return method === "manual" ? "MANUAL" : "AI_ASSISTED";
  };

  const submitMethodSelection = async (advanceToNextStep: boolean) => {
    if (!creatorId) {
      toaster.create({
        type: "error",
        title: "Creator not found",
        description: "Please log in again to continue creating your survey.",
      });
      return;
    }

    if (!createdDraftId) {
      toaster.create({
        type: "error",
        title: "Save basic details first",
        description: "Create the survey draft before selecting a method.",
      });
      return;
    }

    try {
      setIsSavingMethod(true);
      const response = await selectSurveyMethod({
        creatorId,
        surveyId: createdDraftId,
        creationMethod: toCreationMethod(selectedMethod),
      });

      persistDraft(response.survey);

      toaster.create({
        type: "success",
        title: advanceToNextStep ? "Method saved" : "Draft updated",
        description: response.message,
      });

      if (advanceToNextStep) {
        goToStep(3);
      }
    } catch (error) {
      toaster.create({
        type: "error",
        title: "Could not save survey method",
        description:
          error instanceof Error
            ? error.message
            : "Please try again in a moment.",
      });
    } finally {
      setIsSavingMethod(false);
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
          onNext={() => goToStep(2)}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <SelectMethodStep
          selectedMethod={selectedMethod}
          onMethodChange={setSelectedMethod}
          onBack={() => goToStep(1)}
          onSaveDraft={() => submitMethodSelection(false)}
          onNext={() => submitMethodSelection(true)}
          isSubmitting={isSavingMethod}
        />
      );
    }

    if (currentStep === 3 && selectedMethod === "ai") {
      return (
        <CreateQuestionsAIStep
          onBack={() => goToStep(2)}
          onNext={() => goToStep(4)}
        />
      );
    }

    if (currentStep === 3 && selectedMethod === "manual") {
      return (
        <CreateQuestionsManualStep
          onBack={() => goToStep(2)}
          onNext={() => goToStep(4)}
        />
      );
    }

    if (currentStep === 4) {
      return (
        <TargetAudienceStep
          onBack={() => goToStep(3)}
          onNext={() => goToStep(5)}
        />
      );
    }

    if (currentStep === 5) {
      return (
        <SampleBudgetStep
          onBack={() => goToStep(4)}
          onNext={() => goToStep(6)}
        />
      );
    }

    if (currentStep === 6) {
      return <PreviewSubmitStep onBack={() => goToStep(5)} />;
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
