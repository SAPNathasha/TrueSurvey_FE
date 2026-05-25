import { Box, HStack, Icon } from "@chakra-ui/react";
import { FiBarChart2, FiCheck } from "react-icons/fi";

export default function HeroIllustration() {
  return (
    <Box display={{ base: "none", lg: "block" }} position="relative" h="170px">
      <Box
        position="absolute"
        left="10px"
        top="10px"
        w="150px"
        h="100px"
        bg="white"
        borderRadius="14px"
        boxShadow="softCard"
        p="4"
      >
        <HStack gap="2" mb="4">
          <Box w="42px" h="4px" bg="brand.lightBlue" borderRadius="pill" />
          <Box w="65px" h="4px" bg="brand.lightBlue" borderRadius="pill" />
        </HStack>

        <HStack align="end" h="50px" gap="2">
          <Box w="16px" h="20px" bg="brand.lightBlue" borderRadius="4px" />
          <Box w="16px" h="34px" bg="brand.primary" borderRadius="4px" />
          <Box w="16px" h="46px" bg="brand.primaryHover" borderRadius="4px" />
          <Box w="16px" h="28px" bg="brand.lightBlue" borderRadius="4px" />
        </HStack>
      </Box>

      <Box
        position="absolute"
        right="42px"
        top="10px"
        w="58px"
        h="58px"
        bg="white"
        borderRadius="full"
        boxShadow="softCard"
        display="grid"
        placeItems="center"
      >
        <Icon as={FiBarChart2} color="brand.primary" boxSize="7" />
      </Box>

      <Box
        position="absolute"
        left="165px"
        bottom="10px"
        w="230px"
        h="115px"
        bg="brand.lightBlue"
        borderRadius="60px 60px 16px 16px"
        opacity="0.85"
      />

      <Box
        position="absolute"
        left="230px"
        top="35px"
        w="92px"
        h="92px"
        bg="brand.primary"
        borderRadius="full"
      />

      <Box
        position="absolute"
        left="250px"
        top="24px"
        w="82px"
        h="120px"
        bg="brand.primary"
        borderRadius="44px 44px 18px 18px"
      />

      <Box
        position="absolute"
        left="198px"
        bottom="8px"
        w="120px"
        h="70px"
        bg="brand.dark"
        borderRadius="10px"
        transform="skewX(8deg)"
        display="grid"
        placeItems="center"
      >
        <Box
          w="24px"
          h="24px"
          bg="brand.primary"
          borderRadius="full"
          display="grid"
          placeItems="center"
          color="white"
        >
          <FiCheck />
        </Box>
      </Box>
    </Box>
  );
}