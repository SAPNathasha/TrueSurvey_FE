"use client";

import {
  Box,
  Button,
  Field,
  Grid,
  HStack,
  Input,
  InputGroup,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { FiArrowRight, FiFileText } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";
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
  surveyClosingTime: string;
};

type BasicDetailsFormProps = {
  values: BasicDetailsFormValues;
  onChange: (values: BasicDetailsFormValues) => void;
  onNext: () => void;
  onDraftCreated: (survey: SurveyDraft) => void;
  existingDraftId?: string | null;
};

const basicDetailsSchema = Yup.object({
  surveyTitle: Yup.string()
    .trim()
    .max(150, "Survey title must be 150 characters or fewer.")
    .required("Survey title is required."),
  description: Yup.string()
    .trim()
    .max(500, "Survey description must be 500 characters or fewer.")
    .required("Survey description is required."),
  category: Yup.string().trim().required("Please select a survey category."),
  completionDays: Yup.string()
    .required("Estimated completion days is required.")
    .test(
      "completion-days",
      "Estimated completion days must be at least 1.",
      (value) => {
        const numericValue = Number(value);
        return Number.isInteger(numericValue) && numericValue >= 1;
      }
    ),
  surveyClosingTime: Yup.string()
    .required("Survey closing time is required.")
    .test(
      "valid-closing-time",
      "Choose a valid survey closing date and time.",
      (value) => {
        if (!value?.trim()) {
          return false;
        }

        return !Number.isNaN(new Date(value).getTime());
      }
    ),
});

function toUnixSeconds(value: string) {
  return Math.floor(new Date(value).getTime() / 1000);
}

export default function BasicDetailsForm({
  values,
  onChange,
  onNext,
  onDraftCreated,
  existingDraftId,
}: BasicDetailsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitActionRef = useRef<"draft" | "next">("next");
  const formik = useFormik<BasicDetailsFormValues>({
    initialValues: values,
    validationSchema: basicDetailsSchema,
    onSubmit: async (formValues) => {
      const advanceToNextStep = submitActionRef.current === "next";

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

      try {
        setIsSubmitting(true);
        const response = await createSurveyBasicDetails({
          title: formValues.surveyTitle.trim(),
          description: formValues.description.trim(),
          category: formValues.category,
          estimatedCompletionDays: Number(formValues.completionDays),
          surveyClosingTime: toUnixSeconds(formValues.surveyClosingTime),
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
    },
  });
  const descriptionLength = formik.values.description.length;

  useEffect(() => {
    onChange(formik.values);
  }, [formik.values, onChange]);

  const shouldShowError = (field: keyof BasicDetailsFormValues) =>
    Boolean(formik.errors[field] && (formik.touched[field] || formik.submitCount > 0));

  const submitBasicDetails = async (advanceToNextStep: boolean) => {
    submitActionRef.current = advanceToNextStep ? "next" : "draft";
    await formik.submitForm();
  };

  return (
    <DashboardCard p="0" overflow="visible">
      <Box p={{ base: "5", lg: "7" }}>
        <VStack align="stretch" gap="7">
          <Field.Root invalid={shouldShowError("surveyTitle")}>
            <Field.Label fontWeight="bold" fontSize="sm" mb="2">
              Survey Title{" "}
              <Text as="span" color="red.500">
                *
              </Text>
            </Field.Label>

            <Input
              name="surveyTitle"
              value={formik.values.surveyTitle}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
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
            <Field.ErrorText>{formik.errors.surveyTitle}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={shouldShowError("description")}>
            <Field.Label fontWeight="bold" fontSize="sm" mb="2">
              Survey Description{" "}
              <Text as="span" color="red.500">
                *
              </Text>
            </Field.Label>

            <Textarea
              name="description"
              value={formik.values.description}
              onChange={(event) => {
                if (event.target.value.length <= 500) {
                  formik.setFieldValue("description", event.target.value);
                }
              }}
              onBlur={formik.handleBlur}
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
            <Field.ErrorText>{formik.errors.description}</Field.ErrorText>
          </Field.Root>

          <Grid templateColumns={{ base: "1fr", lg: "1fr 0.9fr" }} gap="4">
            <Field.Root invalid={shouldShowError("category")}>
              <Field.Label fontWeight="bold" fontSize="sm" mb="2">
                Survey Category / Domain{" "}
                <Text as="span" color="red.500">
                  *
                </Text>
              </Field.Label>

              <CategoryDropdown
                value={formik.values.category}
                onChange={(value) => {
                  formik.setFieldValue("category", value);
                  formik.setFieldTouched("category", true, false);
                }}
              />
              <Field.ErrorText>{formik.errors.category}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={shouldShowError("completionDays")}>
              <Field.Label fontWeight="bold" fontSize="sm" mb="2">
                Estimated Completion Time for survey in minutes{" "}
                <Text as="span" color="red.500">
                  *
                </Text>
              </Field.Label>

              <InputGroup
                endElement={
                  <Text color="brand.dark" fontSize="sm" pr="4">
                    Mins
                  </Text>
                }
              >
                <Input
                  name="completionDays"
                  value={formik.values.completionDays}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
              <Field.ErrorText>{formik.errors.completionDays}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={shouldShowError("surveyClosingTime")}>
              <Field.Label fontWeight="bold" fontSize="sm" mb="2">
                Survey Closing Time{" "}
                <Text as="span" color="red.500">
                  *
                </Text>
              </Field.Label>

              <Input
                name="surveyClosingTime"
                value={formik.values.surveyClosingTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="datetime-local"
                h="46px"
                px={5}
                borderColor="brand.border"
                _focus={{
                  borderColor: "brand.primary",
                  boxShadow: "0 0 0 1px #0015D6",
                }}
              />

              <Text textStyle="smallText" mt="2">
                Choose when this survey should stop accepting responses.
              </Text>
              <Field.ErrorText>{formik.errors.surveyClosingTime}</Field.ErrorText>
            </Field.Root>
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
