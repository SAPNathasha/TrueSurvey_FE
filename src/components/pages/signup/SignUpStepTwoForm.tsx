"use client";

import { RiErrorWarningFill } from "react-icons/ri";
import {
  Flex,
  Heading,
  Text,
  Icon,
  Box,
  Button,
  Stack,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useFormikContext } from "formik";

import StepItem from "@/components/common/StepItem";
import { useSignupStore } from "@/store/useSignupStore";
import RoleCheckboxes from "./RoleCheckBoxCard";

interface SignupFormValues {
  role: string;
}
type SignUpStepTwoFormProps = {
  onNext: () => Promise<void>;
};

export default function SignUpStepTwoForm({ onNext }: SignUpStepTwoFormProps) {
  const prevStep = useSignupStore((state) => state.prevStep);

  const { values, errors, touched, setFieldValue } =
    useFormikContext<SignupFormValues>();

  return (
    <Flex justify="center">
      <Box layerStyle="formCard">
        <VStack gap="6" align="stretch">
          <HStack gap="5">
            <StepItem number={1} label="Step 1 of 3" color="#9497A6" />
            <StepItem number={2} label="Step 2 of 3" color="#0015D6" />
            <StepItem number={3} label="Step 3 of 3" color="#9497A6" />
          </HStack>

          <Heading textStyle="h2" color="black" textAlign="center">
            Select your role
          </Heading>

          <Text textStyle="smallText" textAlign="center" maxW="360px">
            Choose the option that best describes how you want to use the
            platform.
          </Text>

          <Stack w="full" maxW="366px" gap="15px">
            <RoleCheckboxes
              label="Participant"
              description="Take part and earn money"
              value="participant"
              selectedValue={values.role}
              onSelect={(value) => setFieldValue("role", value)}
            />

            <RoleCheckboxes
              label="Survey creator"
              description="Create and manage surveys"
              value="surveyCreator"
              selectedValue={values.role}
              onSelect={(value) => setFieldValue("role", value)}
            />

            <RoleCheckboxes
              label="Both"
              description="Participate and create surveys"
              value="both"
              selectedValue={values.role}
              onSelect={(value) => setFieldValue("role", value)}
            />

            {touched.role && errors.role && (
              <Text color="red.500" fontSize="sm">
                {errors.role}
              </Text>
            )}
          </Stack>

          <Flex pt="20px" gap="4" justify="center" direction="row">
            <Icon size="md" color="brand.warning">
              <RiErrorWarningFill />
            </Icon>

            <Text textStyle="smallText" textAlign="left" maxW="360px">
              If you choose Participant or Both, the next step lets you
              optionally verify your identity.
            </Text>
          </Flex>

          <Flex w="full" gap="4" direction="row">
            <Button flex="1" variant="outline" onClick={prevStep}>
              Back
            </Button>

            <Button flex="1" variant="solid" onClick={onNext}>
              Next
            </Button>
          </Flex>

          <Text textStyle="smallText" textAlign="center" maxW="360px">
            Already have an account?{" "}
            <Text as="span" textStyle="link">
              Sign in
            </Text>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
}
