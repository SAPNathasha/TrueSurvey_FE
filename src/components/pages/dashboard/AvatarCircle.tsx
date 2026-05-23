"use client";

import { Flex, Icon } from "@chakra-ui/react";
import { FiUser } from "react-icons/fi";

const colors = {
  primary: "#0015D6",
  primaryDark: "#0011AD",
  navy: "#000957",
  yellow: "#FFEB00",
};

export type DashboardRole = "creator" | "participant" | "both";

export default function AvatarCircle() {
  return (
    <Flex
      w="52px"
      h="52px"
      bg="#F4F6FF"
      borderRadius="full"
      align="center"
      justify="center"
      border="1px solid"
      borderColor="gray.100"
    >
      <Icon as={FiUser} boxSize={7} color={colors.primary} />
    </Flex>
  );
}
