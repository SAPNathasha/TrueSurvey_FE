import { VStack } from "@chakra-ui/react";

import StepProgressCard from "../shared/StepProgressCard";
import MethodTipsCard from "./MethodTipsCard";
import SurveySummaryCard from "./SurveySummaryCard";

export default function SelectMethodRightPanel() {
  return (
    <VStack align="stretch" gap="4">
      <StepProgressCard currentStep={2} totalSteps={6} />
      <MethodTipsCard />
      <SurveySummaryCard />
    </VStack>
  );
}