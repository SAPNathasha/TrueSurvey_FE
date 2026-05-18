import { Field, Input } from "@chakra-ui/react";
import { useState } from "react";

interface InputField {
  title: string;
  placeholder: string;
  type: "email" | "password" | "text";
}
export default function InputField({ title, placeholder, type }: InputField) {
  const [value, setValue] = useState("");
  return (
    <Field.Root required width="100%" maxW="360px">
      <Field.Label textStyle="label">
        {title} <Field.RequiredIndicator />
      </Field.Label>

      <Input
        color="black"
        px="5"
        borderRadius="input"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </Field.Root>
  );
}
