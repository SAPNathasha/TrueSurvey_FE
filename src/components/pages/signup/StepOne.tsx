"use client";

import { Flex, Container, Box } from "@chakra-ui/react";
import SignUpStepOneForm from "@/components/pages/signup/SignUpStepOneForm";
import SignUpLeft from "./SignUpLeftSide";

export default function RegisterStepOnePage() {
  return (
    <Box bg="white" minH="100vh" py="20">
      <Container maxW="1200px" mx="auto">
        <Flex gap="10" direction="row" alignItems="center">
          <SignUpLeft
            headindLineOne="Join TrueSurvey"
            headingLineTwo=""
            colouredText="in a few simple steps"
            textLineOne="Create your account to participate in surveys,"
            textLineTwo="share your opinions, earn rewards, or build"
            textLineThree="surveys that matter."
          />

          <SignUpStepOneForm />
        </Flex>
      </Container>
    </Box>
  );
}
