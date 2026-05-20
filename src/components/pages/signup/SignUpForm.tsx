"use client";
import { useSignupStore } from "@/store/useSignupStore";
import SignUpStepOneForm from "./SignUpStepOneForm";
import SignUprStepThreeForm from "./SignUpStepThreeForm";
import SignUpStepTwoForm from "./SignUpStepTwoForm";
import { Form, Formik, FormikValues } from "formik";
import * as Yup from "yup";

const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export default function SignupForm() {
  const currentStep = useSignupStore(
    (state: { currentStep: unknown }) => state.currentStep,
  );
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
      .test("fileSize", "File size must be less than 2MB", (file) => {
        if (!file) return true;
        return file.size <= MAX_FILE_SIZE;
      })
      .test("fileType", "Only JPG and PNG files are allowed", (file) => {
        if (!file) return true;
        return SUPPORTED_IMAGE_TYPES.includes(file.type);
      }),

    selfie: Yup.mixed<File>()
      .nullable()
      .test("fileSize", "File size must be less than 2MB", (file) => {
        if (!file) return true;
        return file.size <= MAX_FILE_SIZE;
      })
      .test("fileType", "Only JPG and PNG files are allowed", (file) => {
        if (!file) return true;
        return SUPPORTED_IMAGE_TYPES.includes(file.type);
      }),
  });

  return (
    <Formik
      initialValues={{ username: "", email: "", password: "" }}
      validationSchema={signUpFormSchema}
      onSubmit={function (values: FormikValues) {
        console.log(values);
      }}
    >
      <Form>
        {currentStep == 1 && <SignUpStepOneForm />}
        {currentStep == 2 && <SignUpStepTwoForm />}
        {currentStep == 3 && <SignUprStepThreeForm />}
      </Form>
    </Formik>
  );
}
