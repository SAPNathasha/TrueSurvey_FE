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
import SignUpStepOneForm from "@/components/pages/signup/SignUpStepOneForm";

export default function RegisterStepOnePage() {
  return (
    <Box bg="white" minH="100vh" py="20">
      <Container maxW="1200px" mx="auto">
        <Flex gap="10" direction="row" alignItems="center">
          <Flex flex="1" gap="4" direction="column" alignItems="flex-start">
            <Heading textStyle="h1" color="black">
              Join TrueSurvey
              <br />
              <Text as="span" color="brand.primary">
                in a few simple steps
              </Text>
            </Heading>

            <Text textStyle="bodyText" fontSize="17px">
              Create your account to participate in surveys, share your
              opinions,
              <br /> earn rewards, or build surveys that matter.
            </Text>

            <Image
              height="380px"
              width="100%"
              objectFit="contain"
              src="/signInImage.png"
              alt="Sign up image"
            />

            <Grid templateColumns="repeat(3, 1fr)" gap="5">
              <IconBox
                title="For Everyone"
                description="Whether you want to build surveys, we've got you."
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
                description="Earn rewards and grow your insights on TrueSurvey."
                iconBg="#EEE7FA"
                icon={CiGift}
                iconColor="#6537ED"
              />
            </Grid>
          </Flex>

          <SignUpStepOneForm />
        </Flex>
      </Container>
    </Box>
  );
}
