"use client";

import { Box, Flex, Grid } from "@chakra-ui/react";

import Sidebar from "@/components/pages/creator/dashboard/Sidebar";
import BasicDetailsForm from "./BasicDetailsForm";
import CreateSurveyStepper from "../shared/CreateSurveyStepper";
import CreateSurveyRightPanel from "./CreateSurveyRightPanel";

export default function CreateSurveyBasicDetails() {
  return (
    <Flex minH="100vh" bg="white" color="brand.dark">
      <Sidebar />

      <Box flex="1" p={{ base: "4", lg: "6" }} overflow="hidden">
        <Box maxW="1500px" mx="auto">
          <CreateSurveyStepper currentStep={1} />

          <Grid
            templateColumns={{ base: "1fr", xl: "1fr 430px" }}
            gap="5"
            mt="5"
            alignItems="start"
          >
            <BasicDetailsForm />
            <CreateSurveyRightPanel />
          </Grid>
        </Box>
      </Box>
    </Flex>
  );
}
