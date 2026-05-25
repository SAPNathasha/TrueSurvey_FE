import NextLink from "next/link";
import { Button, Icon, Text, VStack } from "@chakra-ui/react";
import type { IconType } from "react-icons";

type QuickActionProps = {
  icon: IconType;
  label: string;
  href: string;
};

export default function QuickAction({ icon, label, href }: QuickActionProps) {
  return (
    <Button
      asChild
      variant="outline"
      h="76px"
      borderColor="brand.border"
      color="brand.dark"
      _hover={{
        bg: "brand.cardHover",
        color: "brand.primary",
        borderColor: "brand.primary",
      }}
    >
      <NextLink href={href}>
        <VStack gap="2">
          <Icon as={icon} boxSize="6" color="brand.primary" />
          <Text fontSize="sm">{label}</Text>
        </VStack>
      </NextLink>
    </Button>
  );
}