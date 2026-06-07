"use client";

import { Box, Flex, Grid, SimpleGrid } from "@chakra-ui/react";

import ParticipantSidebar from "@/components/pages/participant/dashboard/ParticipantSidebar";
import Hero from "./Hero";
import StatCard from "./StatCard";
import RightPanel from "./RightPanel";
import MySurveysTable from "./MySurveysTable";
import SurveyStatusCard from "./SurveyStatusCard";
import ResponseGrowthCard from "./ResponseGrowthCard";
import { statCards } from "./dashboardData";

export default function CreatorDashboard() {
  return (
    <Flex minH="100vh" bg="white" color="brand.dark">
      <ParticipantSidebar area="creator" />

      <Box flex="1" p={{ base: "4", lg: "6" }} overflow="hidden">
        <Grid
          templateColumns={{ base: "1fr", xl: "1fr 330px" }}
          gap="5"
          maxW="1500px"
          mx="auto"
        >
          <Box minW="0">
            <Hero />

            <SimpleGrid columns={{ base: 1, md: 3 }} gap="4" mt="5">
              {statCards.map((stat) => (
                <StatCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  growth={stat.growth}
                  icon={stat.icon}
                  active={stat.active}
                  iconBg={stat.iconBg}
                  iconColor={stat.iconColor}
                />
              ))}
            </SimpleGrid>

            <Grid
              templateColumns={{ base: "1fr", lg: "1.35fr 0.95fr" }}
              gap="4"
              mt="4"
            >
              <ResponseGrowthCard />
              <SurveyStatusCard />
            </Grid>

            <MySurveysTable />
          </Box>

          <RightPanel />
        </Grid>
      </Box>
    </Flex>
  );
}
