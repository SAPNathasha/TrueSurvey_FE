import NextLink from "next/link";
import { Box, Button, Grid, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";

import DashboardCard from "./DashboardCard";

const statuses = [
  { label: "Active", value: "4 (17%)", color: "#16B364" },
  { label: "Draft", value: "8 (33%)", color: "#0015D6" },
  { label: "Closed", value: "7 (29%)", color: "#8B5CF6" },
  { label: "Archived", value: "5 (21%)", color: "#CBD5E1" },
];

export default function SurveyStatusCard() {
  return (
    <DashboardCard>
      <Heading fontSize="md" mb="6">
        Survey Status
      </Heading>

      <Grid templateColumns="1fr 1fr" alignItems="center" gap="5">
        <Box
          w="160px"
          h="160px"
          mx="auto"
          borderRadius="full"
          bg="conic-gradient(#16B364 0 17%, #0015D6 17% 50%, #8B5CF6 50% 79%, #CBD5E1 79% 100%)"
          position="relative"
        >
          <Box
            position="absolute"
            inset="28px"
            bg="white"
            borderRadius="full"
            display="grid"
            placeItems="center"
          >
            <Box textAlign="center">
              <Text fontSize="2xl" fontWeight="bold">
                24
              </Text>
              <Text textStyle="smallText">Total</Text>
            </Box>
          </Box>
        </Box>

        <VStack align="stretch" gap="4">
          {statuses.map((status) => (
            <HStack key={status.label} justify="space-between">
              <HStack>
                <Box w="8px" h="8px" bg={status.color} borderRadius="full" />
                <Text fontSize="sm">{status.label}</Text>
              </HStack>

              <Text fontSize="sm">{status.value}</Text>
            </HStack>
          ))}
        </VStack>
      </Grid>

      <Box
        borderTopWidth="1px"
        borderColor="brand.border"
        mt="8"
        pt="4"
        textAlign="center"
      >
        <Button variant="ghost" size="sm" asChild>
          <NextLink href="/creator/surveys">
            View all surveys <FiArrowRight />
          </NextLink>
        </Button>
      </Box>
    </DashboardCard>
  );
}