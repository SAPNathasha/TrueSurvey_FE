"use client";

import { Box, Flex, Heading, HStack } from "@chakra-ui/react";

const colors = {
  primary: "#0015D6",
  primaryDark: "#0011AD",
  navy: "#000957",
  yellow: "#FFEB00",
};

export type DashboardRole = "creator" | "participant" | "both";

export default function LogoSection() {
  return (
    <Flex
      h="94px"
      align="center"
      px={8}
      bg="white"
      borderRight="1px solid"
      borderColor="gray.100"
    >
      <HStack gap={3}>
        <Box
          w="42px"
          h="42px"
          bg={colors.primary}
          borderRadius="8px"
          position="relative"
        >
          <Box
            position="absolute"
            left="12px"
            top="8px"
            w="18px"
            h="26px"
            borderRight="3px solid white"
            borderBottom="3px solid white"
            transform="rotate(40deg)"
          />
        </Box>

        <Heading size="lg" color="#1B1D2A" letterSpacing="-0.5px">
          True
          <Box as="span" color={colors.primary}>
            Survey
          </Box>
        </Heading>
      </HStack>
    </Flex>
  );
}
