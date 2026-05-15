"use client";

import InputField from "@/components/common/InputField";
import {
  Flex,
  Heading,
  Text,
  Image,
  Box,
  Checkbox,
  Button,
} from "@chakra-ui/react";

export default function LoginForm() {
  return (
    <Flex flex="1" alignItems="center" justifyContent="center">
      <Box layerStyle="formCard">
        <Image height="50px" src="/Logo.png" alt="TrueSurvey logo" />

        <Heading textStyle="h2" color="black" textAlign="center">
          Login
        </Heading>

        <Text textStyle="smallText" textAlign="center">
          Access your creator or participant account
        </Text>

        <InputField title="Email" placeholder="you@gmail.com" type="email" />
        <InputField title="Password" placeholder="********" type="password" />

        <Flex
          width="100%"
          maxW="360px"
          alignItems="center"
          justifyContent="space-between"
        >
          <Checkbox.Root>
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label textStyle="smallText">Remember me</Checkbox.Label>
          </Checkbox.Root>

          <Text textStyle="link">Forgot password?</Text>
        </Flex>

        <Button width="100%" maxW="360px" variant="solid">
          Login
        </Button>

        <Button width="100%" maxW="360px" variant="outline">
          Create an account
        </Button>

        <Text textStyle="smallText" textAlign="center" maxW="360px">
          TrueSurvey is for both survey creators and participants. By signing
          in, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </Box>
    </Flex>
  );
}
