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
  Field,
  Input,
  Checkbox,
  Button,
} from "@chakra-ui/react";

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

          {/* Right login card */}
          <Flex flex="1" alignItems="center" justifyContent="center">
            <Box
              width="450px"
              height="600px"
              bg="white"
              boxShadow="card"
              borderRadius="card"
              p="6"
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap="4"
            >
              <Image height="50px" src="/Logo.png" alt="TrueSurvey logo" />

              <Heading textStyle="h2" color="black" textAlign="center">
                Login
              </Heading>

              <Text textStyle="smallText" textAlign="center">
                Access your creator or participant account
              </Text>

              <Field.Root required width="100%" maxW="360px">
                <Field.Label textStyle="label">
                  Email <Field.RequiredIndicator />
                </Field.Label>

                <Input
                  color="black"
                  px="5"
                  borderRadius="input"
                  placeholder="you@example.com"
                  value=""
                  onChange={() => {}}
                />
              </Field.Root>

              <Field.Root required width="100%" maxW="360px">
                <Field.Label textStyle="label">
                  Password <Field.RequiredIndicator />
                </Field.Label>

                <Input
                  color="black"
                  px="5"
                  borderRadius="input"
                  type="password"
                  placeholder="********"
                  value=""
                  onChange={() => {}}
                />
              </Field.Root>

              <Flex
                width="100%"
                maxW="360px"
                alignItems="center"
                justifyContent="space-between"
              >
                <Checkbox.Root>
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label textStyle="smallText">
                    Remember me
                  </Checkbox.Label>
                </Checkbox.Root>

                <Text textStyle="link">Forgot password?</Text>
              </Flex>

              <Button width="100%" maxW="360px" variant="solid">
                Login
              </Button>

              <Button width="100%" maxW="360px" variant="outline">
                Create an account
              </Button>

              <Text textStyle="smallText" textAlign="center" maxW="360px">
                TrueSurvey is for both survey creators and participants. By
                signing in, you agree to our Terms of Service and Privacy
                Policy.
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
