import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="#FFFFFF"
    >
      <VStack gap="4">
        <Heading color="#000957">TrueSurvey Frontend</Heading>

        <Text color="#577BC1">
          Chakra UI is successfully connected.
        </Text>

        <Button bg="#344CB7" color="white" _hover={{ bg: "#000957" }}>
          Get Started
        </Button>
      </VStack>
    </Box>
  );
}