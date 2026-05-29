"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MdArrowBack, MdLockReset } from "react-icons/md";
import NextLink from "next/link";
import { Link as ChakraLink } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";

import {
  Box,
  Button,
  Field,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { resetPassword } from "@/services/authService";

interface ResetPasswordValues {
  newPassword: string;
}

const resetPasswordSchema = Yup.object({
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
});

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const formik = useFormik<ResetPasswordValues>({
    initialValues: {
      newPassword: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values, actions) => {
      try {
        setServerError("");

        if (!token) {
          setServerError("Reset token is missing or invalid");
          return;
        }

        await resetPassword({
          token,
          newPassword: values.newPassword,
        });

        setIsSubmitted(true);
      } catch (error) {
        if (error instanceof Error) {
          setServerError(error.message);
        } else {
          setServerError("Failed to reset password");
        }
      } finally {
        actions.setSubmitting(false);
      }
    },
  });

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="#F7F9FC"
      px={{ base: "4", md: "8" }}
    >
      <Box
        w="full"
        maxW="460px"
        bg="white"
        rounded="2xl"
        shadow="lg"
        px={{ base: "6", md: "10" }}
        py={{ base: "8", md: "10" }}
      >
        <VStack gap="7" align="stretch">
          <VStack gap="3" textAlign="center">
            <Flex
              w="64px"
              h="64px"
              rounded="full"
              align="center"
              justify="center"
              bg="#EAF0FF"
              color="#344CB7"
              mx="auto"
            >
              <Icon as={MdLockReset} boxSize="8" />
            </Flex>

            <Heading color="#000957" fontSize={{ base: "2xl", md: "3xl" }}>
              Reset Password
            </Heading>

            <Text color="gray.600" fontSize="sm" lineHeight="1.7">
              Enter a new password for your account.
            </Text>
          </VStack>

          {isSubmitted ? (
            <Box
              bg="#F0FDF4"
              border="1px solid"
              borderColor="#BBF7D0"
              rounded="xl"
              p="5"
              textAlign="center"
            >
              <Text color="#166534" fontWeight="semibold">
                Password reset successful!
              </Text>

              <Text color="#166534" fontSize="sm" mt="2">
                You can now sign in with your new password.
              </Text>
            </Box>
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <VStack gap="5" align="stretch">
                <Field.Root
                  invalid={Boolean(
                    formik.touched.newPassword && formik.errors.newPassword,
                  )}
                >
                  <Field.Label color="#000957">New password</Field.Label>

                  <Input
                    name="newPassword"
                    type="password"
                    px={5}
                    placeholder="Enter new password"
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    h="48px"
                    rounded="lg"
                    borderColor="gray.300"
                    _focus={{
                      borderColor: "#344CB7",
                      boxShadow: "0 0 0 1px #344CB7",
                    }}
                  />

                  <Field.ErrorText>{formik.errors.newPassword}</Field.ErrorText>
                </Field.Root>

                <Button
                  type="submit"
                  h="48px"
                  bg="#344CB7"
                  color="white"
                  rounded="lg"
                  loading={formik.isSubmitting}
                  _hover={{ bg: "#000957" }}
                  disabled={!token}
                >
                  Reset Password
                </Button>

                {serverError ? (
                  <Text color="red.500" fontSize="sm">
                    {serverError}
                  </Text>
                ) : null}
              </VStack>
            </form>
          )}

          <HStack justify="center" gap="2">
            <Icon as={MdArrowBack} color="#344CB7" />

            <ChakraLink
              asChild
              color="#344CB7"
              fontWeight="semibold"
              fontSize="sm"
              _hover={{ textDecoration: "underline" }}
            >
              <NextLink href="/login">Back to Login</NextLink>
            </ChakraLink>
          </HStack>
        </VStack>
      </Box>
    </Flex>
  );
}
