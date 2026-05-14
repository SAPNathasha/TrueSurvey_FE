"use client";
import IconBox from "@/components/common/IconBox";
import { IoPeople } from "react-icons/io5";
import { MdOutlineSecurity } from "react-icons/md";
import { CiGift } from "react-icons/ci";
import { RiErrorWarningFill } from "react-icons/ri";
import { HiUpload } from "react-icons/hi";
import {
  Flex,
  Container,
  Heading,
  Text,
  Image,
  Grid,
  Icon,
  Box,
  FileUpload,
  Button,
} from "@chakra-ui/react";

export default function RegisterStepThreePage() {
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
                <Box color={"#0015D6"} height="10" order="2">
                  Step 2
                </Box>
                <Box color={"#0015D6"} height="10" order="2">
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
                Optional identity verification
              </Heading>
              <Text
                fontSize="12px"
                fontWeight="regular"
                color="brand.contrast"
                letterSpacing="tight"
                lineHeight="1.1"
                textAlign="center"
              >
                Verify your account to access more surveys and increase your
                earning opportunities
              </Text>

              <Box background="white" width="full" padding="2" color="black">
                <FileUpload.Root w="full">
                  <FileUpload.HiddenInput />
                  <FileUpload.Trigger asChild>
                    <Button
                      variant="outline"
                      w="full"
                      h="75px"
                      justifyContent="center"
                      bg="#577ac145"
                      border="1px solid #5c5c5c"
                      color="black"
                      _hover={{ bg: "#0015D6" }}
                      borderRadius={10}
                      onClick={() => {}}
                    >
                      <Flex gap="4" direction="column" >
                        <Flex gap="4" direction="row" justifyContent="center">
                          <HiUpload /> Upload file
                        </Flex>

                        <Text
                          fontSize="12px"
                          fontWeight="regular"
                          color="#a0a0a0"
                          letterSpacing="tight"
                          lineHeight="1.4"
                          textAlign="center"
                        >
                          Drag and drop your file here, or click to browse{" "}
                          <br></br> JPG,PNG or PDF
                        </Text>
                      </Flex>
                    </Button>
                  </FileUpload.Trigger>
                  <FileUpload.List />
                </FileUpload.Root>
              </Box>
              <Box background="white" width="full" padding="2" color="black">
                <FileUpload.Root w="full">
                  <FileUpload.HiddenInput />
                  <FileUpload.Trigger asChild>
                    <Button
                      variant="outline"
                      w="full"
                      h="75px"
                      justifyContent="center"
                      bg="#577ac145"
                      border="1px solid #5c5c5c"
                      color="black"
                      _hover={{ bg: "#0015D6" }}
                      borderRadius={10}
                      onClick={() => {}}
                    >
                      <HiUpload /> Upload file
                    </Button>
                  </FileUpload.Trigger>
                  <FileUpload.List />
                </FileUpload.Root>
              </Box>

              <Flex pt="20px" gap="4" justify="center" direction="row">
                <Icon size="md" color="rgb(143, 143, 143)">
                  <RiErrorWarningFill />
                </Icon>
                <Text
                  fontSize="12px"
                  color="#A0A0A0"
                  textAlign="left"
                  maxW="360px"
                >
                  If you choose Participant or Both, the next step lets you
                  optionally verify your identity.
                </Text>
              </Flex>

              <Flex w="full" gap="4" direction="row">
                <Button
                  flex="1"
                  bg="#ffffff"
                  border="1px solid #5c5c5c"
                  color="black"
                  _hover={{ bg: "#b4b4b487" }}
                  borderRadius={10}
                  onClick={() => {}}
                >
                  Back
                </Button>

                <Button
                  flex="1"
                  bg="#0015D6"
                  color="white"
                  _hover={{ bg: "#000957" }}
                  borderRadius={10}
                  onClick={() => {}}
                >
                  Next
                </Button>
              </Flex>

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
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
