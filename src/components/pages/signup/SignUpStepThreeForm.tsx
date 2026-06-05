"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react";

import { FaCamera, FaCheck, FaIdCard } from "react-icons/fa";
import UploadBox from "@/components/common/UploadBox";
import StepItem from "@/components/common/StepItem";
import { useSignupStore } from "@/store/useSignupStore";
import { useFormikContext } from "formik";
import type { SignupFormValues } from "./SignUpForm";
import InputField from "@/components/common/InputField";
import Link from "next/link";

export default function SignUprStepThreeForm() {
  const prevStep = useSignupStore((state) => state.prevStep);
  const {
    values,
    errors,
    touched,
    setFieldValue,
    isSubmitting,
    submitForm,
    status,
  } = useFormikContext<SignupFormValues>();

  return (
    <Flex justify="center">
      <Box layerStyle="formCard">
        <VStack gap="6" align="stretch">
          <HStack gap="5">
            <StepItem number={1} label="Step 1 of 3" color="#0015D6" />
            <StepItem number={2} label="Step 2 of 3" color="#0015D6" />
            <StepItem number={3} label="Step 3 of 3" color="#0015D6" />
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
              earning opportunities.
            </Text>
          </Box>

          <VStack gap="4" align="stretch">
            <InputField
              name="nicNumber"
              title="NIC Number (Optional)"
              placeholder="Enter NIC number"
              type="text"
              helperText="Optional text field accepted by backend."
              required={false}
            />

            <UploadBox
              name="nicImage"
              title="Upload NIC / Driving Licence (Front)"
              icon={FaIdCard}
              helper="JPG, JPEG, PNG or WEBP (max 5MB)"
              value={values.nicImage}
              error={touched.nicImage ? errors.nicImage : undefined}
              onChange={(file) => setFieldValue("nicImage", file)}
            />

            <UploadBox
              name="selfieImage"
              title="Upload a Selfie"
              icon={FaCamera}
              helper="JPG, JPEG, PNG or WEBP (max 5MB)"
              value={values.selfieImage}
              error={touched.selfieImage ? errors.selfieImage : undefined}
              onChange={(file) => setFieldValue("selfieImage", file)}
            />
          </VStack>

          {status ? (
            <Text color="red.500" fontSize="sm">
              {status}
            </Text>
          ) : null}

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
              onClick={prevStep}
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
              type="button"
              onClick={async () => {
                await setFieldValue("nicImage", null);
                await setFieldValue("selfieImage", null);
                await submitForm();
              }}
              loading={isSubmitting}
            >
              Skip for now
            </Button>

            <Button
              name="submit"
              type="submit"
              flex="1.25"
              h="42px"
              bg="#0015D6"
              color="white"
              borderRadius="9px"
              fontWeight="700"
              _hover={{
                bg: "#000957",
              }}
              loading={isSubmitting}
            >
              Create account
            </Button>
          </HStack>

          <Text textStyle="smallText" textAlign="center" maxW="360px">
            Already have an account?{" "}
            <Link href="/login">
              <Text as="span" textStyle="link">
                Sign in
              </Text>
            </Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
}
