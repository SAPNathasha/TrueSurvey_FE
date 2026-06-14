"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Box, Flex, type BoxProps, type FlexProps } from "@chakra-ui/react";

import AppHeader from "@/components/layout/AppHeader";
import ParticipantSidebar from "@/components/pages/participant/dashboard/ParticipantSidebar";
import CompleteProfilePopup from "@/components/pages/participant/completePopup/CompleteProfilePopup";
import api from "@/lib/axios";

type AuthenticatedShellProps = {
  activeItem?: string;
  children: ReactNode;
  contentProps?: BoxProps;
  shellProps?: FlexProps;
};

type DashboardResponse = {
  profileStatus?: {
    profileCompleted?: boolean;
    shouldShowCompleteProfilePopup?: boolean;
  };
};

export default function AuthenticatedShell({
  activeItem = "Dashboard",
  children,
  contentProps,
  shellProps,
}: AuthenticatedShellProps) {
  const [showCompleteProfilePopup, setShowCompleteProfilePopup] =
    useState(false);

  useEffect(() => {
    const checkParticipantProfileStatus = async () => {
      try {
        const popupAlreadyShown = sessionStorage.getItem(
          "completeProfilePopupShown",
        );

        if (popupAlreadyShown === "true") {
          return;
        }

        const response = await api.get<DashboardResponse>(
          "/participant/dashboard",
        );

        const shouldShow =
          response.data.profileStatus?.shouldShowCompleteProfilePopup === true;

        if (shouldShow) {
          setShowCompleteProfilePopup(true);
          sessionStorage.setItem("completeProfilePopupShown", "true");
        }
      } catch (error) {
        console.error("Failed to check participant profile status:", error);
      }
    };

    checkParticipantProfileStatus();
  }, []);

  return (
    <>
      <CompleteProfilePopup
        open={showCompleteProfilePopup}
        onClose={() => setShowCompleteProfilePopup(false)}
      />

      <Flex
        minH="100vh"
        bg="white"
        color="brand.dark"
        direction={{ base: "column", lg: "row" }}
        overflowX="hidden"
        {...shellProps}
      >
        <ParticipantSidebar activeItem={activeItem} />

        <Flex flex="1" minW={0} w="full" direction="column">
          <AppHeader />

          <Box
            flex="1"
            minW={0}
            px={{ base: "4", md: "6", lg: "7" }}
            py={{ base: "4", md: "5", lg: "6" }}
            {...contentProps}
          >
            {children}
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
