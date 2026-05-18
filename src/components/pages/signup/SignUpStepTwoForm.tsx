"use client";

import { IoPeople, IoPerson } from "react-icons/io5";
import { RiErrorWarningFill } from "react-icons/ri";

import {
  Flex,
  Heading,
  Text,
  Icon,
  Box,
  CheckboxCard,
  Button,
  Stack,
  HStack,
  VStack,
} from "@chakra-ui/react";
import StepItem from "@/components/common/StepItem";
import { useSignupStore } from "@/store/useSignupStore";

export default function SignUpStepTwoForm() {
  const nextStep = useSignupStore((state) => state.nextStep);
  const prevStep = useSignupStore((state) => state.prevStep);
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
            <CheckboxCard.Root value="participant" w="full">
              <CheckboxCard.HiddenInput />

              <CheckboxCard.Control
                display="flex"
                alignItems="center"
                gap="12px"
                px="20px"
                py="10px"
                h="64px"
                borderWidth="1px"
                borderColor="brand.border"
                borderRadius="input"
                bg="white"
                cursor="pointer"
                transition="all 0.2s ease"
                _hover={{
                  bg: "brand.cardHover",
                  borderColor: "brand.primary",
                }}
                _checked={{
                  bg: "brand.cardSelected",
                  borderColor: "brand.primary",
                }}
              >
                <Flex
                  bg="brand.lightBlue"
                  w="38px"
                  h="38px"
                  minW="38px"
                  borderRadius="md"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon size="sm" color="brand.primary">
                    <IoPerson />
                  </Icon>
                </Flex>

                <CheckboxCard.Content flex="1">
                  <CheckboxCard.Label textStyle="roleTitle">
                    Participant
                  </CheckboxCard.Label>

                  <CheckboxCard.Description textStyle="helperText" mt="3px">
                    Fill surveys and earn rewards.
                  </CheckboxCard.Description>
                </CheckboxCard.Content>

                <CheckboxCard.Indicator />
              </CheckboxCard.Control>
            </CheckboxCard.Root>

            <CheckboxCard.Root value="creator" w="full">
              <CheckboxCard.HiddenInput />

              <CheckboxCard.Control
                display="flex"
                alignItems="center"
                gap="12px"
                px="20px"
                py="10px"
                h="64px"
                borderWidth="1px"
                borderColor="brand.border"
                borderRadius="input"
                bg="white"
                cursor="pointer"
                transition="all 0.2s ease"
                _hover={{
                  bg: "brand.cardHover",
                  borderColor: "brand.primary",
                }}
                _checked={{
                  bg: "brand.cardSelected",
                  borderColor: "brand.primary",
                }}
              >
                <Flex
                  bg="brand.lightBlue"
                  w="38px"
                  h="38px"
                  minW="38px"
                  borderRadius="md"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon size="sm" color="brand.primary">
                    <IoPerson />
                  </Icon>
                </Flex>

                <CheckboxCard.Content flex="1">
                  <CheckboxCard.Label textStyle="roleTitle">
                    Survey Creator
                  </CheckboxCard.Label>

                  <CheckboxCard.Description textStyle="helperText" mt="3px">
                    Create surveys and collect responses.
                  </CheckboxCard.Description>
                </CheckboxCard.Content>

                <CheckboxCard.Indicator />
              </CheckboxCard.Control>
            </CheckboxCard.Root>

            <CheckboxCard.Root value="both" w="full">
              <CheckboxCard.HiddenInput />

              <CheckboxCard.Control
                display="flex"
                alignItems="center"
                gap="12px"
                px="20px"
                py="10px"
                h="70px"
                borderWidth="1px"
                borderColor="brand.border"
                borderRadius="input"
                bg="white"
                cursor="pointer"
                transition="all 0.2s ease"
                _hover={{
                  bg: "brand.cardHover",
                  borderColor: "brand.primary",
                }}
                _checked={{
                  bg: "brand.cardSelected",
                  borderColor: "brand.primary",
                }}
              >
                <Flex
                  bg="brand.lightBlue"
                  w="38px"
                  h="38px"
                  minW="38px"
                  borderRadius="md"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon size="sm" color="brand.primary">
                    <IoPeople />
                  </Icon>
                </Flex>

                <CheckboxCard.Content flex="1">
                  <CheckboxCard.Label textStyle="roleTitle">
                    Both
                  </CheckboxCard.Label>

                  <CheckboxCard.Description textStyle="helperText" mt="3px">
                    Create surveys and participate in surveys.
                  </CheckboxCard.Description>
                </CheckboxCard.Content>

                <CheckboxCard.Indicator />
              </CheckboxCard.Control>
            </CheckboxCard.Root>
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

            <Button flex="1" variant="solid" onClick={nextStep}>
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
