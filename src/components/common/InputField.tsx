"use client";

import { Input } from "@chakra-ui/react";
import { Field } from "@chakra-ui/react";
import { useField } from "formik";

interface InputFieldProps {
  name: string;
  title: string;
  placeholder: string;
  type: "email" | "password" | "text";
  helperText?: string;
}

export default function InputField({
  name,
  title,
  placeholder,
  type,
  helperText,
}: InputFieldProps) {
  const [field, meta] = useField(name);

  const hasError = Boolean(meta.touched && meta.error);

  return (
    <Field.Root required width="100%" maxW="360px" invalid={hasError}>
      <Field.Label textStyle="label">
        {title} <Field.RequiredIndicator />
      </Field.Label>

      <Input
        {...field}
        color="black"
        px="5"
        borderRadius="input"
        type={type}
        placeholder={placeholder}
      />

      {hasError ? (
        <Field.ErrorText>{meta.error}</Field.ErrorText>
      ) : helperText ? (
        <Field.HelperText textStyle="helperText">
          {helperText}
        </Field.HelperText>
      ) : null}
    </Field.Root>
  );
}