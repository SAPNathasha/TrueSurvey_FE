"use client";

import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import {
  FiBell,
  FiClipboard,
  FiCreditCard,
  FiGrid,
  FiHelpCircle,
  FiList,
  FiLogOut,
  FiSearch,
  FiSettings,
  FiShield,
  FiUser,
} from "react-icons/fi";

type ParticipantSidebarProps = {
  activeItem?: string;
};

type SidebarItem = {
  label: string;
  icon: React.ReactNode;
  badge?: string;
  statusBadge?: string;
};

const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    icon: <FiGrid />,
  },
  {
    label: "Available Surveys",
    icon: <FiSearch />,
  },
  {
    label: "My Surveys",
    icon: <FiList />,
  },
  {
    label: "Earnings",
    icon: <FiCreditCard />,
  },
  {
    label: "Wallet",
    icon: <FiUser />,
  },
  {
    label: "Transactions",
    icon: <FiClipboard />,
  },
  {
    label: "Profile",
    icon: <FiUser />,
  },
  {
    label: "Verification",
    icon: <FiShield />,
    statusBadge: "Not Verified",
  },
  {
    label: "Notifications",
    icon: <FiBell />,
    badge: "3",
  },
  {
    label: "Settings",
    icon: <FiSettings />,
  },
  {
    label: "Help & Support",
    icon: <FiHelpCircle />,
  },
  {
    label: "Logout",
    icon: <FiLogOut />,
  },
];

function SidebarItemCard({
  item,
  active,
}: {
  item: SidebarItem;
  active: boolean;
}) {
  return (
    <HStack
      w="100%"
      px="4"
      py="3"
      borderRadius="10px"
      bg={active ? "brand.primary" : "transparent"}
      color={active ? "white" : "brand.dark"}
      fontWeight={active ? "bold" : "medium"}
      justify="space-between"
      cursor="pointer"
      _hover={{
        bg: active ? "brand.primary" : "brand.lightBlue",
        color: active ? "white" : "brand.primary",
      }}
    >
      <HStack gap="3">
        <Box fontSize="20px">{item.icon}</Box>
        <Text fontSize="sm">{item.label}</Text>
      </HStack>

      {item.badge && (
        <Box
          w="24px"
          h="24px"
          borderRadius="full"
          bg={active ? "white" : "#FFEB00"}
          color={active ? "brand.primary" : "brand.dark"}
          fontSize="xs"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontWeight="bold"
        >
          {item.badge}
        </Box>
      )}

      {item.statusBadge && (
        <Box
          px="3"
          py="1"
          borderRadius="999px"
          bg={active ? "whiteAlpha.300" : "#EEF2FF"}
          color={active ? "white" : "brand.primary"}
          fontSize="xs"
          fontWeight="bold"
        >
          {item.statusBadge}
        </Box>
      )}
    </HStack>
  );
}

export default function ParticipantSidebar({
  activeItem = "Dashboard",
}: ParticipantSidebarProps) {
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
          <SidebarItemCard
            key={item.label}
            item={item}
            active={activeItem === item.label}
          />
        ))}
      </VStack>

      <Box
        mt="16"
        borderWidth="1px"
        borderColor="#C7D2FE"
        borderRadius="16px"
        p="5"
        bg="brand.lightBlue"
      >
        <Box
          w="52px"
          h="52px"
          borderRadius="14px"
          bg="brand.primary"
          color="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="26px"
          mb="4"
        >
          <FiShield />
        </Box>

        <Text fontWeight="bold" color="brand.dark">
          Unlock more surveys
        </Text>

        <Text fontSize="sm" color="brand.mutedText" mt="3">
          Verify your identity to access high paying surveys.
        </Text>

        <Box
          as="button"
          w="100%"
          h="44px"
          mt="5"
          borderRadius="10px"
          bg="brand.primary"
          color="white"
          fontWeight="bold"
          fontSize="sm"
        >
          Verify Now
        </Box>
      </Box>
    </Box>
  );
}