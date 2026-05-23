import DashboardSidebar from "@/components/pages/dashboard/DashboardSidebar";
import { Box, Flex } from "@chakra-ui/react";

export default function CreatorDashboardPage() {
  return (
    <Flex minH="100vh" bg="#F8FAFF" color="#0B1028">
      <DashboardSidebar
        role="creator"
        activeItem="Dashboard"
        userName="John Doe"
      />

      <Box flex="1" ml={{ base: "0", lg: "280px" }}>
        <Box px={{ base: 4, md: 8 }} py={6}>
          {/* content */}
        </Box>
      </Box>
    </Flex>
  );
}
