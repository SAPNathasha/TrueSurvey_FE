import { Box, HStack, Icon, Text } from "@chakra-ui/react";
import type { IconType } from "react-icons";

type StatCardProps = {
  title: string;
  value: string;
  growth: string;
  icon: IconType;
  active?: boolean;
  iconBg?: string;
  iconColor?: string;
};

export default function StatCard({
  title,
  value,
  growth,
  icon,
  active,
  iconBg = "whiteAlpha.300",
  iconColor = "white",
}: StatCardProps) {
  return (
    <Box
      bg={active ? "brand.primary" : "white"}
      color={active ? "white" : "brand.dark"}
      borderWidth="1px"
      borderColor={active ? "brand.primary" : "brand.border"}
      borderRadius="card"
      p="6"
      boxShadow="softCard"
      minH="148px"
    >
      <HStack gap="4">
        <Box
          w="46px"
          h="46px"
          bg={active ? "whiteAlpha.300" : iconBg}
          color={active ? "white" : iconColor}
          borderRadius="14px"
          display="grid"
          placeItems="center"
        >
          <Icon as={icon} boxSize="5" />
        </Box>

        <Text fontWeight="medium">{title}</Text>
      </HStack>

      <Text fontSize="3xl" fontWeight="bold" mt="4">
        {value}
      </Text>

      <HStack mt="2" fontSize="sm">
        <Text color={active ? "white" : "brand.success"}>↑ {growth}</Text>
        <Text color={active ? "whiteAlpha.800" : "brand.mutedText"}>
          from last month
        </Text>
      </HStack>
    </Box>
  );
}