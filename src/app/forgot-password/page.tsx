"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MdArrowBack, MdLockReset } from "react-icons/md";
import NextLink from "next/link";
import { Link as ChakraLink } from "@chakra-ui/react";

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

interface ForgotPasswordValues {
  email: string;
}

const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),
});

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formik = useFormik<ForgotPasswordValues>({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, actions) => {
      try {
        /**
         * Replace this with your real Nest.js backend API call later.
         *
         * Example:
         * await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
         *   method: "POST",
         *   headers: { "Content-Type": "application/json" },
         *   body: JSON.stringify(values),
         * });
         */

        console.log("Forgot password email:", values.email);

        setIsSubmitted(true);
      } catch (error) {
        console.error(error);
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
              Forgot Password?
            </Heading>

            <Text color="gray.600" fontSize="sm" lineHeight="1.7">
              Enter your email address and we will send you instructions to
              reset your password.
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
                Reset link sent!
              </Text>

              <Text color="#166534" fontSize="sm" mt="2">
                Please check your email inbox for password reset instructions.
              </Text>
            </Box>
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <VStack gap="5" align="stretch">
                <Field.Root
                  invalid={Boolean(formik.touched.email && formik.errors.email)}
                >
                  <Field.Label color="#000957">Email address</Field.Label>

                  <Input
                    name="email"
                    type="email"
                    px={5}
                    placeholder="Enter your email"
                    value={formik.values.email}
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

                  <Field.ErrorText>{formik.errors.email}</Field.ErrorText>
                </Field.Root>

                <Button
                  type="submit"
                  h="48px"
                  bg="#344CB7"
                  color="white"
                  rounded="lg"
                  loading={formik.isSubmitting}
                  _hover={{ bg: "#000957" }}
                >
                  Send Reset Link
                </Button>
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
