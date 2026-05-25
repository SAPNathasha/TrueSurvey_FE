import NextLink from "next/link";
import {
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  Icon,
  Text,
} from "@chakra-ui/react";
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiGrid,
  FiMoreHorizontal,
} from "react-icons/fi";

import DashboardCard from "./DashboardCard";
import StatusBadge from "./StatusBadge";
import { surveys } from "./dashboardData";

export default function MySurveysTable() {
  return (
    <DashboardCard mt="4" p="0" overflow="hidden">
      <HStack justify="space-between" p="5" pb="3">
        <Heading fontSize="md">My Surveys</Heading>

        <Button variant="ghost" size="sm" asChild>
          <NextLink href="/creator/surveys">
            View all surveys <FiArrowRight />
          </NextLink>
        </Button>
      </HStack>

      <Box overflowX="auto">
        <Box minW="760px">
          <Grid
            templateColumns="2.2fr 0.8fr 1fr 0.8fr 1fr 0.5fr"
            px="5"
            py="3"
            bg="#FAFBFF"
            borderTopWidth="1px"
            borderBottomWidth="1px"
            borderColor="brand.border"
            color="brand.dark"
            fontSize="xs"
            fontWeight="bold"
          >
            <Text>Survey Name</Text>
            <Text>Status</Text>
            <Text>Audience</Text>
            <Text>Responses</Text>
            <Text>Last Updated</Text>
            <Text>Actions</Text>
          </Grid>

          {surveys.map((survey) => (
            <Grid
              key={survey.name}
              templateColumns="2.2fr 0.8fr 1fr 0.8fr 1fr 0.5fr"
              px="5"
              py="3"
              alignItems="center"
              borderBottomWidth="1px"
              borderColor="brand.border"
              _hover={{ bg: "brand.cardHover" }}
            >
              <HStack>
                <Box
                  w="32px"
                  h="32px"
                  bg={survey.status === "Closed" ? "#E8F8F2" : "brand.lightBlue"}
                  color={
                    survey.status === "Closed"
                      ? "brand.success"
                      : "brand.primary"
                  }
                  borderRadius="8px"
                  display="grid"
                  placeItems="center"
                >
                  <Icon as={survey.status === "Closed" ? FiGrid : FiFileText} />
                </Box>

                <Box>
                  <Text fontWeight="bold" fontSize="sm">
                    {survey.name}
                  </Text>

                  <Text textStyle="smallText">{survey.description}</Text>
                </Box>
              </HStack>

              <StatusBadge status={survey.status} />

              <Text fontSize="sm" color="brand.dark">
                {survey.audience}
              </Text>

              <Text fontSize="sm" color="brand.dark">
                {survey.responses}
              </Text>

              <Text fontSize="sm" color="brand.dark">
                {survey.updated}
              </Text>

              <Button variant="ghost" size="sm">
                <FiMoreHorizontal />
              </Button>
            </Grid>
          ))}
        </Box>
      </Box>

      <HStack justify="space-between" p="5">
        <Text textStyle="smallText">Showing 1 to 4 of 24 surveys</Text>

        <HStack>
          <Button variant="outline" size="sm" w="34px" h="34px">
            <FiChevronLeft />
          </Button>

          {["1", "2", "3", "...", "6"].map((page) => (
            <Button
              key={page}
              variant={page === "1" ? "solid" : "ghost"}
              size="sm"
              w="34px"
              h="34px"
            >
              {page}
            </Button>
          ))}

          <Button variant="outline" size="sm" w="34px" h="34px">
            <FiChevronRight />
          </Button>
        </HStack>
      </HStack>
    </DashboardCard>
  );
}