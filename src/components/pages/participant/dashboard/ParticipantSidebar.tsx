"use client";

import NextLink from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Box,
  Button,
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  HStack,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { logoutUser } from "@/services/authService";
import { clearStoredAccessToken } from "@/lib/axios";
import {
  getSidebarMenuItems,
  type SidebarMenuItem,
} from "@/lib/sidebarMenu";
import { getStoredUserRole } from "@/lib/userRole";
import {
  FiShield,
} from "react-icons/fi";

type ParticipantSidebarProps = {
  activeItem?: string;
};

const PARTICIPANT_VERIFICATION_STATUS_KEY = "participantVerificationStatus";

export type SidebarItem = {
  id: string;
  label: string;
  icon: SidebarMenuItem["icon"];
  badge?: string | number;
  statusBadge?: string;
  href?: string;
  onClick?: () => void;
};

function getStoredParticipantVerificationStatus() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedStatus = window.localStorage.getItem(
    PARTICIPANT_VERIFICATION_STATUS_KEY
  );

  if (storedStatus === "VERIFIED" || storedStatus === "NOT_VERIFIED") {
    return storedStatus;
  }

  const storedUser = window.localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    const parsedUser = JSON.parse(storedUser) as Record<string, unknown>;

    if (parsedUser.verificationStatus === "VERIFIED") {
      return "VERIFIED";
    }

    if (parsedUser.verificationStatus === "NOT_VERIFIED") {
      return "NOT_VERIFIED";
    }

    if (parsedUser.isIdentityVerified === true) {
      return "VERIFIED";
    }

    if (parsedUser.isIdentityVerified === false) {
      return "NOT_VERIFIED";
    }
  } catch {
    return null;
  }

  return null;
}

function SidebarItemCard({
  item,
  active,
}: {
  item: SidebarItem;
  active: boolean;
}) {
  const isInteractive = Boolean(item.href || item.onClick);

  const itemContent = (
    <Box
      onClick={item.onClick}
      w="100%"
      px="4"
      py="3"
      borderRadius="10px"
      bg={active ? "brand.primary" : "transparent"}
      color={active ? "white" : "brand.dark"}
      fontWeight={active ? "bold" : "medium"}
      cursor={isInteractive ? "pointer" : "default"}
      _hover={
        isInteractive
          ? {
              bg: active ? "brand.primary" : "brand.lightBlue",
              color: active ? "white" : "brand.primary",
            }
          : undefined
      }
    >
      <HStack justify="space-between" align="center">
        <HStack gap="3">
          <Box fontSize="20px">
            <Icon as={item.icon} />
          </Box>
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
    </Box>
  );

  if (!item.href) {
    return itemContent;
  }

  return (
    <NextLink href={item.href} style={{ textDecoration: "none" }}>
      {itemContent}
    </NextLink>
  );
}

export default function ParticipantSidebar({
  activeItem = "Dashboard",
}: ParticipantSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const storedUserId =
    typeof window === "undefined"
      ? null
      : window.localStorage.getItem("userId") ||
        window.localStorage.getItem("participantId") ||
        window.localStorage.getItem("creatorId");
  const userRole = getStoredUserRole();
  const sidebarItems = getSidebarMenuItems(userRole);
  const verificationStatus = getStoredParticipantVerificationStatus();
  const shouldShowVerificationNotice =
    userRole !== "CREATOR" && verificationStatus !== "VERIFIED";

  async function handleLogoutConfirm() {
    if (!storedUserId) {
      window.alert("Unable to determine your user identity.");
      return;
    }

    setIsSubmitting(true);

    try {
      await logoutUser({ userId: storedUserId });
      clearStoredAccessToken();
      window.localStorage.removeItem("userId");
      window.localStorage.removeItem("participantId");
      window.localStorage.removeItem("creatorId");
      window.localStorage.removeItem("user");
      // Logout succeeded. Redirecting to login page.
      router.push("/login");
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Unable to logout.");
    } finally {
      setIsSubmitting(false);
      setLogoutDialogOpen(false);
    }
  }

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
          {sidebarItems.map((item) => {
            const itemWithAction =
              item.id === "logout"
              ? { ...item, onClick: () => setLogoutDialogOpen(true) }
              : item;

          const active = itemWithAction.href
            ? pathname?.startsWith(itemWithAction.href)
            : activeItem === itemWithAction.label;

          return (
            <SidebarItemCard
              key={itemWithAction.id}
              item={itemWithAction}
              active={active}
            />
          );
        })}
      </VStack>

      {shouldShowVerificationNotice ? (
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
            onClick={() => router.push("/participant/settings")}
          >
            Verify Now
          </Box>
        </Box>
      ) : null}

      <DialogRoot
        open={logoutDialogOpen}
        onOpenChange={(details) => setLogoutDialogOpen(details.open)}
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent
            bg="white"
            borderRadius="16px"
            boxShadow="0 10px 30px rgba(15, 23, 42, 0.08)"
            maxW="420px"
            mx="auto"
            p="6"
          >
            <DialogHeader>
              <DialogTitle>Confirm Logout</DialogTitle>
            </DialogHeader>
            <DialogBody mt="4">
              <Text>Do you want to logout?</Text>
            </DialogBody>
            <DialogFooter mt="6" display="flex" justifyContent="flex-end" gap="3">
              <Button
                variant="outline"
                onClick={() => setLogoutDialogOpen(false)}
                disabled={isSubmitting}
              >
                No
              </Button>
              <Button
                colorScheme="red"
                onClick={handleLogoutConfirm}
                loading={isSubmitting}
              >
                Yes, Logout
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </Box>
  );
}
