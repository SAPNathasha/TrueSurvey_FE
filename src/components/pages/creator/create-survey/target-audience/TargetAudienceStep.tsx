"use client";

import {
  Box,
  Button,
  Field,
  Grid,
  HStack,
  Input,
  NativeSelect,
  Portal,
  Text,
  Combobox,
  createListCollection,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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
import * as Yup from "yup";

import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";
import { toaster } from "@/components/ui/toaster";
import {
  getEstimatedAudienceReach,
  setTargetAudience,
  type AudienceGender,
  type EstimateAudienceReachPayload,
  type SetTargetAudiencePayload,
  type SurveyAudienceType,
} from "@/services/creatorSurveyService";
import {
  getCities,
  getDistricts,
  getProvinces,
  type LocationOption,
} from "@/services/locationService";

type TargetAudienceStepProps = {
  onBack: () => void;
  onNext: () => void;
};

type AudienceTagProps = {
  icon: ReactNode;
  label: string;
  bg: string;
  color: string;
  borderColor: string;
};

type TargetAudienceFormValues = {
  minimumAge: string;
  maximumAge: string;
  gender: AudienceGender;
  provinceId: string;
  province: string;
  cityId: string;
  city: string;
  educationLevel: string;
  districtId: string;
  district: string;
  occupation: string;
  sampleBase: SurveyAudienceType;
};

const targetAudienceStorageKey = "creatorTargetAudience";

const initialValues: TargetAudienceFormValues = {
  minimumAge: "18",
  maximumAge: "45",
  gender: "ALL",
  provinceId: "",
  province: "Any province",
  cityId: "",
  city: "Any city",
  educationLevel: "Any education level",
  districtId: "",
  district: "Any district",
  occupation: "Any",
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

const targetAudienceSchema = Yup.object({
  minimumAge: Yup.string().test(
    "minimum-age",
    "Minimum age must be a whole number between 13 and 100.",
    (value) => {
      if (!value?.trim()) {
        return true;
      }

      const numericValue = Number(value);
      return Number.isInteger(numericValue) && numericValue >= 13 && numericValue <= 100;
    }
  ),
  maximumAge: Yup.string()
    .test(
      "maximum-age",
      "Maximum age must be a whole number between 13 and 100.",
      (value) => {
        if (!value?.trim()) {
          return true;
        }

        const numericValue = Number(value);
        return Number.isInteger(numericValue) && numericValue >= 13 && numericValue <= 100;
      }
    )
    .test(
      "maximum-greater-than-minimum",
      "Minimum age cannot be greater than maximum age.",
      function (value) {
        const minimumAge = this.parent.minimumAge?.trim();
        const maximumAge = value?.trim();

        if (!minimumAge || !maximumAge) {
          return true;
        }

        return Number(minimumAge) <= Number(maximumAge);
      }
    ),
  gender: Yup.mixed<AudienceGender>()
    .oneOf(["ALL", "MALE", "FEMALE", "OTHER"])
    .required(),
  province: Yup.string().max(100, "Province must be 100 characters or fewer."),
  city: Yup.string().max(100, "City must be 100 characters or fewer."),
  district: Yup.string().max(100, "District must be 100 characters or fewer."),
  educationLevel: Yup.string().max(
    150,
    "Education level must be 150 characters or fewer."
  ),
  occupation: Yup.string().max(150, "Occupation must be 150 characters or fewer."),
  sampleBase: Yup.mixed<SurveyAudienceType>()
    .oneOf([
      "GENERAL",
      "CUSTOMERS",
      "VISITORS",
      "EMPLOYEES",
      "VERIFIED_USERS_ONLY",
    ])
    .required("Sample base is required."),
});

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
  const surveyId = getStoredDraftId();
  const storedAudience = getStoredTargetAudience(surveyId);
  const [provinces, setProvinces] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [isLocationsLoading, setIsLocationsLoading] = useState(false);
  const [citySearch, setCitySearch] = useState(
    storedAudience?.city || initialValues.city,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingEstimatedReach, setIsCheckingEstimatedReach] = useState(false);
  const [serverEstimatedReach, setServerEstimatedReach] = useState<number | null>(
    storedAudience?.estimatedReach ?? null
  );
  const submitActionRef = useRef<"draft" | "next">("next");

  const formik = useFormik<TargetAudienceFormValues>({
    initialValues: storedAudience
      ? {
          minimumAge: storedAudience.minimumAge || initialValues.minimumAge,
          maximumAge: storedAudience.maximumAge || initialValues.maximumAge,
          gender: storedAudience.gender || initialValues.gender,
          provinceId:
            "provinceId" in storedAudience &&
            typeof storedAudience.provinceId === "string"
              ? storedAudience.provinceId
              : initialValues.provinceId,
          province:
            "province" in storedAudience &&
            typeof storedAudience.province === "string"
              ? storedAudience.province
              : initialValues.province,
          cityId:
            "cityId" in storedAudience &&
            typeof storedAudience.cityId === "string"
              ? storedAudience.cityId
              : initialValues.cityId,
          city: storedAudience.city || initialValues.city,
          educationLevel:
            storedAudience.educationLevel || initialValues.educationLevel,
          districtId:
            "districtId" in storedAudience &&
            typeof storedAudience.districtId === "string"
              ? storedAudience.districtId
              : initialValues.districtId,
          district: storedAudience.district || initialValues.district,
          occupation: storedAudience.occupation || initialValues.occupation,
          sampleBase: storedAudience.sampleBase || initialValues.sampleBase,
        }
      : initialValues,
    validationSchema: targetAudienceSchema,
    onSubmit: async (values) => {
      await submitTargetAudience(values, submitActionRef.current === "next");
    },
  });
  const { setFieldValue } = formik;

  const filteredCities = useMemo(() => {
    const normalizedSearch = citySearch.trim().toLowerCase();

    if (!normalizedSearch || normalizedSearch === "any city") {
      return cities;
    }

    return cities.filter((city) =>
      city.name.toLowerCase().includes(normalizedSearch),
    );
  }, [cities, citySearch]);

  const cityCollection = useMemo(
    () =>
      createListCollection({
        items: filteredCities.map((city) => ({
          label: city.name,
          value: city.id,
        })),
      }),
    [filteredCities],
  );

  const estimatedReach = useMemo(() => {
    if (typeof serverEstimatedReach === "number") {
      return serverEstimatedReach.toLocaleString();
    }

    let reach = 2400;

    if (formik.values.sampleBase === "CUSTOMERS") reach -= 450;
    if (formik.values.sampleBase === "VISITORS") reach -= 350;
    if (formik.values.sampleBase === "EMPLOYEES") reach -= 600;
    if (formik.values.sampleBase === "VERIFIED_USERS_ONLY") reach -= 900;
    if (formik.values.gender !== "ALL") reach -= 250;
    if (
      formik.values.city.trim() &&
      formik.values.city.trim().toLowerCase() !== "any city"
    ) {
      reach -= 300;
    }
    if (
      formik.values.educationLevel &&
      formik.values.educationLevel !== "Any education level"
    ) {
      reach -= 180;
    }

    return Math.max(reach, 500).toLocaleString();
  }, [formik.values, serverEstimatedReach]);

  const shouldShowError = (field: keyof TargetAudienceFormValues) =>
    Boolean(formik.errors[field] && (formik.touched[field] || formik.submitCount > 0));

  const setFormValue = <K extends keyof TargetAudienceFormValues>(
    field: K,
    value: TargetAudienceFormValues[K]
  ) => {
    setServerEstimatedReach(null);
    void setFieldValue(field, value);
  };

  const setProvinceSelection = (provinceId: string, provinceName: string) => {
    setServerEstimatedReach(null);
    void setFieldValue("provinceId", provinceId);
    void setFieldValue("province", provinceName);
    void setFieldValue("districtId", "");
    void setFieldValue("district", "Any district");
    void setFieldValue("cityId", "");
    void setFieldValue("city", "Any city");
    setDistricts([]);
    setCities([]);
    setCitySearch("Any city");
  };

  const setDistrictSelection = (districtId: string, districtName: string) => {
    setServerEstimatedReach(null);
    void setFieldValue("districtId", districtId);
    void setFieldValue("district", districtName);
    void setFieldValue("cityId", "");
    void setFieldValue("city", "Any city");
    setCities([]);
    setCitySearch("Any city");
  };

  const markAllFieldsTouched = () => {
    formik.setTouched({
      minimumAge: true,
      maximumAge: true,
      gender: true,
      province: true,
      city: true,
      educationLevel: true,
      districtId: true,
      district: true,
      occupation: true,
      sampleBase: true,
    });
  };

  const validateAudienceForm = async (showFieldErrors: boolean) => {
    const errors = await formik.validateForm();

    if (Object.keys(errors).length > 0) {
      if (showFieldErrors) {
        markAllFieldsTouched();
      }

      return false;
    }

    return true;
  };

  const buildTargetAudiencePayload = (
    values: TargetAudienceFormValues
  ): SetTargetAudiencePayload | string => {
    if (!surveyId) {
      return "Survey draft was not found. Please complete the previous steps first.";
    }

    const payload: SetTargetAudiencePayload = {
      surveyId,
      sampleBase: values.sampleBase,
    };

    const minimumAge = values.minimumAge.trim();
    const maximumAge = values.maximumAge.trim();

    if (minimumAge) {
      payload.minimumAge = Number(minimumAge);
    }

    if (maximumAge) {
      payload.maximumAge = Number(maximumAge);
    }

    if (values.gender !== "ALL") {
      payload.gender = values.gender;
    }

    const province = values.province.trim();
    const educationLevel = values.educationLevel.trim();
    const occupation = values.occupation.trim();

    if (province && province !== "Any province" && values.provinceId) {
      payload.province = values.provinceId;
    }

    if (values.cityId) {
      payload.city = values.cityId;
    }

    if (values.districtId) {
      payload.district = values.districtId;
    }

    if (educationLevel && educationLevel !== "Any education level") {
      payload.educationLevel = educationLevel;
    }

    if (occupation && occupation !== "Any") {
      payload.occupation = occupation;
    }

    return payload;
  };

  const buildEstimatePayload = (
    values: TargetAudienceFormValues
  ): EstimateAudienceReachPayload | string => {
    const payload = buildTargetAudiencePayload(values);

    if (typeof payload === "string") {
      return payload;
    }

    return payload;
  };

  const checkEstimatedReach = async (showErrorToast = true) => {
    const isValid = await validateAudienceForm(showErrorToast);

    if (!isValid) {
      if (showErrorToast) {
        toaster.create({
          type: "error",
          title: "Estimated audience unavailable",
          description: "Please fix the highlighted fields first.",
        });
      }
      return;
    }

    const payload = buildEstimatePayload(formik.values);

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
      setServerEstimatedReach(response.estimatedReach ?? null);
      persistTargetAudience(
        payload.surveyId,
        formik.values,
        response.estimatedReach ?? undefined
      );
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
    let isMounted = true;

    const loadProvinces = async () => {
      try {
        setIsLocationsLoading(true);
        const response = await getProvinces();

        if (!isMounted) {
          return;
        }

        setProvinces(response);

        if (!formik.values.provinceId && formik.values.province !== "Any province") {
          const matchedProvince = response.find(
            (province) => province.name === formik.values.province,
          );

          if (matchedProvince) {
            void setFieldValue("provinceId", matchedProvince.id);
          }
        }
      } catch (error) {
        if (isMounted) {
          toaster.create({
            type: "error",
            title: "Could not load provinces",
            description:
              error instanceof Error
                ? error.message
                : "Please try again in a moment.",
          });
        }
      } finally {
        if (isMounted) {
          setIsLocationsLoading(false);
        }
      }
    };

    void loadProvinces();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (!formik.values.provinceId) {
      return;
    }

    const loadDistricts = async () => {
      try {
        setIsLocationsLoading(true);
        const response = await getDistricts(formik.values.provinceId);

        if (!isMounted) {
          return;
        }

        setDistricts(response);

        if (!formik.values.districtId && formik.values.district !== "Any district") {
          const matchedDistrict = response.find(
            (district) => district.name === formik.values.district,
          );

          if (matchedDistrict) {
            void setFieldValue("districtId", matchedDistrict.id);
          }
        }
      } catch (error) {
        if (isMounted) {
          toaster.create({
            type: "error",
            title: "Could not load districts",
            description:
              error instanceof Error
                ? error.message
                : "Please try again in a moment.",
          });
        }
      } finally {
        if (isMounted) {
          setIsLocationsLoading(false);
        }
      }
    };

    void loadDistricts();

    return () => {
      isMounted = false;
    };
  }, [formik.values.provinceId, formik.values.district, formik.values.districtId, setFieldValue]);

  useEffect(() => {
    let isMounted = true;

    if (!formik.values.districtId) {
      return;
    }

    const loadCities = async () => {
      try {
        setIsLocationsLoading(true);
        const response = await getCities(formik.values.districtId);

        if (!isMounted) {
          return;
        }

        setCities(response);

        if (formik.values.city && formik.values.city !== "Any city") {
          setCitySearch(formik.values.city);

          if (!formik.values.cityId) {
            const matchedCity = response.find(
              (city) => city.name === formik.values.city,
            );

            if (matchedCity) {
              void setFieldValue("cityId", matchedCity.id);
            }
          }
        }
      } catch (error) {
        if (isMounted) {
          toaster.create({
            type: "error",
            title: "Could not load cities",
            description:
              error instanceof Error
                ? error.message
                : "Please try again in a moment.",
          });
        }
      } finally {
        if (isMounted) {
          setIsLocationsLoading(false);
        }
      }
    };

    void loadCities();

    return () => {
      isMounted = false;
    };
  }, [formik.values.city, formik.values.cityId, formik.values.districtId, setFieldValue]);

  useEffect(() => {
    if (!surveyId) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void checkEstimatedReach(false);
    }, 0);

    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surveyId]);

  const submitTargetAudience = async (
    values: TargetAudienceFormValues,
    advanceToNextStep: boolean
  ) => {
    const payload = buildTargetAudiencePayload(values);

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
      setServerEstimatedReach(response.targetAudience.estimatedReach ?? null);
      persistTargetAudience(
        payload.surveyId,
        values,
        response.targetAudience.estimatedReach ?? undefined
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
            <Field.Root invalid={shouldShowError("minimumAge")}>
              <Field.Label fontSize="sm" fontWeight="semibold" mb="2">
                Minimum Age
              </Field.Label>

              <Input
                name="minimumAge"
                type="number"
                value={formik.values.minimumAge}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                h="46px"
                borderColor="brand.border"
                px="4"
                _focus={{
                  borderColor: "brand.primary",
                  boxShadow: "0 0 0 1px #0015D6",
                }}
              />
              <Field.ErrorText>{formik.errors.minimumAge}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={shouldShowError("maximumAge")}>
              <Field.Label fontSize="sm" fontWeight="semibold" mb="2">
                Maximum Age
              </Field.Label>

              <Input
                name="maximumAge"
                type="number"
                value={formik.values.maximumAge}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                h="46px"
                borderColor="brand.border"
                px="4"
                _focus={{
                  borderColor: "brand.primary",
                  boxShadow: "0 0 0 1px #0015D6",
                }}
              />
              <Field.ErrorText>{formik.errors.maximumAge}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={shouldShowError("gender")}>
              <Field.Label fontSize="sm" fontWeight="semibold" mb="2">
                Gender
              </Field.Label>

              <NativeSelect.Root>
                <NativeSelect.Field
                  name="gender"
                  value={formik.values.gender}
                  onChange={(event) =>
                    setFormValue("gender", event.target.value as AudienceGender)
                  }
                  onBlur={formik.handleBlur}
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
              <Field.ErrorText>{formik.errors.gender}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={shouldShowError("province")}>
              <Field.Label fontSize="sm" fontWeight="semibold" mb="2">
                Province
              </Field.Label>

              <NativeSelect.Root disabled={isLocationsLoading && provinces.length === 0}>
                <NativeSelect.Field
                  name="province"
                  value={formik.values.provinceId || "ANY"}
                  onChange={(event) => {
                    if (event.target.value === "ANY") {
                      setProvinceSelection("", "Any province");
                      return;
                    }

                    const selectedProvince = provinces.find(
                      (province) => province.id === event.target.value,
                    );

                    if (selectedProvince) {
                      setProvinceSelection(
                        selectedProvince.id,
                        selectedProvince.name,
                      );
                    }
                  }}
                  onBlur={formik.handleBlur}
                  h="46px"
                  borderColor="brand.border"
                  px={5}
                >
                  <option value="ANY">Any province</option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
              <Field.ErrorText>{formik.errors.province}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={shouldShowError("educationLevel")}>
              <Field.Label fontSize="sm" fontWeight="semibold" mb="2">
                Education Level
              </Field.Label>

              <NativeSelect.Root>
                <NativeSelect.Field
                  name="educationLevel"
                  value={formik.values.educationLevel}
                  onChange={(event) =>
                    setFormValue("educationLevel", event.target.value)
                  }
                  onBlur={formik.handleBlur}
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
              <Field.ErrorText>{formik.errors.educationLevel}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={shouldShowError("district")}>
              <Field.Label fontSize="sm" fontWeight="semibold" mb="2">
                District
              </Field.Label>

              <NativeSelect.Root disabled={!formik.values.provinceId || isLocationsLoading}>
                <NativeSelect.Field
                  name="district"
                  value={formik.values.districtId || "ANY"}
                  onChange={(event) => {
                    if (event.target.value === "ANY") {
                      setDistrictSelection("", "Any district");
                      return;
                    }

                    const selectedDistrict = districts.find(
                      (district) => district.id === event.target.value,
                    );

                    if (selectedDistrict) {
                      setDistrictSelection(
                        selectedDistrict.id,
                        selectedDistrict.name,
                      );
                    }
                  }}
                  onBlur={formik.handleBlur}
                  h="46px"
                  borderColor="brand.border"
                  px={5}
                >
                  <option value="ANY">Any district</option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
              <Field.ErrorText>{formik.errors.district}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={shouldShowError("city")}>
              <Field.Label fontSize="sm" fontWeight="semibold" mb="2">
                City
              </Field.Label>

              <Combobox.Root
                collection={cityCollection}
                inputValue={citySearch}
                onInputValueChange={(details) => {
                  setCitySearch(details.inputValue);
                  setServerEstimatedReach(null);

                  if (!details.inputValue) {
                    void formik.setFieldValue("city", "Any city");
                  }
                }}
                onValueChange={(details) => {
                  const selectedCity = cities.find(
                    (city) => city.id === details.value[0],
                  );

                  if (selectedCity) {
                    void formik.setFieldValue("cityId", selectedCity.id);
                    void formik.setFieldValue("city", selectedCity.name);
                    setCitySearch(selectedCity.name);
                    setServerEstimatedReach(null);
                  }
                }}
                openOnClick
              >
                <Combobox.Control>
                  <Combobox.Input
                    placeholder={
                      formik.values.districtId
                        ? "Search and select city"
                        : "Select district first"
                    }
                    disabled={!formik.values.districtId || isLocationsLoading}
                    h="46px"
                    borderWidth="1px"
                    borderColor="brand.border"
                    borderRadius="10px"
                    px="4"
                    _focusVisible={{
                      borderColor: "brand.primary",
                      boxShadow: "0 0 0 1px #0015D6",
                    }}
                  />
                </Combobox.Control>
                <Portal>
                  <Combobox.Positioner>
                    <Combobox.Content
                      bg="white"
                      borderWidth="1px"
                      borderColor="brand.border"
                      borderRadius="12px"
                      boxShadow="lg"
                      maxH="240px"
                      overflowY="auto"
                      zIndex={1600}
                    >
                      <Combobox.Item
                        item={{ label: "Any city", value: "ANY_CITY" }}
                        key="ANY_CITY"
                        px="3"
                        py="2"
                        cursor="pointer"
                        onClick={() => {
                          void formik.setFieldValue("cityId", "");
                          void formik.setFieldValue("city", "Any city");
                          setCitySearch("Any city");
                          setServerEstimatedReach(null);
                        }}
                      >
                        <Combobox.ItemText>Any city</Combobox.ItemText>
                      </Combobox.Item>
                      <Combobox.Empty px="3" py="2" color="brand.mutedText">
                        No cities found.
                      </Combobox.Empty>
                      <Combobox.List>
                        {cityCollection.items.map((item) => (
                          <Combobox.Item
                            key={item.value}
                            item={item}
                            px="3"
                            py="2"
                            cursor="pointer"
                            _highlighted={{ bg: "brand.lightBlue" }}
                          >
                            <Combobox.ItemText>{item.label}</Combobox.ItemText>
                          </Combobox.Item>
                        ))}
                      </Combobox.List>
                    </Combobox.Content>
                  </Combobox.Positioner>
                </Portal>
              </Combobox.Root>
              <Field.ErrorText>{formik.errors.city}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={shouldShowError("occupation")}>
              <Field.Label fontSize="sm" fontWeight="semibold" mb="2">
                Occupation
              </Field.Label>

              <NativeSelect.Root>
                <NativeSelect.Field
                  name="occupation"
                  value={formik.values.occupation}
                  onChange={(event) => setFormValue("occupation", event.target.value)}
                  onBlur={formik.handleBlur}
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
              <Field.ErrorText>{formik.errors.occupation}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={shouldShowError("sampleBase")}>
              <Field.Label fontSize="sm" fontWeight="semibold" mb="2">
                Sample Base
              </Field.Label>

              <NativeSelect.Root>
                <NativeSelect.Field
                  name="sampleBase"
                  value={formik.values.sampleBase}
                  onChange={(event) =>
                    setFormValue(
                      "sampleBase",
                      event.target.value as SurveyAudienceType
                    )
                  }
                  onBlur={formik.handleBlur}
                  h="46px"
                  borderColor="brand.border"
                  px={5}
                >
                  <option value="GENERAL">General</option>
                  <option value="CUSTOMERS">Customers</option>
                  <option value="VISITORS">Visitors</option>
                  <option value="EMPLOYEES">Employees</option>
                  <option value="VERIFIED_USERS_ONLY">Verified users only</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
              <Field.ErrorText>{formik.errors.sampleBase}</Field.ErrorText>
            </Field.Root>
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
              label={`Age ${formik.values.minimumAge || "13"}-${formik.values.maximumAge || "100"}`}
              bg="#EEF2FF"
              color="brand.primary"
              borderColor="#C7D2FE"
            />

            <AudienceTag
              icon={<FiMapPin />}
              label={
                [
                  formik.values.city !== "Any city" ? formik.values.city.trim() : "",
                  formik.values.district !== "Any district"
                    ? formik.values.district.trim()
                    : "",
                  formik.values.province !== "Any province"
                    ? formik.values.province.trim()
                    : "",
                ]
                  .filter(Boolean)
                  .join(", ") || "Any location"
              }
              bg="#ECFDF3"
              color="#087A35"
              borderColor="#BBF7D0"
            />

            <AudienceTag
              icon={<FiShield />}
              label={sampleBaseLabels[formik.values.sampleBase]}
              bg="#F5F3FF"
              color="#6D28D9"
              borderColor="#DDD6FE"
            />

            <AudienceTag
              icon={<LuGraduationCap />}
              label={
                formik.values.educationLevel.includes("Undergraduate")
                  ? "Undergraduate"
                  : formik.values.educationLevel
              }
              bg="#FFF7ED"
              color="#C2410C"
              borderColor="#FED7AA"
            />

            <AudienceTag
              icon={<FiUsers />}
              label={genderLabels[formik.values.gender]}
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
            submitActionRef.current = "draft";
            void formik.submitForm();
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
            submitActionRef.current = "next";
            void formik.submitForm();
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
