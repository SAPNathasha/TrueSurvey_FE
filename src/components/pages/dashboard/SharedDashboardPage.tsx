"use client";

import { Flex, Spinner, Text } from "@chakra-ui/react";

import CreatorSurveysPage from "@/components/pages/creator/surveys/CreatorSurveysPage";
import ParticipantDashboard from "@/components/pages/participant/dashboard/ParticipantDashboard";
import { getStoredUserRole } from "@/lib/userRole";

export default function SharedDashboardPage() {
  const userRole = getStoredUserRole();

  if (userRole === null) {
    return (
      <Flex minH="100vh" align="center" justify="center" gap="3">
        <Spinner color="brand.primary" />
        <Text color="brand.mutedText">Loading dashboard...</Text>
      </Flex>
    );
  }

  if (userRole === "CREATOR") {
    return <CreatorSurveysPage />;
  }

  return <ParticipantDashboard />;
}
