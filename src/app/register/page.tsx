import { Flex, Container, Box } from "@chakra-ui/react";
import SignUpLeftBox from "@/components/pages/signup/SignUpLeftBox";
import SignupForm from "@/components/pages/signup/SignUpForm";

export default function RegisterPage() {

  return (
    <Box bg="white" minH="100vh" py="20">
      <Container maxW="1200px" mx="auto">
        <Flex gap="10" direction="row" alignItems="center">
          <Box bg="white" minH="100vh" py="20">
            <Container maxW="1200px" mx="auto">
              <Flex gap="10" direction="row" alignItems="center">
                <SignUpLeftBox />
                <SignupForm/>
              </Flex>
            </Container>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
