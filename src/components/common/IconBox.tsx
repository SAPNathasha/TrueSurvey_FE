import { Flex, Heading, Text, Icon } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface IconBox {
  title: string;
  description: string;
  iconBg: string;
  icon: IconType;
  iconColor: string;
}

export default function IconBox({
  title,
  description,
  iconBg,
  icon,
  iconColor,
}: IconBox) {
  return (
    <Flex gap="4" direction="row">
      <Flex
        bg={iconBg}
        w="47px"
        h="47px"
        minW="47px"
        borderRadius="full"
        alignItems="center"
        justifyContent="center"
      >
        <Icon as={icon} boxSize="25px" color={iconColor} />
      </Flex>

      <Flex gap="4" direction="column">
        <Heading
          fontSize="15px"
          fontWeight="bold"
          color="black"
          letterSpacing="tight"
          lineHeight="1.3"
        >
          {title}
        </Heading>
        <Text
          fontSize="12px"
          fontWeight="regular"
          color="#A0A0A0"
          letterSpacing="tight"
          lineHeight="1.1"
        >
          {description}
        </Text>
      </Flex>
    </Flex>
  );
}
