"use client";

import { Box, VStack } from "@chakra-ui/react";
import { FiBell, FiUser, FiSettings } from "react-icons/fi";
import getMenuItemsByRole from "./getMenuItemsByRole";
import LogoSection from "./LogoSection";
import UserCard from "./UserCard";
import SidebarItem from "./SidebarItem";

const colors = {
  primary: "#0015D6",
  primaryDark: "#0011AD",
  navy: "#000957",
  yellow: "#FFEB00",
};

export type DashboardRole = "creator" | "participant" | "both";

type MenuItem = {
  label: string;
  icon: React.ElementType;
  href: string;
};

type DashboardSidebarProps = {
  role: DashboardRole;
  activeItem?: string;
  userName?: string;
  userRoleLabel?: string;
};

const bottomMenuItems: MenuItem[] = [
  {
    label: "Notifications",
    icon: FiBell,
    href: "/dashboard/notifications",
  },
  {
    label: "Profile",
    icon: FiUser,
    href: "/dashboard/profile",
  },
  {
    label: "Settings",
    icon: FiSettings,
    href: "/dashboard/settings",
  },
];

export default function DashboardSidebar({
  role,
  activeItem = "Dashboard",
  userName = "John Doe",
  userRoleLabel,
}: DashboardSidebarProps) {
  const menuItems = getMenuItemsByRole(role);

  return (
    <Box
      display={{ base: "none", lg: "block" }}
      position="fixed"
      left="0"
      top="0"
      h="100vh"
      w="280px"
      bg={colors.navy}
      color="white"
      boxShadow="xl"
      zIndex="100"
    >
      <LogoSection />

      <VStack align="stretch" gap={2} px={4} pt={6}>
        {menuItems.map((item) => (
          <SidebarItem
            key={item.label}
            item={item}
            active={activeItem === item.label}
          />
        ))}
      </VStack>

      <Box h="1px" bg="whiteAlpha.300" mx={4} my={6} />

      <VStack align="stretch" gap={2} px={4}>
        {bottomMenuItems.map((item) => (
          <SidebarItem
            key={item.label}
            item={item}
            active={activeItem === item.label}
          />
        ))}
      </VStack>

      <UserCard
        userName={userName}
        userRoleLabel={userRoleLabel ?? getRoleLabel(role)}
      />
    </Box>
  );
}

function getRoleLabel(role: DashboardRole) {
  if (role === "creator") return "Survey Creator";
  if (role === "participant") return "Participant";
  if (role === "both") return "Both";
  return "Creator & Participant";
}
