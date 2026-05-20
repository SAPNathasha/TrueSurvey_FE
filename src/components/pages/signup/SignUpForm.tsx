"use client";

import { useSignupStore } from "@/store/useSignupStore";
import SignUpStepOneForm from "./SignUpStepOneForm";
import SignUprStepThreeForm from "./SignUpStepThreeForm";
import SignUpStepTwoForm from "./SignUpStepTwoForm";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";

const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const MAX_FILE_SIZE = 2 * 1024 * 1024;

export type SignupFormValues = {
  username: string;
  email: string;
  password: string;
  role: string;
  nicOrLicense: File | null;
  selfie: File | null;
};

const signUpFormSchema = Yup.object({
  username: Yup.string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot be more than 30 characters")
    .matches(/^\S*$/, "Username cannot contain spaces")
    .matches(/^[^A-Z]*$/, "Username cannot contain uppercase letters")
    .required("Username is required"),

  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email must be like user@gmail.com")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),

  role: Yup.string()
    .oneOf(
      ["participant", "surveyCreator", "both"],
      "Please select a valid role",
    )
    .required("Please select a role"),

  nicOrLicense: Yup.mixed<File>()
    .nullable()
    .when("role", {
      is: (role: string) => role === "participant" || role === "both",
      then: (schema) =>
        schema
          .required("NIC or license image is required")
          .test("fileSize", "File size must be less than 2MB", (file) => {
            if (!file) return false;
            return file.size <= MAX_FILE_SIZE;
          })
          .test("fileType", "Only JPG and PNG files are allowed", (file) => {
            if (!file) return false;
            return SUPPORTED_IMAGE_TYPES.includes(file.type);
          }),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),

  selfie: Yup.mixed<File>()
    .nullable()
    .when("role", {
      is: (role: string) => role === "participant" || role === "both",
      then: (schema) =>
        schema
          .required("Selfie image is required")
          .test("fileSize", "File size must be less than 2MB", (file) => {
            if (!file) return false;
            return file.size <= MAX_FILE_SIZE;
          })
          .test("fileType", "Only JPG and PNG files are allowed", (file) => {
            if (!file) return false;
            return SUPPORTED_IMAGE_TYPES.includes(file.type);
          }),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),
});

export default function SignupForm() {
  const currentStep = useSignupStore((state) => state.currentStep);
  const nextStep = useSignupStore((state) => state.nextStep);

  const getStepFields = (step: number): Array<keyof SignupFormValues> => {
    if (step === 1) return ["username", "email", "password"];
    if (step === 2) return ["role"];
    if (step === 3) return ["nicOrLicense", "selfie"];
    return [];
  };

  const handleNext = async (
    validateForm: () => Promise<Record<string, string>>,
    setTouched: FormikHelpers<SignupFormValues>["setTouched"],
  ) => {
    const errors = await validateForm();
    const stepFields = getStepFields(currentStep);

    const touchedFields = stepFields.reduce(
      (acc, field) => {
        acc[field] = true;
        return acc;
      },
      {} as Record<keyof SignupFormValues, boolean>,
    );

    setTouched(touchedFields);

    const hasStepErrors = stepFields.some((field) => errors[field]);

    if (!hasStepErrors) {
      nextStep();
    }
  };

  return (
    <Formik<SignupFormValues>
      initialValues={{
        username: "",
        email: "",
        password: "",
        role: "",
        nicOrLicense: null,
        selfie: null,
      }}
      validationSchema={signUpFormSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ validateForm, setTouched }) => (
        <Form>
          {currentStep === 1 && (
            <SignUpStepOneForm
              onNext={() => handleNext(validateForm, setTouched)}
            />
          )}

          {currentStep === 2 && (
            <SignUpStepTwoForm
              onNext={() => handleNext(validateForm, setTouched)}
            />
          )}

          {currentStep === 3 && <SignUprStepThreeForm />}
        </Form>
      )}
    </Formik>
  );
}
