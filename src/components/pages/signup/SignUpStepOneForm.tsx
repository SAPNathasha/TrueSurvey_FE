"use client";

import { SiSpringsecurity } from "react-icons/si";

import {
  Flex,
  Heading,
  Text,
  Icon,
  Box,
  Field,
  Button,
  HStack,
  VStack,
} from "@chakra-ui/react";
import StepItem from "@/components/common/StepItem";
import InputField from "@/components/common/InputField";
import { useSignupStore } from "@/store/useSignupStore";

export default function SignUpStepOneForm() {
  const nextStep = useSignupStore((state) => state.nextStep);
  return (
    <Flex flex="1" alignItems="center" justifyContent="center">
      <Box layerStyle="formCard">
        <VStack gap="6" align="stretch">
          <HStack gap="5">
            <StepItem number={1} label="Step 1 of 3" color="#0015D6" />
            <StepItem number={2} label="Step 2 of 3" color="#9497A6" />
            <StepItem number={3} label="Step 3 of 3" color="#9497A6" />
          </HStack>

          <Heading textStyle="h2" color="black" textAlign="center">
            Create your account
          </Heading>

          <Text textStyle="smallText" textAlign="center">
            Start as a survey creator, participant, or both.
          </Text>

          <Field.Root required width="100%" maxW="360px">
            <InputField title="Username" placeholder="John Doe" type="text" />
            <Field.HelperText textStyle="helperText">
              This will be your public display name.
            </Field.HelperText>
          </Field.Root>

          <Field.Root required width="100%" maxW="360px">
            <InputField
              title="Email"
              placeholder="you@gmail.com"
              type="email"
            />
            <Field.HelperText textStyle="helperText">
              We will send a verification link to this email.
            </Field.HelperText>
          </Field.Root>

          <Field.Root required width="100%" maxW="360px">
            <InputField
              title="Password"
              placeholder="********"
              type="password"
            />
            <Field.HelperText textStyle="helperText">
              Use at least 8 characters with a mix of letters, numbers and
              symbols.
            </Field.HelperText>
          </Field.Root>

          <Button width="100%" maxW="360px" variant="solid" onClick={nextStep}>
            Next
          </Button>

          <Text textStyle="smallText" textAlign="center" maxW="360px">
            Already have an account?{" "}
            <Text as="span" textStyle="link">
              Sign in
            </Text>
          </Text>

          <Flex pt="2" gap="4" justify="center" alignItems="flex-start">
            <Flex
              bg="brand.mutedText"
              w="40px"
              h="40px"
              minW="40px"
              borderRadius="pill"
              alignItems="center"
              justifyContent="center"
            >
              <Icon size="md" color="white">
                <SiSpringsecurity />
              </Icon>
            </Flex>

            <Text textStyle="smallText" textAlign="left" maxW="300px">
              Next, you will choose your role(s) and can optionally verify your
              identity to unlock more features.
            </Text>
          </Flex>
        </VStack>
      </Box>
    </Flex>
  );
}
