"use client";

import {
  Box,
  Button,
  Grid,
  HStack,
  Input,
  NativeSelect,
  Text,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiFileText,
  FiInfo,
  FiMapPin,
  FiShield,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { LuGraduationCap } from "react-icons/lu";

import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";
import { toaster } from "@/components/ui/toaster";
import { getStoredCreatorId } from "@/lib/creatorIdentity";
import {
  getEstimatedAudienceReach,
  setTargetAudience,
  type AudienceGender,
  type EstimateAudienceReachPayload,
  type SetTargetAudiencePayload,
  type SurveyAudienceType,
} from "@/services/creatorSurveyService";

type TargetAudienceStepProps = {
  onBack: () => void;
  onNext: () => void;
};

type AudienceTagProps = {
  icon: React.ReactNode;
  label: string;
  bg: string;
  color: string;
  borderColor: string;
};

type TargetAudienceFormValues = {
  minimumAge: string;
  maximumAge: string;
  gender: AudienceGender;
  city: string;
  educationLevel: string;
  district: string;
  occupation: string;
  sampleBase: SurveyAudienceType;
};

const targetAudienceStorageKey = "creatorTargetAudience";

const initialValues: TargetAudienceFormValues = {
  minimumAge: "18",
  maximumAge: "45",
  gender: "ALL",
  city: "Colombo",
  educationLevel: "Undergraduate / Bachelor's Degree",
  district: "Colombo District",
  occupation: "Executive / Student / Any",
  sampleBase: "VERIFIED_USERS_ONLY",
};

const genderLabels: Record<AudienceGender, string> = {
  ALL: "All genders",
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

const sampleBaseLabels: Record<SurveyAudienceType, string> = {
  GENERAL: "General",
  CUSTOMERS: "Customers",
  VISITORS: "Visitors",
  EMPLOYEES: "Employees",
  VERIFIED_USERS_ONLY: "Verified users only",
};

function getStoredDraftId() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("creatorSurveyDraftId");
}

function getStoredTargetAudience(surveyId: string | null) {
  if (typeof window === "undefined" || !surveyId) {
    return null;
  }

  const stored = window.localStorage.getItem(
    `${targetAudienceStorageKey}:${surveyId}`
  );

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as TargetAudienceFormValues & {
      estimatedReach?: number;
    };
  } catch {
    return null;
  }
}

function persistTargetAudience(
  surveyId: string | null,
  values: TargetAudienceFormValues,
  estimatedReach?: number
) {
  if (typeof window === "undefined" || !surveyId) {
    return;
  }

  window.localStorage.setItem(
    `${targetAudienceStorageKey}:${surveyId}`,
    JSON.stringify({
      ...values,
      estimatedReach,
    })
  );
}

function updateStoredDraftAudience(
  surveyId: string,
  audience: string | null,
  currentStep: string
) {
  if (typeof window === "undefined") {
    return;
  }

  const storedDraft = window.localStorage.getItem("creatorSurveyDraft");

  if (!storedDraft) {
    return;
  }

  try {
    const parsedDraft = JSON.parse(storedDraft) as Record<string, unknown>;

    if (parsedDraft.id !== surveyId) {
      return;
    }

    window.localStorage.setItem(
      "creatorSurveyDraft",
      JSON.stringify({
        ...parsedDraft,
        audience,
        currentStep,
      })
    );
  } catch {
    // Ignore malformed local draft payloads.
  }
}

function AudienceTag({
  icon,
  label,
  bg,
  color,
  borderColor,
}: AudienceTagProps) {
  return (
    <HStack
      gap="2"
      px="4"
      py="2"
      borderRadius="8px"
      borderWidth="1px"
      borderColor={borderColor}
      bg={bg}
      color={color}
      fontSize="sm"
      fontWeight="medium"
    >
      {icon}
      <Text>{label}</Text>
    </HStack>
  );
}

export default function TargetAudienceStep({
  onBack,
  onNext,
}: TargetAudienceStepProps) {
  const creatorId = getStoredCreatorId();
  const surveyId = getStoredDraftId();
  const storedAudience = getStoredTargetAudience(surveyId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingEstimatedReach, setIsCheckingEstimatedReach] = useState(false);
  const [formValues, setFormValues] = useState<TargetAudienceFormValues>(
    storedAudience
      ? {
          minimumAge: storedAudience.minimumAge || initialValues.minimumAge,
          maximumAge: storedAudience.maximumAge || initialValues.maximumAge,
          gender: storedAudience.gender || initialValues.gender,
          city: storedAudience.city || initialValues.city,
          educationLevel:
            storedAudience.educationLevel || initialValues.educationLevel,
          district: storedAudience.district || initialValues.district,
          occupation: storedAudience.occupation || initialValues.occupation,
          sampleBase: storedAudience.sampleBase || initialValues.sampleBase,
        }
      : initialValues
  );
  const [serverEstimatedReach, setServerEstimatedReach] = useState<number | null>(
    storedAudience?.estimatedReach ?? null
  );

  const estimatedReach = useMemo(() => {
    if (serverEstimatedReach !== null) {
      return serverEstimatedReach.toLocaleString();
    }

    let reach = 2400;

    if (formValues.sampleBase === "CUSTOMERS") reach -= 450;
    if (formValues.sampleBase === "VISITORS") reach -= 350;
    if (formValues.sampleBase === "EMPLOYEES") reach -= 600;
    if (formValues.sampleBase === "VERIFIED_USERS_ONLY") reach -= 900;
    if (formValues.gender !== "ALL") reach -= 250;
    if (formValues.city.trim() && formValues.city.trim().toLowerCase() !== "any city") {
      reach -= 300;
    }
    if (
      formValues.educationLevel &&
      formValues.educationLevel !== "Any education level"
    ) {
      reach -= 180;
    }

    return Math.max(reach, 500).toLocaleString();
  }, [formValues, serverEstimatedReach]);

  const setFieldValue = <K extends keyof TargetAudienceFormValues>(
    field: K,
    value: TargetAudienceFormValues[K]
  ) => {
    setServerEstimatedReach(null);
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const buildTargetAudiencePayload = (): SetTargetAudiencePayload | string => {
    if (!creatorId) {
      return "Creator id was not found. Please log in again.";
    }

    if (!surveyId) {
      return "Survey draft was not found. Please complete the previous steps first.";
    }

    const payload: SetTargetAudiencePayload = {
      creatorId,
      surveyId,
      sampleBase: formValues.sampleBase,
    };

    const minimumAge = formValues.minimumAge.trim();
    const maximumAge = formValues.maximumAge.trim();

    if (minimumAge) {
      const parsedMinimumAge = Number(minimumAge);

      if (!Number.isInteger(parsedMinimumAge) || parsedMinimumAge < 13 || parsedMinimumAge > 100) {
        return "Minimum age must be a whole number between 13 and 100.";
      }

      payload.minimumAge = parsedMinimumAge;
    }

    if (maximumAge) {
      const parsedMaximumAge = Number(maximumAge);

      if (!Number.isInteger(parsedMaximumAge) || parsedMaximumAge < 13 || parsedMaximumAge > 100) {
        return "Maximum age must be a whole number between 13 and 100.";
      }

      payload.maximumAge = parsedMaximumAge;
    }

    if (
      payload.minimumAge !== undefined &&
      payload.maximumAge !== undefined &&
      payload.minimumAge > payload.maximumAge
    ) {
      return "Minimum age cannot be greater than maximum age.";
    }

    if (formValues.gender !== "ALL") {
      payload.gender = formValues.gender;
    }

    const city = formValues.city.trim();
    const district = formValues.district.trim();
    const educationLevel = formValues.educationLevel.trim();
    const occupation = formValues.occupation.trim();

    if (city && city.toLowerCase() !== "any city") {
      payload.city = city;
    }

    if (district && district !== "Any district") {
      payload.district = district;
    }

    if (educationLevel && educationLevel !== "Any education level") {
      payload.educationLevel = educationLevel;
    }

    if (occupation && occupation !== "Any") {
      payload.occupation = occupation;
    }

    return payload;
  };

  const buildEstimatePayload = (): EstimateAudienceReachPayload | string => {
    const payload = buildTargetAudiencePayload();

    if (typeof payload === "string") {
      return payload;
    }

    return {
      ...payload,
      userId: payload.creatorId,
    };
  };

  const checkEstimatedReach = async (showErrorToast = true) => {
    const payload = buildEstimatePayload();

    if (typeof payload === "string") {
      if (showErrorToast) {
        toaster.create({
          type: "error",
          title: "Estimated audience unavailable",
          description: payload,
        });
      }
      return;
    }

    try {
      setIsCheckingEstimatedReach(true);
      const response = await getEstimatedAudienceReach(payload);
      setServerEstimatedReach(response.estimatedReach);
      persistTargetAudience(payload.surveyId, formValues, response.estimatedReach);
    } catch (error) {
      if (showErrorToast) {
        toaster.create({
          type: "error",
          title: "Could not check estimated audience",
          description:
            error instanceof Error
              ? error.message
              : "Please try again in a moment.",
        });
      }
    } finally {
      setIsCheckingEstimatedReach(false);
    }
  };

  useEffect(() => {
    if (!creatorId || !surveyId) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void checkEstimatedReach(false);
    }, 0);

    // We only want this when the step is entered for the current draft.
    // The manual button handles recalculation after field edits.
    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creatorId, surveyId]);

  const submitTargetAudience = async (advanceToNextStep: boolean) => {
    const payload = buildTargetAudiencePayload();

    if (typeof payload === "string") {
      toaster.create({
        type: "error",
        title: "Target audience is incomplete",
        description: payload,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await setTargetAudience(payload);
      setServerEstimatedReach(response.targetAudience.estimatedReach);
      persistTargetAudience(
        payload.surveyId,
        formValues,
        response.targetAudience.estimatedReach
      );
      updateStoredDraftAudience(
        payload.surveyId,
        response.survey.audience,
        response.survey.currentStep
      );

      toaster.create({
        type: "success",
        title: advanceToNextStep ? "Target audience saved" : "Draft updated",
        description: response.message,
      });

      if (advanceToNextStep) {
        onNext();
      }
    } catch (error) {
      toaster.create({
        type: "error",
        title: "Could not save target audience",
        description:
          error instanceof Error ? error.message : "Please try again in a moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Box
        bg="brand.lightBlue"
        borderWidth="1px"
        borderColor="#D7E3FF"
        borderRadius="12px"
        px="5"
        py="4"
        mb="5"
      >
        <HStack gap="3" align="start">
          <Box color="brand.primary" pt="1">
            <FiInfo />
          </Box>

          <Text fontSize="sm" color="brand.mutedText">
            Define who should receive this survey by selecting your audience
            filters. You can refine age, location, education, occupation, and
            user verification preferences before continuing.
          </Text>
        </HStack>
      </Box>

      <DashboardCard p="0">
        <Box p={{ base: "5", lg: "7" }}>
          <Text fontSize="xl" fontWeight="bold" color="brand.dark" mb="5">
            Audience Filters
          </Text>

          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="5">
            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb="2">
                Minimum Age
              </Text>

              <Input
                type="number"
                value={formValues.minimumAge}
                onChange={(event) => setFieldValue("minimumAge", event.target.value)}
                h="46px"
                borderColor="brand.border"
                px="4"
                _focus={{
                  borderColor: "brand.primary",
                  boxShadow: "0 0 0 1px #0015D6",
                }}
              />
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb="2">
                Maximum Age
              </Text>

              <Input
                type="number"
                value={formValues.maximumAge}
                onChange={(event) => setFieldValue("maximumAge", event.target.value)}
                h="46px"
                borderColor="brand.border"
                px="4"
                _focus={{
                  borderColor: "brand.primary",
                  boxShadow: "0 0 0 1px #0015D6",
                }}
              />
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb="2">
                Gender
              </Text>

              <NativeSelect.Root>
                <NativeSelect.Field
                  value={formValues.gender}
                  onChange={(event) =>
                    setFieldValue("gender", event.target.value as AudienceGender)
                  }
                  h="46px"
                  borderColor="brand.border"
                >
                  <option value="ALL">All</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb="2">
                City
              </Text>

              <Input
                value={formValues.city}
                onChange={(event) => setFieldValue("city", event.target.value)}
                placeholder="e.g., Colombo"
                h="46px"
                borderColor="brand.border"
                px="4"
                _focus={{
                  borderColor: "brand.primary",
                  boxShadow: "0 0 0 1px #0015D6",
                }}
              />
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb="2">
                Education Level
              </Text>

              <NativeSelect.Root>
                <NativeSelect.Field
                  value={formValues.educationLevel}
                  onChange={(event) =>
                    setFieldValue("educationLevel", event.target.value)
                  }
                  h="46px"
                  borderColor="brand.border"
                  px={5}
                >
                  <option value="Any education level">Any education level</option>
                  <option value="School Student">School Student</option>
                  <option value="Undergraduate / Bachelor's Degree">
                    Undergraduate / Bachelor&apos;s Degree
                  </option>
                  <option value="Diploma / Certificate">
                    Diploma / Certificate
                  </option>
                  <option value="Master's Degree">Master&apos;s Degree</option>
                  <option value="PhD / Doctorate">PhD / Doctorate</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb="2">
                District
              </Text>

              <NativeSelect.Root>
                <NativeSelect.Field
                  value={formValues.district}
                  onChange={(event) => setFieldValue("district", event.target.value)}
                  h="46px"
                  borderColor="brand.border"
                  px={5}
                >
                  <option value="Any district">Any district</option>
                  <option value="Colombo District">Colombo District</option>
                  <option value="Gampaha District">Gampaha District</option>
                  <option value="Kandy District">Kandy District</option>
                  <option value="Galle District">Galle District</option>
                  <option value="Kurunegala District">Kurunegala District</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb="2">
                Occupation
              </Text>

              <NativeSelect.Root>
                <NativeSelect.Field
                  value={formValues.occupation}
                  onChange={(event) => setFieldValue("occupation", event.target.value)}
                  h="46px"
                  borderColor="brand.border"
                  px={5}
                >
                  <option value="Any">Any</option>
                  <option value="Student">Student</option>
                  <option value="Executive / Student / Any">
                    Executive / Student / Any
                  </option>
                  <option value="Business Owner">Business Owner</option>
                  <option value="Government Employee">Government Employee</option>
                  <option value="Private Sector Employee">
                    Private Sector Employee
                  </option>
                  <option value="Freelancer">Freelancer</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb="2">
                Sample Base
              </Text>

              <NativeSelect.Root>
                <NativeSelect.Field
                  value={formValues.sampleBase}
                  onChange={(event) =>
                    setFieldValue(
                      "sampleBase",
                      event.target.value as SurveyAudienceType
                    )
                  }
                  h="46px"
                  borderColor="brand.border"
                  px={5}
                >
                  <option value="GENERAL">General</option>
                  <option value="CUSTOMERS">Customers</option>
                  <option value="VISITORS">Visitors</option>
                  <option value="EMPLOYEES">Employees</option>
                  <option value="VERIFIED_USERS_ONLY">
                    Verified users only
                  </option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Box>
          </Grid>
        </Box>
      </DashboardCard>

      <DashboardCard mt="5" p="0">
        <Box p={{ base: "5", lg: "6" }}>
          <Text fontSize="xl" fontWeight="bold" color="brand.dark" mb="4">
            Audience Summary
          </Text>

          <HStack gap="4" flexWrap="wrap">
            <AudienceTag
              icon={<FiUsers />}
              label={`Age ${formValues.minimumAge || "13"}-${formValues.maximumAge || "100"}`}
              bg="#EEF2FF"
              color="brand.primary"
              borderColor="#C7D2FE"
            />

            <AudienceTag
              icon={<FiMapPin />}
              label={formValues.city.trim() || "Any city"}
              bg="#ECFDF3"
              color="#087A35"
              borderColor="#BBF7D0"
            />

            <AudienceTag
              icon={<FiShield />}
              label={sampleBaseLabels[formValues.sampleBase]}
              bg="#F5F3FF"
              color="#6D28D9"
              borderColor="#DDD6FE"
            />

            <AudienceTag
              icon={<LuGraduationCap />}
              label={
                formValues.educationLevel.includes("Undergraduate")
                  ? "Undergraduate"
                  : formValues.educationLevel
              }
              bg="#FFF7ED"
              color="#C2410C"
              borderColor="#FED7AA"
            />

            <AudienceTag
              icon={<FiUsers />}
              label={genderLabels[formValues.gender]}
              bg="#F0F9FF"
              color="#0369A1"
              borderColor="#BAE6FD"
            />
          </HStack>
        </Box>
      </DashboardCard>

      <DashboardCard mt="5" p="0">
        <Box p={{ base: "5", lg: "6" }}>
          <HStack justify="space-between" flexWrap="wrap" gap="5">
            <HStack gap="4">
              <Box
                w="64px"
                h="64px"
                borderRadius="full"
                bg="brand.lightBlue"
                color="brand.primary"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="30px"
              >
                <FiUsers />
              </Box>

              <Box>
                <Text fontWeight="bold" color="brand.dark">
                  Estimated Reach
                </Text>

                <Text fontSize="sm" color="brand.mutedText">
                  Approximate matched users
                </Text>

                <Text
                  fontSize={{ base: "3xl", lg: "4xl" }}
                  fontWeight="extrabold"
                  color="brand.primary"
                  lineHeight="1.1"
                  mt="1"
                >
                  {estimatedReach}
                </Text>
              </Box>
            </HStack>

            <HStack gap="3" color="brand.mutedText">
              <Box color="green.500">
                <FiTrendingUp />
              </Box>

              <Box>
                <Text fontSize="sm" maxW="230px">
                  Based on your current audience filters
                </Text>

                <Button
                  mt="3"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    void checkEstimatedReach(true);
                  }}
                  loading={isCheckingEstimatedReach}
                  disabled={isSubmitting}
                >
                  Check Estimated Audience
                </Button>
              </Box>
            </HStack>
          </HStack>
        </Box>
      </DashboardCard>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr 1fr" }} gap="4" mt="5">
        <Button h="46px" variant="outline" onClick={onBack}>
          <FiArrowLeft />
          Back to Create Questions
        </Button>

        <Button
          h="46px"
          variant="outline"
          onClick={() => {
            void submitTargetAudience(false);
          }}
          loading={isSubmitting}
        >
          <FiFileText />
          Save as Draft
        </Button>

        <Button
          h="46px"
          color="white"
          onClick={() => {
            void submitTargetAudience(true);
          }}
          px={5}
          loading={isSubmitting}
        >
          Continue
          <FiArrowRight />
        </Button>
      </Grid>
    </Box>
  );
}
