"use client";

import { Box, Flex, Grid } from "@chakra-ui/react";

import ParticipantSidebar from "@/components/pages/participant/dashboard/ParticipantSidebar";
import BasicDetailsForm from "./BasicDetailsForm";
import CreateSurveyStepper from "../shared/CreateSurveyStepper";
import CreateSurveyRightPanel from "./CreateSurveyRightPanel";
import { useState } from "react";
import type { BasicDetailsFormValues } from "./BasicDetailsForm";
import type { SurveyDraft } from "@/services/creatorSurveyService";

const initialBasicDetailsValues: BasicDetailsFormValues = {
  surveyTitle: "",
  description: "",
  category: "",
  completionDays: "7",
};

export default function CreateSurveyBasicDetails() {
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

  return (
    <Flex minH="100vh" bg="white" color="brand.dark">
      <ParticipantSidebar />

      <Box flex="1" p={{ base: "4", lg: "6" }} overflow="hidden">
        <Box maxW="1500px" mx="auto">
          <CreateSurveyStepper currentStep={1} />

          <Grid
            templateColumns={{ base: "1fr", xl: "1fr 430px" }}
            gap="5"
            mt="5"
            alignItems="start"
          >
            <BasicDetailsForm
              values={basicDetails}
              onChange={setBasicDetails}
              onDraftCreated={handleDraftCreated}
              existingDraftId={createdDraftId}
              onNext={() => {}}
            />
            <CreateSurveyRightPanel />
          </Grid>
        </Box>
      </Box>
    </Flex>
  );
}
