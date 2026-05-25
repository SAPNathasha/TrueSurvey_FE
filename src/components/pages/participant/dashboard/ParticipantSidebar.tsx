"use client";

import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import {
  FiBell,
  FiClipboard,
  FiGrid,
  FiList,
  FiSettings,
  FiShield,
  FiUser,
} from "react-icons/fi";

type SidebarItem = {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: string;
};

const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    icon: <FiGrid />,
    active: true,
  },
  {
    label: "Available Surveys",
    icon: <FiClipboard />,
  },
  {
    label: "My Surveys",
    icon: <FiList />,
  },
  {
    label: "Wallet",
    icon: <FiUser />,
  },
  {
    label: "Notifications",
    icon: <FiBell />,
    badge: "3",
  },
  {
    label: "Profile",
    icon: <FiUser />,
  },
  {
    label: "Verification",
    icon: <FiShield />,
  },
  {
    label: "Settings",
    icon: <FiSettings />,
  },
];

function SidebarItemCard({ item }: { item: SidebarItem }) {
  return (
    <HStack
      w="100%"
      px="4"
      py="3"
      borderRadius="10px"
      bg={item.active ? "brand.lightBlue" : "transparent"}
      color={item.active ? "brand.primary" : "brand.dark"}
      fontWeight={item.active ? "bold" : "medium"}
      justify="space-between"
      cursor="pointer"
      _hover={{
        bg: "brand.lightBlue",
        color: "brand.primary",
      }}
    >
      <HStack gap="3">
        <Box fontSize="22px">{item.icon}</Box>
        <Text fontSize="sm">{item.label}</Text>
      </HStack>

      {item.badge && (
        <Box
          w="24px"
          h="24px"
          borderRadius="full"
          bg="brand.primary"
          color="white"
          fontSize="xs"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontWeight="bold"
        >
          {item.badge}
        </Box>
      )}
    </HStack>
  );
}

export default function ParticipantSidebar() {
  return (
    <Box
      w="300px"
      minH="100vh"
      borderRightWidth="1px"
      borderColor="brand.border"
      bg="white"
      px="5"
      py="5"
      display={{ base: "none", lg: "block" }}
      flexShrink="0"
    >
      <VStack align="stretch" gap="2">
        {sidebarItems.map((item) => (
          <SidebarItemCard key={item.label} item={item} />
        ))}
      </VStack>

      <Box
        mt="20"
        borderWidth="1px"
        borderColor="#C7D2FE"
        borderRadius="16px"
        p="5"
        textAlign="center"
        bg="white"
      >
        <Box
          w="92px"
          h="92px"
          borderRadius="24px"
          bg="brand.lightBlue"
          color="brand.primary"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="46px"
          mx="auto"
          mb="4"
        >
          <FiUser />
        </Box>

        <Text fontWeight="bold" color="brand.dark">
          Earn more with every opinion you share! 🎉
        </Text>

        <Text fontSize="sm" color="brand.mutedText" mt="2">
          Complete surveys and get rewarded with cash.
        </Text>

        <HStack justify="center" color="brand.primary" fontWeight="bold" mt="4">
          <Text fontSize="sm">Learn how it works</Text>
          <Text>→</Text>
        </HStack>
      </Box>
    </Box>
  );
}
