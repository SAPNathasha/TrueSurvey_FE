"use client";

import IconBox from "@/components/common/IconBox";
import { IoPeople } from "react-icons/io5";
import { MdOutlineSecurity } from "react-icons/md";
import { CiGift } from "react-icons/ci";

import {
  Flex,
  Container,
  Heading,
  Text,
  Image,
  Grid,
  Box,
} from "@chakra-ui/react";
import LoginForm from "@/components/pages/login/loginForm";

export default function LoginPage() {
  return (
    <Box bg="white" minH="100vh" py="20">
      <Container maxW="1200px" mx="auto">
        <Flex gap="10" alignItems="center" justifyContent="space-between">
          {/* Left section */}
          <Flex flex="1" gap="5" direction="column" alignItems="flex-start">
            <Heading textStyle="h1" color="black">
              Welcome back to
              <br />
              <Text as="span" color="brand.primary">
                TrueSurvey
              </Text>
            </Heading>

            <Text textStyle="bodyText">
              Sign in to create surveys, participate and earn rewards.
            </Text>

            <Image
              height="380px"
              width="100%"
              objectFit="contain"
              src="/loginImage.png"
              alt="Login image"
            />

            <Grid templateColumns="repeat(3, 1fr)" gap="5">
              <IconBox
                title="For Everyone"
                description="Create surveys or participate in surveys easily."
                iconBg="#DDE8FE"
                icon={IoPeople}
                iconColor="brand.primary"
              />

              <IconBox
                title="Secure & Private"
                description="Your data is encrypted and always protected."
                iconBg="#D7F7F0"
                icon={MdOutlineSecurity}
                iconColor="#0AB188"
              />

              <IconBox
                title="Earn Rewards"
                description="Earn rewards by completing published surveys."
                iconBg="#EEE7FA"
                icon={CiGift}
                iconColor="#6537ED"
              />
            </Grid>
          </Flex>

<LoginForm />
        </Flex>
      </Container>
    </Box>
  );
}
