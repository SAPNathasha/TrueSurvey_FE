"use client";

import {
  Badge,
  Box,
  Circle,
  Flex,
  HStack,
  Icon,
  Image,
  Input,
  Text,
} from "@chakra-ui/react";
import { FiBell, FiChevronDown, FiCommand, FiSearch } from "react-icons/fi";

import { getStoredUserRole } from "@/lib/userRole";

type StoredUser = {
  username?: string;
  fullName?: string;
  email?: string;
  profileImage?: string;
  avatarUrl?: string;
};

type HeaderUserInfo = {
  userName: string;
  roleLabel: string;
  profileImage?: string;
};

function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;

  const possibleKeys = ["user", "authUser", "currentUser"];

  for (const key of possibleKeys) {
    const value = localStorage.getItem(key);

    if (!value) continue;

    try {
      return JSON.parse(value) as StoredUser;
    } catch {
      return null;
    }
  }

  return null;
}

function getInitialHeaderUserInfo(): HeaderUserInfo {
  const storedUser = getStoredUser();
  const storedRole = getStoredUserRole();

  const userName =
    storedUser?.fullName || storedUser?.username || storedUser?.email || "User";

  const profileImage = storedUser?.profileImage || storedUser?.avatarUrl;

  let roleLabel = "Dashboard User";

  if (storedRole === "CREATOR") {
    roleLabel = "Survey Creator";
  }

  if (storedRole === "PARTICIPANT") {
    roleLabel = "Survey Participant";
  }

  return {
    userName,
    roleLabel,
    profileImage,
  };
}

export default function AppHeader() {
  const { userName, roleLabel, profileImage } = getInitialHeaderUserInfo();

  return (
    <Flex
      as="header"
      h={{ base: "64px", md: "72px" }}
      borderBottomWidth="1px"
      borderColor="gray.100"
      bg="white"
      align="center"
      justify="space-between"
      px={{ base: "4", md: "6", lg: "7" }}
      gap="4"
      position="sticky"
      top="0"
      zIndex="20"
    >
      <Box
        flex="1"
        maxW={{ base: "full", lg: "560px" }}
        display={{ base: "none", md: "block" }}
      >
        <Box position="relative">
          <Icon
            as={FiSearch}
            position="absolute"
            left="4"
            top="50%"
            transform="translateY(-50%)"
            color="brand.mutedText"
            boxSize="5"
          />

          <Input
            h="44px"
            pl="12"
            pr="16"
            borderRadius="xl"
            borderColor="gray.200"
            bg="white"
            fontSize="sm"
            color="brand.dark"
            placeholder="Search surveys, categories, or rewards..."
            _placeholder={{ color: "brand.mutedText" }}
            _focus={{
              borderColor: "brand.primary",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-primary)",
            }}
          />

          <HStack
            position="absolute"
            right="3"
            top="50%"
            transform="translateY(-50%)"
            gap="1"
            px="2"
            py="1"
            borderRadius="md"
            bg="gray.50"
            color="brand.mutedText"
            fontSize="xs"
            fontWeight="semibold"
          >
            <Icon as={FiCommand} boxSize="3" />
            <Text>K</Text>
          </HStack>
        </Box>
      </Box>

      <HStack gap={{ base: "3", md: "5" }} ml="auto">
        <Box position="relative">
          <Circle
            size="42px"
            borderWidth="1px"
            borderColor="gray.100"
            bg="white"
            cursor="pointer"
          >
            <Icon as={FiBell} boxSize="5" color="brand.dark" />
          </Circle>

          <Badge
            position="absolute"
            top="-1"
            right="-1"
            minW="18px"
            h="18px"
            borderRadius="full"
            bg="red.500"
            color="white"
            fontSize="xs"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            3
          </Badge>
        </Box>

        <HStack gap="3" cursor="pointer">
          <Circle size="48px" overflow="hidden" bg="gray.100">
            {profileImage ? (
              <Image
                src={profileImage}
                alt={userName}
                w="full"
                h="full"
                objectFit="cover"
              />
            ) : (
              <Text fontWeight="bold" color="brand.primary">
                {userName.charAt(0).toUpperCase()}
              </Text>
            )}
          </Circle>

          <Box display={{ base: "none", sm: "block" }}>
            <Text
              fontSize="sm"
              fontWeight="bold"
              color="brand.dark"
              lineHeight="1.2"
            >
              {userName}
            </Text>
            <Text fontSize="xs" color="brand.mutedText">
              {roleLabel}
            </Text>
          </Box>

          <Icon
            as={FiChevronDown}
            boxSize="4"
            color="brand.dark"
            display={{ base: "none", sm: "block" }}
          />
        </HStack>
      </HStack>
    </Flex>
  );
}
