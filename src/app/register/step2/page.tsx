"use client";

import IconBox from "@/components/common/IconBox";
import { IoPeople, IoPerson } from "react-icons/io5";
import { MdOutlineSecurity } from "react-icons/md";
import { CiGift } from "react-icons/ci";
import { RiErrorWarningFill } from "react-icons/ri";

import {
  Flex,
  Container,
  Heading,
  Text,
  Image,
  Grid,
  Icon,
  Box,
  CheckboxCard,
  Button,
  Stack,
} from "@chakra-ui/react";

export default function RegisterStepTwoPage() {
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
            
              <Flex gap="12" justify="center" direction="row">
                <Text textStyle="stepText">Step 1</Text>
                <Text textStyle="stepText">Step 2</Text>
                <Text textStyle="smallText">Step 3</Text>
              </Flex>

              <Heading textStyle="h2" color="black" textAlign="center">
                Select your role
              </Heading>

              <Text textStyle="smallText" textAlign="center" maxW="360px">
                Choose the option that best describes how you want to use the
                platform.
              </Text>

              <Stack w="full" maxW="366px" gap="15px">
              
                <CheckboxCard.Root value="participant" w="full">
                  <CheckboxCard.HiddenInput />

                  <CheckboxCard.Control
                    display="flex"
                    alignItems="center"
                    gap="12px"
                    px="20px"
                    py="10px"
                    h="64px"
                    borderWidth="1px"
                    borderColor="brand.border"
                    borderRadius="input"
                    bg="white"
                    cursor="pointer"
                    transition="all 0.2s ease"
                    _hover={{
                      bg: "brand.cardHover",
                      borderColor: "brand.primary",
                    }}
                    _checked={{
                      bg: "brand.cardSelected",
                      borderColor: "brand.primary",
                    }}
                  >
                    <Flex
                      bg="brand.lightBlue"
                      w="38px"
                      h="38px"
                      minW="38px"
                      borderRadius="md"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon size="sm" color="brand.primary">
                        <IoPerson />
                      </Icon>
                    </Flex>

                    <CheckboxCard.Content flex="1">
                      <CheckboxCard.Label textStyle="roleTitle">
                        Participant
                      </CheckboxCard.Label>

                      <CheckboxCard.Description
                        textStyle="helperText"
                        mt="3px"
                      >
                        Fill surveys and earn rewards.
                      </CheckboxCard.Description>
                    </CheckboxCard.Content>

                    <CheckboxCard.Indicator />
                  </CheckboxCard.Control>
                </CheckboxCard.Root>

               
                <CheckboxCard.Root value="creator" w="full">
                  <CheckboxCard.HiddenInput />

                  <CheckboxCard.Control
                    display="flex"
                    alignItems="center"
                    gap="12px"
                    px="20px"
                    py="10px"
                    h="64px"
                    borderWidth="1px"
                    borderColor="brand.border"
                    borderRadius="input"
                    bg="white"
                    cursor="pointer"
                    transition="all 0.2s ease"
                    _hover={{
                      bg: "brand.cardHover",
                      borderColor: "brand.primary",
                    }}
                    _checked={{
                      bg: "brand.cardSelected",
                      borderColor: "brand.primary",
                    }}
                  >
                    <Flex
                      bg="brand.lightBlue"
                      w="38px"
                      h="38px"
                      minW="38px"
                      borderRadius="md"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon size="sm" color="brand.primary">
                        <IoPerson />
                      </Icon>
                    </Flex>

                    <CheckboxCard.Content flex="1">
                      <CheckboxCard.Label textStyle="roleTitle">
                        Survey Creator
                      </CheckboxCard.Label>

                      <CheckboxCard.Description
                        textStyle="helperText"
                        mt="3px"
                      >
                        Create surveys and collect responses.
                      </CheckboxCard.Description>
                    </CheckboxCard.Content>

                    <CheckboxCard.Indicator />
                  </CheckboxCard.Control>
                </CheckboxCard.Root>

               
                <CheckboxCard.Root value="both" w="full">
                  <CheckboxCard.HiddenInput />

                  <CheckboxCard.Control
                    display="flex"
                    alignItems="center"
                    gap="12px"
                    px="20px"
                    py="10px"
                    h="70px"
                    borderWidth="1px"
                    borderColor="brand.border"
                    borderRadius="input"
                    bg="white"
                    cursor="pointer"
                    transition="all 0.2s ease"
                    _hover={{
                      bg: "brand.cardHover",
                      borderColor: "brand.primary",
                    }}
                    _checked={{
                      bg: "brand.cardSelected",
                      borderColor: "brand.primary",
                    }}
                  >
                    <Flex
                      bg="brand.lightBlue"
                      w="38px"
                      h="38px"
                      minW="38px"
                      borderRadius="md"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon size="sm" color="brand.primary">
                        <IoPeople />
                      </Icon>
                    </Flex>

                    <CheckboxCard.Content flex="1">
                      <CheckboxCard.Label textStyle="roleTitle">
                        Both
                      </CheckboxCard.Label>

                      <CheckboxCard.Description
                        textStyle="helperText"
                        mt="3px"
                      >
                        Create surveys and participate in surveys.
                      </CheckboxCard.Description>
                    </CheckboxCard.Content>

                    <CheckboxCard.Indicator />
                  </CheckboxCard.Control>
                </CheckboxCard.Root>
              </Stack>

              <Flex pt="20px" gap="4" justify="center" direction="row">
                <Icon size="md" color="brand.warning">
                  <RiErrorWarningFill />
                </Icon>

                <Text textStyle="smallText" textAlign="left" maxW="360px">
                  If you choose Participant or Both, the next step lets you
                  optionally verify your identity.
                </Text>
              </Flex>

              <Flex w="full" gap="4" direction="row">
                <Button flex="1" variant="outline" onClick={() => {}}>
                  Back
                </Button>

                <Button flex="1" variant="solid" onClick={() => {}}>
                  Next
                </Button>
              </Flex>

              <Text textStyle="smallText" textAlign="center" maxW="360px">
                Already have an account?{" "}
                <Text as="span" textStyle="link">
                  Sign in
                </Text>
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}