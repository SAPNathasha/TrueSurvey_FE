"use client";

import { Flex, Container, Box } from "@chakra-ui/react";
import SignUpStepTwoForm from "@/components/pages/signup/SignUpStepTwoForm";
import SignUpLeft from "./SignUpLeftSide";

export default function RegisterStepTwoPage() {
  return (
    <Box bg="white" minH="100vh" py="20">
      <Container maxW="1200px" mx="auto">
        <Flex gap="10" direction="row" alignItems="center">
          <SignUpLeft
            headindLineOne="Choose how you"
            headingLineTwo="want to use"
            colouredText="TrueSurvey"
            textLineOne="Join as a participant, a survey creator, or both."
            textLineTwo="You can always change this later in your settings."
          />

          <SignUpStepTwoForm onNext={function (): Promise<void> {
            throw new Error("Function not implemented.");
          } } />
        </Flex>
      </Container>
    </Box>
  );
}
