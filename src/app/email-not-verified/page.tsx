"use client";

import { Box, Button, Heading, Spinner, Text, VStack } from "@chakra-ui/react";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resendEmailVerification } from "@/services/authService";

function EmailNotVerifiedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") ?? "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerifyAccount = async () => {
    if (!email) {
      setError("Email address is missing. Please go back and login again.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await resendEmailVerification({
        email,
      });

      router.push(`/check-email?email=${encodeURIComponent(email)}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
        return;
      }

      setError("Failed to send verification email. Please try again.");
    } finally {
      setLoading(false);
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
        maxW="540px"
        bg="white"
        borderRadius="24px"
        boxShadow="0 20px 60px rgba(0, 9, 87, 0.12)"
        p={{ base: "6", md: "10" }}
        textAlign="center"
      >
        <VStack gap="5">
          <Box
            w="76px"
            h="76px"
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
            Email Not Verified
          </Heading>

          <Text color="gray.600">
            Your email address is not verified yet. Please verify your account
            before logging in to TrueSurvey.
          </Text>

          {email ? (
            <Text fontWeight="semibold" color="#0015D6">
              {email}
            </Text>
          ) : null}

          <Text fontSize="sm" color="gray.500">
            Click the button below and we will send a new verification email to
            your registered email address.
          </Text>

          {error ? (
            <Text color="red.500" fontSize="sm">
              {error}
            </Text>
          ) : null}

          <Button
            bg="#0015D6"
            color="white"
            _hover={{
              bg: "#000957",
            }}
            w="full"
            loading={loading}
            onClick={handleVerifyAccount}
          >
            Verify Account
          </Button>

          <Button
            variant="ghost"
            color="#0015D6"
            onClick={() => router.push("/login")}
          >
            Back to Login
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}

export default function EmailNotVerifiedPage() {
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
      <EmailNotVerifiedContent />
    </Suspense>
  );
}
