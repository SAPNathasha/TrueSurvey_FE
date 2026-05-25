import NextLink from "next/link";
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  FiArrowRight,
  FiCalendar,
  FiCheck,
  FiDownload,
  FiLayout,
  FiPlusCircle,
} from "react-icons/fi";

import DashboardCard from "./DashboardCard";
import QuickAction from "./QuickAction";
import { notifications, progressItems } from "./dashboardData";

export default function RightPanel() {
  return (
    <VStack align="stretch" gap="4">
      <DashboardCard>
        <HStack justify="space-between" mb="4">
          <Heading fontSize="md">Notifications</Heading>

          <Button variant="ghost" size="sm">
            View all
          </Button>
        </HStack>

        <VStack align="stretch" gap="4">
          {notifications.map((item) => (
            <HStack key={item.title} align="start" gap="3">
              <Box
                w="38px"
                h="38px"
                bg={item.color}
                color="white"
                borderRadius="full"
                display="grid"
                placeItems="center"
                flexShrink="0"
              >
                <Icon as={item.icon} />
              </Box>

              <Box>
                <Text fontSize="sm" fontWeight="medium">
                  {item.title}
                </Text>

                <Text textStyle="smallText" mt="1">
                  {item.time}
                </Text>
              </Box>
            </HStack>
          ))}
        </VStack>
      </DashboardCard>

      <DashboardCard>
        <Heading fontSize="md" mb="5">
          Creator Progress
        </Heading>

        <HStack gap="5" align="center">
          <Box
            w="78px"
            h="78px"
            borderRadius="full"
            bg="conic-gradient(#0015D6 0 75%, #E5E7EB 75% 100%)"
            position="relative"
            flexShrink="0"
          >
            <Box
              position="absolute"
              inset="8px"
              bg="white"
              borderRadius="full"
              display="grid"
              placeItems="center"
              fontWeight="bold"
            >
              75%
            </Box>
          </Box>

          <Box>
            <Text fontWeight="bold">Profile Complete</Text>
            <Text textStyle="smallText">You&apos;re doing great!</Text>
          </Box>
        </HStack>

        <VStack align="stretch" gap="3" mt="5">
          {progressItems.map((item) => (
            <HStack key={item.label}>
              <Box
                w="16px"
                h="16px"
                borderRadius="full"
                bg={item.done ? "brand.success" : "white"}
                borderWidth="1px"
                borderColor={item.done ? "brand.success" : "brand.mutedText"}
                color="white"
                display="grid"
                placeItems="center"
                fontSize="10px"
              >
                {item.done && <FiCheck />}
              </Box>

              <Text
                fontSize="sm"
                color={item.done ? "brand.dark" : "brand.mutedText"}
              >
                {item.label}
              </Text>
            </HStack>
          ))}
        </VStack>

        <Button variant="ghost" w="full" mt="5" asChild>
          <NextLink href="/creator/profile">
            Complete Profile <FiArrowRight />
          </NextLink>
        </Button>
      </DashboardCard>

      <DashboardCard>
        <Heading fontSize="md" mb="4">
          Quick Actions
        </Heading>

        <SimpleGrid columns={2} gap="3">
          <QuickAction
            icon={FiPlusCircle}
            label="Create Survey"
            href="/creator/surveys/create"
          />

          <QuickAction
            icon={FiLayout}
            label="Survey Templates"
            href="/creator/templates"
          />

          <QuickAction
            icon={FiDownload}
            label="Export Results"
            href="/creator/exports"
          />

          <QuickAction
            icon={FiCalendar}
            label="Schedule Survey"
            href="/creator/schedule"
          />
        </SimpleGrid>
      </DashboardCard>
    </VStack>
  );
}