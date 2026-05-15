"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Icon,
  Image,
  Text,
  FileUpload,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react";

import { IoPeople } from "react-icons/io5";
import { MdOutlineSecurity } from "react-icons/md";
import { CiGift } from "react-icons/ci";
import { HiUpload } from "react-icons/hi";
import { FaCamera, FaCheck, FaIdCard, FaShieldAlt } from "react-icons/fa";
import { BsInfoCircle } from "react-icons/bs";
import { MdGroups } from "react-icons/md";

function FeatureBox({
  title,
  description,
  icon,
  iconBg,
  iconColor,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <HStack align="flex-start" gap="3">
      <Flex
        w="48px"
        h="48px"
        borderRadius="full"
        bg={iconBg}
        align="center"
        justify="center"
        flexShrink={0}
      >
        <Icon as={icon} color={iconColor} fontSize="24px" />
      </Flex>

      <Box>
        <Text fontSize="13px" fontWeight="700" color="#000957">
          {title}
        </Text>
        <Text fontSize="11px" color="#9CA3AF" lineHeight="1.5" mt="1">
          {description}
        </Text>
      </Box>
    </HStack>
  );
}

function StepItem({
  number,
  label,
  active = false,
}: {
  number: number;
  label: string;
  active?: boolean;
}) {
  return (
    <VStack gap="2" flex="1">
      <HStack gap="2">
        <Flex
          w="22px"
          h="22px"
          borderRadius="full"
          bg="#0015D6"
          color="white"
          align="center"
          justify="center"
          fontSize="12px"
          fontWeight="700"
        >
          {number}
        </Flex>

        <Text fontSize="13px" color="#0015D6" fontWeight="600">
          {label}
        </Text>
      </HStack>

      <Box
        w="100%"
        h="3px"
        bg={active ? "#0015D6" : "#0015D6"}
        borderRadius="full"
      />
    </VStack>
  );
}

function UploadBox({
  title,
  icon,
  helper,
}: {
  title: string;
  icon: React.ElementType;
  helper: string;
}) {
  return (
    <Box w="full">
      <HStack mb="2" gap="3">
        <Flex
          w="27px"
          h="22px"
          bg="white"
          borderRadius="4px"
          border="1px solid #D9E4FF"
          align="center"
          justify="center"
          boxShadow="sm"
        >
          <Icon as={icon} color="#1D4DFF" fontSize="14px" />
        </Flex>

        <Text fontSize="13px" fontWeight="700" color="#666">
          {title}
        </Text>
      </HStack>

      <FileUpload.Root w="full">
        <FileUpload.HiddenInput />

        <FileUpload.Trigger asChild>
          <Button
            w="full"
            h="86px"
            bg="#EEF4FF"
            border="1.5px dashed #9DB5E8"
            borderRadius="10px"
            color="#0015D6"
            _hover={{
              bg: "#E5EEFF",
              borderColor: "#0015D6",
            }}
          >
            <VStack gap="2">
              <Icon as={HiUpload} fontSize="24px" color="#1D4DFF" />

              <Text fontSize="12px" color="#8B95A7" fontWeight="500">
                Drag and drop your file here, or click to browse
              </Text>

              <Text fontSize="11px" color="#A7AFBF" fontWeight="400">
                {helper}
              </Text>
            </VStack>
          </Button>
        </FileUpload.Trigger>

        <FileUpload.List />
      </FileUpload.Root>
    </Box>
  );
}

export default function RegisterStepThreePage() {
  return (
    <Box bg="#FFFFFF" minH="100vh" display="flex" alignItems="center">
      <Container maxW="1200px" mx="auto" px="6" py="10">
        <Grid
          templateColumns={{
            base: "1fr",
            lg: "1.1fr 0.9fr",
          }}
          gap="10"
          alignItems="center"
        >
          {/* Left Side */}
          <Box>
            <Heading
              fontSize={{
                base: "38px",
                lg: "48px",
              }}
              lineHeight="1.12"
              letterSpacing="-1.5px"
              fontWeight="800"
              color="#111A44"
              mb="4"
            >
              Verify to unlock
              <br />
              <Text as="span" color="#0015D6">
                more surveys
              </Text>
            </Heading>

            <Text
              fontSize="16px"
              color="#A0AEC0"
              lineHeight="1.5"
              maxW="470px"
              mb="5"
            >
              This optional step helps you access more surveys and earn more
              rewards
            </Text>

            <HStack gap="3" mb="2">
              <Icon as={BsInfoCircle} color="#3B82F6" fontSize="24px" />
              <Text fontSize="13px" color="#9CA3AF" lineHeight="1.5">
                This step is only for Participants or users
                <br />
                who chose Both roles.
              </Text>
            </HStack>

            <Image
              src="/signInImage.png"
              alt="TrueSurvey verification illustration"
              w="100%"
              maxW="520px"
              h="330px"
              objectFit="contain"
              mt="1"
              mb="6"
            />

            <Grid templateColumns="repeat(3, 1fr)" gap="7" maxW="560px">
              <FeatureBox
                title="For Everyone"
                description="Whether you want to build surveys, we've got you."
                icon={MdGroups}
                iconBg="#DDE8FE"
                iconColor="#0015D6"
              />

              <FeatureBox
                title="Secure & Private"
                description="Your data is encrypted and always protected."
                icon={MdOutlineSecurity}
                iconBg="#D7F7F0"
                iconColor="#0AB188"
              />

              <FeatureBox
                title="Earn & Grow"
                description="Earn rewards and grow your insights on TrueSurvey."
                icon={CiGift}
                iconBg="#EEE7FA"
                iconColor="#6537ED"
              />
            </Grid>
          </Box>

          {/* Right Card */}
          <Flex justify="center">
            <Box
              w="100%"
              maxW="480px"
              bg="white"
              borderRadius="24px"
              boxShadow="0px 18px 45px rgba(0, 0, 0, 0.18)"
              px="9"
              py="8"
            >
              <VStack gap="6" align="stretch">
                <HStack gap="5">
                  <StepItem number={1} label="Step 1 of 3" />
                  <StepItem number={2} label="Step 2 of 3" />
                  <StepItem number={3} label="Step 3 of 3" active />
                </HStack>

                <Box>
                  <HStack align="center" gap="2" mb="2">
                    <Heading
                      fontSize="24px"
                      color="#111111"
                      fontWeight="800"
                      lineHeight="1.2"
                    >
                      Optional identity verification
                    </Heading>
                  </HStack>

                  <Text fontSize="14px" color="#A0A0A0" lineHeight="1.5">
                    Verify your account to access more surveys and increase your
                    earning opportunities
                  </Text>
                </Box>

                <VStack gap="4" align="stretch">
                  <UploadBox
                    title="Upload NIC / Driving Licence (Front)"
                    icon={FaIdCard}
                    helper="JPG, PNG or PDF"
                  />

                  <UploadBox
                    title="Upload a Selfie"
                    icon={FaCamera}
                    helper="Make sure your face is clearly visible"
                  />
                </VStack>

                <HStack
                  align="center"
                  gap="5"
                  bg="#EEF8FF"
                  borderRadius="10px"
                  px="5"
                  py="5"
                >
                  <VStack align="start" gap="1">
                    {[
                      "This step is optional.",
                      "Verified users can access more surveys and earn more.",
                      "Files are used only to confirm you are a real person.",
                      "Responses remain anonymous.",
                      "No one can see who voted or filled a survey.",
                      "Survey results are shown anonymously.",
                      "You can also complete this later in Settings.",
                      "Your private details and pictures are not stored after verification and are not kept as personal survey data.",
                    ].map((item) => (
                      <HStack key={item} gap="2" align="flex-start">
                        <Icon
                          as={FaCheck}
                          color="#1D4DFF"
                          fontSize="9px"
                          mt="3px"
                          flexShrink={0}
                        />
                        <Text fontSize="11px" color="#1F2937" lineHeight="1.4">
                          {item}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </HStack>

                <HStack gap="3">
                  <Button
                    flex="1"
                    h="42px"
                    bg="white"
                    color="#000957"
                    border="1px solid #CBD5E1"
                    borderRadius="9px"
                    fontWeight="700"
                    _hover={{
                      bg: "#F8FAFC",
                    }}
                  >
                    Back
                  </Button>

                  <Button
                    flex="1"
                    h="42px"
                    bg="white"
                    color="#0015D6"
                    border="1px solid #CBD5E1"
                    borderRadius="9px"
                    fontWeight="700"
                    _hover={{
                      bg: "#EEF4FF",
                    }}
                  >
                    Skip for now
                  </Button>

                  <Button
                    flex="1.25"
                    h="42px"
                    bg="#0015D6"
                    color="white"
                    borderRadius="9px"
                    fontWeight="700"
                    _hover={{
                      bg: "#000957",
                    }}
                  >
                    Create account
                  </Button>
                </HStack>

                <Text textAlign="center" fontSize="13px" color="#A0A0A0">
                  Already have an account?{" "}
                  <Text
                    as="span"
                    color="#0015D6"
                    fontWeight="700"
                    cursor="pointer"
                  >
                    Sign in
                  </Text>
                </Text>
              </VStack>
            </Box>
          </Flex>
        </Grid>
      </Container>
    </Box>
  );
}
