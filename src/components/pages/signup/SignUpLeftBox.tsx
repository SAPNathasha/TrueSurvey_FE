'use client'
import { useSignupStore } from "@/store/useSignupStore";
import { Box, Heading } from "@chakra-ui/react";
import SignUpLeft from "./SignUpLeftSide";

export default function SignUpLeftBox() {
  const currentStep = useSignupStore(
    (state: { currentStep: unknown }) => state.currentStep,
  );
  return (
    <>
      {currentStep == 1 && (
        <SignUpLeft
          headindLineOne="Join TrueSurvey"
          headingLineTwo=""
          colouredText="in a few simple steps"
          textLineOne="Create your account to participate in surveys,"
          textLineTwo="share your opinions, earn rewards, or build"
          textLineThree="surveys that matter."
        />
      )}
      {currentStep == 2 && (
        <SignUpLeft
          headindLineOne="Choose how you"
          headingLineTwo="want to use"
          colouredText="TrueSurvey"
          textLineOne="Join as a participant, a survey creator, or both."
          textLineTwo="You can always change this later in your settings."
        />
      )}
      {currentStep == 3 && (
        <SignUpLeft
          headindLineOne="Verify to unlock"
          headingLineTwo=""
          colouredText="more surveys"
          textLineOne="This optional step helps you access more surveys"
          textLineTwo="and earn more rewards"
        />
      )}
    </>
  );
}
