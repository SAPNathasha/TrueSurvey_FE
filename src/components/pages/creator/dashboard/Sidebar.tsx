"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";

import { getSidebarMenuItems, type SidebarMenuItem } from "@/lib/sidebarMenu";
import { getStoredUserRole } from "@/lib/userRole";

export default function Sidebar() {
  const userRole = getStoredUserRole();
  const menuItems = getSidebarMenuItems(userRole);

  return (
    <Box
      w={{ base: "82px", lg: "270px" }}
      bg="white"
      borderRightWidth="1px"
      borderColor="brand.border"
      p="4"
      display="flex"
      flexDirection="column"
      gap="5"
      position="sticky"
      top="0"
      h="100vh"
    >
      <VStack align="stretch" gap="2">
        {menuItems.map((item) => (
          <SidebarItem key={item.label} item={item} />
        ))}
      </VStack>

      <Box flex="1" />

      {/* <Box
        display={{ base: "none", lg: "block" }}
        bg="white"
        borderWidth="1px"
        borderColor="brand.border"
        borderRadius="card"
        p="5"
        textAlign="center"
        boxShadow="softCard"
      >
        <Box fontSize="54px" mb="3">
          🏆
        </Box>

        <Text fontWeight="bold" color="brand.dark">
          You&apos;re a Pro Creator! 🎉
        </Text>

        <Text textStyle="smallText" mt="1">
          Keep up the amazing work.
        </Text>

        <Button variant="ghost" size="sm" mt="2">
          View Creator Stats <FiArrowRight />
        </Button>
      </Box> */}

      {/* <Box
        display={{ base: "none", lg: "block" }}
        bg="white"
        borderWidth="1px"
        borderColor="brand.border"
        borderRadius="card"
        p="5"
        boxShadow="softCard"
      >
        <HStack justify="space-between">
          <HStack>
            <Icon as={creatorPlanIcon} color="brand.warning" />
            <Text fontWeight="bold">Creator Plan</Text>
          </HStack>

          <Badge bg="brand.lightBlue" color="brand.primary" borderRadius="pill">
            Pro
          </Badge>
        </HStack>

        <Text textStyle="smallText" mt="3">
          Renews on Apr 24, 2025
        </Text>

        <HStack mt="5" justify="space-between">
          <Text fontWeight="bold" fontSize="sm">
            8,245
          </Text>
          <Text textStyle="smallText">/ 10,000 responses used</Text>
        </HStack>

        <Box
          h="6px"
          bg="gray.subtle"
          borderRadius="pill"
          mt="2"
          overflow="hidden"
        >
          <Box h="full" w="82%" bg="brand.primary" borderRadius="pill" />
        </Box>

        <Button variant="ghost" w="full" mt="5">
          Upgrade Plan
        </Button>
      </Box> */}
    </Box>
  );
}

function SidebarItem({ item }: { item: SidebarMenuItem }) {
  const pathname = usePathname();

  if (!item.href) {
    return null;
  }

  const active =
    pathname === item.href ||
    (item.href !== "/creator/dashboard" && pathname.startsWith(item.href));

  return (
    <NextLink href={item.href} style={{ textDecoration: "none" }}>
      <HStack
        px={{ base: "3", lg: "4" }}
        py="3"
        borderRadius="12px"
        gap="4"
        bg={active ? "brand.cardSelected" : "transparent"}
        color={active ? "brand.primary" : "brand.dark"}
        fontWeight={active ? "bold" : "medium"}
        _hover={{ bg: "brand.cardHover", color: "brand.primary" }}
        justify={{ base: "center", lg: "flex-start" }}
      >
        <Icon as={item.icon} boxSize="5" />

        <Text display={{ base: "none", lg: "block" }} fontSize="sm">
          {item.label}
        </Text>

        {item.badge && (
          <Box
            ml="auto"
            display={{ base: "none", lg: "grid" }}
            placeItems="center"
            w="22px"
            h="22px"
            bg="brand.primary"
            color="white"
            borderRadius="full"
            fontSize="xs"
            fontWeight="bold"
          >
            {item.badge}
          </Box>
        )}
      </HStack>
    </NextLink>
  );
}
