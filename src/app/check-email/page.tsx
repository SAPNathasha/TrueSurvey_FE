"use client";

import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CheckEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");

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
            bg="#FFFBE6"
            color="#0015D6"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="36px"
          >
            ✉
          </Box>

          <Heading size="lg" color="#000957">
            Verify Your Email
          </Heading>

          <Text color="gray.600">
            An email has been sent to your email address. Please verify your
            email before logging in to the system.
          </Text>

          {email && (
            <Text fontWeight="semibold" color="#0015D6">
              {email}
            </Text>
          )}

          <Text fontSize="sm" color="gray.500">
            After verifying your email, you can return to the login page and
            access your TrueSurvey account.
          </Text>

          <Button
            bg="#0015D6"
            color="white"
            _hover={{ bg: "#0011AD" }}
            w="full"
            onClick={() => router.push("/login")}
          >
            Go to Login
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={null}>
      <CheckEmailContent />
    </Suspense>
  );
}
