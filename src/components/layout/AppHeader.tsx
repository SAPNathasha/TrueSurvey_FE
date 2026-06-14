"use client";

import { useState } from "react";
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
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import {
  FiBell,
  FiChevronDown,
  FiCommand,
  FiCreditCard,
  FiLogOut,
  FiSearch,
  FiSettings,
  FiUser,
} from "react-icons/fi";

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

  if (storedRole === "BOTH") {
    roleLabel = "Survey User";
  }

  return {
    userName,
    roleLabel,
    profileImage,
  };
}

export default function AppHeader() {
  const router = useRouter();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const { userName, roleLabel, profileImage } = getInitialHeaderUserInfo();

  const goToProfile = () => {
    const role = getStoredUserRole();

    setIsProfileMenuOpen(false);

    if (role === "CREATOR") {
      router.push("/creator/settings");
      return;
    }

    router.push("/settings");
  };

  const goToWallet = () => {
    const role = getStoredUserRole();

    setIsProfileMenuOpen(false);

    if (role === "CREATOR") {
      router.push("/creator/wallet");
      return;
    }

    router.push("/wallet");
  };

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    localStorage.clear();
    router.push("/login");
  };

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

        <Box position="relative">
          <HStack
            gap="3"
            cursor="pointer"
            borderRadius="xl"
            px="2"
            py="1"
            _hover={{ bg: "gray.50" }}
            onClick={() => {
              setIsProfileMenuOpen((previous) => !previous);
            }}
          >
            <Circle
              size="48px"
              overflow="hidden"
              bg="gray.100"
              onClick={(event) => {
                event.stopPropagation();
                goToProfile();
              }}
            >
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

            <Box
              display={{ base: "none", sm: "block" }}
              onClick={(event) => {
                event.stopPropagation();
                goToProfile();
              }}
            >
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

          {isProfileMenuOpen && (
            <Box
              position="absolute"
              top="58px"
              right="0"
              w="240px"
              bg="white"
              borderWidth="1px"
              borderColor="gray.100"
              borderRadius="xl"
              boxShadow="0 16px 40px rgba(15, 23, 42, 0.12)"
              p="2"
              zIndex="50"
            >
              <VStack align="stretch" gap="1">
                <HStack
                  gap="3"
                  px="3"
                  py="3"
                  borderRadius="lg"
                  cursor="pointer"
                  _hover={{ bg: "gray.50" }}
                  onClick={goToProfile}
                >
                  <Icon as={FiUser} boxSize="4" color="brand.primary" />
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold">
                      Profile
                    </Text>
                    <Text fontSize="xs" color="brand.mutedText">
                      View your profile details
                    </Text>
                  </Box>
                </HStack>

                <HStack
                  gap="3"
                  px="3"
                  py="3"
                  borderRadius="lg"
                  cursor="pointer"
                  _hover={{ bg: "gray.50" }}
                  onClick={goToProfile}
                >
                  <Icon as={FiSettings} boxSize="4" color="brand.primary" />
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold">
                      Settings
                    </Text>
                    <Text fontSize="xs" color="brand.mutedText">
                      Manage account settings
                    </Text>
                  </Box>
                </HStack>

                <HStack
                  gap="3"
                  px="3"
                  py="3"
                  borderRadius="lg"
                  cursor="pointer"
                  _hover={{ bg: "gray.50" }}
                  onClick={goToWallet}
                >
                  <Icon as={FiCreditCard} boxSize="4" color="brand.primary" />
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold">
                      Wallet
                    </Text>
                    <Text fontSize="xs" color="brand.mutedText">
                      View earnings and withdrawals
                    </Text>
                  </Box>
                </HStack>

                <HStack
                  gap="3"
                  px="3"
                  py="3"
                  borderRadius="lg"
                  cursor="pointer"
                  _hover={{ bg: "red.50" }}
                  onClick={handleLogout}
                >
                  <Icon as={FiLogOut} boxSize="4" color="red.500" />
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color="red.500">
                      Logout
                    </Text>
                    <Text fontSize="xs" color="red.400">
                      Sign out from your account
                    </Text>
                  </Box>
                </HStack>
              </VStack>
            </Box>
          )}
        </Box>
      </HStack>
    </Flex>
  );
}
