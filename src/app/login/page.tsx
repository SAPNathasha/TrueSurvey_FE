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
              Welcome back to
              <br />
              <Text as="span" color="#0015D6">
                TrueSurvey
              </Text>
            </Heading>

            <Text
              fontSize="17px"
              fontWeight="regular"
              color="#A0A0A0"
              letterSpacing="tight"
              lineHeight="1.1"
            >
              Sign in to create surveys, participate and earn rewards.
            </Text>
            <Image
              height="380px"
              width="100%"
              objectFit="contain"
              src="/LoginImage.png"
              alt="Login image"
            />
            <Grid templateColumns="repeat(3, 1fr)" gap="6">
              <Flex gap="4" direction="row">
                <Image height="60px" src="/lg1.png" alt="Login icon 1" />
                <Flex gap="4" direction="column">
                  <Heading
                    fontSize="15px"
                    fontWeight="bold"
                    color="black"
                    letterSpacing="tight"
                    lineHeight="1.1"
                  >
                    For Everyone
                  </Heading>
                  <Text
                    fontSize="12px"
                    fontWeight="regular"
                    color="#A0A0A0"
                    letterSpacing="tight"
                    lineHeight="1.1"
                  >
                    Whether you want to build surveys, we have got you.
                  </Text>
                </Flex>
              </Flex>
              <Flex gap="4" direction="row">
                <Image height="60px" src="/lg1.png" alt="Login icon 1" />
                <Flex gap="4" direction="column">
                  <Heading
                    fontSize="15px"
                    fontWeight="bold"
                    color="black"
                    letterSpacing="tight"
                    lineHeight="1.1"
                  >
                    For Everyone
                  </Heading>
                  <Text
                    fontSize="12px"
                    fontWeight="regular"
                    color="#A0A0A0"
                    letterSpacing="tight"
                    lineHeight="1.1"
                  >
                    Whether you want to build surveys, we have got you.
                  </Text>
                </Flex>
              </Flex>
              <Flex gap="4" direction="row">
                <Image height="60px" src="/lg1.png" alt="Login icon 1" />
                <Flex gap="4" direction="column">
                  <Heading
                    fontSize="15px"
                    fontWeight="bold"
                    color="black"
                    letterSpacing="tight"
                    lineHeight="1.1"
                  >
                    For Everyone
                  </Heading>
                  <Text
                    fontSize="12px"
                    fontWeight="regular"
                    color="#A0A0A0"
                    letterSpacing="tight"
                    lineHeight="1.1"
                  >
                    Whether you want to build surveys, we have got you.
                  </Text>
                </Flex>
              </Flex>
            </Grid>
          </Flex>

          <Flex
            gap="4"
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              width="450px"
              height="600px"
              bg="white"
              boxShadow="2px 4px 25px 4px rgba(0, 0, 0, 0.15)"
              borderRadius="md"
              p="6"
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap="4"
            >
              <Image height="50px" src="/Logo.png" alt="Login icon 1" />
              <Heading
                fontSize="30px"
                fontWeight="bold"
                color="black"
                letterSpacing="tight"
                lineHeight="1.1"
                textAlign="center"
              >
                Login
              </Heading>
              <Text
                fontSize="12px"
                fontWeight="regular"
                color="#a0a0a0"
                letterSpacing="tight"
                lineHeight="1.1"
                textAlign="center"
              >
                Access your creator or participant account
              </Text>
              <Field.Root required width="100%" maxW="360px">
                <Field.Label fontSize="12px" color="black">
                  Email <Field.RequiredIndicator />
                </Field.Label>
                <Input color="#000000" padding={5} borderRadius={10} placeholder="you@example.com" />
              </Field.Root>
              <Field.Root required width="100%" maxW="360px">
                <Field.Label fontSize="12px" color="black">
                  Password <Field.RequiredIndicator />
                </Field.Label>
                <Input color="#000000" padding={5} borderRadius={10} type="password" placeholder="********" />
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
                  <Checkbox.Label fontSize="12px" color="#A0A0A0">
                    Remember me
                  </Checkbox.Label>
                </Checkbox.Root>

                <Text fontSize="13px" color="#0015D6" cursor="pointer">
                  Forgot password?
                </Text>
              </Flex>
              <Button
                width="100%"
                maxW="360px"
                bg="#0015D6"
                color="white"
                _hover={{ bg: "#000957" }}
                borderRadius={10}
              >
                Sign in
              </Button>

              <Button
                width="100%"
                maxW="360px"
                variant="outline"
                bg="#0015d600"
                color="#0015D6"
                _hover={{ bg: "#F4F4F4" }}
                borderRadius={10}
              >
                Create an account
              </Button>

              <Text
                fontSize="12px"
                color="#A0A0A0"
                textAlign="center"
                maxW="360px"
              >
                TrueSurvey is for both survey creators and participants.By
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
