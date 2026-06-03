"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/common/InputField";
import NextLink from "next/link";
import {
  Flex,
  Heading,
  Text,
  Image,
  Box,
  Checkbox,
  Button,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { loginUser } from "@/services/authService";
import { setStoredAccessToken } from "@/lib/axios";

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

const initialValues: LoginFormValues = {
  email: "",
  password: "",
  rememberMe: false,
};

const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  rememberMe: Yup.boolean(),
});

function getStringField(source: unknown, keys: string[]) {
  if (!source || typeof source !== "object") {
    return null;
  }

  const record = source as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return null;
}

function getLoginUser(data: unknown) {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;

  if (record.user && typeof record.user === "object") {
    return record.user;
  }

  if (record.participant && typeof record.participant === "object") {
    return record.participant;
  }

  return record;
}

export default function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const handleLogin = async (values: LoginFormValues) => {
    try {
      setServerError("");

      const data = await loginUser({
        email: values.email,
        password: values.password,
      });

      console.log("Login success:", data);

      const token = data.accessToken || data.access_token || data.token;

      if (!token) {
        throw new Error("Login successful, but token was not returned");
      }

      setStoredAccessToken(token);

      const loginUserData = getLoginUser(data);
      const participantId = getStringField(loginUserData, [
        "participantId",
        "userId",
        "id",
        "sub",
      ]);
      const role = getStringField(loginUserData, ["role"]);

      if (participantId) {
        window.localStorage.setItem("participantId", participantId);
        window.localStorage.setItem("userId", participantId);
      }

      if (role) {
        window.localStorage.setItem("userRole", role);
      }

      if (loginUserData) {
        window.localStorage.setItem("user", JSON.stringify(loginUserData));
      }

      router.push(
        role === "CREATOR" ? "/creator/dashboard" : "/participant/dashboard"
      );
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError("Login failed");
      }
    }
  };

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

        <Formik
          initialValues={initialValues}
          validationSchema={loginValidationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form style={{ width: "100%" }}>
              <Flex direction="column" alignItems="center" gap="4">
                <InputField
                  name="email"
                  title="Email"
                  placeholder="Enter your email"
                  type="email"
                />

                <InputField
                  name="password"
                  title="Password"
                  placeholder="Enter your password"
                  type="password"
                />

                {serverError && (
                  <Text color="red.500" fontSize="sm" maxW="360px">
                    {serverError}
                  </Text>
                )}

                <Flex
                  width="100%"
                  maxW="360px"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Checkbox.Root
                    checked={values.rememberMe}
                    onCheckedChange={(details) =>
                      setFieldValue("rememberMe", Boolean(details.checked))
                    }
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label textStyle="smallText">
                      Remember me
                    </Checkbox.Label>
                  </Checkbox.Root>

                  <ChakraLink
                    asChild
                    color="#344CB7"
                    fontSize="sm"
                    fontWeight="semibold"
                    _hover={{ textDecoration: "underline" }}
                  >
                    <NextLink href="/forgot-password">
                      Forgot password?
                    </NextLink>
                  </ChakraLink>
                </Flex>

                <Button
                  width="100%"
                  maxW="360px"
                  variant="solid"
                  type="submit"
                  loading={isSubmitting}
                >
                  Login
                </Button>

                <Button
                  width="100%"
                  maxW="360px"
                  variant="outline"
                  type="button"
                  asChild
                >
                  <NextLink href="/register">Create an account</NextLink>
                </Button>

                <Text textStyle="smallText" textAlign="center" maxW="360px">
                  TrueSurvey is for both survey creators and participants. By
                  signing in, you agree to our Terms of Service and Privacy
                  Policy.
                </Text>
              </Flex>
            </Form>
          )}
        </Formik>
      </Box>
    </Flex>
  );
}
