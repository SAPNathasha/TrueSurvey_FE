"use client";

import IconBox from "@/components/common/IconBox";
import { IoPeople } from "react-icons/io5";
import { MdOutlineSecurity } from "react-icons/md";
import { CiGift } from "react-icons/ci";
import { SiSpringsecurity } from "react-icons/si";

import {
  Flex,
  Container,
  Heading,
  Text,
  Image,
  Grid,
  Icon,
  Box,
  Field,
  Input,
  Button,
} from "@chakra-ui/react";

export default function RegisterStepOnePage() {
  return (
    <Box bg="white" minH="100vh" py="20">
      <Container maxW="1200px" mx="auto">
        <Flex gap="10" direction="row" alignItems="center">
          {/* Left Section */}
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

          {/* Right Form Section */}
          <Flex flex="1" alignItems="center" justifyContent="center">
            <Box layerStyle="formCard">
              
              <Flex width="100%" maxW="360px" gap="12" justify="center">
                <Text textStyle="stepText">Step 1</Text>
                <Text textStyle="smallText">Step 2</Text>
                <Text textStyle="smallText">Step 3</Text>
              </Flex>

              <Heading textStyle="h2" color="black" textAlign="center">
                Create your account
              </Heading>

              <Text textStyle="smallText" textAlign="center">
                Start as a survey creator, participant, or both.
              </Text>

              <Field.Root required width="100%" maxW="360px">
                <Field.Label textStyle="label">
                  Username <Field.RequiredIndicator />
                </Field.Label>

                <Input
                  color="black"
                  px="5"
                  borderRadius="input"
                  borderColor="gray.border"
                  bg="gray.inputBg"
                  placeholder="Choose a username"
                  value=""
                  onChange={() => {}}
                />

                <Field.HelperText textStyle="helperText">
                  This will be your public display name.
                </Field.HelperText>
              </Field.Root>

              <Field.Root required width="100%" maxW="360px">
                <Field.Label textStyle="label">
                  Email <Field.RequiredIndicator />
                </Field.Label>

                <Input
                  color="black"
                  px="5"
                  borderRadius="input"
                  borderColor="gray.border"
                  bg="gray.inputBg"
                  placeholder="you@example.com"
                  value=""
                  onChange={() => {}}
                />

                <Field.HelperText textStyle="helperText">
                  We will send a verification link to this email.
                </Field.HelperText>
              </Field.Root>

              <Field.Root required width="100%" maxW="360px">
                <Field.Label textStyle="label">
                  Password <Field.RequiredIndicator />
                </Field.Label>

                <Input
                  color="black"
                  px="5"
                  borderRadius="input"
                  borderColor="gray.border"
                  bg="gray.inputBg"
                  type="password"
                  placeholder="********"
                  value=""
                  onChange={() => {}}
                />

                <Field.HelperText textStyle="helperText">
                  Use at least 8 characters with a mix of letters, numbers and
                  symbols.
                </Field.HelperText>
              </Field.Root>

              <Button width="100%" maxW="360px" variant="solid" onClick={() => {}}>
                Next
              </Button>

              <Text textStyle="smallText" textAlign="center" maxW="360px">
                Already have an account?{" "}
                <Text as="span" textStyle="link">
                  Sign in
                </Text>
              </Text>

              <Flex pt="2" gap="4" justify="center" alignItems="flex-start">
                <Flex
                  bg="brand.mutedText"
                  w="40px"
                  h="40px"
                  minW="40px"
                  borderRadius="pill"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon size="md" color="white">
                    <SiSpringsecurity />
                  </Icon>
                </Flex>

                <Text textStyle="smallText" textAlign="left" maxW="300px">
                  Next, you will choose your role(s) and can optionally verify
                  your identity to unlock more features.
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}