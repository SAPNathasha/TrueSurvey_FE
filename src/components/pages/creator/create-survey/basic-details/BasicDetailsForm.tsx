"use client";

import {
  Box,
  Button,
  Grid,
  HStack,
  Input,
  InputGroup,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { FiArrowRight, FiFileText } from "react-icons/fi";
import { useState } from "react";

import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";
import { getStoredCreatorId } from "@/lib/creatorIdentity";
import { toaster } from "@/components/ui/toaster";
import {
  createSurveyBasicDetails,
  type SurveyDraft,
} from "@/services/creatorSurveyService";
import CategoryDropdown from "./CategoryDropdown";

export type BasicDetailsFormValues = {
  surveyTitle: string;
  description: string;
  category: string;
  completionDays: string;
};

type BasicDetailsFormProps = {
  values: BasicDetailsFormValues;
  onChange: (values: BasicDetailsFormValues) => void;
  onNext: () => void;
  onDraftCreated: (survey: SurveyDraft) => void;
  existingDraftId?: string | null;
};

export default function BasicDetailsForm({
  values,
  onChange,
  onNext,
  onDraftCreated,
  existingDraftId,
}: BasicDetailsFormProps) {
  const creatorId = getStoredCreatorId();
  const descriptionLength = values.description.length;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setFieldValue = <K extends keyof BasicDetailsFormValues>(
    field: K,
    value: BasicDetailsFormValues[K]
  ) => {
    onChange({
      ...values,
      [field]: value,
    });
  };

  const validateForm = () => {
    if (!creatorId) {
      return "Creator id was not found. Please log in again.";
    }

    if (!values.surveyTitle.trim()) {
      return "Survey title is required.";
    }

    if (!values.description.trim()) {
      return "Survey description is required.";
    }

    if (!values.category.trim()) {
      return "Please select a survey category.";
    }

    const estimatedCompletionDays = Number(values.completionDays);

    if (!Number.isInteger(estimatedCompletionDays) || estimatedCompletionDays < 1) {
      return "Estimated completion days must be at least 1.";
    }

    return null;
  };

  const submitBasicDetails = async (advanceToNextStep: boolean) => {
    if (existingDraftId) {
      if (advanceToNextStep) {
        onNext();
      } else {
        toaster.create({
          type: "info",
          title: "Draft already saved",
          description: "Your survey draft has already been created.",
        });
      }
      return;
    }

    const validationMessage = validateForm();

    if (validationMessage) {
      toaster.create({
        type: "error",
        title: "Missing survey details",
        description: validationMessage,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await createSurveyBasicDetails({
        creatorId: creatorId as string,
        title: values.surveyTitle.trim(),
        description: values.description.trim(),
        category: values.category,
        estimatedCompletionDays: Number(values.completionDays),
      });

      onDraftCreated(response.survey);

      toaster.create({
        type: "success",
        title: advanceToNextStep ? "Basic details saved" : "Draft saved",
        description: response.message,
      });

      if (advanceToNextStep) {
        onNext();
      }
    } catch (error) {
      toaster.create({
        type: "error",
        title: "Could not save survey",
        description:
          error instanceof Error
            ? error.message
            : "Please try again in a moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardCard p="0" overflow="visible">
      <Box p={{ base: "5", lg: "7" }}>
        <VStack align="stretch" gap="7">
          <Box>
            <Text fontWeight="bold" fontSize="sm" mb="2">
              Survey Title{" "}
              <Text as="span" color="red.500">
                *
              </Text>
            </Text>

            <Input
              value={values.surveyTitle}
              onChange={(event) =>
                setFieldValue("surveyTitle", event.target.value)
              }
              placeholder="e.g., Customer Satisfaction Survey"
              h="46px"
              borderColor="brand.border"
              _focus={{
                borderColor: "brand.primary",
                boxShadow: "0 0 0 1px #0015D6",
              }}
              px={5}
            />

            <Text textStyle="smallText" mt="2">
              Give your survey a clear and concise title.
            </Text>
          </Box>

          <Box>
            <Text fontWeight="bold" fontSize="sm" mb="2">
              Survey Description{" "}
              <Text as="span" color="red.500">
                *
              </Text>
            </Text>

            <Textarea
              value={values.description}
              onChange={(event) => {
                if (event.target.value.length <= 500) {
                  setFieldValue("description", event.target.value);
                }
              }}
              placeholder="Short explanation of the survey purpose"
              minH="115px"
              resize="none"
              px={5}
              py={3}
              borderColor="brand.border"
              _focus={{
                borderColor: "brand.primary",
                boxShadow: "0 0 0 1px #0015D6",
              }}
            />

            <HStack justify="space-between" mt="2">
              <Text textStyle="smallText">
                Provide a brief overview of what this survey aims to achieve.
              </Text>

              <Text textStyle="smallText">{descriptionLength} / 500</Text>
            </HStack>
          </Box>

          <Grid templateColumns={{ base: "1fr", lg: "1fr 0.9fr" }} gap="4">
            <Box>
              <Text fontWeight="bold" fontSize="sm" mb="2">
                Survey Category / Domain{" "}
                <Text as="span" color="red.500">
                  *
                </Text>
              </Text>

              <CategoryDropdown
                value={values.category}
                onChange={(value) => setFieldValue("category", value)}
              />
            </Box>

            <Box>
              <Text fontWeight="bold" fontSize="sm" mb="2">
                Estimated Completion Time Days{" "}
                <Text as="span" color="red.500">
                  *
                </Text>
              </Text>

              <InputGroup
                endElement={
                  <Text color="brand.dark" fontSize="sm" pr="4">
                    Days
                  </Text>
                }
              >
                <Input
                  value={values.completionDays}
                  onChange={(event) =>
                    setFieldValue("completionDays", event.target.value)
                  }
                  type="number"
                  min="1"
                  h="46px"
                  px={5}
                  borderColor="brand.border"
                  _focus={{
                    borderColor: "brand.primary",
                    boxShadow: "0 0 0 1px #0015D6",
                  }}
                />
              </InputGroup>

              <Text textStyle="smallText" mt="2">
                Estimated time needed to complete the survey.
              </Text>
            </Box>
          </Grid>
        </VStack>
      </Box>

      <Box
        borderTopWidth="1px"
        borderColor="brand.border"
        px={{ base: "5", lg: "7" }}
        py="5"
      >
        <HStack justify="flex-end" gap="4" flexWrap="wrap">
          <Button
            variant="outline"
            px={5}
            py={3}
            onClick={() => {
              void submitBasicDetails(false);
            }}
            loading={isSubmitting}
          >
            <FiFileText />
            Save as Draft
          </Button>

          <Button px={5} py={3} variant="subtle">
            Cancel
          </Button>

          <Button
            px={5}
            py={3}
            color="white"
            onClick={() => {
              void submitBasicDetails(true);
            }}
            loading={isSubmitting}
          >
            Continue to Select Method <FiArrowRight />
          </Button>
        </HStack>
      </Box>
    </DashboardCard>
  );
}
