"use client";

import InputField from "@/components/common/InputField";
import {
  Flex,
  Heading,
  Text,
  Image,
  Box,
  Checkbox,
  Button,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

const initialValues: LoginFormValues = {
  email: "",
  password: "",
  rememberMe: false,
};

const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  rememberMe: Yup.boolean(),
});

export default function LoginForm() {
  const handleLogin = (values: LoginFormValues) => {
    console.log("Login values:", values);

    // Later you can call your backend login API here
  };

  return (
    <Flex flex="1" alignItems="center" justifyContent="center">
      <Box layerStyle="formCard">
        <Image height="50px" src="/Logo.png" alt="TrueSurvey logo" />

        <Heading textStyle="h2" color="black" textAlign="center">
          Login
        </Heading>

        <Text textStyle="smallText" textAlign="center">
          Access your creator or participant account
        </Text>

        <Formik
          initialValues={initialValues}
          validationSchema={loginValidationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form style={{ width: "100%" }}>
              <Flex direction="column" alignItems="center" gap="4">
                <InputField
                  name="email"
                  title="Email"
                  placeholder="Enter your email"
                  type="email"
                />

                <InputField
                  name="password"
                  title="Password"
                  placeholder="Enter your password"
                  type="password"
                />

                <Flex
                  width="100%"
                  maxW="360px"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Checkbox.Root
                    checked={values.rememberMe}
                    onCheckedChange={(details) =>
                      setFieldValue("rememberMe", Boolean(details.checked))
                    }
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label textStyle="smallText">
                      Remember me
                    </Checkbox.Label>
                  </Checkbox.Root>

                  <Text textStyle="link">Forgot password?</Text>
                </Flex>

                <Button
                  width="100%"
                  maxW="360px"
                  variant="solid"
                  type="submit"
                  loading={isSubmitting}
                >
                  Login
                </Button>

                <Button width="100%" maxW="360px" variant="outline" type="button">
                  Create an account
                </Button>

                <Text textStyle="smallText" textAlign="center" maxW="360px">
                  TrueSurvey is for both survey creators and participants. By
                  signing in, you agree to our Terms of Service and Privacy
                  Policy.
                </Text>
              </Flex>
            </Form>
          )}
        </Formik>
      </Box>
    </Flex>
  );
}