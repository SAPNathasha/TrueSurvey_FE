"use client";

import { Box, Container, Flex } from "@chakra-ui/react";
import SignUpStepThreeForm from "@/components/pages/signup/SignUpStepThreeForm";

import SignUpLeft from "./SignUpLeftSide";

export default function RegisterStepThreePage() {
  return (
    <Box bg="white" minH="100vh" py="20">
      <Container maxW="1200px" mx="auto">
        <Flex gap="10" direction="row" alignItems="center">
          <SignUpLeft
            headindLineOne="Verify to unlock"
            headingLineTwo=""
            colouredText="more surveys"
            textLineOne="This optional step helps you access more surveys"
            textLineTwo="and earn more rewards"
          />

          <SignUpStepThreeForm />
        </Flex>
      </Container>
    </Box>
  );
}
