"use client";

import {
  Badge,
  Box,
  Button,
  HStack,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiCheck } from "react-icons/fi";

import type { SurveyMethod } from "./selectMethodTypes";

type MethodOptionCardProps = {
  method: SurveyMethod;
  selected: boolean;
  onSelect: () => void;
};

export default function MethodOptionCard({
  method,
  selected,
  onSelect,
}: MethodOptionCardProps) {
  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor={selected ? "brand.primary" : "brand.border"}
      borderRadius="card"
      p={{ base: "5", lg: "6" }}
      boxShadow="softCard"
      cursor="pointer"
      onClick={onSelect}
      transition="0.2s ease"
      _hover={{
        borderColor: "brand.primary",
        transform: "translateY(-2px)",
      }}
    >
      <Box
        w="24px"
        h="24px"
        borderRadius="full"
        borderWidth="2px"
        borderColor={selected ? "brand.primary" : "gray.400"}
        display="grid"
        placeItems="center"
        mb="5"
      >
        {selected && (
          <Box w="10px" h="10px" borderRadius="full" bg="brand.primary" />
        )}
      </Box>

      <HStack align="center" gap="5" mb="6">
        <MethodIllustration methodId={method.id} />

        <Box>
          <Text fontSize={{ base: "xl", lg: "2xl" }} fontWeight="bold">
            {method.title}
          </Text>

          <Text color="brand.mutedText" fontSize="sm" mt="3" lineHeight="1.7">
            {method.description}
          </Text>
        </Box>
      </HStack>

      <VStack align="stretch" gap="4" mb="6">
        {method.features.map((feature) => (
          <HStack key={feature} gap="3" align="start">
            <Box
              w="20px"
              h="20px"
              borderRadius="full"
              bg="brand.primary"
              color="white"
              display="grid"
              placeItems="center"
              flexShrink="0"
              fontSize="12px"
              mt="1px"
            >
              <FiCheck />
            </Box>

            <Text fontSize="sm" color="brand.dark">
              {feature}
            </Text>
          </HStack>
        ))}
      </VStack>

      <HStack gap="2" flexWrap="wrap" mb="6">
        {method.tags.map((tag) => (
          <Badge
            key={tag.label}
            bg="brand.cardSelected"
            color="brand.primary"
            px="3"
            py="2"
            borderRadius="8px"
            fontWeight="medium"
          >
            <HStack gap="2">
              <Icon as={tag.icon} />
              <Text>{tag.label}</Text>
            </HStack>
          </Badge>
        ))}
      </HStack>

      <Button
        w="full"
        variant={method.buttonVariant}
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
      >
        {method.buttonLabel}
      </Button>
    </Box>
  );
}

function MethodIllustration({ methodId }: { methodId: string }) {
  if (methodId === "ai") {
    return (
      <Box
        w="130px"
        h="120px"
        display={{ base: "none", md: "block" }}
        position="relative"
        flexShrink="0"
      >
        <Box
          position="absolute"
          left="20px"
          top="18px"
          w="76px"
          h="76px"
          borderRadius="26px"
          borderWidth="3px"
          borderColor="brand.primary"
        />

        <Box
          position="absolute"
          left="48px"
          top="0"
          w="22px"
          h="22px"
          bg="brand.lightBlue"
          borderRadius="full"
        />

        <Box
          position="absolute"
          right="12px"
          bottom="20px"
          px="3"
          py="2"
          bg="brand.warning"
          color="brand.dark"
          borderRadius="8px"
          fontWeight="bold"
          fontSize="sm"
        >
          AI
        </Box>

        <Box
          position="absolute"
          left="6px"
          top="70px"
          w="12px"
          h="12px"
          bg="brand.lightBlue"
          borderRadius="full"
        />
      </Box>
    );
  }

  return (
    <Box
      w="130px"
      h="120px"
      display={{ base: "none", md: "block" }}
      position="relative"
      flexShrink="0"
    >
      <Box
        position="absolute"
        left="28px"
        top="10px"
        w="70px"
        h="90px"
        bg="white"
        borderWidth="2px"
        borderColor="#CFE0FF"
        borderRadius="8px"
      />

      <Box
        position="absolute"
        left="42px"
        top="30px"
        w="36px"
        h="4px"
        bg="brand.primary"
      />

      <Box
        position="absolute"
        left="42px"
        top="48px"
        w="48px"
        h="4px"
        bg="brand.lightBlue"
      />

      <Box
        position="absolute"
        left="42px"
        top="66px"
        w="44px"
        h="4px"
        bg="brand.lightBlue"
      />

      <Box
        position="absolute"
        right="8px"
        top="32px"
        w="16px"
        h="68px"
        bg="brand.primary"
        borderRadius="8px"
        transform="rotate(38deg)"
      />

      <Box
        position="absolute"
        left="0"
        bottom="22px"
        w="34px"
        h="34px"
        bg="brand.warning"
        borderRadius="8px"
      />
    </Box>
  );
}