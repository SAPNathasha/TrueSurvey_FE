import {
  Box,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiZap } from "react-icons/fi";

import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";
import { setupTips } from "./basicDetailsData";

export default function SetupTipsCard() {
  return (
    <DashboardCard>
      <HStack mb="6" gap="4">
        <Box
          w="46px"
          h="46px"
          borderRadius="12px"
          bg="brand.lightBlue"
          color="brand.primary"
          display="grid"
          placeItems="center"
        >
          <FiZap />
        </Box>

        <Heading fontSize="md">Survey Setup Tips</Heading>
      </HStack>

      <VStack align="stretch" gap="5">
        {setupTips.map((tip) => (
          <HStack key={tip.title} align="start" gap="4">
            <Box
              w="54px"
              h="54px"
              borderRadius="full"
              bg="brand.lightBlue"
              color="brand.primary"
              display="grid"
              placeItems="center"
              flexShrink="0"
            >
              <Icon as={tip.icon} boxSize="6" />
            </Box>

            <Box>
              <Text fontWeight="bold" fontSize="sm">
                {tip.title}
              </Text>

              <Text textStyle="smallText" mt="1">
                {tip.description}
              </Text>
            </Box>
          </HStack>
        ))}
      </VStack>
    </DashboardCard>
  );
}