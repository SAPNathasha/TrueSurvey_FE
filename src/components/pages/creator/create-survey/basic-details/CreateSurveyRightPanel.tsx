import { VStack } from "@chakra-ui/react";

import StepProgressCard from "../shared/StepProgressCard";
import SetupTipsCard from "./SetupTipsCard";
import WhatNextCard from "./WhatNextCard";

export default function CreateSurveyRightPanel() {
  return (
    <VStack align="stretch" gap="4">
      <StepProgressCard currentStep={1} totalSteps={6} />
      <SetupTipsCard />
      <WhatNextCard />
    </VStack>
  );
}