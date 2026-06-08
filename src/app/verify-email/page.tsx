"use client";

import {
  Box,
  Button,
  Heading,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

type VerifyStatus = "checking" | "success" | "error" | "missing-token";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const hasCalledApi = useRef(false);

  const [status, setStatus] = useState<VerifyStatus>("checking");
  const [message, setMessage] = useState("Verifying your email address...");
  const [resendEmail, setResendEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("missing-token");
        setMessage("Verification token is missing from the link.");
        return;
      }

      /**
       * Prevent double API call in React strict mode during development.
       */
      if (hasCalledApi.current) {
        return;
      }

      hasCalledApi.current = true;

      try {
        const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setStatus("error");
          setMessage(
            data.message ??
              "Email verification failed. The link may be invalid or expired.",
          );
          return;
        }

        setStatus("success");
        setMessage(data.message ?? "Email verified successfully.");
      } catch {
        setStatus("error");
        setMessage("Something went wrong while verifying your email.");
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleResendVerification = async () => {
    if (!resendEmail.trim()) {
      setResendMessage("Please enter your email address.");
      return;
    }

    setResendLoading(true);
    setResendMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/resend-email-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: resendEmail.trim(),
          }),
        },
      );

      const data = await response.json();

      setResendMessage(
        data.message ??
          "If your account exists and is not verified, a new email has been sent.",
      );
    } catch {
      setResendMessage("Failed to send verification email. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bg="#F7F8FC"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px="4"
    >
      <Box
        w="full"
        maxW="520px"
        bg="white"
        borderRadius="24px"
        boxShadow="0 20px 60px rgba(0, 9, 87, 0.12)"
        p={{ base: "6", md: "10" }}
        textAlign="center"
      >
        <VStack gap="6">
          {status === "checking" && (
            <>
              <Spinner size="xl" color="#0015D6" />
              <Heading size="lg" color="#000957">
                Verifying Email
              </Heading>
              <Text color="gray.600">{message}</Text>
            </>
          )}

          {status === "success" && (
            <>
              <Box
                w="70px"
                h="70px"
                borderRadius="full"
                bg="#E7F8EF"
                color="#178A4C"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="36px"
                fontWeight="bold"
              >
                ✓
              </Box>

              <Heading size="lg" color="#000957">
                Email Verified
              </Heading>

              <Text color="gray.600">{message}</Text>

              <Button
                bg="#0015D6"
                color="white"
                _hover={{ bg: "#0011AD" }}
                w="full"
                onClick={() => router.push("/login")}
              >
                Continue to Login
              </Button>
            </>
          )}

          {(status === "error" || status === "missing-token") && (
            <>
              <Box
                w="70px"
                h="70px"
                borderRadius="full"
                bg="#FFF1F1"
                color="#D60000"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="36px"
                fontWeight="bold"
              >
                !
              </Box>

              <Heading size="lg" color="#000957">
                Verification Failed
              </Heading>

              <Text color="gray.600">{message}</Text>

              <Box w="full" pt="4">
                <Text
                  textAlign="left"
                  fontSize="sm"
                  color="#000957"
                  fontWeight="medium"
                  mb="2"
                >
                  Resend verification email
                </Text>

                <Input
                  placeholder="Enter your registered email"
                  value={resendEmail}
                  onChange={(event) => setResendEmail(event.target.value)}
                  mb="3"
                />

                <Button
                  bg="#0015D6"
                  color="white"
                  _hover={{ bg: "#0011AD" }}
                  w="full"
                  loading={resendLoading}
                  onClick={handleResendVerification}
                >
                  Resend Email
                </Button>

                {resendMessage && (
                  <Text mt="3" fontSize="sm" color="gray.600">
                    {resendMessage}
                  </Text>
                )}
              </Box>

              <Button
                variant="ghost"
                color="#0015D6"
                onClick={() => router.push("/login")}
              >
                Back to Login
              </Button>
            </>
          )}
        </VStack>
      </Box>
    </Box>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <Box
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner size="xl" color="#0015D6" />
        </Box>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
