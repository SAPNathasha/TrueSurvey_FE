"use client";

import { Box, HStack, Icon, Text } from "@chakra-ui/react";
import { FiChevronDown } from "react-icons/fi";

import AvatarCircle from "./AvatarCircle";

export type DashboardRole = "creator" | "participant" | "both";

export default function UserCard({
  userName,
  userRoleLabel,
}: {
  userName: string;
  userRoleLabel: string;
}) {
  return (
    <Box position="absolute" bottom="24px" left="16px" right="16px">
      <HStack
        p={4}
        border="1px solid"
        borderColor="whiteAlpha.200"
        borderRadius="14px"
        bg="whiteAlpha.100"
        justify="space-between"
      >
        <HStack gap={3}>
          <AvatarCircle />

          <Box>
            <Text fontWeight="700">{userName}</Text>
            <Text fontSize="sm" color="whiteAlpha.800">
              {userRoleLabel}
            </Text>
          </Box>
        </HStack>

        <Icon as={FiChevronDown} />
      </HStack>
    </Box>
  );
}
