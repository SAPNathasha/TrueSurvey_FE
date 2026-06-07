"use client";

import NextLink from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Box,
  Button,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerPositioner,
  DrawerRoot,
  DrawerTitle,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  Flex,
  HStack,
  Icon,
  IconButton,
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
  FiMenu,
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
  const [drawerOpen, setDrawerOpen] = useState(false);
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

  function handleNavigate(href: string) {
    setDrawerOpen(false);
    router.push(href);
  }

  function renderNavigation() {
    return (
      <VStack align="stretch" gap="2">
        {sidebarItems.map((item) => {
          const itemWithAction =
            item.id === "logout"
              ? {
                  ...item,
                  onClick: () => {
                    setDrawerOpen(false);
                    setLogoutDialogOpen(true);
                  },
                }
              : item.href
                ? {
                    ...item,
                    onClick: () => setDrawerOpen(false),
                  }
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
    );
  }

  function renderVerificationNotice() {
    if (!shouldShowVerificationNotice) {
      return null;
    }

    return (
      <Box
        mt="10"
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

        <Button
          w="100%"
          h="44px"
          mt="5"
          borderRadius="10px"
          bg="brand.primary"
          color="white"
          fontWeight="bold"
          fontSize="sm"
          onClick={() => handleNavigate("/participant/settings")}
        >
          Verify Now
        </Button>
      </Box>
    );
  }

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
    <>
      <Flex
        display={{ base: "flex", lg: "none" }}
        align="center"
        justify="space-between"
        px="4"
        py="3.5"
        borderBottomWidth="1px"
        borderColor="brand.border"
        bg="white"
        position="sticky"
        top="0"
        zIndex="10"
      >
        <Box minW={0}>
          <Text fontSize="xs" fontWeight="semibold" color="brand.mutedText">
            TrueSurvey
          </Text>
          <Text fontSize="lg" fontWeight="bold" color="brand.dark">
            {activeItem}
          </Text>
        </Box>

        <IconButton
          aria-label="Open navigation menu"
          variant="outline"
          size="sm"
          flexShrink={0}
          onClick={() => setDrawerOpen(true)}
        >
          <FiMenu />
        </IconButton>
      </Flex>

      <DrawerRoot
        open={drawerOpen}
        onOpenChange={(details) => setDrawerOpen(details.open)}
        placement="start"
        size="xs"
      >
        <DrawerBackdrop bg="blackAlpha.500" />
        <DrawerPositioner display={{ base: "flex", lg: "none" }}>
          <DrawerContent maxW="280px">
            <DrawerHeader
              px="5"
              py="4"
              borderBottomWidth="1px"
              borderColor="brand.border"
            >
              <DrawerTitle fontSize="lg" fontWeight="bold" color="brand.dark">
                Navigation
              </DrawerTitle>
            </DrawerHeader>
            <DrawerCloseTrigger top="4" right="4" />
            <DrawerBody px="5" py="5" overflowY="auto">
              {renderNavigation()}
              {renderVerificationNotice()}
            </DrawerBody>
          </DrawerContent>
        </DrawerPositioner>
      </DrawerRoot>

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
        {renderNavigation()}
        {renderVerificationNotice()}
      </Box>

      <DialogRoot
        open={logoutDialogOpen}
        onOpenChange={(details) => setLogoutDialogOpen(details.open)}
      >
        <DialogBackdrop bg="blackAlpha.600" />
        <DialogPositioner p={{ base: "4", md: "8" }} alignItems="center">
          <DialogContent
            bg="white"
            borderRadius="16px"
            boxShadow="0 10px 30px rgba(15, 23, 42, 0.08)"
            maxW={{ base: "calc(100vw - 32px)", md: "420px" }}
            w="full"
            overflow="hidden"
          >
            <DialogHeader
              px="6"
              py="4"
              borderBottomWidth="1px"
              borderColor="brand.border"
            >
              <DialogTitle fontSize="lg" fontWeight="bold" color="brand.dark">
                Confirm Logout
              </DialogTitle>
            </DialogHeader>
            <DialogCloseTrigger
              top="4"
              right="4"
              _focus={{ boxShadow: "none" }}
              _focusVisible={{ boxShadow: "outline" }}
            />
            <DialogBody px="6" py="5">
              <Text color="brand.dark">Do you want to logout?</Text>
            </DialogBody>
            <DialogFooter
              px="6"
              py="4"
              borderTopWidth="1px"
              borderColor="brand.border"
              display="flex"
              justifyContent="flex-end"
              gap="3"
            >
              <Button
                variant="outline"
                h="36px"
                px="4"
                minW="88px"
                onClick={() => setLogoutDialogOpen(false)}
                disabled={isSubmitting}
              >
                No
              </Button>
              <Button
                h="36px"
                px="4"
                minW="112px"
                bg="red.500"
                color="white"
                _hover={{ bg: "red.600" }}
                _active={{ bg: "red.700" }}
                onClick={handleLogoutConfirm}
                loading={isSubmitting}
              >
                Yes, Logout
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </>
  );
}
