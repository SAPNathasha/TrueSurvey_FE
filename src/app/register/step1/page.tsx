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
    <Box bg="white" minH="100vh" padding={20}>
      <Container maxW="1200px" marginX={"auto"}>
        <Flex gap="4" direction="row">
          <Flex gap="4" direction="column" alignItems="left">
            <Heading
              fontSize="50px"
              fontWeight="bold"
              color="black"
              letterSpacing="tight"
              lineHeight="1.1"
            >
              Join TrueSurvey
              <br />
              <Text as="span" color="#0015D6">
                in a few simple steps
              </Text>
            </Heading>

            <Text
              fontSize="17px"
              fontWeight="regular"
              color="#A0A0A0"
              letterSpacing="tight"
              lineHeight="1.1"
            >
              Create your account to participate in surveys, share your
              opinions,
              <br /> earn rewards, or build surveys that matter.
            </Text>
            <Image
              height="380px"
              width="100%"
              objectFit="contain"
              src="/signInImage.png"
              alt="Login image"
            />
            <Grid templateColumns="repeat(3, 1fr)" gap="5">
              <IconBox
                title="For Everyone"
                description="Whether you want to build surveys, we've got you."
                iconBg="#DDE8FE"
                icon={IoPeople}
                iconColor="#0015D6"
              />
              <IconBox
                title="Secure & Private"
                description="Your data is encrypted
 and always protected."
                iconBg="#D7F7F0"
                icon={MdOutlineSecurity}
                iconColor="#0AB188"
              />
              <IconBox
                title="For Everyone"
                description="Earn rewards and grow your
insights on TrueSurvey."
                iconBg="#EEE7FA"
                icon={CiGift}
                iconColor="#6537ED"
              />
            </Grid>
          </Flex>

          <Flex
            gap="4"
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              width="450px"
              height="700px"
              bg="white"
              boxShadow="2px 4px 25px 4px rgba(0, 0, 0, 0.15)"
              borderRadius="lg"
              p="6"
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap="4"
            >
              <Flex gap="12" justify="center" direction="row">
                <Box color={"#0015D6"} height="10" order="1">
                  Step 1
                </Box>
                <Box color={"#A0A0A0"} height="10" order="2">
                  Step 2
                </Box>
                <Box color={"#A0A0A0"} height="10" order="2">
                  Step 3
                </Box>
              </Flex>
              <Heading
                fontSize="30px"
                fontWeight="bold"
                color="black"
                letterSpacing="tight"
                lineHeight="1.1"
                textAlign="center"
              >
                Create your account
              </Heading>
              <Text
                fontSize="12px"
                fontWeight="regular"
                color="#a0a0a0"
                letterSpacing="tight"
                lineHeight="1.1"
                textAlign="center"
              >
                Start as a survey creator, participant, or both.
              </Text>
              <Field.Root required width="100%" maxW="360px">
                <Field.Label fontSize="12px" color="black">
                  Username <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  color="#000000"
                  padding={5}
                  borderRadius={10}
                  type="password"
                  placeholder="Choose a username"
                  value={""}
                  onChange={() => {}}
                />
                <Field.HelperText>
                  This will be your public display name.
                </Field.HelperText>
              </Field.Root>
              <Field.Root required width="100%" maxW="360px">
                <Field.Label fontSize="12px" color="black">
                  Email <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  color="#000000"
                  padding={5}
                  borderRadius={10}
                  placeholder="you@example.com"
                  value={""}
                  onChange={() => {}}
                />
                <Field.HelperText>
                  We wll send a verification link to this email.
                </Field.HelperText>
              </Field.Root>
              <Field.Root required width="100%" maxW="360px">
                <Field.Label fontSize="12px" color="black">
                  Password <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  color="#000000"
                  padding={5}
                  borderRadius={10}
                  type="password"
                  placeholder="********"
                  value={""}
                  onChange={() => {}}
                />
                <Field.HelperText>
                  Use at least 8 characters with a mix of letters, numbers &
                  symbols.
                </Field.HelperText>
              </Field.Root>

              <Button
                width="100%"
                maxW="360px"
                bg="#0015D6"
                color="white"
                _hover={{ bg: "#000957" }}
                borderRadius={10}
                onClick={() => {}}
              >
                Next
              </Button>

              <Text
                fontSize="12px"
                color="#A0A0A0"
                textAlign="center"
                maxW="360px"
              >
                Already have an account?{" "}
                <Text as="span" color="#0015D6">
                  Sign in
                </Text>
                <Flex pt="20px" gap="4" justify="center" direction="row">
                  <Flex
                    bg="#A0A0A0"
                    w="40px"
                    h="40px"
                    minW="40px"
                    borderRadius="full"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon size="md" color="#ffffff">
                      <SiSpringsecurity />
                    </Icon>
                  </Flex>
                  <Text
                    fontSize="12px"
                    color="#A0A0A0"
                    textAlign="left"
                    maxW="360px"
                  >
                    Next, you wll choose your role(s) and can optionally verify
                    your identity to unlock more features.
                  </Text>
                </Flex>
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
