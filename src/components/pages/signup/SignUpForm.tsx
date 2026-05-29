"use client";

import { useSignupStore } from "@/store/useSignupStore";
import SignUpStepOneForm from "./SignUpStepOneForm";
import SignUprStepThreeForm from "./SignUpStepThreeForm";
import SignUpStepTwoForm from "./SignUpStepTwoForm";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { registerUser, RegisterRole } from "@/services/authService";
import { useRouter } from "next/navigation";

const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export type SignupFormValues = {
  username: string;
  email: string;
  password: string;
  role: string;
  nicNumber: string;
  nicImage: File | null;
  selfieImage: File | null;
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
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),

  role: Yup.string()
    .oneOf(["PARTICIPANT", "CREATOR", "BOTH"], "Please select a valid role")
    .required("Please select a role"),

  nicNumber: Yup.string().trim().notRequired(),

  nicImage: Yup.mixed<File>()
    .nullable()
    .test("fileSize", "File size must be less than 5MB", (file) => {
      if (!file) return true;
      return file.size <= MAX_FILE_SIZE;
    })
    .test(
      "fileType",
      "Only JPG, JPEG, PNG, and WEBP files are allowed",
      (file) => {
        if (!file) return true;
        return SUPPORTED_IMAGE_TYPES.includes(file.type);
      },
    ),

  selfieImage: Yup.mixed<File>()
    .nullable()
    .test("fileSize", "File size must be less than 5MB", (file) => {
      if (!file) return true;
      return file.size <= MAX_FILE_SIZE;
    })
    .test(
      "fileType",
      "Only JPG, JPEG, PNG, and WEBP files are allowed",
      (file) => {
        if (!file) return true;
        return SUPPORTED_IMAGE_TYPES.includes(file.type);
      },
    ),
});

export default function SignupForm() {
  const router = useRouter();
  const currentStep = useSignupStore((state) => state.currentStep);
  const nextStep = useSignupStore((state) => state.nextStep);
  const resetSignup = useSignupStore((state) => state.resetSignup);

  const getStepFields = (step: number): Array<keyof SignupFormValues> => {
    if (step === 1) return ["username", "email", "password"];
    if (step === 2) return ["role"];
    if (step === 3) return ["nicNumber", "nicImage", "selfieImage"];
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
        nicNumber: "",
        nicImage: null,
        selfieImage: null,
      }}
      validationSchema={signUpFormSchema}
      onSubmit={async (values, { setStatus }) => {
        try {
          setStatus(undefined);
          await registerUser({
            username: values.username.trim(),
            email: values.email.trim().toLowerCase(),
            password: values.password,
            role: values.role as RegisterRole,
            nicNumber: values.nicNumber.trim() || undefined,
            nicImage: values.nicImage,
            selfieImage: values.selfieImage,
          });

          resetSignup();
          router.push("/login");
        } catch (error) {
          if (error instanceof Error) {
            setStatus(error.message);
            return;
          }

          setStatus("Registration failed");
        }
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
