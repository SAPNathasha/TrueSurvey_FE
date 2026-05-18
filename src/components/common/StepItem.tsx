"use client";

import { Box, Flex, Text, VStack, HStack } from "@chakra-ui/react";

interface StepItem {
  number: number;
  label: string;
  color: string;
}

export default function UStepItem({ number, label, color }: StepItem) {
  return (
    <VStack gap="2" flex="1">
      <HStack gap="2">
        <Flex
          w="22px"
          h="22px"
          borderRadius="full"
          bg={color}
          color="white"
          align="center"
          justify="center"
          fontSize="12px"
          fontWeight="700"
        >
          {number}
        </Flex>

        <Text fontSize="13px" color={color} fontWeight="600">
          {label}
        </Text>
      </HStack>

      <Box w="100%" h="3px" bg={color} borderRadius="full" />
    </VStack>
  );
}
