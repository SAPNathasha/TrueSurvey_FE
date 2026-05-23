"use client";

import { HStack, Icon, Text } from "@chakra-ui/react";

import Link from "next/link";

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

export default function SidebarItem({
  item,
  active,
}: {
  item: MenuItem;
  active: boolean;
}) {
  return (
    <Link href={item.href} style={{ textDecoration: "none" }}>
      <HStack
        h="50px"
        px={4}
        borderRadius="10px"
        gap={4}
        bg={active ? colors.primary : "transparent"}
        color={active ? "white" : "whiteAlpha.900"}
        fontWeight="700"
        cursor="pointer"
        _hover={{
          bg: active ? colors.primary : "whiteAlpha.100",
        }}
      >
        <Icon as={item.icon} boxSize={5} />
        <Text>{item.label}</Text>
      </HStack>
    </Link>
  );
}
