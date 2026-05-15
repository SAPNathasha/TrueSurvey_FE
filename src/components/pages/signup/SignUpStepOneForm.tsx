"use client";

import { SiSpringsecurity } from "react-icons/si";

import {
  Flex,
  Heading,
  Text,
  Icon,
  Box,
  Field,
  Input,
  Button,
} from "@chakra-ui/react";

export default function SignUpStepOneForm() {
  return (
    <Flex flex="1" alignItems="center" justifyContent="center">
      <Box layerStyle="formCard">
        <Flex width="100%" maxW="360px" gap="12" justify="center">
          <Text textStyle="stepText">Step 1</Text>
          <Text textStyle="smallText">Step 2</Text>
          <Text textStyle="smallText">Step 3</Text>
        </Flex>
        <Heading textStyle="h2" color="black" textAlign="center">
          Create your account
        </Heading>

        <Text textStyle="smallText" textAlign="center">
          Start as a survey creator, participant, or both.
        </Text>

        <Field.Root required width="100%" maxW="360px">
          <Field.Label textStyle="label">
            Username <Field.RequiredIndicator />
          </Field.Label>

          <Input
            color="black"
            px="5"
            borderRadius="input"
            borderColor="gray.border"
            bg="gray.inputBg"
            placeholder="Choose a username"
            value=""
            onChange={() => {}}
          />

          <Field.HelperText textStyle="helperText">
            This will be your public display name.
          </Field.HelperText>
        </Field.Root>

        <Field.Root required width="100%" maxW="360px">
          <Field.Label textStyle="label">
            Email <Field.RequiredIndicator />
          </Field.Label>

          <Input
            color="black"
            px="5"
            borderRadius="input"
            borderColor="gray.border"
            bg="gray.inputBg"
            placeholder="you@example.com"
            value=""
            onChange={() => {}}
          />

          <Field.HelperText textStyle="helperText">
            We will send a verification link to this email.
          </Field.HelperText>
        </Field.Root>

        <Field.Root required width="100%" maxW="360px">
          <Field.Label textStyle="label">
            Password <Field.RequiredIndicator />
          </Field.Label>

          <Input
            color="black"
            px="5"
            borderRadius="input"
            borderColor="gray.border"
            bg="gray.inputBg"
            type="password"
            placeholder="********"
            value=""
            onChange={() => {}}
          />

          <Field.HelperText textStyle="helperText">
            Use at least 8 characters with a mix of letters, numbers and
            symbols.
          </Field.HelperText>
        </Field.Root>

        <Button width="100%" maxW="360px" variant="solid" onClick={() => {}}>
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
      </Box>
    </Flex>
  );
}
