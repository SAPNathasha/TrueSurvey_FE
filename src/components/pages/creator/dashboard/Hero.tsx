import NextLink from "next/link";
import { Box, Button, Grid, Heading, HStack, Text } from "@chakra-ui/react";
import { FiBarChart2, FiPlus } from "react-icons/fi";

import HeroIllustration from "./HeroIllustration";

export default function Hero() {
  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="#CBD7F0"
      borderRadius="18px"
      minH="210px"
      overflow="hidden"
      position="relative"
      px={{ base: "5", lg: "9" }}
      py={{ base: "7", lg: "8" }}
      boxShadow="0px 18px 45px rgba(0, 9, 87, 0.06)"
    >
      <Grid
        templateColumns={{ base: "1fr", lg: "1fr 420px" }}
        alignItems="center"
      >
        <Box>
          <Heading fontSize={{ base: "2xl", md: "3xl" }} color="brand.dark">
            Welcome back, Sarah! 👋
          </Heading>

          <Text mt="3" color="brand.mutedText">
            You have 4 active surveys and 2,753 total responses.
          </Text>

          <HStack mt="6" gap="3" flexWrap="wrap">
            <Button asChild py={5} px={3} color={"white"}>
              <NextLink href="/creator/surveys/create">
                <FiPlus color="white"/>
                Create New Survey
              </NextLink>
            </Button>

            <Button variant="outline" asChild py={5} px={3}>
              <NextLink href="/creator/analytics">
                <FiBarChart2 />
                View Analytics
              </NextLink>
            </Button>
          </HStack>
        </Box>

        <HeroIllustration />
      </Grid>
    </Box>
  );
}